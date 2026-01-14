import type React from "react";

import "../lib/frame.css";

import type { FrameOverrides, FrameProps } from "./FrameProps.ts";
import { frameToSettings } from "../lib/frameToSettings.ts";

import {resolveLayout} from "./Layout/Layout.ts"

export function Frame({
  children,
  as: Component = "div",
  layout,
  override,
  title,
  className = "",
  // style is NOT destructured as it's not in FrameProps. We rely on override.style.
  // Note: if 'style' is passed in ...props (legacy), TS will complain at call site,
  // and we ignore it here unless we explicitly look for it.
  ...props
}: FrameProps) {
  // 1. Resolve Layout
  const layoutSettings = layout ? resolveLayout(layout) : {};

  // 2. Merge Overrides (Layout override < Direct override)
  // We extract style specifically to merge it last
  const combinedOverrideStyle = {
    ...layoutSettings.override?.style,
    ...override?.style,
  };

  const combinedOverride: FrameOverrides = {
    ...layoutSettings.override,
    ...override,
  };

  // 3. Construct Settings Input (Layout < Props < Override)
  // This flattens strict props and loose overrides into one Loose object for calculation
  const settingsInput: FrameOverrides = {
    ...layoutSettings,
    ...props,
    ...combinedOverride,
  } as FrameOverrides;

  // 4. Calculate Settings (Classes & CSS Vars)
  const { className: settingsClass, style: settingsStyle } =
    frameToSettings(settingsInput);



  // 5. Compute Final Style
  // Logic from previous Frame.tsx for specific computed props (grid, size logic)
  // We need to access props from settingsInput to ensure consistency

  const p = settingsInput; // Alias for brevity

  const computedStyle: React.CSSProperties = {
    // Grid Areas/Columns (Dynamic)
    gridTemplateColumns: p.columns,
    gridTemplateRows: p.rows,
    gridTemplateAreas: p.areas,


    // Flex
    flex: typeof p.flex === "number" ? p.flex : undefined,
    flexShrink:
      p.w !== undefined || p.h !== undefined || p.ratio !== undefined
        ? 0
        : undefined,

    // Visual
    opacity: p.opacity as any,
    aspectRatio: p.ratio,

    color: p.surface === "primary" ? "var(--primary-fg)" : "inherit",

    ...settingsStyle, // Injected variables & standard props (p, gap, w, h, etc)
    ...combinedOverrideStyle, // User arbitrary style overrides
  };

  return (
    <Component
      className={`frame ${settingsClass} ${className}`}
      style={computedStyle}
      onClick={props.onClick}
      title={title}
      // We pass ...props to DOM mostly for event handlers, aria, etc.
      // But props contains strict styling props too (p, w).
      // React ignores unknown props on DOM elements if they are not standard attributes.
      // 'p', 'gap' etc are NOT valid HTML attributes.
      // However, we should try to filter them out?
      // Previous Frame didn't filter aggressively, just relied on React or Component being 'div'.
      // If 'Component' is a styled component or custom, it might receive them.
      // For now, we preserve behavior passing ...props.
      {...props}
    >
      {children}
    </Component>
  );
}
