import { useAtom, useAtomValue } from "jotai";
import { Paperclip, Star } from "lucide-react";
import { Icon } from "@/ui/primitives/Icon";
import { Text } from "@/legacy-design-system/text/Text.tsx";
import {
  FontSize,
  IconSize,
} from "@/legacy-design-system/token/token.const.1tier";
import { filteredThreadsAtom, selectedThreadIdAtom } from "./store";
import * as styles from "./Mail.css";

export function MailList() {
  const threads = useAtomValue(filteredThreadsAtom);
  const [selectedThreadId, setSelectedThreadId] = useAtom(selectedThreadIdAtom);

  if (threads.length === 0) {
    return (
      <div className={styles.mailList} style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <Text.Card.Title style={{ color: "var(--text-secondary)" }}>
            No mail
          </Text.Card.Title>
          <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
            Your mailbox is empty
          </Text.Card.Note>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mailList}>
      {threads.map((thread) => {
        const isSelected = selectedThreadId === thread.id;
        const firstMail = thread.mails[0];

        return (
          <div
            key={thread.id}
            className={styles.mailItem({ selected: isSelected, read: thread.isRead })}
            onClick={() => setSelectedThreadId(thread.id)}
          >
            {/* Header Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "24px" }}>
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
            </div>

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
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
            </div>

            {/* Labels */}
            {thread.labels.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {thread.labels.map((label) => (
                  <div
                    key={label}
                    style={{
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(0,0,0,0.05)",
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Text.Card.Note
                      size={FontSize.n10}
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {label}
                    </Text.Card.Note>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
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
