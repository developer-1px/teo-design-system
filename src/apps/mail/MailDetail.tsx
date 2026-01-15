import {
  Archive,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Paperclip,
  Reply,
  ReplyAll,
  Forward,
  Trash2,
  Star,
} from "lucide-react";
import { useAtomValue } from "jotai";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text.tsx";
import { FontSize, IconSize, Size, Space } from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
import { selectedThreadAtom } from "./store";

export function MailDetail() {
  const selectedThread = useAtomValue(selectedThreadAtom);

  if (!selectedThread) {
    return (
      <Frame fill pack layout={Layout.Center.Default}>
        <Frame override={{ gap: Space.n8 }} align="center">
          <Icon src={Inbox} size={IconSize.n64} style={{ color: "var(--text-tertiary)" }} />
          <Text.Card.Title style={{ color: "var(--text-secondary)" }}>No mail selected</Text.Card.Title>
          <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
            Select a mail to view
          </Text.Card.Note>
        </Frame>
      </Frame>
    );
  }

  const mail = selectedThread.mails[0];

  return (
    <Frame fill override={{ p: Space.n0 }}>
      {/* Toolbar */}
      <Frame
        override={{ h: Size.n48, py: Space.n0, px: Space.n16, gap: Space.n8, borderBottom: true }}
        layout={Layout.Row.Toolbar.Default}
      >
        <Action variant="ghost" icon={ArrowLeft} />
        <Action variant="ghost" icon={Archive} />
        <Action variant="ghost" icon={Trash2} />
        <Action variant="ghost" icon={MoreVertical} />
        <Frame flex />
        <Action variant="ghost" icon={ChevronLeft} />
        <Action variant="ghost" icon={ChevronRight} />
      </Frame>

      {/* Mail Content */}
      <Frame fill scroll override={{ p: Space.n24, gap: Space.n24 }} layout={Layout.Stack.Content.Default}>
        {/* Subject */}
        <Frame override={{ gap: Space.n12 }}>
          <Frame layout={Layout.Row.Item.Default} align="center">
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
                color: selectedThread.isStarred ? "#f59e0b" : "var(--text-tertiary)",
                fill: selectedThread.isStarred ? "#f59e0b" : "none",
                cursor: "pointer",
              }}
            />
          </Frame>

          {/* Labels */}
          {selectedThread.labels.length > 0 && (
            <Frame layout={Layout.Wrap.Chips.Default}>
              {selectedThread.labels.map((label) => (
                <Frame
                  key={label}
                  override={{ py: Space.n4, px: Space.n8}} rounded={Radius2.sm}
                  surface="raised"
                >
                  <Text.Card.Note size={FontSize.n11}>{label}</Text.Card.Note>
                </Frame>
              ))}
            </Frame>
          )}
        </Frame>

        {/* Sender Info */}
        <Frame override={{ gap: Space.n12 }} layout={Layout.Row.Item.Default} align="start">
          <Frame
            override={{ w: Size.n40, h: Size.n40}} rounded={Radius2.full}
            surface="raised"
            pack
          >
            <Text.Card.Title weight="bold" size={FontSize.n16} style={{ color: "var(--text-primary)" }}>
              {mail.from.name[0]}
            </Text.Card.Title>
          </Frame>

          <Frame override={{ gap: Space.n4 }} flex>
            <Frame layout={Layout.Row.Item.Default} align="center">
              <Text.Card.Title weight="bold" size={FontSize.n14} style={{ flex: 1 }}>
                {mail.from.name}
              </Text.Card.Title>
              <Text.Card.Note size={FontSize.n12} style={{ color: "var(--text-tertiary)" }}>
                {mail.date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text.Card.Note>
            </Frame>
            <Text.Card.Note size={FontSize.n12} style={{ color: "var(--text-secondary)" }}>
              {mail.from.email}
            </Text.Card.Note>
            <Text.Card.Note size={FontSize.n12} style={{ color: "var(--text-tertiary)" }}>
              to {mail.to.join(", ")}
            </Text.Card.Note>
          </Frame>
        </Frame>

        {/* Mail Body */}
        <Frame override={{ gap: Space.n16 }}>
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
        </Frame>

        {/* Attachments */}
        {mail.hasAttachments && (
          <Frame override={{ gap: Space.n8 }}>
            <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
              {mail.attachmentCount} Attachment{mail.attachmentCount !== 1 ? "s" : ""}
            </Text.Card.Note>
            <Frame
              override={{py: Space.n12, px: Space.n12, gap: Space.n12}} rounded={Radius2.md}
              surface="raised"
              layout={Layout.Row.Item.Default}
              align="center"
            >
              <Icon src={Paperclip} size={IconSize.n16} />
              <Text.Card.Note size={FontSize.n13}>design-system-review.pdf</Text.Card.Note>
              <Frame flex />
              <Text.Card.Note size={FontSize.n11} style={{ color: "var(--text-tertiary)" }}>
                2.4 MB
              </Text.Card.Note>
            </Frame>
          </Frame>
        )}

        {/* Reply Actions */}
        <Frame override={{ gap: Space.n8 }} layout={Layout.Row.Actions.Default}>
          <Action variant="surface" border icon={Reply} label="Reply" />
          <Action variant="surface" border icon={ReplyAll} label="Reply All" />
          <Action variant="surface" border icon={Forward} label="Forward" />
        </Frame>
      </Frame>
    </Frame>
  );
}

// Helper Inbox icon
function Inbox({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
