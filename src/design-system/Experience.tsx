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
            className={className}
            style={style}
            // @ts-ignore - Custom attribute for CSS tokens
            data-experience={value}
            w="100%"
            h="100%"
            fill
        >
            {children}
        </Frame>
    );
}
