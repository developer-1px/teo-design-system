import type React from "react";

import "../../style/frame.css";

import type { FrameOverrides, FrameProps } from "./FrameProps.ts";
import { frameToSettings } from "./frameToSettings.ts";

import { resolveLayout } from "./Layout/Layout.ts";

export function Frame({
  children,
  as: Component = "div",
  style,
  layout,
  override,
  title,
  className = "",

  // Destructure Prop-Driven Styling to prevent DOM leakage
  gap,
  pack,
  w,
  h,
  flex,
  row,
  wrap,
  fill,
  surface,
  rounded,
  clip,
  border,
  scroll,
  shrink,
  shadow,
  opacity,
  ratio,

  // Remaining props are passed to DOM
  ...domProps
}: FrameProps) {
  // 1. Resolve Layout
  const layoutSettings = layout ? resolveLayout(layout) : {};

  // 2. Merge Overrides (Layout override < Direct override)
  // We extract style specifically to merge it last
  const combinedOverrideStyle = {
    ...layoutSettings.style,
    ...style,
  };

  const combinedOverride: FrameOverrides = {
    ...layoutSettings.override,
    ...override,
  };

  // 3. Construct Settings Input (Layout < Props < Override)
  // We reconstruct the props object for calculation
  const explicitProps: FrameOverrides = {
    gap,
    pack,
    w,
    h,

    flex,
    row,
    wrap,
    fill,
    shrink,

    clip,
    scroll,

    shadow,
    opacity,
    ratio,
  };

  // Remove undefined keys so they don't overwrite layoutSettings
  Object.keys(explicitProps).forEach(
    (key) =>
      explicitProps[key as keyof FrameOverrides] === undefined &&
      delete explicitProps[key as keyof FrameOverrides],
  );

  // This flattens strict props and loose overrides into one Loose object for calculation
  // surface, rounded, border are top-level only, added separately
  const settingsInput = {
    ...layoutSettings,
    ...explicitProps,
    ...combinedOverride,
    ...(surface !== undefined && { surface }),
    ...(rounded !== undefined && { rounded }),
    ...(border !== undefined && { border }),
  };

  // 4. Calculate Settings (Classes & CSS Vars)
  const { className: settingsClass, style: settingsStyle } =
    frameToSettings(settingsInput);

  // 5. Compute Final Style
  // Logic from previous Frame.tsx for specific computed props (grid, size logic)
  const input = settingsInput; // Alias for brevity

  const computedStyle: React.CSSProperties = {
    // Grid Areas/Columns (Dynamic)
    gridTemplateColumns: input.columns,
    gridTemplateRows: input.rows,
    gridTemplateAreas: input.areas,

    // Flex
    flex: typeof input.flex === "number" ? input.flex : undefined,
    flexShrink:
      input.w !== undefined ||
      input.h !== undefined ||
      input.ratio !== undefined
        ? 0
        : undefined,

    // Visual
    aspectRatio: input.ratio,

    color: input.surface === "primary" ? "var(--primary-fg)" : "inherit",

    ...settingsStyle, // Injected variables & standard props (p, gap, w, h, etc, opacity)
    ...combinedOverrideStyle, // User arbitrary style overrides
  };

  return (
    <Component
      className={`frame ${settingsClass} ${className}`}
      style={computedStyle}
      title={title}
      {...domProps}
    >
      {children}
    </Component>
  );
}
