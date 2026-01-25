import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { Divider } from "@/design-system/Divider";
import { Frame } from "@/design-system/Frame/Frame.tsx";
import { Layout } from "@/design-system/Frame/Layout/Layout.ts";
import { ResizeHandle, useResizable } from "@/design-system/Resizable";
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
    defaultSize: 6,
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
    <Frame
      override={{
        borderLeft: true, // Flat separation
        zIndex: ZIndex.n100,
      }}
      style={{
        width: `${size}px`,
        boxShadow: "var(--elevation-n5)", // Critical focus level
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        // Drawer Animation: Slide in from right
        transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)", // Smooth "iOS-like" ease
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        pointerEvents: isVisible ? "auto" : "none", // Prevent interaction when hidden
      }}
      surface="base" // Tone match with Main Area
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

          <Frame
            layout={Layout.Col.Left.Start}
            spacing={Space.n12}
            scroll
            override={{ fill: true }}
          >
            <Frame override={{ p: Space.n24, gap: Space.n32 }}>
              <DrawerProperties
                entries={Object.entries(displayRow).filter(
                  ([key]) => !key.startsWith("_") && key !== "avatarColor",
                )}
                formatColumnLabel={formatColumnLabel}
                formatValue={formatValue}
              />

              <Divider />

              <DrawerActivity />
            </Frame>
          </Frame>

          <DrawerFooter onClose={handleClose} />
        </>
      ) : null}
    </Frame>
  );
}
