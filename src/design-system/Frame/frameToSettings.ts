import type React from "react";
import type { FrameOverrides } from "./FrameProps.ts";
import type { SurfaceToken } from "../lib/types.ts";
import type { Radius2Token } from "../token";
import { Radius2 } from "../token";

// Internal type for frameToSettings - includes top-level only props
type FrameSettingsInput = FrameOverrides & {
  surface?: SurfaceToken;
  rounded?: Radius2Token | boolean;
  border?: boolean;
};

export function frameToSettings(props: FrameSettingsInput): {
  className: string;
  style: React.CSSProperties;
} {
  const classes: string[] = [];

  // Helper to remove undefined keys
  const cleanStyles = (styles: React.CSSProperties) => {
    return Object.fromEntries(
      Object.entries(styles).filter(([_, v]) => v !== undefined),
    ) as React.CSSProperties;
  };

  // Helper to handle Size.screen axis-specific conversion
  const resolveSizing = (
    val: string | number | undefined,
    axis: "width" | "height",
  ) => {
    if (val === undefined) return undefined;
    // Size.screen is "100vh" but should be "100vw" for width axis
    if (val === "100vh" && axis === "width") return "100vw";
    // All other values (CSS variables, keywords, units) pass through as-is
    return val;
  };

  // --- Smart Logic Helpers ---
  const isFixedDimension = (
    val: string | number | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _axis: "width" | "height",
  ): boolean => {
    if (val === undefined) return false;
    // String checks
    if (typeof val === "string") {
      // CSS variable tokens (e.g., "var(--size-n40)") → fixed dimension
      if (val.startsWith("var(--size-") || val.startsWith("var(--container-size-")) {
        return true;
      }
      // Keyword values (Size.full, Size.screen, etc.) → not fixed
      if (
        [
          "100%",
          "100vh",
          "100vw",
          "auto",
          "min-content",
          "max-content",
          "fit-content",
        ].includes(val)
      ) {
        return false;
      }
      // Explicit px/rem/em values → fixed dimension
      if (/^-?\d*\.?\d+(px|rem|em)$/.test(val)) return true;
    }
    return false;
  };

  const standardStyles: React.CSSProperties = cleanStyles({
    // Padding (tokens are already CSS variables)
    padding: props.p,
    paddingTop: props.pt ?? props.py,
    paddingBottom: props.pb ?? props.py,
    paddingLeft: props.pl ?? props.px,
    paddingRight: props.pr ?? props.px,

    gap: props.gap,

    // Sizing (tokens are already CSS variables)
    width: resolveSizing(props.w, "width"),
    height: resolveSizing(props.h, "height"),
    minWidth: resolveSizing(props.minWidth, "width"),
    minHeight: resolveSizing(props.minHeight, "height"),
    maxWidth: resolveSizing(props.maxWidth, "width"),
    maxHeight: resolveSizing(props.maxHeight, "height"),

    // Radius (tokens are already CSS variables)
    borderRadius: props.r,

    // Opacity (tokens are already CSS variables)
    opacity: props.opacity,

    // Borders (boolean only)
    border: props.border === true ? "1px solid var(--border-color)" : undefined,
    borderTop:
      props.borderTop === true ? "1px solid var(--border-color)" : undefined,
    borderRight:
      props.borderRight === true ? "1px solid var(--border-color)" : undefined,
    borderBottom:
      props.borderBottom === true ? "1px solid var(--border-color)" : undefined,
    borderLeft:
      props.borderLeft === true ? "1px solid var(--border-color)" : undefined,
  });

  // --- Base Layout ---
  if (props.grid) classes.push("grid");
  else classes.push("flex"); // Default to flex (replaces .frame display:flex)

  if (props.fill) classes.push("fill");
  if (props.row) classes.push("hbox");
  else classes.push("vbox"); // Default

  if (props.pack) classes.push("pack");

  // Wrap
  if (props.wrap === "wrap") classes.push("wrap");
  else if (props.wrap === "nowrap") classes.push("nowrap");
  else if (props.wrap === "wrap-reverse") classes.push("wrap-reverse");

  // Align
  if (props.align) classes.push(`items-${props.align}`);

  // Justify
  if (props.justify) classes.push(`justify-${props.justify}`);

  // Flex
  if (props.flex === true) classes.push("flex-1");
  else if (props.flex === false) classes.push("flex-none");

  // --- Sizing Classes ---
  // Size.full is "100%" and Size.screen is "100vh" at runtime
  if (props.w === "100%") classes.push("w-full");
  else if (props.w === "100vh") classes.push("w-screen");

  if (props.h === "100%") classes.push("h-full");
  else if (props.h === "100vh") classes.push("h-screen");

  // --- Radius: Convert rounded prop to Radius2 tokens (2-tier) ---
  if (props.r === undefined && props.rounded !== undefined) {
    if (typeof props.rounded === "boolean") {
      standardStyles.borderRadius = props.rounded ? Radius2.md : Radius2.none;
    } else {
      // Use Radius2 for semantic aliases, fallback to raw value for custom strings
      standardStyles.borderRadius = props.rounded in Radius2
        ? Radius2[props.rounded as keyof typeof Radius2]
        : props.rounded;
    }
  }

  // --- Surface Classes ---
  if (props.surface) {
    classes.push(`surface-${props.surface}`);
  }

  // --- Overflow (Legacy removed, ensure clean) ---
  // if (props.overflow) ... removed

  // --- Clip ---
  if (props.clip === true) {
    classes.push("overflow-hidden");
  } else if (props.clip === false) {
    classes.push("overflow-visible"); // Explicit visible if clip is false
  }

  // --- Cursor ---
  if (props.cursor) {
    classes.push(`cursor-${props.cursor}`);
  }

  // --- Shadow ---
  if (props.shadow) {
    classes.push(`shadow-${props.shadow}`);
  }

  // --- Smart Layout Logic ---

  // 1. Scroll & Min-Size Safety
  if (props.scroll) {
    // If scroll is enabled, we MUST ensure min-size is 0 to allow shrinking
    // unless user explicitly overwrote minWidth/minHeight (which standardStyles handles,
    // but the class generation for automatic safety happens here or via vars?)
    // Actually, standardStyles.minWidth takes precedence.

    // We apply standard overflow classes
    if (props.scroll === true) {
      // if (!props.overflow) classes.push("overflow-auto"); // Overflow prop removed.
      // Auto scroll implies overflow-auto.
      classes.push("overflow-auto");

      // Safety:
      if (props.minWidth === undefined) standardStyles.minWidth = 0;
      if (props.minHeight === undefined) standardStyles.minHeight = 0;
    } else if (props.scroll === "x") {
      classes.push("overflow-x-auto");
      classes.push("overflow-y-hidden");

      if (props.minWidth === undefined) standardStyles.minWidth = 0;
    } else if (props.scroll === "y") {
      classes.push("overflow-y-auto");
      classes.push("overflow-x-hidden");

      if (props.minHeight === undefined) standardStyles.minHeight = 0;
    }
  }

  // 2. Smart Shrink
  // If shrink is explicitly set, use it
  if (props.shrink !== undefined) {
    if (props.shrink === true) standardStyles.flexShrink = 1;
    else if (props.shrink === false) standardStyles.flexShrink = 0;
    else standardStyles.flexShrink = props.shrink;
  } else {
    // Heuristic: If fixed dim exists => shrink=0
    // We check raw props before resolution
    const hasFixedWidth = isFixedDimension(props.w, "width");
    // const hasFixedHeight = isFixedDimension(props.h, "height");

    // We only enforce shrink=0 if width is fixed, as flex-row is default context usually.
    // If flex-col, height matters. But defaulting to 0 for any fixed dim is safe?
    // If I set h=40px, I usually don't want it compressed.
    // Let's be aggressive: Fixed geometry resists compression.
    if (hasFixedWidth || isFixedDimension(props.h, "height")) {
      standardStyles.flexShrink = 0;
    }
  }

  return {
    className: classes.join(" "),
    style: standardStyles,
  };
}
