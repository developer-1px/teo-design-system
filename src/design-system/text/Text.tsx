import type React from "react";
import type { FontSizeToken, FontWeight } from "../lib/types.ts";

import { Card } from "./context/Card.tsx";
import { Field } from "./context/Field.tsx";
import { Menu } from "./context/Menu.tsx";
import { Prose } from "./context/Prose.tsx";
import { Table } from "./context/Table.tsx";

export type TextVariant =
  | "heading-lg"
  | "heading-md"
  | "heading-sm"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "caption"
  | "caption-sm"
  | "code";

export interface TextProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "style" | "className" | "color"
  > {
  children: React.ReactNode;
  variant?: TextVariant;
  as?: React.ElementType;

  // Overrides
  weight?: FontWeight | "regular" | "medium" | "bold";
  mono?: boolean;
  opacity?: number | import("../token/token.const.1tier").OpacityToken;
  size?: FontSizeToken; // Absolute scale only, strict
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "muted"
    | "dim"
    | "white"
    | string;

  className?: string;
  style?: React.CSSProperties;
}

export function TextRoot({
  children,
  variant = "body-md", // New default
  as,
  weight,
  mono,
  opacity,
  size,
  color,
  className = "",
  style: styleProp = {},
  ...props
}: TextProps) {
  // 1. Resolve Tag
  const Tag = (as || getTagForVariant(variant)) as React.ElementType;

  // 2. Resolve Color
  const colorValue = resolveColor(color);

  // 3. Resolve Typography Styles
  const typoStyle = resolveTypography(variant);

  // 4. Overrides
  const mergedStyle: React.CSSProperties = {
    ...typoStyle,
    color: colorValue,
    fontFamily: mono ? "var(--font-family-mono)" : undefined,
    margin: 0,
    ...styleProp,
  };

  // Handle explicit weight override
  if (weight) {
    mergedStyle.fontWeight =
      weight === "regular"
        ? "var(--font-weight-regular)"
        : weight === "medium"
          ? "var(--font-weight-medium)"
          : weight === "bold"
            ? "var(--font-weight-bold)"
            : weight; // Tokens are already CSS variables
  }

  // Handle explicit size override (tokens are already CSS variables)
  if (size !== undefined) {
    mergedStyle.fontSize = size; // Already "var(--font-size-nX)"
  }

  // Handle Opacity Token (tokens are already CSS variables)
  if (opacity !== undefined) {
    mergedStyle.opacity = opacity; // Already "var(--opacity-nX)" with 0-1 values
  }

  return (
    <Tag className={className} style={mergedStyle} {...props}>
      {children}
    </Tag>
  );
}

export const Text = Object.assign(TextRoot, {
  Card,
  Prose,
  Menu,
  Field,
  Table,
});

// --- Helpers ---

function getTagForVariant(variant: TextVariant): React.ElementType {
  if (variant.startsWith("heading")) {
    if (variant === "heading-lg") return "h2";
    if (variant === "heading-md") return "h3";
    return "h4";
  }
  if (variant === "code") return "code";
  return "p";
}

function resolveColor(color: TextProps["color"]): string | undefined {
  if (color) {
    if (["primary", "secondary", "tertiary", "muted", "dim"].includes(color)) {
      return `var(--text-${color})`;
    }
    if (color === "white") return "#ffffff";
    return color;
  }

  // Defaults based on hierarchy if no color specified
  // (Optional: could enforce specific defaults per role, but usually inherits or defaults to body)
  return "var(--text-body)";
}

function resolveTypography(variant: TextVariant): React.CSSProperties {
  // New Semantic System
  return {
    fontSize: `var(--text-${variant}-size)`,
    fontWeight: `var(--text-${variant}-weight)`,
    lineHeight: `var(--text-${variant}-height)`,
    letterSpacing: `var(--text-${variant}-spacing)`,
  };
}
