import { useAtom, useAtomValue } from "jotai";
import { Paperclip, Star } from "lucide-react";
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
import { filteredThreadsAtom, selectedThreadIdAtom } from "./store";

export function MailList() {
  const threads = useAtomValue(filteredThreadsAtom);
  const [selectedThreadId, setSelectedThreadId] = useAtom(selectedThreadIdAtom);

  if (threads.length === 0) {
    return (
      <Frame
        layout={Layout.Col.Center.Start}
        spacing={Space.n0}
        override={{
          w: Size.fill,
          h: Size.fill,
        }}
      >
        <Frame layout={Layout.Row.Middle.End} spacing={Space.n8}>
          <Text.Card.Title style={{ color: "var(--text-secondary)" }}>
            No mail
          </Text.Card.Title>
          <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
            Your mailbox is empty
          </Text.Card.Note>
        </Frame>
      </Frame>
    );
  }

  return (
    <Frame
      scroll
      override={{
        p: Space.n0,
        w: Size.fill,
        h: Size.fill,
      }}
    >
      {threads.map((thread) => {
        const isSelected = selectedThreadId === thread.id;
        const firstMail = thread.mails[0];

        return (
          <Frame
            key={thread.id}
            interactive
            surface={isSelected ? "sunken" : "base"}
            override={{
              py: Space.n12,
              px: Space.n16,
              gap: Space.n8,
              borderBottom: true, // Frame override handles the structure
            }}
            style={{
              // Reserve border space when not selected (sunken creates 1px border)
              border: isSelected ? undefined : "1px solid transparent",
              borderBottomColor: "var(--border-color)", // Ensure bottom separator is visible
            }}
            onClick={() => setSelectedThreadId(thread.id)}
          >
            {/* Header Row */}
            <Frame
              layout={Layout.Row.Middle.Center}
              spacing={Space.n12}
              override={{ px: Space.n16, minHeight: Size.n40 }}
            >
              <Icon
                src={Star}
                size={IconSize.n16}
                style={{
                  color: thread.isStarred ? "#f59e0b" : "var(--text-tertiary)",
                  fill: thread.isStarred ? "#f59e0b" : "none",
                }}
              />
              <Text.Card.Title
                weight={thread.isRead ? "regular" : "bold"}
                size={FontSize.n13}
                style={{
                  color: thread.isRead
                    ? "var(--text-secondary)"
                    : "var(--text-primary)",
                  flex: 1,
                }}
              >
                {thread.participants.join(", ")}
              </Text.Card.Title>
              <Text.Card.Note
                size={FontSize.n11}
                style={{ color: "var(--text-tertiary)" }}
              >
                {formatDate(thread.lastMailDate)}
              </Text.Card.Note>
            </Frame>

            {/* Subject */}
            <Text.Card.Title
              weight={thread.isRead ? "regular" : "bold"}
              size={FontSize.n13}
              style={{
                color: thread.isRead
                  ? "var(--text-secondary)"
                  : "var(--text-primary)",
              }}
            >
              {thread.subject}
            </Text.Card.Title>

            {/* Snippet */}
            <Frame
              layout={Layout.Row.Middle.Center}
              spacing={Space.n12}
              override={{ px: Space.n16, minHeight: Size.n40 }}
            >
              <Text.Card.Note
                size={FontSize.n12}
                style={{
                  color: "var(--text-tertiary)",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {firstMail.snippet}
              </Text.Card.Note>
              {firstMail.hasAttachments && (
                <Icon
                  src={Paperclip}
                  size={IconSize.n14}
                  style={{ color: "var(--text-tertiary)" }}
                />
              )}
            </Frame>

            {/* Labels */}
            {thread.labels.length > 0 && (
              <Frame
                layout={Layout.Row.Middle.Start}
                wrap="wrap"
                spacing={Space.n8}
              >
                {thread.labels.map((label) => (
                  <Frame
                    key={label}
                    override={{ py: Space.n2, px: Space.n6 }}
                    rounded={Radius2.sm}
                    surface="raised"
                  >
                    <Text.Card.Note
                      size={FontSize.n10}
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {label}
                    </Text.Card.Note>
                  </Frame>
                ))}
              </Frame>
            )}
          </Frame>
        );
      })}
    </Frame>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (days < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
