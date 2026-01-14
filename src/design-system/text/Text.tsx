import type React from "react";
import "../lib/tokens.css";
import type { FontWeight, TypographyVariant } from "../lib/types.ts";
import { toToken } from "../lib/utils.ts";

import { Card } from "./context/Card.tsx";
import { Prose } from "./context/Prose.tsx";
import { Menu } from "./context/Menu.tsx";
import { Field } from "./context/Field.tsx";
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
  | "code"
  | TypographyVariant; // Keep numeric for compat

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
  opacity?: number;
  size?: number | string; // Override size (number for token, string for px)
  color?: "primary" | "secondary" | "tertiary" | "muted" | "dim" | "white" | string;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = (as || getTagForVariant(variant)) as any;

  // 2. Resolve Color
  const colorValue = resolveColor(color, variant);

  // 3. Resolve Typography Styles
  const typoStyle = resolveTypography(variant);

  // 4. Overrides
  const mergedStyle: React.CSSProperties = {
    ...typoStyle,
    color: colorValue,
    fontFamily: mono ? "var(--font-family-mono)" : undefined,
    opacity,
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
            : toToken(weight, "font-weight");
  }

  // Handle explicit size override
  if (size) {
    mergedStyle.fontSize = toToken(size, "font-size");
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
  if (typeof variant === "number") {
    if (variant === 1) return "h1";
    if (variant === 2) return "h2";
    if (variant === 3) return "p";
    return "span";
  }
  if (variant.startsWith("heading")) {
    if (variant === "heading-lg") return "h2";
    if (variant === "heading-md") return "h3";
    return "h4";
  }
  if (variant === "code") return "code";
  return "p";
}

function resolveColor(
  color: TextProps["color"],
  variant: TextVariant
): string | undefined {
  if (color) {
    if (["primary", "secondary", "tertiary", "muted", "dim"].includes(color)) {
      return `var(--text-${color})`;
    }
    if (color === "white") return "#ffffff";
    return color;
  }

  // Defaults based on hierarchy if no color specified
  // (Optional: could enforce specific defaults per role, but usually inherits or defaults to body)
  if (typeof variant === "number") {
    // Legacy fallback
    const map: Record<number, string> = {
      1: "var(--text-primary)",
      2: "var(--text-body)",
      3: "var(--text-subtle)",
    };
    return map[variant] || "var(--text-body)";
  }

  return "var(--text-body)";
}

function resolveTypography(variant: TextVariant): React.CSSProperties {
  // If legacy numeric
  if (typeof variant === "number") {
    return {
      fontSize: `var(--font-size-${variant})`,
      fontWeight: variant <= 2 ? "var(--font-weight-bold)" : "var(--font-weight-regular)",
      lineHeight: 1.5,
    };
  }

  // New Semantic System
  return {
    fontSize: `var(--text-${variant}-size)`,
    fontWeight: `var(--text-${variant}-weight)`,
    lineHeight: `var(--text-${variant}-height)`,
    letterSpacing: `var(--text-${variant}-spacing)`,
  };
}
