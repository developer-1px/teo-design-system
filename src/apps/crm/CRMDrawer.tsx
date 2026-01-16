import { useAtom, useAtomValue } from "jotai";
import { FileText } from "lucide-react";

import { Divider } from "../../design-system/Divider";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { ResizeHandle, useResizable } from "../../design-system/Resizable";
import { Text } from "../../design-system/text/Text.tsx";
import {
  IconSize,
  Space,
  ZIndex,
} from "../../design-system/token/token.const.1tier";
import { formatColumnLabel } from "./dataLoader";
import { DrawerActivity } from "./drawer/DrawerActivity";
import { DrawerFooter } from "./drawer/DrawerFooter";
import { DrawerHeader } from "./drawer/DrawerHeader";
import { DrawerProperties } from "./drawer/DrawerProperties";
import {
  formatValue,
  getAvatarColor,
  getDisplayTitle,
  getFieldIcon,
} from "./drawer/drawerUtils";
import { currentDataAtom, selectedRowIdAtom } from "./store";
import type { DataRow } from "./types";

export function CRMDrawer() {
  const data = useAtomValue(currentDataAtom);
  const [selectedRowId, setSelectedRowId] = useAtom(selectedRowIdAtom);

  const selectedRow = data.find(
    (row) => (row as DataRow & { __rowId: string }).__rowId === selectedRowId,
  );

  const hasSelection = !!selectedRowId && !!selectedRow;

  const handleClose = () => setSelectedRowId(null);

  // Resizable hook
  const { size, resizeHandleProps } = useResizable({
    direction: "right",
    defaultSize: 512,
    minSize: 320,
    maxSize: 800,
    storageKey: "crm-drawer-width",
  });

  return (
    <Frame
      override={{
        borderLeft: true, // Flat separation
        zIndex: ZIndex.n100,
      }}
      w={`${size}px` as unknown as any}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
      }}
      surface="base" // Tone match with Main Area
    >
      <ResizeHandle direction="right" {...resizeHandleProps} />
      {hasSelection && selectedRow ? (
        <>
          <DrawerHeader
            title={getDisplayTitle(selectedRow)}
            subtitle={`${Object.entries(selectedRow).filter(([key]) => !key.startsWith("_") && key !== "avatarColor").length} properties`}
            avatarColor={getAvatarColor(selectedRow)}
            onClose={handleClose}
          />

          <Frame layout={Layout.Stack.Content.Scroll} fill>
            <Frame
              override={{ p: Space.n24, gap: Space.n32 }}
            >
              <DrawerProperties
                entries={Object.entries(selectedRow).filter(
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
      ) : (
        <Frame flex fill layout={Layout.Center.Default}>
          <Frame override={{ gap: Space.n16, align: "center" }}>
            <Icon
              src={FileText}
              size={IconSize.n48}
              style={{ color: "var(--text-tertiary)" }}
            />
            <Text.Card.Title style={{ color: "var(--text-secondary)" }}>
              No Selection
            </Text.Card.Title>
            <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
              Select a row to view details
            </Text.Card.Note>
          </Frame>
        </Frame>
      )}
    </Frame>
  );
}
