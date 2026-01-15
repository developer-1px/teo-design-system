import {
  Building2,
  CheckSquare,
  ChevronDown,
  Database,
  FolderKanban,
  LayoutGrid,
  Users,
} from "lucide-react";
import { useAtom, useAtomValue } from "jotai";

import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text.tsx";
import {
  IconSize,
  Size,
  type SizeToken,
  Space,
} from "../../design-system/token/token.const.1tier";
import { datasetsAtom, selectedDatasetAtom } from "./store";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  LayoutGrid,
  Building2,
  Users,
  FolderKanban,
  CheckSquare,
  Database,
};

function Avatar({
  initial,
  color,
  size = Size.n20,
}: {
  initial: string;
  color: string;
  size?: SizeToken;
}) {
  return (
    <Frame
      override={{
        w: size,
        h: size,
        rounded: "full",
      }}
      style={{ backgroundColor: color }}
      pack
      align="center"
      justify="center"
    >
      <Text.Card.Note
        weight="bold"
        style={{ color: "white", fontSize: "10px" }}
      >
        {initial}
      </Text.Card.Note>
    </Frame>
  );
}

function DatasetItem({
  name,
  label,
  icon: iconName,
  active,
  onClick,
}: {
  name: string;
  label: string;
  icon: string;
  active?: boolean;
  onClick: () => void;
}) {
  const IconComponent = iconMap[iconName] || Database;

  return (
    <Action
      variant={active ? "surface" : "ghost"}
      rounded="md"
      w="100%"
      justify="start"
      onClick={onClick}
    >
      <Frame
        override={{ gap: Space.n12, w: Size.full, py: Space.n6, px: Space.n8 }}
        layout={Layout.Row.Item.Default}
        align="center"
      >
        <Icon
          src={IconComponent}
          size={IconSize.n16}
          style={{
            color: active ? "var(--text-primary)" : "var(--text-secondary)",
          }}
        />
        <Text.Menu.Item
          weight={active ? "medium" : "regular"}
          style={{
            color: active ? "var(--text-primary)" : "var(--text-secondary)",
          }}
        >
          {label}
        </Text.Menu.Item>
      </Frame>
    </Action>
  );
}

export function CRMSidebar() {
  const datasets = useAtomValue(datasetsAtom);
  const [selectedDataset, setSelectedDataset] = useAtom(selectedDatasetAtom);

  return (
    <Frame
      override={{
        w: Size.n240,
        minWidth: Size.n240,
        h: Size.full,
        p: Space.n8,
        gap: Space.n4,
      }}
      surface="sunken"
    >
      {/* Workspace Switcher */}
      <Action variant="ghost" rounded="md">
        <Frame
          override={{ gap: Space.n12, p: Space.n4 }}
          layout={Layout.Row.Item.Default}
          align="center"
        >
          <Avatar initial="D" color="black" size={Size.n20} />
          <Text.Menu.Item weight="bold">DataTable</Text.Menu.Item>
          <Frame flex />
          <Icon src={ChevronDown} size={IconSize.n14} opacity={0.4} />
        </Frame>
      </Action>

      <Frame override={{ h: Size.n8 }} />

      {/* Datasets Section */}
      <Frame override={{ gap: Space.n4 }}>
        <SectionLabel label="Datasets" />
        {datasets.map((dataset) => (
          <DatasetItem
            key={dataset.name}
            name={dataset.name}
            label={dataset.label}
            icon={dataset.icon}
            active={selectedDataset === dataset.name}
            onClick={() => setSelectedDataset(dataset.name)}
          />
        ))}
      </Frame>

      <Frame flex />

      {/* Bottom Info */}
      <Frame override={{ gap: Space.n4 }}>
        <Frame
          override={{ py: Space.n6, px: Space.n8 }}
          surface="base"
          rounded="md"
        >
          <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
            {datasets.length} datasets loaded
          </Text.Card.Note>
        </Frame>
      </Frame>
    </Frame>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Frame override={{ py: Space.n4, px: Space.n8 }}>
      <Text.Menu.Group
        style={{ letterSpacing: "0.05em", color: "var(--text-tertiary)" }}
      >
        {label.toUpperCase()}
      </Text.Menu.Group>
    </Frame>
  );
}
