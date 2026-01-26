import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Frame } from "@/legacy-design-system/Frame/Frame.tsx";
import { Layout } from "@/legacy-design-system/Frame/Layout/Layout.ts";
import { Icon } from "@/ui/primitives/Icon";
import { Text } from "@/legacy-design-system/text/Text.tsx";
import {
  IconSize,
  Size,
  Space,
} from "@/legacy-design-system/token/token.const.1tier";

export interface PropertySectionProps {
  title: string;
  icon?: React.ElementType;
  defaultExpanded?: boolean;
  level?: number;
  children: React.ReactNode;
}

/**
 * Collapsible section component for grouping related properties
 * Supports nested levels with visual hierarchy (indentation, background)
 */
export function PropertySection({
  title,
  icon: IconSrc,
  defaultExpanded = false,
  level = 0,
  children,
}: PropertySectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Calculate indentation based on nesting level
  const indentSize = level * 16;

  return (
    <Frame layout={Layout.Col.Left.Start} spacing={Space.n12}>
      {/* Section Header - clickable to expand/collapse */}
      <Frame
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        override={{
          minHeight: Size.n32,
          gap: Space.n8,
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
        style={{
          paddingLeft: `${indentSize}px`,
          backgroundColor: expanded
            ? "var(--surface-raised)"
            : "var(--surface-base)",
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          if (!expanded) {
            e.currentTarget.style.backgroundColor = "var(--surface-sunken)";
          }
        }}
        onMouseLeave={(e) => {
          if (!expanded) {
            e.currentTarget.style.backgroundColor = "var(--surface-base)";
          }
        }}
      >
        {/* Chevron Icon - indicates expand/collapse state */}
        <Icon
          src={expanded ? ChevronDown : ChevronRight}
          size={IconSize.n14}
          style={{ color: "var(--text-tertiary)" }}
        />

        {/* Custom Icon (optional) */}
        {IconSrc && (
          <Icon
            src={IconSrc}
            size={IconSize.n14}
            style={{ color: "var(--text-tertiary)" }}
          />
        )}

        {/* Section Title */}
        <Text.Menu.Group
          weight="medium"
          style={{
            color: expanded ? "var(--text-secondary)" : "var(--text-tertiary)",
            fontSize: level === 0 ? "12px" : "11px",
          }}
        >
          {title.toUpperCase()}
        </Text.Menu.Group>
      </Frame>

      {/* Section Content - shown when expanded */}
      {expanded && (
        <Frame
          layout={Layout.Col.Left.Start}
          spacing={Space.n8}
          style={{
            paddingLeft: `${indentSize + 8}px`,
          }}
        >
          {children}
        </Frame>
      )}
    </Frame>
  );
}
