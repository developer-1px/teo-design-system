import { Frame } from "./Frame/Frame.tsx";
import { Layout } from "./Frame/Layout/Layout.ts";
import type { SurfaceToken } from "./lib/types.ts";
import { Text } from "./text/Text.tsx";
import { Size, Space } from "./token/token.const.1tier";
import type { Radius2Token } from "./token/token.const.2tier";

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
  rounded?: Radius2Token;
  surface?: SurfaceToken;
  flex?: boolean | number;
}

export function Section({
  children,
  title,
  icon,
  fill,
  ...props
}: SectionProps) {
  const { w, h, flex, rounded, style, border, ...rest } = props;

  // Border Logic
  const computedBorder: React.CSSProperties = {};
  const finalBorder = border ?? true; // Default to true if undefined

  if (finalBorder === true) {
    computedBorder.border = "1px solid var(--border-color)";
  } else if (typeof finalBorder === "string") {
    const key =
      `border${finalBorder.charAt(0).toUpperCase() + finalBorder.slice(1)}` as keyof React.CSSProperties;
    // @ts-expect-error
    computedBorder[key] = "1px solid var(--border-color)";
  }

  return (
    <Frame
      style={{
        width: w,
        height: h,
        ...computedBorder,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
      override={{
        p: Space.n0,
        flex,
        r: rounded,
        clip: true,
      }}
      as="section"
      surface="base"
      {...rest}
    >
      {(title || icon) && (
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n8}
          minHeight={Size.n32}
          override={{
            p: Space.n8,
            border: true,
          }}
        >
          <Text.Card.Note
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: "bold",
            }}
          >
            {title}
          </Text.Card.Note>
        </Frame>
      )}
      <Frame
        scroll
        w={Size.fill}
        h={Size.fill}
        override={{ flex: 1 }}
        layout={Layout.Col.Left.Start}
        spacing={Space.n12}
      >
        {children}
      </Frame>
    </Frame>
  );
}
