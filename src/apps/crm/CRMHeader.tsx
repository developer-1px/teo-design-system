import { Globe, LayoutGrid, Plus, Search } from "lucide-react";

import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text.tsx";
import { IconSize, Size, Space } from "../../design-system/token/token.const.1tier";

export function CRMHeader() {
  return (
    <Frame
      override={{
        h: Size.n64,
        py: Space.n0,
        px: Space.n20,
      }}
      layout={Layout.Row.Header.Default}
      align="center"
      justify="between"
      surface="base"
    >
      <Frame
        override={{ gap: Space.n8 }}
        layout={Layout.Row.Meta.Default}
        align="center"
      >
        <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
          Records
        </Text.Card.Note>
        <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
          /
        </Text.Card.Note>
        <Frame
          override={{ gap: Space.n8 }}
          layout={Layout.Row.Meta.Default}
          align="center"
        >
          <Icon src={LayoutGrid} size={IconSize.n16} />
          <Text.Card.Title weight="bold">Deals</Text.Card.Title>
        </Frame>
      </Frame>

      {/* Global Search */}
      <Frame
        override={{
          w: Size.n384,
          rounded: "md",
          py: Space.n6,
          px: Space.n12,
          gap: Space.n8,
        }}
        surface="sunken"
        layout={Layout.Row.Toolbar.Compact}
        align="center"
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
            rounded: "sm",
            px: Space.n4,
            py: Space.n2,
          }}
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
