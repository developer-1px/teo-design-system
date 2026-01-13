import type React from "react";
import { Text } from "./Text";
import { Frame } from "./Frame";
import "./tokens.css";

import type { RoundedToken, SurfaceToken } from "./types";

interface SectionProps {
  children?: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  // Layout props passthrough
  fill?: boolean;
  style?: React.CSSProperties;
  border?: boolean | "top" | "bottom" | "left" | "right";
  w?: string | number;
  h?: string | number;
  rounded?: RoundedToken;
  surface?: SurfaceToken;
  shadow?: "sm" | "md" | "lg";
  flex?: boolean | number;
}

export function Section({
  children,
  title,
  icon,
  fill,
  ...props
}: SectionProps) {
  // Border Logic
  const computedBorder: React.CSSProperties = {};
  const finalBorder = props.border ?? true; // Default to true if undefined

  if (finalBorder === true) {
    computedBorder.border = "1px solid var(--border-color)";
  } else if (typeof finalBorder === "string") {
    const key = `border${finalBorder.charAt(0).toUpperCase() + finalBorder.slice(1)}` as keyof React.CSSProperties;
    // @ts-expect-error
    computedBorder[key] = "1px solid var(--border-color)";
  }

  return (
    <Frame
      surface="base"
      {...props}
      p={0} // Force zero padding so children/separators can hit edges
      fill={fill}
      style={{
        ...computedBorder,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        ...props.style,
      }}
    >
      {(title || icon) && (
        <Frame
          row
          align="center"
          gap={2}
          p={2}
          style={{
            borderBottom: "1px solid var(--border-color)",
            flexShrink: 0,
          }}
        >
          {icon && <span style={{ color: "var(--text-subtle)" }}>{icon}</span>}
          {title && (
            <Text
              variant={4}
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: "bold",
              }}
            >
              {title}
            </Text>
          )}
        </Frame>
      )}
      <Frame fill flex style={{ overflow: "auto", minHeight: 0 }}>
        {children}
      </Frame>
    </Frame>
  );
}
