import { useAtom, useAtomValue } from "jotai";
import {
  Building2,
  CheckSquare,
  ChevronDown,
  Database,
  FolderKanban,
  LayoutGrid,
  Users,
} from "lucide-react";

import { Action } from "@/design-system/Action";
import { Frame } from "@/design-system/Frame/Frame.tsx";
import { Layout } from "@/design-system/Frame/Layout/Layout.ts";
import { Icon } from "@/design-system/Icon";
import { ResizeHandle, useResizable } from "@/design-system/Resizable";
import { Text } from "@/design-system/text/Text.tsx";
import {
  IconSize,
  Size,
  type SizeToken,
  Space,
} from "@/design-system/token/token.const.1tier";
import { datasetsAtom, selectedDatasetAtom } from "./store";
import { Radius2 } from "@/design-system/token/radius2";

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
      rounded={Radius2.full}
      style={{ backgroundColor: color }}
      override={{ w: size, h: size, align: "center", pack: true }}
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
  label,
  icon: iconName,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onClick: () => void;
}) {
  const IconComponent = iconMap[iconName] || Database;

  return (
    <Action
      variant={active ? "surface" : "ghost"}
      rounded={Radius2.sm}
      w="100%"
      justify="start"
      onClick={onClick}
    >
      <Frame
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        override={{
          w: Size.fill,
          py: Space.n6,
          px: Space.n8,
          minHeight: Size.n40,
        }}
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

  // Resizable hook
  const { size, resizeHandleProps } = useResizable({
    direction: "left",
    defaultSize: 240,
    minSize: 200,
    maxSize: 400,
    storageKey: "crm-sidebar-width",
  });

  return (
    <Frame
      override={{
        h: Size.fill,
        p: Space.n8,
        gap: Space.n4,
        borderRight: true, // Flat separation
      }}
      style={{
        position: "relative",
      }}
      w={`${size}px` as unknown as any}
      surface="sunken"
    >
      <ResizeHandle direction="left" {...resizeHandleProps} />
      {/* Workspace Switcher - Fixed Height Header */}
      <Frame
        h={Size.n64}
        override={{
          px: Space.n8,
          borderBottom: true, // Continuous line with Main Header
          align: "center",
        }}
        surface="sunken"
      >
        <Action variant="ghost" rounded={Radius2.sm} w="100%">
          <Frame
            layout={Layout.Row.Middle.Center}
            spacing={Space.n12}
            override={{ p: Space.n4, minHeight: Size.n40 }}
          >
            <Avatar initial="D" color="black" size={Size.n20} />
            <Text.Menu.Item weight="bold">DataTable</Text.Menu.Item>
            <Frame override={{ flex: 1 }} />
            <Icon src={ChevronDown} size={IconSize.n14} opacity={0.4} />
          </Frame>
        </Action>
      </Frame>

      <Frame override={{ h: Size.n8 }} />

      {/* Datasets Section */}
      <Frame override={{ gap: Space.n2 }}>
        <SectionLabel label="Datasets" />
        {datasets.map((dataset) => (
          <DatasetItem
            key={dataset.name}
            label={dataset.label}
            icon={dataset.icon}
            active={selectedDataset === dataset.name}
            onClick={() => setSelectedDataset(dataset.name)}
          />
        ))}
      </Frame>

      <Frame override={{ flex: 1 }} />

      {/* Bottom Info */}
      <Frame layout={Layout.Col.Stretch.Start} spacing={Space.n4}>
        <Frame
          override={{ py: Space.n6, px: Space.n8 }}
          surface="sunken"
          rounded={Radius2.sm}
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
