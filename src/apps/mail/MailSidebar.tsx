import { useAtom, useAtomValue } from "jotai";
import {
  AlertOctagon,
  Archive,
  Edit,
  FileText,
  Inbox,
  Send,
  Star,
  Trash2,
} from "lucide-react";

import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text.tsx";
import {
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { folderCountsAtom, selectedFolderAtom } from "./store";
import type { MailFolder } from "./types";

const FOLDER_CONFIG: Array<{
  id: MailFolder;
  label: string;
  icon: React.ElementType;
}> = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "starred", label: "Starred", icon: Star },
  { id: "sent", label: "Sent", icon: Send },
  { id: "drafts", label: "Drafts", icon: FileText },
  { id: "archive", label: "Archive", icon: Archive },
  { id: "spam", label: "Spam", icon: AlertOctagon },
  { id: "trash", label: "Trash", icon: Trash2 },
];

export function MailSidebar() {
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderAtom);
  const folderCounts = useAtomValue(folderCountsAtom);

  return (
    <Frame
      override={{
        w: Size.n240,
        minWidth: Size.n240,
        h: Size.fill,
        p: Space.n8,
        gap: Space.n8,
      }}
      surface="sunken"
    >
      {/* Compose Button - Raised Interactive */}
      <Frame
        as="button"
        interactive
        surface="raised"
        rounded={Radius2.md}
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        override={{
          p: Space.n8,
          gap: Space.n8,
          justify: "start",
          minHeight: Size.n40,
        }}
        // Primary override style if needed for Compose, but "raised" is standard button now.
        // Assuming we want strict raised button behavior.
      >
        <Icon src={Edit} size={IconSize.n16} />
        <Text.Menu.Item weight="medium">Compose</Text.Menu.Item>
      </Frame>

      <Frame override={{ h: Size.n8 }} />

      {/* Folder List */}
      <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
        {FOLDER_CONFIG.map((folder) => {
          const isActive = selectedFolder === folder.id;
          const count = folderCounts[folder.id];

          return (
            <Frame
              key={folder.id}
              as="button"
              interactive
              surface={isActive ? "raised" : "ghost"}
              rounded={Radius2.md}
              layout={Layout.Row.Middle.Center}
              spacing={Space.n12}
              override={{
                py: Space.n6,
                px: Space.n8,
                justify: "start",
                w: Size.fill,
                minHeight: Size.n40,
              }}
              onClick={() => setSelectedFolder(folder.id)}
            >
              <Icon
                src={folder.icon}
                size={IconSize.n16}
                style={{
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              />
              <Text.Menu.Item
                weight={isActive ? "medium" : "regular"}
                style={{
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              >
                {folder.label}
              </Text.Menu.Item>
              <Frame override={{ flex: 1 }} />
              {count > 0 && (
                <Text.Card.Note
                  style={{
                    color: isActive
                      ? "var(--text-primary)"
                      : "var(--text-tertiary)",
                  }}
                >
                  {count}
                </Text.Card.Note>
              )}
            </Frame>
          );
        })}
      </Frame>
    </Frame>
  );
}
