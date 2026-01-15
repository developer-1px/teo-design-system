import { Paperclip, Star } from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text.tsx";
import { FontSize, IconSize, Space } from "../../design-system/token/token.const.1tier";
import { filteredThreadsAtom, selectedThreadIdAtom } from "./store";

export function MailList() {
  const threads = useAtomValue(filteredThreadsAtom);
  const [selectedThreadId, setSelectedThreadId] = useAtom(selectedThreadIdAtom);

  if (threads.length === 0) {
    return (
      <Frame fill pack layout={Layout.Center.Default}>
        <Frame override={{ gap: Space.n8 }} align="center">
          <Text.Card.Title style={{ color: "var(--text-secondary)" }}>No mail</Text.Card.Title>
          <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
            Your mailbox is empty
          </Text.Card.Note>
        </Frame>
      </Frame>
    );
  }

  return (
    <Frame fill scroll override={{ p: Space.n0 }}>
      {threads.map((thread) => {
        const isSelected = selectedThreadId === thread.id;
        const firstMail = thread.mails[0];

        return (
          <Frame
            key={thread.id}
            override={{ py: Space.n12, px: Space.n16, gap: Space.n8 }}
            style={{
              borderBottom: "1px solid var(--border-color)",
              backgroundColor: isSelected ? "var(--surface-sunken)" : undefined,
              cursor: "pointer",
            }}
            onClick={() => setSelectedThreadId(thread.id)}
          >
            {/* Header Row */}
            <Frame layout={Layout.Row.Item.Default} align="center">
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
                  color: thread.isRead ? "var(--text-secondary)" : "var(--text-primary)",
                  flex: 1,
                }}
              >
                {thread.participants.join(", ")}
              </Text.Card.Title>
              <Text.Card.Note size={FontSize.n11} style={{ color: "var(--text-tertiary)" }}>
                {formatDate(thread.lastMailDate)}
              </Text.Card.Note>
            </Frame>

            {/* Subject */}
            <Text.Card.Title
              weight={thread.isRead ? "regular" : "bold"}
              size={FontSize.n13}
              style={{
                color: thread.isRead ? "var(--text-secondary)" : "var(--text-primary)",
              }}
            >
              {thread.subject}
            </Text.Card.Title>

            {/* Snippet */}
            <Frame layout={Layout.Row.Item.Default} align="center">
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
                <Icon src={Paperclip} size={IconSize.n14} style={{ color: "var(--text-tertiary)" }} />
              )}
            </Frame>

            {/* Labels */}
            {thread.labels.length > 0 && (
              <Frame layout={Layout.Wrap.Chips.Default}>
                {thread.labels.map((label) => (
                  <Frame
                    key={label}
                    override={{ py: Space.n2, px: Space.n6, rounded: "sm" }}
                    surface="raised"
                  >
                    <Text.Card.Note size={FontSize.n10} style={{ color: "var(--text-tertiary)" }}>
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
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  if (days < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
