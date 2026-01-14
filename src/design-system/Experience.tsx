import React from "react";
import { Frame } from "./Frame";

export type ExperienceType = "application" | "landing" | "document";

interface ExperienceProps {
  value: ExperienceType;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Experience({
  value,
  children,
  className = "",
  style,
}: ExperienceProps) {
  return (
    <Frame
      override={{ style: style, w: "100%", h: "100%" }}
      className={className}
      // @ts-ignore - Custom attribute for CSS tokens
      data-experience={value}
      fill
    >
      {children}
    </Frame>
  );
}
