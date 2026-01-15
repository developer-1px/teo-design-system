import React from "react";
import type { FrameOverrides } from "./FrameProps.ts";


export function frameToSettings(props: FrameOverrides): {
  className: string;
  style: React.CSSProperties;
} {
  const classes: string[] = [];
  const vars: Record<string, any> = {};
  // Helper to remove undefined keys
  const cleanStyles = (styles: React.CSSProperties) => {
    return Object.fromEntries(
      Object.entries(styles).filter(([_, v]) => v !== undefined)
    ) as React.CSSProperties;
  };

  // Function to resolve space tokens strictly
  const resolveSpace = (val: string | number | undefined) => {
    if (!val) return undefined;
    if (typeof val === "string" && val.startsWith("space.")) {
      return `var(--${val.replace(".", "-")})`;
    }
    // Fallback used to be toToken, effectively allow direct pixel numbers or string passthrough?
    // User wants to avoid legacy. Strict tokens preferred.
    // If number, convert to px? Or assume oldMultiplier?
    // Old frame.css uses calc(var(--p) * 4px).
    // If we want to support '0', it's space.n0.
    if (val === 0) return "0px";
    return val; // Allow explicit strings like "10px" or "auto" if typed that way, though types say SpaceToken
  };

  const resolveRadius = (val: string | number | undefined) => {
    if (!val) return undefined;
    if (typeof val === "string" && val.startsWith("radius.")) {
      return `var(--${val.replace(".", "-")})`;
    }
    if (val === 0) return "0px";
    return val;
  };

  const resolveOpacity = (val: string | number | undefined) => {
    if (val === undefined) return undefined;
    if (typeof val === "string" && val.startsWith("opacity.")) {
      return `var(--${val.replace(".", "-")})`;
    }
    // Allow raw numbers if passed (though types restricted it, overrides might still pass it?)
    // But strict OpacityToken is preferred.
    if (typeof val === "number") return val;
    return val;
  };





  // Function to resolve size/container tokens strictly
  // Supports size.n*, size.full, container.n*
  const resolveSizing = (val: string | number | undefined, axis: "width" | "height") => {
    if (!val) return undefined;
    if (typeof val === "string") {
      // Legacy Token Fixes
      if (val === "size.full") return "100%";
      if (val === "size.screen") return axis === "width" ? "100vw" : "100vh";
      if (val === "size.min") return "min-content";
      if (val === "size.max") return "max-content";
      if (val === "size.fit") return "fit-content";
      if (val === "size.auto") return "auto";

      // Strict Token Mapping
      if (val.startsWith("size.") || val.startsWith("container.")) {
        return `var(--${val.replace(".", "-")})`;
      }

      // Pass through known keywords (explicit styling)
      // "full" and "screen" are handled by classes below, so we skip them here 
      // unless user passed "size.full" (handled above).
      if (["auto", "fit-content", "min-content", "max-content", "100%", "50%", "33%", "66%"].includes(val)) {
        return val;
      }

      // Allow explicit pixel values if string (e.g. "200px")?
      // User wants to remove legacy "toToken" behavior which allowed numbers -> px.
      // But explicit strings like "20px" might be useful overrides. 
      // For now, let's stick to tokens + keywords to be safe/strict as requested.
      // Allow explicit pixel/unit values
      if (/^-?\d*\.?\d+(px|rem|em|%|vw|vh)$/.test(val)) {
        return val;
      }
    }
    // Allow numbers (React handles as px)
    if (typeof val === "number") return val;

    return undefined;
  };

  // --- Smart Logic Helpers ---
  const isFixedDimension = (
    val: string | number | undefined,
    _: "width" | "height"
  ): boolean => {
    if (val === undefined) return false;
    if (typeof val === "number") return true;
    // String checks
    if (val.startsWith("size.n") || val.startsWith("container.n")) return true;
    if (val === "size.full" || val === "size.screen" || val === "size.auto" || val === "size.min" || val === "size.max" || val === "size.fit") return false;
    // Explicit px/rem
    if (/^-?\d*\.?\d+(px|rem|em)$/.test(val)) return true;
    return false;
  };


  const standardStyles: React.CSSProperties = cleanStyles({
    // Standard Padding
    padding: resolveSpace(props.p) as any,
    paddingTop:
      (resolveSpace(props.pt) as any) ??
      (resolveSpace(props.py) as any),
    paddingBottom:
      (resolveSpace(props.pb) as any) ??
      (resolveSpace(props.py) as any),
    paddingLeft:
      (resolveSpace(props.pl) as any) ??
      (resolveSpace(props.px) as any),
    paddingRight:
      (resolveSpace(props.pr) as any) ??
      (resolveSpace(props.px) as any),

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
  if (props.w === "size.full") classes.push("w-full");
  else if (props.w === "size.screen") classes.push("w-screen");

  if (props.h === "size.full") classes.push("h-full");
  else if (props.h === "size.screen") classes.push("h-screen");

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
    classes.push("overflow-clip");
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
