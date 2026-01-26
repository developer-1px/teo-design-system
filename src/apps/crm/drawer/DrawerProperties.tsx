import { ChevronDown, ChevronRight } from "lucide-react";
import { useAccordion } from "@/design-system/hooks/components/useAccordion";
// Updated Accordion path assumed correct based on move
import { Icon } from "@/ui/primitives/Icon";
import { ExpandableValue } from "./ExpandableValue.tsx";
import { groupEntries } from "./PropertyGroup.tsx";
import { vars } from "@/design-system/theme.css.ts";
import * as styles from "./DrawerProperties.css";

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.n8 }}>
      {groups.map((group, groupIndex) => {
        const groupId = `${group.title}-${groupIndex}`;
        const itemProps = getItemProps(groupId);
        const panelProps = getPanelProps(groupId);

        return (
          <div key={groupId} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header / Trigger */}
            <div
              className={styles.groupHeader}
              style={{
                backgroundColor: itemProps.expanded
                  ? vars.color.surface.raised
                  : "transparent",
              }}
              onClick={itemProps.onToggle}
            >
              <Icon
                src={itemProps.expanded ? ChevronDown : ChevronRight}
                size={14}
                style={{ color: vars.color.text.tertiary }}
              />
              <Icon
                src={group.icon}
                size={14}
                style={{ color: vars.color.text.tertiary }}
              />
              <span
                style={{
                  color: itemProps.expanded
                    ? vars.color.text.primary
                    : vars.color.text.tertiary,
                  fontSize: "12px",
                  fontWeight: itemProps.expanded ? 600 : 500,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase"
                }}
              >
                {group.title}
              </span>
            </div>

            {/* Content Panel */}
            {itemProps.expanded && (
              <div
                className={styles.groupPanel}
                {...panelProps}
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
              </div>
            )}
          </div>
        );
      })}
    </div>
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
    <div className={styles.propertyRow}>
      {/* Key (Fixed Width) */}
      <div style={{ width: 128, flexShrink: 0 }}>
        <span
          style={{
            color: vars.color.text.tertiary,
            fontSize: "12px",
            lineHeight: "1.5",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      </div>
      {/* Value (Fill Width) */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <ExpandableValue value={value} rawValue={rawValue} empty={empty} />
      </div>
    </div>
  );
}
