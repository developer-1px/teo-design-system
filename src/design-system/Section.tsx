import { Frame } from "./Frame/Frame.tsx";
import { Layout } from "./Frame/Layout/Layout.ts";
import type { RoundedToken, SurfaceToken } from "./lib/types.ts";
import { Text } from "./text/Text.tsx";
import { Space } from "./token/token.const.1tier";

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
  const { w, h, flex, rounded, shadow, style, border, ...rest } = props;

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
        width: resolveSizingStyle(w),
        height: resolveSizingStyle(h),
        ...computedBorder,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
      clip
      override={{
        p: Space.n0,
        w: resolveSizingProp(w),
        h: resolveSizingProp(h),
        flex,
        rounded,
        shadow,
      }}
      as="section"
      surface="base"
      fill={fill}
      {...rest}
    >
      {(title || icon) && (
        <Frame
          style={{
            borderBottom: "1px solid var(--border-color)",
            flexShrink: 0,
          }}
          override={{
            gap: Space.n8,
            p: Space.n8,
          }}
          layout={Layout.Row.Item.Tight}
          align="center"
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
      <Frame style={{ minHeight: 0 }} scroll override={{}} fill flex>
        {children}
      </Frame>
    </Frame>
  );
}
