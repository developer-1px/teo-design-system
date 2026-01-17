/**
 * Chat Panel
 * Tests: Layout system, Surface system, Text variants
 */

import { Bot, Send, User } from "lucide-react";
import { useState } from "react";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon.tsx";
import { Text } from "../../design-system/text/Text.tsx";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier.ts";
import { Radius2 } from "../../design-system/token/token.const.2tier.ts";
import type { ChatMessage } from "../AgentEditorApp.tsx";

interface ChatPanelProps {
  messages: ChatMessage[];
}

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <Frame
      override={{
        px: Space.n16,
        py: Space.n12,
        gap: Space.n12,
        row: true,
        align: "start",
      }}
    >
      {/* Avatar */}
      <Frame
        override={{
          w: Size.n32,
          h: Size.n32,
          align: "center",
          justify: "center",
        }}
        surface={isUser ? "primary" : "raised"}
        rounded={Radius2.full}
      >
        <Icon
          src={isUser ? User : Bot}
          size={IconSize.n16}
          style={{ color: isUser ? "var(--primary-fg)" : "var(--text-body)" }}
        />
      </Frame>

      {/* Message Content */}
      <Frame override={{ flex: 1, gap: Space.n6 }}>
        {/* Header */}
        <Frame override={{ row: true, gap: Space.n8, align: "baseline" }}>
          <Text size={FontSize.n13} weight="medium">
            {isUser ? "You" : "Agent"}
          </Text>
          <Text size={FontSize.n11} style={{ color: "var(--text-subtle)" }}>
            {formatMessageTime(message.timestamp)}
          </Text>
        </Frame>

        {/* Content */}
        <Text size={FontSize.n14} style={{ lineHeight: "1.6" }}>
          {message.content}
        </Text>
      </Frame>
    </Frame>
  );
}

function ChatInput() {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      console.log("Send message:", input);
      setInput("");
    }
  };

  return (
    <Frame
      override={{
        p: Space.n16,
        borderTop: true,
      }}
    >
      <form onSubmit={handleSubmit} style={{ display: "contents" }}>
        <Frame
          override={{
            row: true,
            gap: Space.n8,
            align: "end",
          }}
        >
          {/* Input Field */}
          <Frame
            surface="sunken"
            interactive
            override={{
              flex: 1,
              px: Space.n12,
              py: Space.n10,
              row: true,
              align: "center",
              gap: Space.n8,
              border: true,
            }}
            rounded={Radius2.lg}
            style={{ cursor: "text" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the agent to modify code..."
              style={{
                all: "unset",
                flex: 1,
                fontFamily: "var(--font-primary)",
                fontSize: "var(--font-size-n14)",
                color: "var(--text-primary)",
              }}
            />
          </Frame>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim()}
            style={{ all: "unset" }}
          >
            <Frame
              interactive
              surface="primary"
              override={{
                w: Size.n40,
                h: Size.n40,
                align: "center",
                justify: "center",
              }}
              rounded={Radius2.lg}
            >
              <Icon
                src={Send}
                size={IconSize.n16}
                style={{ color: "var(--primary-fg)" }}
              />
            </Frame>
          </button>
        </Frame>
      </form>
    </Frame>
  );
}

export function ChatPanel({ messages }: ChatPanelProps) {
  return (
    <Frame
      layout={Layout.Col.Stretch.Start}
      spacing={Space.n0}
      override={{ h: Size.fill }}
    >
      {/* Header */}
      <Frame
        override={{
          px: Space.n16,
          py: Space.n12,
          borderBottom: true,
        }}
      >
        <Text size={FontSize.n14} weight="medium">
          Conversation
        </Text>
        <Text size={FontSize.n11} style={{ color: "var(--text-subtle)" }}>
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </Text>
      </Frame>

      {/* Messages */}
      <Frame
        scroll="y"
        override={{
          flex: 1,
          minHeight: Size.n0,
        }}
      >
        <Frame override={{ gap: Space.n4 }}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </Frame>
      </Frame>

      {/* Input */}
      <ChatInput />
    </Frame>
  );
}
