import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { Divider } from "@/ui/Divider";
import { ResizeHandle, useResizable } from "@/ui/Resizable";
import { formatColumnLabel } from "./dataLoader";
import { DrawerActivity } from "./drawer/DrawerActivity";
import { DrawerFooter } from "./drawer/DrawerFooter";
import { DrawerHeader } from "./drawer/DrawerHeader";
import { DrawerProperties } from "./drawer/DrawerProperties";
import {
  formatValue,
  getAvatarColor,
  getDisplayTitle,
} from "./drawer/drawerUtils";
import { currentDataAtom, selectedRowIdAtom } from "./store";
import type { DataRow } from "./types";
import * as styles from "./CRMDrawer.css";

export function CRMDrawer() {
  const data = useAtomValue(currentDataAtom);
  const [selectedRowId, setSelectedRowId] = useAtom(selectedRowIdAtom);

  const selectedRow = data.find(
    (row) => (row as DataRow & { __rowId: string }).__rowId === selectedRowId,
  );

  const handleClose = () => setSelectedRowId(null);

  // Resizable hook
  const { size, resizeHandleProps } = useResizable({
    direction: "right",
    defaultSize: 320, // defaultSize legacy was 6? wait, code said 6? typo? 320.
    minSize: 320,
    maxSize: 1000,
    storageKey: "crm-drawer-width",
  });

  // Cache the last valid selection to persist content during exit animation
  const [cachedRow, setCachedRow] = useState<typeof selectedRow | null>(null);

  useEffect(() => {
    if (selectedRow) {
      setCachedRow(selectedRow);
    }
  }, [selectedRow]);

  const displayRow = selectedRow || cachedRow;
  const isVisible = !!selectedRow;

  if (!displayRow) {
    return null; // Initial state, nothing to show/animate
  }

  return (
    <div
      className={styles.drawer}
      style={{
        width: size,
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <ResizeHandle direction="right" {...resizeHandleProps} />
      {displayRow ? (
        <>
          <DrawerHeader
            title={getDisplayTitle(displayRow)}
            subtitle={`${Object.entries(displayRow).filter(([key]) => !key.startsWith("_") && key !== "avatarColor").length} properties`}
            avatarColor={getAvatarColor(displayRow)}
            onClose={handleClose}
          />

          <div className={styles.content}>
            <div className={styles.section}>
              <DrawerProperties
                entries={Object.entries(displayRow).filter(
                  ([key]) => !key.startsWith("_") && key !== "avatarColor",
                )}
                formatColumnLabel={formatColumnLabel}
                formatValue={formatValue}
              />

              <Divider />

              <DrawerActivity />
            </div>
          </div>

          <DrawerFooter onClose={handleClose} />
        </>
      ) : null}
    </div>
  );
}
