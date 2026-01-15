import {
  Calendar,
  Globe,
  Hash,
  Mail,
  MoreHorizontal,
  User,
  X,
} from "lucide-react";

import { Action } from "../../design-system/Action";
import { Divider } from "../../design-system/Divider";
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
import type { Deal } from "./CRMConstants";

function Avatar({
  initial,
  color,
  size = 32,
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
        size={FontSize.n12}
        weight="bold"
        style={{ color: "white" }}
      >
        {initial}
      </Text.Card.Note>
    </Frame>
  );
}

export function CRMDrawer({
  isOpen,
  onClose,
  deal,
}: {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
}) {
  if (!isOpen || !deal) return null;

  return (
    <Frame
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: 500,
        zIndex: 100,
      }}
      override={{
        shadow: "lg",
      }}
      surface="overlay"
      borderLeft
    >
      {/* Header */}
      <Frame
        style={{ height: 64 }}
        override={{
          py: Space.n0,
          px: Space.n24,
        }}
        layout={Layout.Row.Header.Default}
        align="center"
        justify="between"
        borderBottom
      >
        <Frame
          override={{ gap: Space.n12 }}
          layout={Layout.Row.Item.Default}
          align="center"
        >
          <Avatar initial={deal.name[0]} color={deal.avatarColor} size={32} />
          <Frame>
            <Text.Card.Title weight="bold">{deal.name}</Text.Card.Title>
            <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
              ID: {deal.id} • Added recently
            </Text.Card.Note>
          </Frame>
        </Frame>
        <Frame override={{ gap: Space.n8 }} layout={Layout.Row.Actions.Default}>
          <Action icon={MoreHorizontal} variant="ghost" />
          <Action icon={X} variant="ghost" onClick={onClose} />
        </Frame>
      </Frame>

      {/* Body */}
      <Frame flex fill scroll>
        <Frame override={{ p: Space.n24, gap: Space.n32 }}>
          {/* Properties Section */}
          <Frame override={{ gap: Space.n16 }}>
            <Text.Menu.Group style={{ color: "var(--text-tertiary)" }}>
              PROPERTIES
            </Text.Menu.Group>
            <Frame override={{ gap: Space.n8 }}>
              <PropertyRow icon={Globe} label="Company" value={deal.company} />
              <PropertyRow
                icon={Hash}
                label="Value"
                value={deal.value}
                primary
              />
              <PropertyRow icon={User} label="Owner" value={deal.owner} />
              <PropertyRow
                icon={Calendar}
                label="Close Date"
                value={deal.closeDate}
              />
              <PropertyRow icon={Mail} label="Contact Email" value="-" empty />
            </Frame>
          </Frame>

          <Divider />

          {/* Activity Section */}
          <Frame override={{ gap: Space.n16 }}>
            <Text.Menu.Group style={{ color: "var(--text-tertiary)" }}>
              ACTIVITY
            </Text.Menu.Group>
            <Frame override={{ gap: Space.n16 }}>
              <ActivityItem
                user="Sarah A."
                action="moved to Negotiation"
                time="2h ago"
              />
              <ActivityItem
                user="Mike R."
                action="commented: 'Met with the VP today, looks good.'"
                time="5h ago"
              />
              <ActivityItem user="System" action="created deal" time="2d ago" />
            </Frame>
          </Frame>
        </Frame>
      </Frame>

      {/* Footer */}
      <Frame
        override={{
          py: Space.n16,
          px: Space.n24,
        }}
        layout={Layout.Row.Actions.Default}
        justify="end"
        surface="sunken"
        borderTop
      >
        <Action label="Delete Deal" variant="ghost" />
        <Action label="Update Stage" variant="surface" border />
      </Frame>
    </Frame>
  );
}

function PropertyRow({
  icon: IconSrc,
  label,
  value,
  primary,
  empty,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  primary?: boolean;
  empty?: boolean;
}) {
  return (
    <Frame
      style={{ minHeight: 32 }}
      override={{ gap: Space.n16 }}
      layout={Layout.Row.Item.Default}
      align="center"
    >
      <Frame
        override={{ gap: Space.n8, w: Size.n128 }}
        layout={Layout.Row.Meta.Default}
        align="center"
      >
        <Icon
          src={IconSrc}
          size={IconSize.n14}
          style={{ color: "var(--text-tertiary)" }}
        />
        <Text.Field.Label style={{ color: "var(--text-tertiary)" }}>
          {label}
        </Text.Field.Label>
      </Frame>
      <Text.Field.Value
        weight={primary ? "bold" : "regular"}
        style={{
          color: empty
            ? "var(--text-tertiary)"
            : primary
              ? "var(--text-primary)"
              : "var(--text-secondary)",
        }}
      >
        {value}
      </Text.Field.Value>
    </Frame>
  );
}

function ActivityItem({
  user,
  action,
  time,
}: {
  user: string;
  action: string;
  time: string;
}) {
  return (
    <Frame override={{ gap: Space.n12 }} layout={Layout.Row.Item.Default}>
      <Frame
        override={{ w: Size.n24, h: Size.n24, rounded: "full" }}
        surface="raised"
        pack
      >
        <Icon
          src={User}
          size={IconSize.n14}
          style={{ color: "var(--text-secondary)" }}
        />
      </Frame>
      <Frame override={{ gap: Space.n4 }}>
        <Frame override={{ gap: Space.n4 }} layout={Layout.Row.Item.Tight}>
          <Text.Card.Title size={FontSize.n13}>{user}</Text.Card.Title>
          <Text.Card.Note>{action}</Text.Card.Note>
        </Frame>
        <Text.Card.Note
          size={FontSize.n11}
          style={{ color: "var(--text-tertiary)" }}
        >
          {time}
        </Text.Card.Note>
      </Frame>
    </Frame>
  );
}
