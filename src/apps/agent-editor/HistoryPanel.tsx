/**
 * History Panel
 * Tests: selected prop, auto-ghost surface, useNavigation
 */

import { Clock, FileCode } from "lucide-react";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { useNavigation } from "../../design-system/hooks/useNavigation.ts";
import { Icon } from "../../design-system/Icon.tsx";
import { Text } from "../../design-system/text/Text.tsx";
import {
  FontSize,
  IconSize,
  Opacity,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier.ts";
import { Radius2 } from "../../design-system/token/token.const.2tier.ts";
import type { HistoryItem } from "../AgentEditorApp.tsx";

interface HistoryPanelProps {
  items: HistoryItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function formatTimestamp(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

function getStatusColor(status: HistoryItem["status"]): string {
  switch (status) {
    case "completed":
      return "var(--text-subtle)";
    case "active":
      return "var(--primary-bg)";
    case "pending":
      return "var(--text-muted)";
  }
}

function HistoryItemCard({
  item,
  isActive,
  onClick,
}: {
  item: HistoryItem;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Frame
      interactive
      selected={isActive}
      onClick={onClick}
      override={{
        px: Space.n12,
        py: Space.n12,
        gap: Space.n8,
        borderBottom: true,
      }}
    >
      {/* Status + Title */}
      <Frame override={{ row: true, gap: Space.n8, align: "center" }}>
        {/* Status Indicator */}
        <Frame
          override={{
            w: Size.n8,
            h: Size.n8,
          }}
          rounded={Radius2.full}
          style={{
            backgroundColor: getStatusColor(item.status),
          }}
        />
        <Frame override={{ flex: 1 }}>
          <Text
            size={FontSize.n13}
            weight="medium"
            style={{ lineHeight: "1.4" }}
          >
            {item.title}
          </Text>
        </Frame>
      </Frame>

      {/* Meta Info */}
      <Frame override={{ row: true, gap: Space.n12, align: "center" }}>
        {/* Time */}
        <Frame
          override={{
            row: true,
            gap: Space.n4,
            align: "center",
            opacity: Opacity.n60,
          }}
        >
          <Icon src={Clock} size={IconSize.n10} />
          <Text size={FontSize.n11}>{formatTimestamp(item.timestamp)}</Text>
        </Frame>

        {/* Files Changed */}
        <Frame
          override={{
            row: true,
            gap: Space.n4,
            align: "center",
            opacity: Opacity.n60,
          }}
        >
          <Icon src={FileCode} size={IconSize.n10} />
          <Text size={FontSize.n11}>
            {item.filesChanged} {item.filesChanged === 1 ? "file" : "files"}
          </Text>
        </Frame>
      </Frame>
    </Frame>
  );
}

export function HistoryPanel({
  items,
  selectedId,
  onSelect,
}: HistoryPanelProps) {
  // Keyboard navigation
  const { selectedIndex } = useNavigation({
    items,
    onSelect: (item) => onSelect(item.id),
    enabled: true,
  });

  return (
    <Frame
      layout={Layout.Col.Stretch.Start}
      spacing={Space.n0}
      override={{ h: Size.fill }}
    >
      {/* Header */}
      <Frame
        override={{
          px: Space.n12,
          py: Space.n12,
          borderBottom: true,
        }}
      >
        <Text size={FontSize.n14} weight="medium">
          History
        </Text>
        <Text size={FontSize.n11} style={{ color: "var(--text-subtle)" }}>
          {items.length} {items.length === 1 ? "task" : "tasks"}
        </Text>
      </Frame>

      {/* List */}
      <Frame
        scroll="y"
        override={{
          flex: 1,
          minHeight: Size.n0,
        }}
      >
        {items.map((item, index) => (
          <HistoryItemCard
            key={item.id}
            item={item}
            isActive={item.id === selectedId || index === selectedIndex}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </Frame>
    </Frame>
  );
}
