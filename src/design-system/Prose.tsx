import type React from "react";
import { Frame, type FrameProps } from "./Frame";
import "./tokens.css";

type ProseRole =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "body-sm"
    | "caption";

interface ProseProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "style" | "title" | "color"> {
    role: ProseRole;
    children?: React.ReactNode;
    as?: React.ElementType;
    align?: "left" | "center" | "right" | "justify";
    color?: "primary" | "secondary" | "tertiary" | "white" | string;
    className?: string;
    style?: React.CSSProperties;
}

export function Prose({
    role,
    children,
    as,
    align,
    color,
    className = "",
    style = {},
    ...props
}: ProseProps) {
    // Determine default element based on role
    const Component =
        as ||
        (role.startsWith("h") ? (role as React.ElementType) : "p");

    // Resolve color
    let colorValue = "inherit";
    if (color) {
        if (["primary", "secondary", "tertiary"].includes(color)) {
            colorValue = `var(--text-${color})`;
        } else if (color === "white") {
            colorValue = "#ffffff";
        } else {
            colorValue = color;
        }
    }

    const computedStyle: React.CSSProperties = {
        fontSize: `var(--prose-${role}-size)`,
        lineHeight: `var(--prose-${role}-height)`,
        letterSpacing: `var(--prose-${role}-spacing)`,
        fontWeight: `var(--prose-${role}-weight)`,
        textAlign: align,
        color: colorValue,
        margin: 0,
        ...style,
    };

    return (
        <Component
            className={className}
            style={computedStyle}
            {...props}
        >
            {children}
        </Component>
    );
}

interface ProseDocumentProps extends FrameProps {
    children: React.ReactNode;
    maxWidth?: number | string;
    className?: string;
    gap?: number | string;
}

export function ProseDocument({
    children,
    maxWidth = "800px",
    className = "",
    style,
    gap = 4,
    ...props
}: ProseDocumentProps) {
    return (
        <Frame
            w="100%"
            maxWidth={maxWidth}
            gap={gap}
            style={{
                marginLeft: "auto",
                marginRight: "auto",
                ...style,
            }}
            className={`prose-document ${className}`}
            {...props}
        >
            {children}
        </Frame>
    );
}

export function ProseSection({
    children,
    maxWidth,
    contentGap,
    p = "96px 24px",
    w = "100%",
    ...props
}: React.ComponentProps<typeof Frame> & {
    maxWidth?: number | string;
    contentGap?: number | string;
}) {
    return (
        <Frame w={w} p={p} {...props}>
            <ProseDocument maxWidth={maxWidth} gap={contentGap}>
                {children}
            </ProseDocument>
        </Frame>
    );
}
