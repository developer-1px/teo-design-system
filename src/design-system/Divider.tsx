import type React from "react";

interface DividerProps {
  variant?: "line" | "dot" | "slash" | "spacer";
  size?: number | string; // Margin size
  color?: string;
  orientation?: "horizontal" | "vertical"; // Manual override
  className?: string;
  style?: React.CSSProperties;
}

export function Divider({
  variant = "line",
  size,
  color = "var(--border-color)",
  orientation,
  className = "",
  style,
}: DividerProps) {
  // Default size based on variant
  const defaultSize = variant === "line" ? 2 : 1;
  const marginValue = size !== undefined ? size : defaultSize;
  const resolvedMargin =
    typeof marginValue === "number"
      ? `var(--space-${marginValue})`
      : marginValue;

  // Note: True context-awareness (detecting parent stack direction) requires Context or css-container-queries.
  // For this minimal system, we will rely on implicit defaults or explicit overrides.
  // By default, we assume vertical stacking (Horizontal Line) unless forced.
  const isVerticalLine = orientation === "vertical"; // This creates a Vertical Bar |

  if (variant === "spacer") {
    return (
      <div
        style={{ flexBasis: resolvedMargin}}
        aria-hidden="true"
      />
    );
  }

  if (variant === "dot") {
    return (
      <span
        className={`divider-dot ${className}`}
        style={{
          color,
          margin: `0 ${resolvedMargin}`,
          ...style,
        }}
      >
        •
      </span>
    );
  }

  if (variant === "slash") {
    return (
      <span
        className={`divider-slash ${className}`}
        style={{
          color,
          margin: `0 ${resolvedMargin}`,
          ...style,
        }}
      >
        /
      </span>
    );
  }

  // Line Variant
  const lineStyle: React.CSSProperties = {
    backgroundColor: color,
    ...style,
  };

  if (isVerticalLine) {
    // Vertical Bar (for Horizontal Stacks)
    // e.g. Toolbar | Item
    return (
      <hr
        className={`divider-vertical ${className}`}
        style={{
          ...lineStyle,
          width: "1px",
          height: "1em", // Match text height by default
          alignSelf: "center",
          margin: `0 ${resolvedMargin}`,
          border: "none", // Reset default hr styles
        }}
        aria-orientation="vertical"
      />
    );
  }

  // Horizontal Line (for Vertical Stacks) - Default
  // e.g. Section ---------------- Section
  return (
    <hr
      className={`divider-horizontal ${className}`}
      style={{
        ...lineStyle,
        width: "100%",
        height: "1px",
        margin: `${resolvedMargin} 0`,
        border: "none", // Reset default hr styles
      }}
      aria-orientation="horizontal"
    />
  );
}
