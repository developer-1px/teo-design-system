import { ChevronDown, ChevronRight } from "lucide-react";
import { Frame } from "../../../design-system/Frame/Frame.tsx";
import { Layout } from "../../../design-system/Frame/Layout/Layout.ts";
import { useAccordion } from "../../../design-system/hooks";
import { Icon } from "../../../design-system/Icon";
import { Text } from "../../../design-system/text/Text.tsx";
import {
  IconSize,
  Size,
  Space,
} from "../../../design-system/token/token.const.1tier";
import { ExpandableValue } from "./ExpandableValue.tsx";
import { groupEntries } from "./PropertyGroup.tsx";

export function DrawerProperties({
  entries,
  formatColumnLabel,
  formatValue,
}: {
  entries: [string, unknown][];
  formatColumnLabel: (key: string) => string;
  formatValue: (value: unknown) => string;
}) {
  const groups = groupEntries(entries);
  const groupIds = groups.map((g, i) => `${g.title}-${i}`);
  const defaultExpanded = groups
    .filter((g) => g.isPrimary)
    .map((g, i) => `${g.title}-${i}`);

  const { getItemProps, getPanelProps } = useAccordion({
    items: groupIds,
    defaultExpanded,
    allowMultiple: true,
  });

  return (
    <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
      {groups.map((group, groupIndex) => {
        const groupId = `${group.title}-${groupIndex}`;
        const itemProps = getItemProps(groupId);
        const panelProps = getPanelProps(groupId);

        return (
          <Frame
            key={groupId}
            layout={Layout.Col.Left.Start}
            spacing={Space.n0}
          >
            {/* Header / Trigger */}
            <Frame
              {...itemProps}
              layout={Layout.Row.Middle.Center}
              spacing={Space.n12}
              override={{
                minHeight: Size.n40,
                h: Size.n32,
                gap: Space.n8,
                cursor: "pointer",
                px: Space.n8,
              }}
              style={{
                backgroundColor: itemProps.expanded
                  ? "var(--surface-raised)"
                  : "transparent",
                transition: "all 0.15s ease",
              }}
              onClick={itemProps.onToggle}
            >
              <Icon
                src={itemProps.expanded ? ChevronDown : ChevronRight}
                size={IconSize.n14}
                style={{ color: "var(--text-tertiary)" }}
              />
              <Icon
                src={group.icon}
                size={IconSize.n14}
                style={{ color: "var(--text-tertiary)" }}
              />
              <Text.Menu.Group
                style={{
                  color: itemProps.expanded
                    ? "var(--text-primary)"
                    : "var(--text-tertiary)",
                  fontSize: "12px",
                  fontWeight: itemProps.expanded ? 600 : 500,
                }}
              >
                {group.title.toUpperCase()}
              </Text.Menu.Group>
            </Frame>

            {/* Content Panel */}
            <Frame
              {...panelProps}
              layout={Layout.Col.Left.Start}
              spacing={Space.n8}
              h={Size.hug}
              override={{
                clip: false,
                pb: Space.n20,
                pl: Space.n24,
                gap: Space.n12,
              }}
            >
              {group.entries.map((entry) => (
                <PropertyRow
                  key={entry.key}
                  label={formatColumnLabel(entry.key)}
                  value={formatValue(entry.value)}
                  rawValue={entry.value}
                  empty={!entry.value}
                />
              ))}
            </Frame>
          </Frame>
        );
      })}
    </Frame>
  );
}

function PropertyRow({
  label,
  value,
  rawValue,
  empty,
}: {
  label: string;
  value: string;
  rawValue?: unknown;
  empty?: boolean;
}) {
  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      h={Size.hug}
      override={{ minHeight: Size.n40, align: "start", gap: Space.n16 }}
    >
      {/* Key (Fixed Width) */}
      <Frame override={{ w: Size.n128 }}>
        <Text.Field.Label
          style={{
            color: "var(--text-tertiary)",
            fontSize: "12px",
            lineHeight: "1.5",
          }}
        >
          {label}
        </Text.Field.Label>
      </Frame>
      {/* Value (Fill Width) */}
      <Frame
        layout={Layout.Col.Left.Start}
        spacing={Space.n0}
        w={Size.fill}
        h={Size.hug}
        override={{ minWidth: Size.n0 }}
      >
        <ExpandableValue value={value} rawValue={rawValue} empty={empty} />
      </Frame>
    </Frame>
  );
}
