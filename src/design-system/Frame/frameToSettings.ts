import type React from "react";
import type { FrameOverrides } from "./FrameProps.ts";
import { px } from "../token/lib/utils.ts";

export function frameToSettings(props: FrameOverrides): {
  className: string;
  style: React.CSSProperties;
} {
  const classes: string[] = [];
  const vars: Record<string, any> = {};
  // Helper to remove undefined keys
  const cleanStyles = (styles: React.CSSProperties) => {
    return Object.fromEntries(
      Object.entries(styles).filter(([_, v]) => v !== undefined),
    ) as React.CSSProperties;
  };

  // Function to resolve space tokens (Branded Type)
  const resolveSpace = (val: string | number | undefined) => {
    if (val === undefined) return undefined;
    // Branded Type: numeric token (e.g., Space.n12 is 12 at runtime)
    if (typeof val === "number") {
      return px(val as any); // Convert to "12px"
    }
    // Allow explicit string overrides (e.g., "10px", "auto", "2rem")
    return val;
  };

  // Function to resolve radius tokens (Branded Type)
  const resolveRadius = (val: string | number | undefined) => {
    if (val === undefined) return undefined;
    // Branded Type: numeric token (e.g., Radius.n8 is 8 at runtime)
    if (typeof val === "number") {
      return px(val as any); // Convert to "8px"
    }
    // Allow explicit string overrides
    return val;
  };

  // Function to resolve opacity tokens (Branded Type)
  const resolveOpacity = (val: string | number | undefined) => {
    if (val === undefined) return undefined;
    // Branded Type: numeric token (e.g., Opacity.n50 is 50 at runtime)
    // Opacity tokens are 0-100 scale, convert to 0-1 for CSS
    if (typeof val === "number") {
      return val / 100; // Convert to CSS opacity (0-1)
    }
    // Allow explicit string overrides
    return val;
  };

  // Function to resolve size/container tokens (Branded Type)
  const resolveSizing = (
    val: string | number | undefined,
    axis: "width" | "height",
  ) => {
    if (val === undefined) return undefined;

    // Branded Type: numeric token (e.g., Size.n40 is 40 at runtime)
    if (typeof val === "number") {
      return px(val as any); // Convert to "40px"
    }

    // String handling: Size keywords and explicit overrides
    if (typeof val === "string") {
      // Size.screen needs axis-specific handling
      // Size.screen is "100vh" but should be "100vw" for width axis
      if (val === "100vh") {
        return axis === "width" ? "100vw" : "100vh";
      }

      // Pass through Size keyword values (already CSS values)
      // Size.full = "100%", Size.min = "min-content", etc.
      if (
        [
          "100%",
          "100vw",
          "min-content",
          "max-content",
          "fit-content",
          "auto",
        ].includes(val)
      ) {
        return val;
      }

      // Allow explicit CSS unit values (e.g., "200px", "50%", "2rem")
      if (/^-?\d*\.?\d+(px|rem|em|%|vw|vh)$/.test(val)) {
        return val;
      }

      // Allow other percentage values
      if (["50%", "33%", "66%", "25%", "75%"].includes(val)) {
        return val;
      }
    }

    return undefined;
  };

  // --- Smart Logic Helpers ---
  const isFixedDimension = (
    val: string | number | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _axis: "width" | "height",
  ): boolean => {
    if (val === undefined) return false;
    // Branded Type numeric token (e.g., Size.n40) → fixed dimension
    if (typeof val === "number") return true;
    // String checks
    if (typeof val === "string") {
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
    // Standard Padding
    padding: resolveSpace(props.p) as any,
    paddingTop:
      (resolveSpace(props.pt) as any) ?? (resolveSpace(props.py) as any),
    paddingBottom:
      (resolveSpace(props.pb) as any) ?? (resolveSpace(props.py) as any),
    paddingLeft:
      (resolveSpace(props.pl) as any) ?? (resolveSpace(props.px) as any),
    paddingRight:
      (resolveSpace(props.pr) as any) ?? (resolveSpace(props.px) as any),

    gap: resolveSpace(props.gap) as any,

    // Sizing (Strict)
    width: resolveSizing(props.w, "width") as any,
    height: resolveSizing(props.h, "height") as any,
    minWidth: resolveSizing(props.minWidth, "width") as any,
    minHeight: resolveSizing(props.minHeight, "height") as any,
    maxWidth: resolveSizing(props.maxWidth, "width") as any,
    maxHeight: resolveSizing(props.maxHeight, "height") as any,

    // Radius (Strict, 'r' prop takes precedence)
    borderRadius: resolveRadius(props.r),

    // Opacity
    opacity: resolveOpacity(props.opacity),

    // Borders
    border:
      props.border === true
        ? "1px solid var(--border-color)"
        : typeof props.border === "string"
          ? props.border
          : undefined,
    borderTop:
      props.borderTop === true
        ? "1px solid var(--border-color)"
        : typeof props.borderTop === "string"
          ? props.borderTop
          : undefined,
    borderRight:
      props.borderRight === true
        ? "1px solid var(--border-color)"
        : typeof props.borderRight === "string"
          ? props.borderRight
          : undefined,
    borderBottom:
      props.borderBottom === true
        ? "1px solid var(--border-color)"
        : typeof props.borderBottom === "string"
          ? props.borderBottom
          : undefined,
    borderLeft:
      props.borderLeft === true
        ? "1px solid var(--border-color)"
        : typeof props.borderLeft === "string"
          ? props.borderLeft
          : undefined,
    borderColor: props.borderColor,
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

  // --- Radius Classes ---
  // Only apply rounded classes if 'r' is NOT defined
  // 'r' prop sets generic style which overrides class, but we avoid conflicting classes for cleanliness
  if (props.r === undefined) {
    if (props.rounded === true) {
      classes.push("r-md");
    } else if (props.rounded === false || props.rounded === "none") {
      classes.push("r-none");
    } else if (typeof props.rounded === "string") {
      classes.push(`r-${props.rounded}`);
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

  if (typeof props.gap === "number") {
    vars["--gap"] = props.gap;
  }

  // --- Check for other numeric tokens if we want to support them via vars in future frame.css updates ---
  // For now, only p and gap are scalar-variable driving.

  return {
    className: classes.join(" "),
    style: { ...vars, ...standardStyles },
  };
}
