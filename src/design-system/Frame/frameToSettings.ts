import type React from "react";
import type { SurfaceToken } from "../lib/types.ts";
import type { BorderWidthToken, Radius2Token, ZIndexToken } from "../token";
import { Radius2, Size, type SizeKey } from "../token"; // Import Size for token lookup
import type { FrameOverrides } from "./FrameProps.ts";

// Internal type for frameToSettings - includes top-level only props
type FrameSettingsInput = FrameOverrides & {
  surface?: SurfaceToken;
  rounded?: Radius2Token | boolean;
  border?: boolean;
  borderWidth?: BorderWidthToken;
  z?: ZIndexToken;
  zIndex?: ZIndexToken;
  interactive?: boolean | "button" | "text";
  selected?: boolean;
};

export function frameToSettings(props: FrameSettingsInput): {
  className: string;
  style: React.CSSProperties;
} {
  const classes: string[] = [];

  // Helper to remove undefined and empty string keys
  const cleanStyles = (styles: React.CSSProperties) => {
    return Object.fromEntries(
      Object.entries(styles).filter(([_, v]) => v !== undefined && v !== ""),
    ) as React.CSSProperties;
  };

  // Helper: Resolve Size Tokens (support "n40" string -> var(--size-n40))
  const resolveToken = (val: string | number | undefined) => {
    if (val === undefined) return undefined;
    if (typeof val === "string" && val in Size) {
      return Size[val as SizeKey];
    }
    return val;
  };

  // Helper handling Size.screen axis-specific conversion
  const resolveSizing = (
    val: string | number | undefined,
    axis: "width" | "height",
  ) => {
    const tokenVal = resolveToken(val);
    if (tokenVal === undefined) return undefined;

    // Size.screen is "100vh" but should be "100vw" for width axis
    if (tokenVal === "100vh" && axis === "width") return "100vw";

    return tokenVal;
  };

  // ---------------------------------------------------------------------------
  // 1. Layout Context (Direction) & Overrides
  // ---------------------------------------------------------------------------
  if (props.grid) {
    classes.push("grid");
  } else if (props.row) {
    classes.push("hbox");
  } else {
    // Default or explicit vbox
    // Check if layout implies row? FrameOverrides.row is used.
    classes.push("vbox");
  }

  // Wrap
  if (props.wrap === true || props.wrap === "wrap") classes.push("wrap");
  else if (props.wrap === "nowrap") classes.push("nowrap");

  // ---------------------------------------------------------------------------
  // 2. Packing & Alignment
  // ---------------------------------------------------------------------------

  // Align
  if (props.align) classes.push(`align(${props.align})`);

  // Pack: Only supported in Override now
  if (props.pack !== undefined) {
    if (props.pack === true || props.pack === "center")
      classes.push("pack"); // pack=true means center center
    else if (typeof props.pack === "string")
      classes.push(`pack(${props.pack})`);
  } else if (props.justify) {
    // Direct mapping for justify if provided (though strict layout prefers pack)
    classes.push(`pack(${props.justify})`);
  }

  // ---------------------------------------------------------------------------
  // 3. Sizing (Hybrid Strategy: Class + Style)
  // ---------------------------------------------------------------------------
  const styles: React.CSSProperties = {};

  // Resolve Tokens for w/h
  const wVal = resolveSizing(props.w, "width");
  const hVal = resolveSizing(props.h, "height");

  // -- Width --
  if (typeof wVal === "number") {
    // Raw Number -> Style
    classes.push("w(fixed)");
    styles.width = `${wVal}px`;
  } else if (wVal === "fill") {
    classes.push("w(fill)");
    // Fallback for non-flex parents (like root).
    // Safe because flex-basis or align-self: stretch overrides this in flex containers.
    styles.width = "100%";
  } else if (wVal === "hug") {
    classes.push("w(hug)");
  } else if (wVal === "100vw" || wVal === "screen") {
    classes.push("w(screen)");
  } else if (typeof wVal === "string") {
    // Token (var) OR Raw String (50%)
    classes.push("w(fixed)");
    styles.width = wVal;
  }

  // -- MaxWidth --
  if (props.maxWidth !== undefined) {
    classes.push("max-w(fixed)");
    const maxWVal = resolveSizing(props.maxWidth, "width");
    if (typeof maxWVal === "number") {
      styles.maxWidth = `${maxWVal}px`;
    } else if (typeof maxWVal === "string") {
      styles.maxWidth = maxWVal;
    }
  }

  // -- Height --
  if (typeof hVal === "number") {
    classes.push("h(fixed)");
    styles.height = `${hVal}px`;
  } else if (hVal === "fill") {
    classes.push("h(fill)");
    // Fallback for non-flex parents.
    styles.height = "100%";
  } else if (hVal === "hug") {
    classes.push("h(hug)");
  } else if (hVal === "100vh" || hVal === "screen") {
    classes.push("h(screen)");
  } else if (typeof hVal === "string") {
    classes.push("h(fixed)");
    styles.height = hVal;
  }

  // -- Min/Max Sizes --
  if (props.minWidth !== undefined)
    styles.minWidth = resolveSizing(props.minWidth, "width");
  if (props.minHeight !== undefined)
    styles.minHeight = resolveSizing(props.minHeight, "height");
  if (props.maxWidth !== undefined)
    styles.maxWidth = resolveSizing(props.maxWidth, "width");
  if (props.maxHeight !== undefined)
    styles.maxHeight = resolveSizing(props.maxHeight, "height");

  // ---------------------------------------------------------------------------
  // 5. Visuals & Decoration
  // ---------------------------------------------------------------------------

  // Radius
  if (props.r === undefined && props.rounded !== undefined) {
    if (typeof props.rounded === "boolean") {
      styles.borderRadius = props.rounded ? Radius2.md : Radius2.none;
    } else {
      styles.borderRadius =
        props.rounded in Radius2
          ? Radius2[props.rounded as keyof typeof Radius2]
          : props.rounded;
    }
  } else if (props.r) {
    styles.borderRadius = props.r;
  }

  // Surface
  if (props.surface) {
    classes.push(`surface-${props.surface}`);
  }

  // Padding
  // Use shorthand if all sides are the same, otherwise use individual properties
  if (props.p !== undefined) {
    styles.padding = props.p;
  } else {
    // Only set individual padding properties if they have values
    const pt = props.pt ?? props.py;
    const pb = props.pb ?? props.py;
    const pl = props.pl ?? props.px;
    const pr = props.pr ?? props.px;

    if (pt !== undefined) styles.paddingTop = pt;
    if (pb !== undefined) styles.paddingBottom = pb;
    if (pl !== undefined) styles.paddingLeft = pl;
    if (pr !== undefined) styles.paddingRight = pr;
  }

  // Gap
  styles.gap = props.gap;

  // Border
  if (props.border === true) styles.border = "1px solid var(--border-color)";
  if (props.borderWidth) styles.borderWidth = props.borderWidth;
  if (props.borderTop === true)
    styles.borderTop = "1px solid var(--border-color)";
  if (props.borderRight === true)
    styles.borderRight = "1px solid var(--border-color)";
  if (props.borderBottom === true)
    styles.borderBottom = "1px solid var(--border-color)";
  if (props.borderLeft === true)
    styles.borderLeft = "1px solid var(--border-color)";

  // Clip
  if (props.clip === true) classes.push("clip");
  else if (props.clip === false) classes.push("overflow-visible");

  // Scroll
  if (props.scroll === true) classes.push("scroll");
  else if (props.scroll === "x") classes.push("scroll-x");
  else if (props.scroll === "y") classes.push("scroll-y");

  // Cursor & Elevation
  if (props.cursor) classes.push(`cursor-${props.cursor}`);
  if (props.opacity) styles.opacity = props.opacity;
  if (props.elevation) styles.boxShadow = `var(--elevation-${props.elevation})`;
  if (props.z) styles.zIndex = props.z;
  if (props.zIndex) styles.zIndex = props.zIndex;

  // ---------------------------------------------------------------------------
  // 6. Interactive & Selected States
  // ---------------------------------------------------------------------------
  if (props.interactive) {
    classes.push("interactive");
    if (typeof props.interactive === "string") {
      classes.push(`interactive-${props.interactive}`);
    }
  }

  if (props.selected) {
    classes.push("selected");
  }

  // ---------------------------------------------------------------------------
  // 7. Return
  // ---------------------------------------------------------------------------
  return {
    className: classes.join(" "),
    style: cleanStyles(styles),
  };
}
