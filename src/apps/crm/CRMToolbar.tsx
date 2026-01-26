import { Filter, LayoutGrid, List, SlidersHorizontal } from "lucide-react";

import { Action } from "@/ui/primitives/Action";

import {
  Opacity,
  Size,
  Space,
} from "@/legacy-design-system/token/token.const.1tier";

export function CRMToolbar() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: Space.n8,
        height: Size.n48,
        paddingTop: Space.n0,
        paddingBottom: Space.n0,
        paddingLeft: Space.n20,
        paddingRight: Space.n20,
        borderBottom: "1px solid var(--border-subtle)",
        backgroundColor: "var(--surface-base)",
      }}
    >
      <Action variant="surface" icon={List} label="Table" />
      <Action
        variant="ghost"
        icon={LayoutGrid}
        label="Kanban"
        opacity={Opacity.n50}
      />
      <div style={{ width: 1, height: 16, backgroundColor: "var(--border-subtle)" }} />
      <Action variant="ghost" icon={Filter} label="Filter" />
      <Action variant="ghost" icon={SlidersHorizontal} label="Sort" />
      <div style={{ flex: 1 }} />
      <span style={{ color: "var(--text-tertiary)", fontSize: "12px" }}>
        6 Deal Records
      </span>
    </div>
  );
}
