import type React from "react";

import type { FrameProps } from "./FrameProps.ts";
import { frameToSettings } from "./frameToSettings.ts";

export function Frame({
  children,
  as: Component = "div",
  style,

  // --- Preset Props (2-Tier Semantic) ---
  // Layout (Flow)
  layout,
  wrap,

  // Sizing (Constraints)
  w,
  h,

  // Appearance (Visuals)
  surface,
  opacity,

  scroll,
  interactive,
  rounded,
  selected,

  // Spacing (Unified)
  spacing,

  // Overrides (1-Tier Tokens)
  override,

  // Semantic
  title,

  // DOM
  ...domProps
}: FrameProps) {
  // ---------------------------------------------------------------------------
  // 1. Resolve Presets (Layout Token)
  // ---------------------------------------------------------------------------
  // MDK v7.7 Strict: Layout is the Source of Truth. No resolving needed.
  const layoutSettings = layout || ({} as any);

  // ---------------------------------------------------------------------------
  // 2. Auto-resolve Surface for Interactive Elements
  // ---------------------------------------------------------------------------
  // If interactive but no surface specified, default to ghost
  const resolvedSurface =
    surface !== undefined ? surface : interactive ? "ghost" : undefined;

  // ---------------------------------------------------------------------------
  // 3. Construct Settings Input (The "Source of Truth")
  // ---------------------------------------------------------------------------
  // Priority: Layout Preset < Top-Level Props < Overrides
  const settingsInput = {
    ...layoutSettings,

    // Top-Level Props (Explicit overrides for Layout)
    ...(wrap !== undefined && { wrap }),
    ...(w !== undefined && { w }),
    ...(h !== undefined && { h }),
    ...(scroll !== undefined && { scroll }),
    ...(opacity !== undefined && { opacity }),
    ...(resolvedSurface !== undefined && { surface: resolvedSurface }),
    ...(interactive !== undefined && { interactive }),
    ...(rounded !== undefined && { rounded }),
    ...(selected !== undefined && { selected }),

    // Top-Level Spacing (Unified)
    // spacing → gap = spacing * 1, p = spacing * 1.25
    ...(spacing !== undefined && {
      gap: spacing,
      p: `calc(${spacing} * 1.25)` as any, // CSS calc for padding
    }),

    // Ad-hoc Overrides (Highest Priority)
    ...override,
  };

  // ---------------------------------------------------------------------------
  // 3. Calculate CSS (Classes & Vars)
  // ---------------------------------------------------------------------------
  const { className: settingsClass, style: settingsVars } =
    frameToSettings(settingsInput);

  // ---------------------------------------------------------------------------
  // 4. Compute Final Style (Restricted Style Injection)
  // ---------------------------------------------------------------------------
  const computedStyle: React.CSSProperties = {
    // A. Dynamic Layout Logic
    gridTemplateColumns: settingsInput.columns,
    gridTemplateRows: settingsInput.rows,
    gridTemplateAreas: settingsInput.areas,

    aspectRatio: settingsInput.ratio,

    // B. Injected Variables
    ...settingsVars,

    // C. Layout Override Style (e.g. from preset)
    ...((layoutSettings.style || {}) as React.CSSProperties),

    // D. User Restricted Style (Escape Hatch)
    ...style,
  };

  return (
    <Component
      className={`frame ${settingsClass}`}
      style={computedStyle}
      title={title}
      {...domProps}
    >
      {children}
    </Component>
  );
}
