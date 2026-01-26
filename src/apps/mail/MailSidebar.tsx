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

import { Icon } from "@/ui/primitives/Icon";
import { Text } from "@/legacy-design-system/text/Text.tsx";
import { IconSize } from "@/legacy-design-system/token/token.const.1tier";
import { folderCountsAtom, selectedFolderAtom } from "./store";
import type { MailFolder } from "./types";
import * as styles from "./Mail.css";

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
    <div className={styles.sidebar}>
      {/* Compose Button */}
      <button className={styles.sidebarButton({ active: false, variant: "primary" })}>
        <Icon src={Edit} size={IconSize.n16} style={{ color: "currentColor" }} />
        <Text.Menu.Item weight="medium" style={{ color: "currentColor" }}>Compose</Text.Menu.Item>
      </button>

      <div style={{ height: "8px" }} />

      {/* Folder List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {FOLDER_CONFIG.map((folder) => {
          const isActive = selectedFolder === folder.id;
          const count = folderCounts[folder.id];

          return (
            <button
              key={folder.id}
              className={styles.sidebarButton({ active: isActive })}
              onClick={() => setSelectedFolder(folder.id)}
            >
              <Icon
                src={folder.icon}
                size={IconSize.n16}
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              />
              <Text.Menu.Item
                weight={isActive ? "medium" : "regular"}
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  flex: 1,
                }}
              >
                {folder.label}
              </Text.Menu.Item>
              {count > 0 && (
                <Text.Card.Note
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                  }}
                >
                  {count}
                </Text.Card.Note>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
