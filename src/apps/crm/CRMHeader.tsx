import { Globe, LayoutGrid, Plus, Search } from "lucide-react";

import { Action } from "@/ui/primitives/Action";
import { Icon } from "@/ui/primitives/Icon";
import {
  IconSize,
  Size,
  Space,
} from "@/legacy-design-system/token/token.const.1tier";
import { Radius2 } from "@/legacy-design-system/token/radius2";

export function CRMHeader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Space.n12,
        height: Size.n64,
        paddingTop: Space.n0,
        paddingBottom: Space.n0,
        paddingLeft: Space.n20,
        paddingRight: Space.n20,
        borderBottom: "1px solid var(--border-subtle)",
        backgroundColor: "var(--surface-base)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: Space.n8,
        }}
      >
        <span style={{ color: "var(--text-tertiary)", fontSize: "12px" }}>
          Records
        </span>
        <span style={{ color: "var(--text-tertiary)", fontSize: "12px" }}>
          /
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: Space.n8,
          }}
        >
          <Icon src={LayoutGrid} size={IconSize.n16} />
          <span style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)" }}>Deals</span>
        </div>
      </div>

      {/* Global Search */}
      <div
        style={{
          borderRadius: Radius2.md,
          backgroundColor: "var(--surface-sunken)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: Space.n8,
          height: Size.n36,
          width: Size.n384,
          paddingTop: Space.n6,
          paddingBottom: Space.n6,
          paddingLeft: Space.n12,
          paddingRight: Space.n12,
        }}
      >
        <Icon
          src={Search}
          size={IconSize.n14}
          style={{ color: "var(--text-tertiary)" }}
        />
        <input
          style={{
            flex: 1,
            border: "none",
            background: "none",
            color: "var(--text-tertiary)",
            fontSize: "14px",
            outline: "none",
          }}
          placeholder="Search deals, companies..."
        />
        <div style={{ flex: 1 }} />
        <div
          style={{
            paddingLeft: Space.n4,
            paddingRight: Space.n4,
            paddingTop: Space.n2,
            paddingBottom: Space.n2,
            borderRadius: Radius2.sm,
            backgroundColor: "var(--surface-raised)",
          }}
        >
          <span
            style={{ color: "var(--text-tertiary)", fontSize: "10px" }}
          >
            ⌘K
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: Space.n8, marginLeft: "auto" }}>
        <Action variant="surface" border icon={Globe} label="Share" />
        <Action variant="primary" icon={Plus} label="New Deal" />
      </div>
    </div>
  );
}
