import type React from "react";
import { Frame } from "./Frame/Frame.tsx";
import type { FrameProps } from "./Frame/FrameProps.ts";
import { Layout } from "./Frame/Layout/Layout.ts";
import { Size, Space } from "./token/token.const.1tier";

type ProseRole = "h1" | "h2" | "h3" | "h4" | "body" | "body-sm" | "caption";

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

export function ProseOld({
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
    as || (role.startsWith("h") ? (role as React.ElementType) : "p");

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
    <Component className={className} style={computedStyle} {...props}>
      {children}
    </Component>
  );
}

interface ProseDocumentProps extends Omit<FrameProps, "gap" | "maxWidth"> {
  children: React.ReactNode;
  maxWidth?: number | string;
  className?: string;
  gap?: number | string;
  style?: React.CSSProperties;
}

export function ProseDocument({
  children,
  maxWidth = "800px",
  className = "",
  style,
  gap = 4,
  ...props
}: ProseDocumentProps) {
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
      style={{
        maxWidth: resolveSizingStyle(maxWidth),
        marginLeft: "auto",
        marginRight: "auto",
        ...style,
      }}
      override={{
        w: Size.full,
        maxWidth: resolveSizingProp(maxWidth),
        gap: gap as any,
        py: Space.n0,
        px: Space.n24,
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
  layout = "centered",
  p = "24 0",
  w = Size.full,
  ...props
}: Omit<React.ComponentProps<typeof Frame>, "layout" | "p" | "w"> & {
  maxWidth?: number | string;
  contentGap?: number | string;
  layout?: "centered" | "full";
  p?: any; // Allow loose
  w?: any; // Allow loose
}) {
  return (
    <Frame override={{ w: w, p: p }} {...props}>
      {layout === "centered" ? (
        <ProseDocument maxWidth={maxWidth} gap={contentGap}>
          {children}
        </ProseDocument>
      ) : (
        children
      )}
    </Frame>
  );
}

export function ProseActions({
  children,
  align = "left",
  gap = 2,
  ...props
}: Omit<React.ComponentProps<typeof Frame>, "align" | "gap"> & {
  align?: "left" | "center" | "right";
  gap?: number | string;
}) {
  const justify =
    align === "center" ? "center" : align === "right" ? "end" : "start";

  return (
    <Frame
      style={{ marginTop: "var(--space-6)" }}
      override={{ gap: gap as any }}
      layout={Layout.Row.Actions.Default}
      justify={justify}
      {...props}
    >
      {children}
    </Frame>
  );
}
