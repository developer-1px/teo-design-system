import React from "react";
import { Frame } from "./Frame/Frame.tsx";
import { Icon } from "./Icon";
import type {
  ActionVariant,
  JustifyToken,
  RoundedToken,
  SurfaceToken,
} from "./lib/types.ts";
import { Text } from "./text/Text.tsx";
import {
  type IconSizeToken,
  type OpacityToken,
  Space,
  type SpaceToken,
} from "./token/token.const.1tier";
import { ActionSize, type ActionSizeToken } from "./token/token.const.2tier";

interface ActionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  children?: React.ReactNode;
  icon?: React.ReactNode | React.ElementType;
  label?: string;
  variant?: ActionVariant;

  // Layout overrides
  rounded?: RoundedToken;
  p?: SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  pt?: SpaceToken;
  pb?: SpaceToken;
  pl?: SpaceToken;
  pr?: SpaceToken;
  gap?: SpaceToken;
  border?: boolean;
  flex?: boolean | number;
  fill?: boolean;

  // Sizing
  /**
   * T-Shirt size for the action.
   * Controls height, icon size, and default padding.
   * @default "sm"
   */
  size?: ActionSizeToken;

  // Escape hatches
  w?: number | string;
  h?: number | string;
  iconSize?: number | IconSizeToken; // Explicit icon size override
  iconRotation?: number;

  // Visual
  opacity?: OpacityToken;
  surface?: SurfaceToken;
  tooltip?: string;
  glow?: boolean;
  shadow?: string;

  // Layout
  justify?: JustifyToken;
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
  size = "sm", // Default to sm (32px)
  iconSize,
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

  // Resolve 2-Tier Token
  const sizeConfig = ActionSize[size] || ActionSize.sm;

  // Helper to render icon
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;

    // Use explicit iconSize if provided, otherwise fallback to size token
    const finalIconSize = iconSize || sizeConfig.icon;

    return (
      <Icon
        src={icon as React.ElementType}
        size={finalIconSize}
        style={{ display: "block" }}
      />
    );
  };

  const finalVariant = variant ?? (label ? "surface" : "ghost");

  // If label exists, we want auto width. If no label (icon only), we defaults to square (height)
  // But strictly, 'w' prop overrides everything.
  // If 'w' is unset:
  //   - label available -> auto
  //   - no label -> square (w = h)
  const defaultWidth = label ? "auto" : sizeConfig.height;
  const finalWidth = w ?? defaultWidth;

  // Height is strict from token unless overridden
  const finalHeight = h ?? sizeConfig.height;

  // Padding: Use explicit 'p' if provided, otherwise use token's padding
  // NOTE: If label is present, we might want lateral padding.
  // The token 'padding' is likely for the Icon-only case or the gap? 
  // Let's assume the token.padding is for general padding.
  const finalP = p ?? sizeConfig.padding;

  const finalRounded = rounded ?? "round";

  const resolveSizingProp = (val: string | number | undefined) => {
    if (
      typeof val === "string" &&
      (val.startsWith("size.") || val.startsWith("container."))
    ) {
      return val as any;
    }
    return undefined;
  };
  const resolveSizingStyle = (val: string | number | undefined) => {
    if (
      typeof val === "string" &&
      (val.startsWith("size.") || val.startsWith("container."))
    ) {
      return undefined;
    }
    if (typeof val === "number") return `${val}px`;
    return val;
  };

  return (
    <Frame
      override={{
        w: resolveSizingProp(finalWidth),
        h: resolveSizingProp(finalHeight),
        rounded: finalRounded,
        p: finalP,
        gap: gap ?? Space.n4,
        opacity: opacity,
        row: true,
        align: "center",
      }}
      style={{
        width: resolveSizingStyle(finalWidth),
        height: resolveSizingStyle(finalHeight),
        border: border ? "1px solid var(--border-color)" : undefined,
        cursor: "pointer",
        color: finalVariant === "primary" ? "var(--primary-fg)" : "inherit",
        boxShadow: shadow
          ? `var(--shadow-${shadow})`
          : glow
            ? "0 0 20px -5px var(--primary-bg)"
            : undefined,
        ...styleOverride,
      }}
      as="button"
      className={`action-base action-${finalVariant} ${className}`}
      title={tooltip}
      surface={surface}
      pack
      justify={justify}
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
            fontSize: sizeConfig.fontSize, // Use token font size
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
