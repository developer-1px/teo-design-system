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

export function CRMHeader() {
  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      h={Size.n64}
      override={{
        py: Space.n0,
        px: Space.n20,
        borderBottom: true, // Continuous line with Sidebar
      }}
    >
      <Frame
        layout={Layout.Row.Middle.Start}
        spacing={Space.n8}
        override={{ align: "center" }}
      >
        <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
          Records
        </Text.Card.Note>
        <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
          /
        </Text.Card.Note>
        <Frame
          layout={Layout.Row.Middle.Start}
          spacing={Space.n8}
          override={{ align: "center" }}
        >
          <Icon src={LayoutGrid} size={IconSize.n16} />
          <Text.Card.Title weight="bold">Deals</Text.Card.Title>
        </Frame>
      </Frame>

      {/* Global Search */}
      <Frame
        rounded={Radius2.md}
        surface="sunken"
        layout={Layout.Row.Middle.Center}
        spacing={Space.n8}
        h={Size.n36}
        override={{
          w: Size.n384,
          py: Space.n6,
          px: Space.n12,
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
        <Frame override={{ flex: 1 }} />
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

      <Frame layout={Layout.Row.Middle.End} spacing={Space.n8}>
        <Action variant="surface" border icon={Globe} label="Share" />
        <Action variant="primary" icon={Plus} label="New Deal" />
      </Frame>
    </Frame>
  );
}
