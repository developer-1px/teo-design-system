import { useState } from "react";
import { Action } from "../../../design-system/Action";
import { Frame } from "../../../design-system/Frame/Frame.tsx";
import { Layout } from "../../../design-system/Frame/Layout/Layout.ts";
import { Text } from "../../../design-system/text/Text.tsx";
import { Size, Space } from "../../../design-system/token/token.const.1tier";
import { Radius2 } from "../../../design-system/token/token.const.2tier";
import { JsonSmartView } from "./JsonSmartView";

interface ExpandableValueProps {
  value: string;
  rawValue?: unknown;
  primary?: boolean;
  empty?: boolean;
}

export function ExpandableValue({
  value,
  rawValue,
  empty,
}: ExpandableValueProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle null/undefined
  if (empty || rawValue === null || rawValue === undefined) {
    return (
      <Text.Field.Value
        style={{ color: "var(--text-tertiary)", fontSize: "12px" }}
      >
        —
      </Text.Field.Value>
    );
  }

  // If it's an array
  if (Array.isArray(rawValue)) {
    // Check if it's a complex array (contains objects)
    const isComplex = rawValue.some(
      (item) => typeof item === "object" && item !== null,
    );

    if (isComplex) {
      return <JsonSmartView data={rawValue} />;
    }

    // Simple arrays: show tags
    const threshold = 10;
    const visibleItems = isExpanded ? rawValue : rawValue.slice(0, threshold);
    const hasMore = rawValue.length > threshold;

    return (
      <Frame
        layout={Layout.Row.Middle.Start}
        wrap="wrap"
        spacing={Space.n8}
        override={{ gap: Space.n4 }}
      >
        {visibleItems.map((item, i) => (
          <Frame
            key={i}
            override={{ px: Space.n8, py: Space.n2 }}
            surface="sunken"
            rounded={Radius2.sm}
          >
            <Text.Field.Value
              style={{ fontSize: "12px", color: "var(--text-secondary)" }}
            >
              {String(item)}
            </Text.Field.Value>
          </Frame>
        ))}
        {hasMore && (
          <Action onClick={() => setIsExpanded(!isExpanded)}>
            <Frame
              w={Size.hug}
              override={{ px: Space.n8, py: Space.n2 }}
              surface="sunken"
              rounded={Radius2.sm}
              style={{ cursor: "pointer" }}
            >
              <Text.Field.Value
                style={{ fontSize: "11px", color: "var(--primary-text)" }}
              >
                {isExpanded
                  ? "Show Less"
                  : `+${rawValue.length - threshold} more`}
              </Text.Field.Value>
            </Frame>
          </Action>
        )}
      </Frame>
    );
  }

  // Handle objects (Render as JsonSmartView)
  if (typeof rawValue === "object" && rawValue !== null) {
    return <JsonSmartView data={rawValue} />;
  }

  // Handle long strings (e.g. description)
  const isLong = value.length > 60;
  const displayValue =
    isExpanded || !isLong ? value : `${value.slice(0, 60)}...`;

  return (
    <Frame
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      override={{ gap: Space.n4 }}
    >
      <Text.Field.Value
        style={{
          color: empty ? "var(--text-tertiary)" : "var(--text-secondary)",
          fontSize: "12px",
          lineHeight: "1.5",
          wordBreak: "break-all",
        }}
      >
        {displayValue}
      </Text.Field.Value>
      {isLong && (
        <Action onClick={() => setIsExpanded(!isExpanded)}>
          <Frame
            w={Size.hug}
            override={{ px: Space.n8, py: Space.n2 }}
            surface="sunken"
            rounded={Radius2.sm}
            style={{ cursor: "pointer" }}
          >
            <Text.Field.Value
              style={{ fontSize: "11px", color: "var(--primary-text)" }}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </Text.Field.Value>
          </Frame>
        </Action>
      )}
    </Frame>
  );
}

// Keep export for compatibility but no-op or simplify if used elsewhere
export function parseValueIntoParts(value: string, _rawValue: unknown) {
  return [{ type: "text" as const, content: value }];
}
