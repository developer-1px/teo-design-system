import React from "react";
import { Frame } from "./Frame";
import { Text } from "./text/Text.tsx";
import { Icon } from "./Icon";
import { IconSize, Space, type IconSizeToken, type SpaceToken } from "./token/token.const.1tier";


import type { ActionVariant, RoundedToken, SurfaceToken } from "./lib/types.ts";
import { toToken } from "./lib/utils.ts";

interface ActionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  children?: React.ReactNode;
  icon?: React.ReactNode | React.ElementType;
  label?: string;
  variant?: ActionVariant;

  // Layout overrides
  rounded?: RoundedToken;
  p?: number | string;
  gap?: SpaceToken | number;
  border?: boolean;
  flex?: boolean | number;
  fill?: boolean;

  // Shortcuts
  size?: number | string; // Sets unique width & height (square)
  w?: number | string;
  h?: number | string;
  iconSize?: number | IconSizeToken; // Sets icon size if icon is a component
  iconRotation?: number; // Internalized rotation

  // Visual
  opacity?: number;
  surface?: SurfaceToken; // Explicit surface control
  tooltip?: string;
  glow?: boolean;
  shadow?: string;

  // Layout
  justify?: string;
}

export function Action({
  children,
  icon,
  label,
  variant,
  rounded = "round",
  p,
  gap,
  border,
  w,
  h,
  size,
  iconSize = 16,
  iconRotation,
  opacity,
  surface,
  tooltip,
  glow,
  shadow,
  justify,
  className = "",
  style: styleOverride,
  ...props
}: ActionProps) {
  // Helper to render icon
  // Helper to render icon
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;

    return (
      <Icon
        src={icon as React.ElementType}
        size={iconSize || IconSize.n16}
        style={{ display: "block" }} // Ensure no extra spacing quirks
      />
    );
  };

  // Logic: Actions with a label default to 'surface' if variant not specified.
  // This provides a professional "button" look for textual actions.
  const finalVariant = variant ?? (label ? "surface" : "ghost");

  // Dimension logic: If label is present, width should be auto to fit text.
  // size/width props can still override this if explicitly provided.
  const finalWidth = label ? "auto" : size;
  const finalHeight = size;

  // Logic: If variant is 'surface', ensure radius defaults to 'round' (8px) if not overridden.
  // Although the prop default is 'round', this makes the intent explicit and robust vs future prop changes.
  const finalRounded =
    rounded ?? (finalVariant === "surface" ? "round" : "round");

  const mapJustify = (v: string | undefined) => {
    if (v === "start") return "flex-start";
    if (v === "end") return "flex-end";
    if (v === "between") return "space-between";
    return v;
  };

  return (
    <Frame
      override={{
        w: w ?? finalWidth,
        h: h ?? finalHeight,
        rounded: finalRounded,
        p: p ?? (label ? 2 : 0),
        gap: (gap as SpaceToken) ?? Space.n4,
        opacity: opacity,
        style: {
          border: border ? "1px solid var(--border-color)" : undefined,
          minWidth: !label && size ? (toToken(size, "size") as any) : undefined, // Ensure square for icons
          cursor: "pointer", // Indicate interactivity
          color: finalVariant === "primary" ? "var(--primary-fg)" : "inherit",
          boxShadow: shadow
            ? `var(--shadow-${shadow})`
            : glow
              ? "0 0 20px -5px var(--primary-bg)"
              : undefined,
          ...styleOverride,
        },
      }}
      as="button"
      className={`action-base action-${finalVariant} ${className}`}
      title={tooltip}
      surface={surface}
      row
      pack
      justify={mapJustify(justify) as any}
      {...props}
    >
      {icon && (
        <span
          className="action-icon"
          style={{
            display: "flex",
            transform: iconRotation ? `rotate(${iconRotation}deg)` : undefined,
          }}
        >
          {renderIcon()}
        </span>
      )}
      {label && (
        <Text.Menu.Item
          style={{
            lineHeight: 1,
            whiteSpace: "nowrap",
            color: "inherit",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          {label}
        </Text.Menu.Item>
      )}
      {children}
    </Frame>
  );
}
