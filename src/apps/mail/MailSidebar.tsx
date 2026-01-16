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
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text.tsx";
import {
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
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
      {/* Compose Button */}
      <Action
        variant="primary"
        icon={Edit}
        label="Compose"
        rounded={Radius2.md}
        w="100%"
      />

      <Frame override={{ h: Size.n8 }} />

      {/* Folder List */}
      <Frame layout={Layout.Stack.List.Default}>
        {FOLDER_CONFIG.map((folder) => {
          const isActive = selectedFolder === folder.id;
          const count = folderCounts[folder.id];

          return (
            <Action
              key={folder.id}
              variant={isActive ? "surface" : "ghost"}
              rounded={Radius2.md}
              w="100%"
              justify="start"
              onClick={() => setSelectedFolder(folder.id)}
            >
              <Frame
                layout={Layout.Row.Item.Default}
                override={{
                  gap: Space.n12,
                  w: Size.fill,
                  py: Space.n6,
                  px: Space.n8,
                  align: "center",
                }}
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
                <Frame flex />
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
            </Action>
          );
        })}
      </Frame>
    </Frame>
  );
}
