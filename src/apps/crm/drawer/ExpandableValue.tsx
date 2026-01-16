import { useState } from "react";
import { Action } from "../../../design-system/Action";
import { Frame } from "../../../design-system/Frame/Frame.tsx";
import { Layout } from "../../../design-system/Frame/Layout/Layout.ts";
import { Text } from "../../../design-system/text/Text.tsx";
import {
  Space,
} from "../../../design-system/token/token.const.1tier";
import { Radius2 } from "../../../design-system/token/token.const.2tier";

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
      <Text.Field.Value style={{ color: "var(--text-tertiary)", fontSize: "12px" }}>
        —
      </Text.Field.Value>
    );
  }

  // If it's an array, show tags
  if (Array.isArray(rawValue)) {
    const visibleItems = isExpanded ? rawValue : rawValue.slice(0, 3);
    const hasMore = rawValue.length > 3;

    return (
      <Frame layout={Layout.Wrap.Chips.Default} override={{ gap: Space.n4 }}>
        {visibleItems.map((item, i) => (
          <Frame
            key={i}
            override={{ px: Space.n8, py: Space.n2 }}
            surface="sunken"
            rounded={Radius2.sm}
          >
            <Text.Field.Value style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </Text.Field.Value>
          </Frame>
        ))}
        {hasMore && (
          <Action onClick={() => setIsExpanded(!isExpanded)}>
            <Text.Field.Value style={{ fontSize: "11px", color: "var(--primary-text)", cursor: "pointer" }}>
              {isExpanded ? "Show Less" : `+${rawValue.length - 3} more`}
            </Text.Field.Value>
          </Action>
        )}
      </Frame>
    );
  }

  // Handle objects (Render as a badge or stringified)
  if (typeof rawValue === 'object') {
    return (
      <Frame
        override={{ px: Space.n8, py: Space.n2 }}
        surface="sunken"
        rounded={Radius2.sm}
      >
        <Text.Field.Value style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
          {Object.keys(rawValue).length} properties
        </Text.Field.Value>
      </Frame>
    );
  }

  // Handle long strings (e.g. description)
  const isLong = value.length > 60;
  const displayValue = isExpanded || !isLong ? value : `${value.slice(0, 60)}...`;

  return (
    <Frame layout={Layout.Stack.Content.None}>
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
          <Text.Field.Value style={{ fontSize: "11px", color: "var(--primary-text)", cursor: "pointer", pt: Space.n4 }}>
            {isExpanded ? "Show Less" : "Show More"}
          </Text.Field.Value>
        </Action>
      )}
    </Frame>
  );
}

// Keep export for compatibility but no-op or simplify if used elsewhere
export function parseValueIntoParts(value: string, _rawValue: unknown) {
  return [{ type: "text" as const, content: value }];
}
