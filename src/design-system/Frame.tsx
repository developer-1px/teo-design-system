import type React from "react";
import "./tokens.css";
import "./frame.css";

import type { FrameProps } from "./props";
import { toToken } from "./utils";
import { frameToSettings } from "./frameToSettings";



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
  border,
  rounded,
  overflow,
  cursor,

  shadow,
  opacity,
  ratio,
  borderColor,

  position,
  top,
  bottom,
  left,
  right,
  zIndex,

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
    position,
    align,
    justify,
    flex,
    overflow,
    cursor,
    shadow,
    grid,
    fill,
  } as FrameProps);

  // --- Legacy Computed Styles (for props not covered by frame.css yet) ---
  const computedBorder: React.CSSProperties = {};
  const finalBorder = border ?? (surface === "selected" ? true : undefined);

  const colorStr = borderColor
    ? borderColor === "default"
      ? "var(--border-color)"
      : borderColor === "transparent"
        ? "transparent"
        : `var(--${borderColor})`
    : "var(--border-color)";

  if (finalBorder === true)
    computedBorder.border = `var(--border-width) solid ${colorStr}`;
  else if (typeof finalBorder === "string") {
    const key =
      `border${finalBorder.charAt(0).toUpperCase() + finalBorder.slice(1)}` as keyof React.CSSProperties;
    // @ts-expect-error
    computedBorder[key] = `var(--border-width) solid ${colorStr}`;
  }

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

    ...computedBorder,

    // Visual Props
    opacity,
    aspectRatio: ratio,

    // Positioning
    zIndex,
    top: toToken(top, "space"),
    bottom: toToken(bottom, "space"),
    left: toToken(left, "space"),
    right: toToken(right, "space"),

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
