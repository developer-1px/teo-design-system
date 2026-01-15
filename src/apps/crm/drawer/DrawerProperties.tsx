import { Frame } from "../../../design-system/Frame/Frame.tsx";
import { Layout } from "../../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../../design-system/Icon";
import { Text } from "../../../design-system/text/Text.tsx";
import { IconSize, Size, Space } from "../../../design-system/token/token.const.1tier";

export function DrawerProperties({
  entries,
  getFieldIcon,
  formatColumnLabel,
  formatValue,
}: {
  entries: [string, unknown][];
  getFieldIcon: (key: string) => React.ElementType;
  formatColumnLabel: (key: string) => string;
  formatValue: (value: unknown) => string;
}) {
  return (
    <Frame layout={Layout.Stack.Content.Default}>
      <Text.Menu.Group style={{ color: "var(--text-tertiary)" }}>
        PROPERTIES
      </Text.Menu.Group>
      <Frame layout={Layout.Stack.List.Default}>
        {entries.map(([key, value]) => (
          <PropertyRow
            key={key}
            icon={getFieldIcon(key)}
            label={formatColumnLabel(key)}
            value={formatValue(value)}
            primary={key === "name" || key === "title" || key === "value"}
            empty={value === null || value === undefined || value === ""}
            isColor={typeof value === "string" && value.startsWith("#")}
            colorValue={
              typeof value === "string" && value.startsWith("#") ? value : undefined
            }
          />
        ))}
      </Frame>
    </Frame>
  );
}

function PropertyRow({
  icon: IconSrc,
  label,
  value,
  primary,
  empty,
  isColor,
  colorValue,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  primary?: boolean;
  empty?: boolean;
  isColor?: boolean;
  colorValue?: string;
}) {
  return (
    <Frame
      override={{ minHeight: Size.n32, gap: Space.n16 }}
      layout={Layout.Row.Item.Default}
      align="center"
    >
      <Frame
        override={{ gap: Space.n8, w: Size.n128 }}
        layout={Layout.Row.Meta.Default}
        align="center"
      >
        <Icon
          src={IconSrc}
          size={IconSize.n14}
          style={{ color: "var(--text-tertiary)" }}
        />
        <Text.Field.Label style={{ color: "var(--text-tertiary)" }}>
          {label}
        </Text.Field.Label>
      </Frame>
      <Frame
        override={{ gap: Space.n8 }}
        layout={Layout.Row.Item.Default}
        align="center"
      >
        {isColor && colorValue && (
          <Frame
            override={{w: Size.n16,
              h: Size.n16}} rounded="sm"
            style={{
              backgroundColor: colorValue,
              border: "1px solid var(--border-color)",
            }}
          />
        )}
        <Text.Field.Value
          weight={primary ? "bold" : "regular"}
          style={{
            color: empty
              ? "var(--text-tertiary)"
              : primary
                ? "var(--text-primary)"
                : "var(--text-secondary)",
          }}
        >
          {value}
        </Text.Field.Value>
      </Frame>
    </Frame>
  );
}
