import { Menu, Search, Settings, User } from "lucide-react";
import { useAtom } from "jotai";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text.tsx";
import { FontSize, IconSize, Size, Space } from "../../design-system/token/token.const.1tier";
import { searchQueryAtom } from "./store";

export function MailHeader() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

  return (
    <Frame
      override={{ h: Size.n64, py: Space.n0, px: Space.n20, borderBottom: true }}
      layout={Layout.Row.Header.Default}
      surface="base"
    >
      {/* Left: Logo and Menu */}
      <Frame override={{ gap: Space.n12 }} layout={Layout.Row.Item.Default}>
        <Action variant="ghost" icon={Menu} />
        <Frame override={{ gap: Space.n8 }} layout={Layout.Row.Item.Default} align="center">
          <Icon src={Mail} size={IconSize.n20} style={{ color: "var(--text-primary)" }} />
          <Text.Card.Title weight="bold">Mail</Text.Card.Title>
        </Frame>
      </Frame>

      {/* Center: Search */}
      <Frame
        override={{w: Size.n448, py: Space.n6, px: Space.n12, gap: Space.n8}} rounded="md"
        surface="sunken"
        layout={Layout.Row.Toolbar.Compact}
        align="center"
      >
        <Icon src={Search} size={IconSize.n14} style={{ color: "var(--text-tertiary)" }} />
        <input
          type="text"
          placeholder="Search mail"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            background: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: FontSize.n13,
          }}
        />
      </Frame>

      {/* Right: Profile and Settings */}
      <Frame override={{ gap: Space.n8 }} layout={Layout.Row.Actions.Default}>
        <Action variant="ghost" icon={Settings} />
        <Action variant="surface" icon={User} />
      </Frame>
    </Frame>
  );
}

// Helper Mail icon
function Mail({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
