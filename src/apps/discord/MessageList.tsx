/**
 * Discord MessageList Component
 * Displays scrollable list of messages
 */

import { useAtomValue } from "jotai";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Text } from "../../design-system/text/Text.tsx";
import { FontSize, Size, Space } from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
import { getChannelMessages } from "./mockData";
import { selectedChannelIdAtom } from "./store";
import type { Message } from "./types";

function MessageItem({ message }: { message: Message }) {
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getStatusColor = (status: Message["author"]["status"]) => {
    switch (status) {
      case "online":
        return "#43b581";
      case "idle":
        return "#faa61a";
      case "dnd":
        return "#f04747";
      case "offline":
        return "#747f8d";
    }
  };

  return (
    <Frame
      layout={Layout.Row.Item.Default}
      override={{
        px: Space.n16,
        py: Space.n8,
        align: "start",
      }}
      style={{
        position: "relative",
      }}
    >
      {/* Avatar */}
      <Frame
        override={{
          w: Size.n40,
          h: Size.n40,
          align: "center",
          justify: "center",
          position: "relative",
        }}
        surface="raised"
        rounded={Radius2.full}
      >
        <Text size={FontSize.n20}>{message.author.avatar}</Text>
        {/* Status Indicator */}
        <Frame
          override={{
            w: Size.n12,
            h: Size.n12,
          }}
          rounded={Radius2.full}
          style={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            backgroundColor: getStatusColor(message.author.status),
            border: "2px solid var(--surface-base)",
          }}
        />
      </Frame>

      {/* Message Content */}
      <Frame flex layout={Layout.Stack.Content.None}>
        {/* Header */}
        <Frame layout={Layout.Row.Item.Compact} override={{ align: "baseline" }}>
          <Text size={FontSize.n14} weight="bold">
            {message.author.name}
          </Text>
          <Text size={FontSize.n10} style={{ color: "var(--text-muted)" }}>
            {formatTime(message.timestamp)}
          </Text>
        </Frame>

        {/* Message Text */}
        <Text size={FontSize.n14} style={{ lineHeight: "1.5" }}>
          {message.content}
        </Text>
      </Frame>
    </Frame>
  );
}

export function MessageList() {
  const selectedChannelId = useAtomValue(selectedChannelIdAtom);

  if (!selectedChannelId) {
    return (
      <Frame
        flex
        override={{
          align: "center",
          justify: "center",
          p: Space.n16,
        }}
      >
        <Text size={FontSize.n14} style={{ color: "var(--text-subtle)" }}>
          Select a channel to view messages
        </Text>
      </Frame>
    );
  }

  const messages = getChannelMessages(selectedChannelId);

  if (messages.length === 0) {
    return (
      <Frame
        flex
        override={{
          align: "center",
          justify: "center",
          p: Space.n16,
        }}
      >
        <Text size={FontSize.n14} style={{ color: "var(--text-subtle)" }}>
          No messages yet. Start the conversation!
        </Text>
      </Frame>
    );
  }

  return (
    <Frame
      flex
      layout={Layout.Stack.Content.Scroll}
      override={{ py: Space.n16 }}
    >
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </Frame>
  );
}
