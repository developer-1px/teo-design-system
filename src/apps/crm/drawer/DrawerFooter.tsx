import { Action } from "@/ui/primitives/Action";
import * as styles from "../CRMDrawer.css";

export function DrawerFooter({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.footer}>
      <Action label="Close" variant="ghost" onClick={onClose} />
      <Action label="Edit" variant="surface" />
    </div>
  );
}
