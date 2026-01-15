import { Globe, LayoutGrid, Plus, Search } from "lucide-react";

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

export function CRMHeader() {
  return (
    <Frame
      layout={Layout.Row.Header.Default}
      surface="base"
      override={{ h: Size.n64, py: Space.n0, px: Space.n20, align: "center" }}
    >
      <Frame
        layout={Layout.Row.Meta.Default}
        override={{ gap: Space.n8, align: "center" }}
      >
        <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
          Records
        </Text.Card.Note>
        <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
          /
        </Text.Card.Note>
        <Frame
          layout={Layout.Row.Meta.Default}
          override={{ gap: Space.n8, align: "center" }}
        >
          <Icon src={LayoutGrid} size={IconSize.n16} />
          <Text.Card.Title weight="bold">Deals</Text.Card.Title>
        </Frame>
      </Frame>

      {/* Global Search */}
      <Frame
        rounded={Radius2.md}
        surface="sunken"
        layout={Layout.Row.Toolbar.Compact}
        override={{
          w: Size.n384,
          py: Space.n6,
          px: Space.n12,
          gap: Space.n8,
          align: "center",
        }}
      >
        <Icon
          src={Search}
          size={IconSize.n14}
          style={{ color: "var(--text-tertiary)" }}
        />
        <Text.Field.Label
          flex
          style={{
            border: "none",
            background: "none",
            color: "var(--text-tertiary)",
          }}
        >
          Search deals, companies...
        </Text.Field.Label>
        <Frame flex />
        <Frame
          override={{
            px: Space.n4,
            py: Space.n2,
          }}
          rounded={Radius2.sm}
          surface="raised"
        >
          <Text.Card.Note
            style={{ color: "var(--text-tertiary)", fontSize: "10px" }}
          >
            ⌘K
          </Text.Card.Note>
        </Frame>
      </Frame>

      <Frame override={{ gap: Space.n8 }} layout={Layout.Row.Actions.Default}>
        <Action variant="surface" border icon={Globe} label="Share" />
        <Action variant="primary" icon={Plus} label="New Deal" />
      </Frame>
    </Frame>
  );
}
