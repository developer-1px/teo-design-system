import type React from "react";
import { Frame } from "./Frame/Frame";
import { Text } from "./text/Text";
import type { WidthToken } from "./token";
import { FontSize, Space } from "./token/token.const.1tier";
import { Radius2 } from "./token/token.const.2tier";

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  w?: WidthToken;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  w,
}: SegmentedControlProps<T>) {
  // We need to track the position of the selected item to animate the indicator
  // Simpler version: Just grid/flex with equal width items and transform logic based on index.
  const selectedIndex = options.findIndex((o) => o.value === value);
  const safeIndex = selectedIndex >= 0 ? selectedIndex : 0;

  return (
    <Frame
      surface="sunken"
      override={{
        r: Radius2.md, // Match Field radius
        p: Space.n4,
        row: true,
        w: w,
        clip: true, // Contain indicator
      }}
      style={
        {
          width: w ? undefined : "fit-content",
          position: "relative",
        } as React.CSSProperties
      }
    >
      {/* Sliding Indicator */}
      <Frame
        surface="raised"
        override={{
          r: Radius2.sm, // Inner radius slightly smaller
          elevation: "n1",
        }}
        style={
          {
            position: "absolute",
            top: "4px", // Space.n4
            bottom: "4px",
            // Use flexible width calculation based on assumption of equal distribution
            width: `calc((100% - 8px) / ${options.length})`,
            transform: `translateX(calc(100% * ${safeIndex}))`,
            left: "4px",
            transition: "transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)",
          } as any
        }
      />

      {/* Options Layer (Above indicator) */}
      <Frame
        override={{
          row: true,
          w: "100%" as any, // Force full width
          justify: "between",
        }}
        style={
          {
            position: "relative", // Ensure zIndex works
            zIndex: 1, // Cast needed if restricted or acceptable as CSSProperties
          } as React.CSSProperties
        }
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <Frame
              key={option.value}
              onClick={() => onChange(option.value)}
              interactive={!isSelected ? "button" : undefined}
              override={{
                flex: 1,
                align: "center",
                justify: "center",
                py: Space.n4,
                cursor: "pointer",
              }}
              style={
                {
                  textAlign: "center",
                  color: isSelected
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                  transition: "color 0.2s ease",
                  zIndex: 2,
                } as React.CSSProperties
              }
            >
              {typeof option.label === "string" ? (
                <Text
                  size={FontSize.n11} // Match Field font size
                  weight={isSelected ? "bold" : "medium"}
                  color="inherit" // Inherit from Frame style
                >
                  {option.label}
                </Text>
              ) : (
                option.label
              )}
            </Frame>
          );
        })}
      </Frame>
    </Frame>
  );
}
