import type React from "react";
import { Frame } from "./Frame";
import { Text } from "./text/Text.tsx";
import { FontSize } from "./token/token.const.1tier.ts";

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
  return (
    <Frame
      override={{
        gap: 1.5,
        p: `1.5 ${rightIcon ? 1.5 : 2} 1.5 2`,
        w: flex ? undefined : w,
        style: {
          cursor: "text",
          ...style,
        },
      }}
      flex={flex}
      row
      align="center"
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
