import type React from "react"

import "../../style/frame.css"

import type {FrameOverrides, FrameProps} from "./FrameProps.ts"
import {frameToSettings} from "./frameToSettings.ts"

import {resolveLayout} from "./Layout/Layout.ts"

export function Frame({
  children,
  as: Component = "div",
  className = "",
  style,

  // --- Preset Props (2-Tier Semantic) ---
  // Layout (Flow)
  layout,

  row,
  wrap,
  pack,

  // @deprecated
  gap, // @deprecated
  grid, // @deprecated
  fill,// @deprecated
  flex,// @deprecated

  // Sizing (Constraints)
  w,
  h,
  ratio,

  // Appearance (Visuals)
  surface,
  border,
  borderWidth,
  rounded,
  shadow,
  opacity,

  clip,
  scroll,

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
  const layoutSettings = layout ? resolveLayout(layout) : {}

  // ---------------------------------------------------------------------------
  // 2. Resolve Overrides (Standard < Layout < Override)
  // ---------------------------------------------------------------------------
  const combinedOverride: FrameOverrides = {
    ...layoutSettings.override,
    ...override,
  }

  // ---------------------------------------------------------------------------
  // 3. Flatten Props (Explicit > Undefined)
  // ---------------------------------------------------------------------------
  // Collect explicit props to ensure they override presets
  const explicitProps: FrameOverrides = {
    // Layout
    row,
    gap,
    pack,
    grid,
    wrap,
    flex,
    scroll,
    // Sizing
    w,
    h,
    fill,

    ratio,
    // Appearance (Partial) - some are top-level only
    clip,
    shadow,
    opacity,
  }

  // Clean undefined values
  const cleanExplicitProps = Object.fromEntries(
    Object.entries(explicitProps).filter(([_, v]) => v !== undefined),
  )

  // ---------------------------------------------------------------------------
  // 4. Construct Settings Input (The "Source of Truth")
  // ---------------------------------------------------------------------------
  const settingsInput = {
    ...layoutSettings,
    ...cleanExplicitProps,
    ...combinedOverride, // Valid 1-Tier tokens
    // Top-level only Appearance props
    ...(surface !== undefined && {surface}),
    ...(rounded !== undefined && {rounded}),
    ...(border !== undefined && {border}),
    ...(borderWidth !== undefined && {borderWidth}),
  }

  // ---------------------------------------------------------------------------
  // 5. Calculate CSS (Classes & Vars)
  // ---------------------------------------------------------------------------
  const {className: settingsClass, style: settingsVars} =
    frameToSettings(settingsInput)

  // ---------------------------------------------------------------------------
  // 6. Compute Final Style (Restricted Style Injection)
  // ---------------------------------------------------------------------------
  const computedStyle: React.CSSProperties = {
    // A. Dynamic Layout Logic
    gridTemplateColumns: settingsInput.columns,
    gridTemplateRows: settingsInput.rows,
    gridTemplateAreas: settingsInput.areas,

    // B. Legacy/Compat Logic
    flex:
      typeof settingsInput.flex === "number" ? settingsInput.flex : undefined,
    flexShrink:
      settingsInput.w !== undefined ||
      settingsInput.h !== undefined ||
      settingsInput.ratio !== undefined
        ? 0
        : undefined,
    aspectRatio: settingsInput.ratio,

    // C. Theme Logic
    color:
      settingsInput.surface === "primary" ? "var(--primary-fg)" : "inherit",

    // D. Injected Variables
    ...settingsVars,

    // E. Layout Override Style (e.g. from preset)
    ...((layoutSettings.style || {}) as React.CSSProperties),

    // F. User Restricted Style (Escape Hatch)
    ...style,
  }

  return (
    <Component
      className={`frame ${settingsClass} ${className}`}
      style={computedStyle}
      title={title}
      {...domProps}
    >
      {children}
    </Component>
  )
}
