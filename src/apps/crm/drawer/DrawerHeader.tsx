import { ChevronsRight, MoreHorizontal } from "lucide-react";
import { Action } from "@/ui/primitives/Action";
import * as styles from "../CRMDrawer.css";

function Avatar({
  initial,
  color,
}: {
  initial: string;
  color: string;
}) {
  return (
    <div
      className={styles.avatar}
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
}

export function DrawerHeader({
  title,
  subtitle,
  avatarColor,
  onClose,
}: {
  title: string;
  subtitle: string;
  avatarColor: string;
  onClose: () => void;
}) {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <Action icon={ChevronsRight} variant="ghost" onClick={onClose} />
        <Avatar initial={title[0]} color={avatarColor} />
        <div className={styles.textMeta}>
          <span className={styles.title}>{title}</span>
          <span className={styles.subtitle}>{subtitle}</span>
        </div>
      </div>
      <Action icon={MoreHorizontal} variant="ghost" />
    </div>
  );
}
