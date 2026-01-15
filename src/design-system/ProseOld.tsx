import type React from "react";
import { Frame } from "./Frame/Frame.tsx";
import type { FrameProps } from "./Frame/FrameProps.ts";
import { Layout } from "./Frame/Layout/Layout.ts";
import { Size, Space } from "./token/token.const.1tier";
import type {
  SpaceToken,
  SizeToken,
  ContainerSizeToken,
} from "./token/lib/brand";

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
  maxWidth?: ContainerSizeToken | (string & {});
  className?: string;
  gap?: SpaceToken;
  style?: React.CSSProperties;
}

export function ProseDocument({
  children,
  maxWidth = "800px",
  className = "",
  style,
  gap = Space.n16,
  ...props
}: ProseDocumentProps) {
  return (
    <Frame
      style={{
        maxWidth: typeof maxWidth === "string" && maxWidth.includes("px") ? maxWidth : undefined,
        marginLeft: "auto",
        marginRight: "auto",
        ...style,
      }}
      override={{
        w: Size.full,
        maxWidth: typeof maxWidth !== "string" || !maxWidth.includes("px") ? maxWidth : undefined,
        gap,
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
  p,
  w,
  ...props
}: Omit<React.ComponentProps<typeof Frame>, "layout" | "p" | "w"> & {
  maxWidth?: ContainerSizeToken | (string & {});
  contentGap?: SpaceToken;
  layout?: "centered" | "full";
  p?: SpaceToken;
  w?: SizeToken;
}) {
  return (
    <Frame override={{ w, p }} {...props}>
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
  gap = Space.n8,
  ...props
}: Omit<React.ComponentProps<typeof Frame>, "align" | "gap"> & {
  align?: "left" | "center" | "right";
  gap?: SpaceToken;
}) {
  const justify =
    align === "center" ? "center" : align === "right" ? "end" : "start";

  return (
    <Frame
      style={{ marginTop: "var(--space-6)" }}
      override={{ gap }}
      layout={Layout.Row.Actions.Default}
      justify={justify}
      {...props}
    >
      {children}
    </Frame>
  );
}
