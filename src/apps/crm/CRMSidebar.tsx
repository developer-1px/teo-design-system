import {
  Archive,
  ChevronDown,
  Home,
  Inbox,
  LayoutGrid,
  List,
  Settings,
  User,
  Users,
} from "lucide-react";

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

function Avatar({
  initial,
  color,
  size = 20,
}: {
  initial: string;
  color: string;
  size?: number;
}) {
  return (
    <Frame
      style={{ width: size, height: size, backgroundColor: color }}
      override={{
        rounded: "full",
      }}
      pack
      align="center"
      justify="center"
    >
      <Text.Card.Note
        weight="bold"
        style={{ color: "white", fontSize: "10px" }}
      >
        {initial}
      </Text.Card.Note>
    </Frame>
  );
}

function SidebarItem({
  icon: IconSrc,
  label,
  active,
  count,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  count?: number;
}) {
  return (
    <Action
      variant={active ? "surface" : "ghost"}
      rounded="md"
      w="100%"
      justify="start"
    >
      <Frame
        override={{ gap: Space.n12, w: Size.full, py: Space.n6, px: Space.n8 }}
        layout={Layout.Row.Item.Default}
        align="center"
      >
        <Icon
          src={IconSrc}
          size={IconSize.n16}
          style={{
            color: active ? "var(--text-primary)" : "var(--text-secondary)",
          }}
        />
        <Text.Menu.Item
          weight={active ? "medium" : "regular"}
          style={{
            color: active ? "var(--text-primary)" : "var(--text-secondary)",
          }}
        >
          {label}
        </Text.Menu.Item>
        {count !== undefined && (
          <>
            <Frame flex />
            <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
              {count}
            </Text.Card.Note>
          </>
        )}
      </Frame>
    </Action>
  );
}

export function CRMSidebar() {
  return (
    <Frame
      style={{ width: "240px", minWidth: 240 }}
      override={{
        h: Size.full,
        p: Space.n8,
        gap: Space.n4,
      }}
      surface="sunken"
    >
      {/* Workspace Switcher */}
      <Action variant="ghost" rounded="md">
        <Frame
          override={{ gap: Space.n12, p: Space.n4 }}
          layout={Layout.Row.Item.Default}
          align="center"
        >
          <Avatar initial="O" color="black" size={20} />
          <Text.Menu.Item weight="bold">Orbit Inc.</Text.Menu.Item>
          <Frame flex />
          <Icon src={ChevronDown} size={IconSize.n14} opacity={0.4} />
        </Frame>
      </Action>

      <Frame override={{ h: Size.n8 }} />

      {/* Main Nav */}
      <Frame override={{ gap: Space.n4 }}>
        <SidebarItem icon={Home} label="Home" />
        <SidebarItem icon={Inbox} label="Inbox" count={4} />
      </Frame>

      {/* Sections */}
      <Frame override={{ pt: Space.n16, gap: Space.n4 }}>
        <SectionLabel label="Records" />
        <SidebarItem icon={Users} label="Companies" />
        <SidebarItem icon={User} label="People" />
        <SidebarItem icon={LayoutGrid} label="Deals" active />
      </Frame>

      <Frame override={{ pt: Space.n16, gap: Space.n4 }}>
        <SectionLabel label="Views" />
        <SidebarItem icon={List} label="All Deals" />
        <SidebarItem icon={Archive} label="Archived" />
      </Frame>

      <Frame flex />

      {/* Bottom Actions */}
      <Frame override={{ gap: Space.n4 }}>
        <SidebarItem icon={Settings} label="Settings" />
        <Action variant="ghost" rounded="md" w="100%">
          <Frame
            override={{ gap: Space.n12, py: Space.n6, px: Space.n8 }}
            layout={Layout.Row.Item.Default}
            align="center"
          >
            <Avatar initial="M" color="#4F46E5" size={20} />
            <Text.Menu.Item weight="medium">Mike R.</Text.Menu.Item>
          </Frame>
        </Action>
      </Frame>
    </Frame>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Frame override={{ py: Space.n4, px: Space.n8 }}>
      <Text.Menu.Group
        style={{ letterSpacing: "0.05em", color: "var(--text-tertiary)" }}
      >
        {label.toUpperCase()}
      </Text.Menu.Group>
    </Frame>
  );
}
