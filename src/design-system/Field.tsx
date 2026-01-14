import type React from "react";
import { Frame } from "./Frame";
import { Text } from "./text/Text.tsx";

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
      flex={flex}
      row
      align="center"
      gap={1.5}
      p={`1.5 ${rightIcon ? 1.5 : 2} 1.5 2`}
      w={flex ? undefined : w}
      as="label"
      className={`field-base ${className}`}
      style={{
        cursor: "text",
        ...style,
      }}
    >
      {icon && (
        <Frame
          className="field-icon"
          style={{
            display: "flex",
            flexShrink: 0,
          }}
        >
          {icon}
        </Frame>
      )}
      {label && (
        <Text
          variant={4}
          className="field-label"
          size={6}
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
          style={{
            opacity: 0.4,
            display: "flex",
            flexShrink: 0,
          }}
        >
          {rightIcon}
        </Frame>
      )}
    </Frame>
  );
}
