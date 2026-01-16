import {ChevronDown, ChevronRight} from "lucide-react"
import {useState} from "react"
import {Frame} from "../../../design-system/Frame/Frame.tsx"
import {Layout} from "../../../design-system/Frame/Layout/Layout.ts"
import {Icon} from "../../../design-system/Icon"
import {Text} from "../../../design-system/text/Text.tsx"
import {IconSize, Size, Space,} from "../../../design-system/token/token.const.1tier"

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
    <Frame layout={Layout.Stack.Content.Default}>
      {/* Section Header - clickable to expand/collapse */}
      <Frame
        layout={Layout.Row.Item.Default}
        override={{
          minHeight: Size.n32,
          gap: Space.n8,
          align: "center",
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
          layout={Layout.Stack.List.Default}
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
