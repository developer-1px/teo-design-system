import type React from "react";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  length?: string | number;
  thickness?: string | number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function Separator({
  orientation = "horizontal",
  length = "100%",
  thickness = "var(--border-width)",
  color = "var(--border-color)",
  style,
  className = "",
}: SeparatorProps) {
  const isHorizontal = orientation === "horizontal";

  const finalStyle: React.CSSProperties = {
    backgroundColor: color,
    width: isHorizontal
      ? typeof length === "number"
        ? `${length}px`
        : length
      : thickness,
    height: isHorizontal
      ? thickness
      : typeof length === "number"
        ? `${length}px`
        : length,
    flexShrink: 0,
    ...style,
  };

  return (
    <hr
      className={`separator ${className}`}
      style={{ ...finalStyle, border: "none" }}
      aria-orientation={orientation}
    />
  );
}
