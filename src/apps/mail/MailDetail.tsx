import { useAtomValue } from "jotai";
import {
  Archive,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Forward,
  MoreVertical,
  Paperclip,
  Reply,
  ReplyAll,
  Star,
  Trash2,
  Inbox
} from "lucide-react";

import { Icon } from "@/design-system/Icon";
import { Text } from "@/design-system/text/Text.tsx";
import {
  FontSize,
  IconSize,
} from "@/design-system/token/token.const.1tier";
import { selectedThreadAtom } from "./store";
import * as styles from "./Mail.css";

export function MailDetail() {
  const selectedThread = useAtomValue(selectedThreadAtom);

  if (!selectedThread) {
    return (
      <div className={styles.mailDetail} style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <Icon
            src={Inbox}
            size={IconSize.n64}
            style={{ color: "var(--text-tertiary)" }}
          />
          <Text.Card.Title style={{ color: "var(--text-secondary)" }}>
            No mail selected
          </Text.Card.Title>
          <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
            Select a mail to view
          </Text.Card.Note>
        </div>
      </div>
    );
  }

  const mail = selectedThread.mails[0];

  return (
    <div className={styles.mailDetail}>
      {/* Toolbar */}
      <div className={styles.detailToolbar}>
        <button className={styles.iconButton}>
          <Icon src={ArrowLeft} size={IconSize.n20} />
        </button>
        <button className={styles.iconButton}>
          <Icon src={Archive} size={IconSize.n20} />
        </button>
        <button className={styles.iconButton}>
          <Icon src={Trash2} size={IconSize.n20} />
        </button>
        <button className={styles.iconButton}>
          <Icon src={MoreVertical} size={IconSize.n20} />
        </button>

        <div style={{ flex: 1 }} />

        <button className={styles.iconButton}>
          <Icon src={ChevronLeft} size={IconSize.n20} />
        </button>
        <button className={styles.iconButton}>
          <Icon src={ChevronRight} size={IconSize.n20} />
        </button>
      </div>

      {/* Mail Content */}
      <div className={styles.detailContent}>
        {/* Subject */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Text.Card.Title
              size={FontSize.n20}
              weight="bold"
              style={{ flex: 1, color: "var(--text-primary)" }}
            >
              {selectedThread.subject}
            </Text.Card.Title>
            <Icon
              src={Star}
              size={IconSize.n20}
              style={{
                color: selectedThread.isStarred
                  ? "#f59e0b"
                  : "var(--text-tertiary)",
                fill: selectedThread.isStarred ? "#f59e0b" : "none",
                cursor: "pointer",
              }}
            />
          </div>

          {/* Labels */}
          {selectedThread.labels.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {selectedThread.labels.map((label) => (
                <div
                  key={label}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(0,0,0,0.05)",
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <Text.Card.Note size={FontSize.n11}>{label}</Text.Card.Note>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sender Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "9999px",
              backgroundColor: "rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text.Card.Title
              weight="bold"
              size={FontSize.n16}
              style={{ color: "var(--text-primary)" }}
            >
              {mail.from.name[0]}
            </Text.Card.Title>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Text.Card.Title
                weight="bold"
                size={FontSize.n14}
                style={{ flex: 1 }}
              >
                {mail.from.name}
              </Text.Card.Title>
              <Text.Card.Note
                size={FontSize.n12}
                style={{ color: "var(--text-tertiary)" }}
              >
                {mail.date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text.Card.Note>
            </div>
            <Text.Card.Note
              size={FontSize.n12}
              style={{ color: "var(--text-secondary)" }}
            >
              {mail.from.email}
            </Text.Card.Note>
          </div>
        </div>

        {/* Mail Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Text.Field.Value
            size={FontSize.n14}
            style={{
              color: "var(--text-primary)",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {mail.body}
          </Text.Field.Value>
        </div>

        {/* Attachments */}
        {mail.hasAttachments && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
              {mail.attachmentCount} Attachment
              {mail.attachmentCount !== 1 ? "s" : ""}
            </Text.Card.Note>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                gap: "12px",
                borderRadius: "12px",
                backgroundColor: "rgba(0,0,0,0.02)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <Icon src={Paperclip} size={IconSize.n16} />
              <Text.Card.Note size={FontSize.n13}>
                design-system-review.pdf
              </Text.Card.Note>
              <div style={{ flex: 1 }} />
              <Text.Card.Note
                size={FontSize.n11}
                style={{ color: "var(--text-tertiary)" }}
              >
                2.4 MB
              </Text.Card.Note>
            </div>
          </div>
        )}

        {/* Reply Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
          <button className={styles.iconButton} style={{ width: "auto", padding: "0 12px", gap: "8px", border: "1px solid rgba(0,0,0,0.1)" }}>
            <Icon src={Reply} size={IconSize.n16} />
            <Text.Menu.Item weight="medium">Reply</Text.Menu.Item>
          </button>
          <button className={styles.iconButton} style={{ width: "auto", padding: "0 12px", gap: "8px", border: "1px solid rgba(0,0,0,0.1)" }}>
            <Icon src={ReplyAll} size={IconSize.n16} />
            <Text.Menu.Item weight="medium">Reply All</Text.Menu.Item>
          </button>
          <button className={styles.iconButton} style={{ width: "auto", padding: "0 12px", gap: "8px", border: "1px solid rgba(0,0,0,0.1)" }}>
            <Icon src={Forward} size={IconSize.n16} />
            <Text.Menu.Item weight="medium">Forward</Text.Menu.Item>
          </button>
        </div>
      </div>
    </div>
  );
}
