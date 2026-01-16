import type React from "react";
import { Frame } from "./Frame/Frame.tsx";
import type { FrameOverrides } from "./Frame/FrameProps.ts";

import { Text } from "./text/Text.tsx";
import { FontSize, Space, Opacity, Size } from "./token/token.const.1tier.ts";
import { Radius2 } from "./token/token.const.2tier.ts";

interface FieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  w?: string | number;
  flex?: boolean | number;
  inputStyle?: React.CSSProperties;
  override?: FrameOverrides;
}

export function Field({
  label,
  icon,
  rightIcon,
  w = "100%",
  flex,
  className = "",
  style,
  inputStyle,
  value,
  onChange,
  override,
  ...props
}: FieldProps) {
  const effW = flex ? undefined : w;

  return (
    <Frame
      as="label"
      interactive="text"
      surface="sunken"
      style={{
        width: effW,
        ...style,
      }}
      override={{
        gap: Space.n6,
        py: Space.n6,
        pl: Space.n8,
        pr: rightIcon ? Space.n6 : Space.n8,
        row: true, // Ensure row layout
        align: "center",
        ...((flex ? { flex } : {}) as any),
        ...override
      }}
      rounded={Radius2.md}
      className={className}
    >
      {icon && (
        <Frame
          override={{
            // Ensure icon doesn't shrink
            w: Size.n16, h: Size.n16,
            align: "center", justify: "center"
          }}
          style={{ color: "var(--text-subtle)" }}
        >
          {icon}
        </Frame>
      )}
      {label && (
        <Text
          size={FontSize.n9}
          weight="bold"
          style={{
            marginRight: "var(--space-0-5)",
            whiteSpace: "nowrap",
            textAlign: "center",
            color: "var(--text-subtle)"
          }}
        >
          {label}
        </Text>
      )}
      <input
        {...props}
        value={value}
        onChange={onChange}
        style={{
          border: "none",
          background: "transparent",
          outline: "none",
          padding: 0,
          minWidth: 0,
          flex: 1,
          color: "var(--text-primary)",
          fontSize: "var(--font-size-n14)", // Default Input Size
          height: "100%",
          ...inputStyle,
        }}
      />
      {rightIcon && (
        <Frame
          override={{
            opacity: Opacity.n40
          }}
        >
          {rightIcon}
        </Frame>
      )}
    </Frame>
  );
}
