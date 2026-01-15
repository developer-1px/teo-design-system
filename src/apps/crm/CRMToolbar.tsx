import { Filter, LayoutGrid, List, SlidersHorizontal } from "lucide-react";

import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Separator } from "../../design-system/Separator";
import { Text } from "../../design-system/text/Text.tsx";
import {
  Opacity,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";

export function CRMToolbar() {
  return (
    <Frame
      layout={Layout.Row.Toolbar.Default}
      surface="base"
      override={{
        h: Size.n48,
        py: Space.n0,
        px: Space.n20,
        gap: Space.n8,
        borderBottom: true,
        align: "center",
      }}
    >
      <Action variant="surface" icon={List} label="Table" />
      <Action
        variant="ghost"
        icon={LayoutGrid}
        label="Kanban"
        opacity={Opacity.n50}
      />
      <Separator orientation="vertical" style={{ height: 16 }} />
      <Action variant="ghost" icon={Filter} label="Filter" />
      <Action variant="ghost" icon={SlidersHorizontal} label="Sort" />
      <Frame flex />
      <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
        6 Deal Records
      </Text.Card.Note>
    </Frame>
  );
}
