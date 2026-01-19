import { useAtom } from "jotai";
import { Menu, Search, Settings, User } from "lucide-react";

import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text.tsx";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
import { searchQueryAtom } from "./store";

export function MailHeader() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

  return (
    <Frame
      override={{
        h: Size.n64,
        py: Space.n0,
        px: Space.n20,
        borderBottom: true,
      }}
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      h={Size.n44}
      surface="base"
    >
      {/* Left: Logo and Menu */}
      <Frame
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        override={{ px: Space.n16, minHeight: Size.n40 }}
      >
        <Frame
          as="button"
          interactive
          surface="ghost"
          rounded={Radius2.md}
          override={{ p: Space.n8 }}
        >
          <Icon src={Menu} size={IconSize.n20} />
        </Frame>

        <Frame
          override={{ gap: Space.n8, minHeight: Size.n40 }}
          layout={Layout.Row.Middle.Center}
          spacing={Space.n12}
        >
          <Icon
            src={Mail}
            size={IconSize.n20}
            style={{ color: "var(--text-primary)" }}
          />
          <Text.Card.Title weight="bold">Mail</Text.Card.Title>
        </Frame>
      </Frame>

      {/* Center: Search */}
      <Frame
        as="label"
        rounded={Radius2.md}
        surface="sunken"
        interactive="text"
        layout={Layout.Row.Middle.Center}
        spacing={Space.n8}
        h={Size.n36}
        override={{
          w: Size.n448,
          py: Space.n6,
          px: Space.n12,
        }}
      >
        <Icon
          src={Search}
          size={IconSize.n14}
          style={{ color: "var(--text-tertiary)" }}
        />
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
      <Frame layout={Layout.Row.Middle.End} spacing={Space.n8}>
        <Frame
          as="button"
          interactive
          surface="ghost"
          rounded={Radius2.md}
          override={{ p: Space.n8 }}
        >
          <Icon src={Settings} size={IconSize.n20} />
        </Frame>
        <Frame
          as="button"
          interactive
          surface="base"
          rounded={Radius2.full}
          override={{ p: Space.n8, border: true }}
        >
          <Icon src={User} size={IconSize.n20} />
        </Frame>
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
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
