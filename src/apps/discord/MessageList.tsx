/**
 * Discord MessageList Component
 * Displays scrollable list of messages
 */

import { useAtomValue } from "jotai";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Overlay } from "../../design-system/Overlay";
import { Text } from "../../design-system/text/Text.tsx";
import {
  FontSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
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
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      override={{ py: Space.n8, align: "start", minHeight: Size.n40 }}
    >
      {/* Avatar */}
      <Frame
        override={{
          w: Size.n40,
          h: Size.n40,
          align: "center",
          justify: "center",
        }}
        surface="raised"
        rounded={Radius2.full}
      >
        <Text size={FontSize.n20}>{message.author.avatar}</Text>
        {/* Status Indicator */}
        <Overlay position="absolute" bottom="0px" right="0px">
          <Frame
            override={{
              w: Size.n12,
              h: Size.n12,
            }}
            rounded={Radius2.full}
            style={{
              backgroundColor: getStatusColor(message.author.status),
              border: "2px solid var(--surface-base)",
            }}
          />
        </Overlay>
      </Frame>

      {/* Message Content */}
      <Frame
        override={{ flex: 1 }}
        layout={Layout.Col.Left.Start}
        spacing={Space.n0}
      >
        {/* Header */}
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n4}
          override={{ align: "baseline", minHeight: Size.n24 }}
        >
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
        override={{
          align: "center",
          justify: "center",
          p: Space.n16,
          flex: 1,
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
        override={{
          align: "center",
          justify: "center",
          p: Space.n16,
          flex: 1,
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
      layout={Layout.Col.Left.Start}
      spacing={Space.n12}
      scroll
      override={{ py: Space.n16, flex: 1 }}
    >
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </Frame>
  );
}
