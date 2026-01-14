import type React from "react";
import { Frame } from "./Frame/Frame.tsx";
import { Layout } from "./Frame/Layout/Layout.ts";
import { Text } from "./text/Text.tsx";
import { FontSize, Space } from "./token/token.const.1tier.ts";

interface FieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  w?: string | number;
  flex?: boolean | number;
  inputStyle?: React.CSSProperties;
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
  ...props
}: FieldProps) {

  const resolveSizingProp = (val: string | number | undefined) => {
    if (typeof val === "string" && (val.startsWith("size.") || val.startsWith("container."))) {
      return val as any;
    }
    return undefined;
  };
  const resolveSizingStyle = (val: string | number | undefined) => {
    if (typeof val === "string" && (val.startsWith("size.") || val.startsWith("container."))) {
      return undefined;
    }
    if (typeof val === "number") return `${val}px`;
    return val;
  };

  const effW = flex ? undefined : w;

  return (
    <Frame
      override={{
        gap: Space.n6,
        py: Space.n6,
        pl: Space.n8,
        pr: rightIcon ? Space.n6 : Space.n8,
        w: resolveSizingProp(effW),
        row: true, // Ensure row layout
        align: "center",
        style: {
          width: resolveSizingStyle(effW),
          cursor: "text",
          ...style,
        },
      }}
      flex={flex}
      as="label"
      className={`field-base ${className}`}
    >
      {icon && (
        <Frame
          override={{
            style: {
              display: "flex",
              flexShrink: 0,
            },
          }}
          className="field-icon"
        >
          {icon}
        </Frame>
      )}
      {label && (
        <Text
          className="field-label"
          size={FontSize.n9}
          weight="bold"
          style={{
            width: "var(--space-3-5)", // Approximately 14px if we added 3.5
            marginRight: "var(--space-0-5)",
            flexShrink: 0,
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      )}
      <input
        {...props}
        value={value}
        onChange={onChange}
        className="field-input"
        style={{
          paddingLeft: 0,
          minWidth: 0,
          flex: 1,
          cursor: "text",
          fontSize: "var(--font-size-n11)",
          ...inputStyle,
        }}
      />
      {rightIcon && (
        <Frame
          override={{
            style: {
              opacity: 0.4,
              display: "flex",
              flexShrink: 0,
            },
          }}
        >
          {rightIcon}
        </Frame>
      )}
    </Frame>
  );
}
