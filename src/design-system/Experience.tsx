import type React from "react";
import { Frame } from "./Frame/Frame.tsx";
import { Size } from "./token/token.const.1tier";

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
      override={{ w: Size.full, h: Size.full }}
      style={style}
      className={className}
      data-experience={value}
      fill
    >
      {children}
    </Frame>
  );
}
