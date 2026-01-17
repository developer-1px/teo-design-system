/**
 * Discord ChannelSidebar Component
 * Displays server name, channels, and user profile
 */

import { useAtom, useAtomValue } from "jotai";
import { ChevronDown, Hash, Headphones, Settings, Volume2 } from "lucide-react";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text.tsx";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
import { getServerById } from "./mockData";
import { selectedChannelIdAtom, selectedServerIdAtom } from "./store";
import type { Channel } from "./types";

function ChannelItem({
  channel,
  isSelected,
  onClick,
}: {
  channel: Channel;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n8}
      minHeight={Size.n32}
      override={{
        px: Space.n8,
        py: Space.n6,
        cursor: "pointer",
      }}
      surface={isSelected ? "selected" : undefined}
      rounded={Radius2.sm}
      onClick={onClick}
    >
      <Icon
        src={channel.type === "text" ? Hash : Volume2}
        size={IconSize.n16}
        style={{
          color: isSelected ? "var(--text-primary)" : "var(--text-subtle)",
        }}
      />
      <Text
        size={FontSize.n14}
        weight={isSelected ? "medium" : "regular"}
        style={{
          color: isSelected ? "var(--text-primary)" : "var(--text-subtle)",
        }}
      >
        {channel.name}
      </Text>
    </Frame>
  );
}

export function ChannelSidebar() {
  const selectedServerId = useAtomValue(selectedServerIdAtom);
  const [selectedChannelId, setSelectedChannelId] = useAtom(
    selectedChannelIdAtom,
  );

  const server = selectedServerId ? getServerById(selectedServerId) : null;

  if (!server) {
    return (
      <Frame
        surface="base"
        override={{
          w: Size.n240,
          borderRight: true,
          align: "center",
          justify: "center",
          p: Space.n16,
        }}
      >
        <Text size={FontSize.n14} style={{ color: "var(--text-subtle)" }}>
          Select a server
        </Text>
      </Frame>
    );
  }

  const categories = Array.from(
    new Set(server.channels.map((c) => c.category || "CHANNELS")),
  );

  return (
    <Frame
      surface="base"
      override={{
        w: Size.n240,
        borderRight: true,
        minWidth: Size.n0,
      }}
    >
      {/* Server Header */}
      <Frame
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        h={Size.n44}
        override={{
          cursor: "pointer",
          shadow: "sm",
        }}
      >
        <Text size={FontSize.n14} weight="bold">
          {server.name}
        </Text>
        <Icon src={ChevronDown} size={IconSize.n16} />
      </Frame>

      {/* Channels */}
      <Frame
        layout={Layout.Col.Left.Start}
        spacing={Space.n12}
        scroll
        override={{ px: Space.n8, py: Space.n16, flex: 1 }}
      >
        {categories.map((category) => {
          const categoryChannels = server.channels.filter(
            (c) => (c.category || "CHANNELS") === category,
          );

          return (
            <Frame key={category} layout={Layout.Col.Left.Start} spacing={Space.n4}>
              {/* Category Header */}
              <Frame
                layout={Layout.Row.Middle.Center}
                spacing={Space.n8}
                minHeight={Size.n32}
                override={{ px: Space.n8, py: Space.n4 }}
              >
                <Text
                  size={FontSize.n10}
                  weight="bold"
                  style={{
                    color: "var(--text-muted)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {category}
                </Text>
              </Frame>

              {/* Channel List */}
              {categoryChannels.map((channel) => (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  isSelected={selectedChannelId === channel.id}
                  onClick={() => setSelectedChannelId(channel.id)}
                />
              ))}
            </Frame>
          );
        })}
      </Frame>

      {/* User Profile (Bottom) */}
      <Frame
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        minHeight={Size.n40}
        surface="sunken"
        override={{
          px: Space.n8,
          py: Space.n8,
        }}
      >
        <Frame
          override={{
            w: Size.n32,
            h: Size.n32,
            align: "center",
            justify: "center",
          }}
          surface="primary"
          rounded={Radius2.full}
        >
          <Text size={FontSize.n14}>👤</Text>
        </Frame>
        <Frame override={{ flex: 1 }}>
          <Text size={FontSize.n12} weight="bold">
            User
          </Text>
          <Text
            size={FontSize.n10}
            style={{ color: "var(--text-subtle)", marginTop: "-2px" }}
          >
            online
          </Text>
        </Frame>
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n4}
          minHeight={Size.n24} override={{ px: Space.n8 }}
        >
          <Icon
            src={Headphones}
            size={IconSize.n16}
            style={{ cursor: "pointer", color: "var(--text-subtle)" }}
          />
          <Icon
            src={Settings}
            size={IconSize.n16}
            style={{ cursor: "pointer", color: "var(--text-subtle)" }}
          />
        </Frame>
      </Frame>
    </Frame>
  );
}
