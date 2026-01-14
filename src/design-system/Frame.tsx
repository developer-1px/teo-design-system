import type React from "react";
import "./lib/tokens.css";
import "./lib/frame.css";

import type { FrameProps } from "./lib/props.ts";
import { toToken } from "./lib/utils.ts";
import { frameToSettings } from "./lib/frameToSettings.ts";



export function Frame({
  children,
  as: Component = "div",

  p,
  gap,
  pack,
  w,
  h,

  flex,
  row,
  wrap,
  fill,
  grid,
  columns,
  rows,
  areas,

  minWidth,
  minHeight,
  maxWidth,
  maxHeight,

  align,
  justify,

  surface,
  rounded,
  overflow,
  cursor,

  shadow,
  opacity,
  ratio,



  title,
  className = "",
  style = {},
  ...props
}: FrameProps) {
  // --- New Settings (Hybrid CSS/Vars) ---
  // Calculates classNames and scalar variables (e.g., --p: 2)
  const { className: settingsClass, style: settingsStyle } = frameToSettings({
    row,
    pack,
    wrap,
    p,
    gap,
    w,
    h,
    rounded,
    surface,

    align,
    justify,
    flex,
    overflow,
    cursor,
    shadow,
    grid,
    fill,
  } as FrameProps);

  const computedStyle: React.CSSProperties = {
    // Grid Areas/Columns (Dynamic)
    gridTemplateColumns: columns,
    gridTemplateRows: rows,
    gridTemplateAreas: areas,

    // Sizing (W/H fallback for numeric values)
    width: (typeof w === 'number' || (typeof w === 'string' && !['full', 'screen'].includes(w)))
      ? toToken(w, "size") as any
      : undefined,
    height: (typeof h === 'number' || (typeof h === 'string' && !['full', 'screen'].includes(h)))
      ? toToken(h, "size") as any
      : undefined,

    minWidth: toToken(minWidth, "size") as any,
    minHeight: toToken(minHeight, "size") as any,
    maxWidth: toToken(maxWidth, "size") as any,
    maxHeight: toToken(maxHeight, "size") as any,

    // Flex (Fallback for numeric values)
    flex: typeof flex === "number" ? flex : undefined,
    flexShrink: (w !== undefined || h !== undefined || ratio !== undefined) ? 0 : undefined,

    // Visual Props
    opacity,
    aspectRatio: ratio,

    // Positioning


    color: surface === "primary" ? "var(--primary-fg)" : "inherit",

    ...settingsStyle, // Injected variables (--p, --gap)
    ...style, // User overrides
  };

  return (
    <Component
      className={`frame ${settingsClass} ${className}`}
      style={computedStyle}
      onClick={props.onClick}
      title={title}
      {...props}
    >
      {children}
    </Component>
  );
}
