import {
  Archive,
  Calendar,
  ChevronDown,
  Filter,
  Globe,
  Hash,
  Home,
  Inbox,
  LayoutGrid,
  List,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  User,
  Users,
  X,
} from "lucide-react";

import { useState } from "react";
import { Action } from "../design-system/Action";
import { Divider } from "../design-system/Divider";
import { Frame } from "../design-system/Frame";
import { Separator } from "../design-system/Separator";
import { Text } from "../design-system/text/Text.tsx";
import { Icon } from "../design-system/Icon";
import { IconSize } from "../design-system/token/token.const.1tier";

// --- Mock Data ---

type DealStage = "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed";

interface Deal {
  id: string;
  name: string;
  company: string;
  stage: DealStage;
  value: string;
  owner: string;
  closeDate: string;
  avatarColor: string;
}

const DEALS: Deal[] = [
  {
    id: "1",
    name: "Enterprise License",
    company: "Acme Corp",
    stage: "Negotiation",
    value: "$120,000",
    owner: "Sarah A.",
    closeDate: "Oct 24, 2024",
    avatarColor: "#E11D48",
  },
  {
    id: "2",
    name: "Q4 Expansion",
    company: "Linear Orbit",
    stage: "Qualified",
    value: "$45,000",
    owner: "Mike R.",
    closeDate: "Nov 12, 2024",
    avatarColor: "#2563EB",
  },
  {
    id: "3",
    name: "Startup Plan",
    company: "Vercel",
    stage: "Proposal",
    value: "$12,000",
    owner: "John D.",
    closeDate: "Oct 30, 2024",
    avatarColor: "#000000",
  },
  {
    id: "4",
    name: "Global Rollout",
    company: "Stripe",
    stage: "Lead",
    value: "$250,000",
    owner: "Sarah A.",
    closeDate: "Dec 15, 2024",
    avatarColor: "#6366F1",
  },
  {
    id: "5",
    name: "Security Add-on",
    company: "Raycast",
    stage: "Closed",
    value: "$8,500",
    owner: "Mike R.",
    closeDate: "Sep 28, 2024",
    avatarColor: "#DC2626",
  },
  {
    id: "6",
    name: "Design Systems",
    company: "Figma",
    stage: "Negotiation",
    value: "$85,000",
    owner: "John D.",
    closeDate: "Nov 01, 2024",
    avatarColor: "#10B981",
  },
];

// --- Components ---

function Avatar({
  initial,
  color,
  size = 24,
}: {
  initial: string;
  color: string;
  size?: number;
}) {
  return (
    <Frame
      override={{
        style: { width: size, height: size, backgroundColor: color },
        rounded: "full",
      }}
      pack
      align="center"
      justify="center"
    >
      <Text variant="caption-sm" weight="bold" style={{ color: "white" }}>
        {initial}
      </Text>
    </Frame>
  );
}

function StageBadge({ stage }: { stage: DealStage }) {
  let color = "var(--text-secondary)";
  let bg = "var(--surface-sunken)";

  switch (stage) {
    case "Lead":
      color = "#64748B";
      bg = "#F1F5F9";
      break;
    case "Qualified":
      color = "#0369A1";
      bg = "#E0F2FE";
      break;
    case "Proposal":
      color = "#7C3AED";
      bg = "#F3E8FF";
      break;
    case "Negotiation":
      color = "#B45309";
      bg = "#FEF3C7";
      break;
    case "Closed":
      color = "#15803D";
      bg = "#DCFCE7";
      break;
  }

  return (
    <Frame
      override={{
        p: "1 2",
        rounded: "md",
        style: { backgroundColor: bg, border: "1px solid var(--border-color)" },
      }}
    >
      <Text variant="caption-sm" weight="medium" style={{ color }}>
        {stage}
      </Text>
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
    <Action variant={active ? "surface" : "ghost"} rounded="md" w="100%">
      <Frame override={{ gap: 3, w: "100%", p: "1.5 2" }} row align="center">
        <Icon
          src={IconSrc}
          size={IconSize.n16}
          style={{
            color: active ? "var(--text-primary)" : "var(--text-secondary)",
          }}
        />
        <Text
          variant="body-sm"
          weight={active ? "medium" : "regular"}
          color={active ? "primary" : "secondary"}
        >
          {label}
        </Text>
        {count !== undefined && (
          <>
            <Frame flex />
            <Text variant="caption-sm" color="tertiary">
              {count}
            </Text>
          </>
        )}
      </Frame>
    </Action>
  );
}

function Sidebar() {
  return (
    <Frame
      override={{
        w: "240px",
        p: "3 3",
        gap: 4,
        h: "full",
        style: { minWidth: 240, borderRight: "1px solid var(--border-color)" },
      }}
      surface="sunken"
    >
      {/* Workspace Switcher */}
      <Action variant="ghost" rounded="md">
        <Frame override={{ gap: 3, p: "1" }} row align="center">
          <Avatar initial="O" color="black" size={20} />
          <Text weight="bold" variant="body-sm">
            Orbit Inc.
          </Text>
          <Frame flex />
          <SelectorIcon />
        </Frame>
      </Action>

      {/* Main Nav */}
      <Frame override={{ gap: 1 }}>
        <SidebarItem icon={Home} label="Home" />
        <SidebarItem icon={Inbox} label="Inbox" count={4} />
      </Frame>

      {/* Sections */}
      <Frame override={{ gap: 1 }}>
        <SectionLabel label="Records" />
        <SidebarItem icon={Users} label="Companies" />
        <SidebarItem icon={User} label="People" />
        <SidebarItem icon={LayoutGrid} label="Deals" active />
      </Frame>

      <Frame override={{ gap: 1 }}>
        <SectionLabel label="Views" />
        <SidebarItem icon={List} label="All Deals" />
        <SidebarItem icon={Archive} label="Archived" />
      </Frame>

      <Frame flex />

      {/* Bottom Actions */}
      <Frame override={{ gap: 1 }}>
        <SidebarItem icon={Settings} label="Settings" />
        <Frame override={{ gap: 3, p: "2" }} row align="center">
          <Avatar initial="M" color="#4F46E5" size={20} />
          <Text variant="body-sm" weight="medium">
            Mike R.
          </Text>
        </Frame>
      </Frame>
    </Frame>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Frame override={{ p: "1 2" }}>
      <Text
        variant="caption-sm"
        weight="bold"
        color="tertiary"
        style={{ letterSpacing: "0.05em" }}
      >
        {label.toUpperCase()}
      </Text>
    </Frame>
  );
}

function SelectorIcon() {
  return (
    <Frame override={{ style: { opacity: 0.4 } }}>
      <Icon src={ChevronDown} size={IconSize.n14} />
    </Frame>
  );
}

function Header() {
  return (
    <Frame
      override={{
        p: "3 5",
        style: { height: 60, borderBottom: "1px solid var(--border-color)" },
      }}
    >
      <Frame override={{ gap: 2 }} row align="center">
        <Text variant="body-md" color="tertiary">
          Records
        </Text>
        <Text variant="body-md" color="tertiary">
          /
        </Text>
        <Frame override={{ gap: 2 }} row align="center">
          <Icon src={LayoutGrid} size={IconSize.n16} />
          <Text variant="heading-sm" color="primary">
            Deals
          </Text>
        </Frame>
      </Frame>

      {/* Global Search */}
      <Frame
        override={{
          rounded: "md",
          p: "1.5 3",
          gap: 2,
          style: { width: 320, border: "1px solid var(--border-color)" },
        }}
        surface="sunken"
        row
        align="center"
      >
        <Icon src={Search} size={IconSize.n14} style={{ color: "var(--text-tertiary)" }} />
        <Text variant="body-sm" color="tertiary">
          Search...
        </Text>
        <Frame flex />
        <Frame
          override={{
            rounded: "sm",
            p: 0,
            style: {
              borderColor: "var(--border-color)",
              border: "1px solid var(--border-color)",
            },
          }}
          surface="raised"
        >
          <Text variant="caption-sm" color="tertiary">
            ⌘K
          </Text>
        </Frame>
      </Frame>

      <Frame override={{ gap: 2 }} row>
        <Action variant="surface" border icon={ShareIcon} label="Share" />
        <Action
          variant="primary"
          icon={Plus}
          label="New Deal"
          style={{
            backgroundColor: "var(--text-primary)",
            color: "var(--surface-base)",
          }}
        />
      </Frame>
    </Frame>
  );
}

function ShareIcon(props: any) {
  return <Globe {...props} />;
}

function Toolbar() {
  return (
    <Frame
      override={{
        p: "2 5",
        style: { height: 48, borderBottom: "1px solid var(--border-color)" },
        gap: 2,
      }}
      row
      align="center"
      surface="base"
    >
      <Action variant="ghost" icon={List} label="Table" />
      <Action variant="ghost" icon={LayoutGrid} label="Kanban" opacity={0.5} />
      <Separator orientation="vertical" style={{ height: 16 }} />
      <Action variant="ghost" icon={Filter} label="Filter" />
      <Action variant="ghost" icon={SlidersHorizontal} label="Sort" />
      <Frame flex />
      <Text variant="caption" color="tertiary">
        6 Deal Records
      </Text>
    </Frame>
  );
}

// Table Components
const TABLE_COLS = "40px minmax(200px, 1.5fr) 1fr 140px 140px 120px 1fr";

function TableHeader() {
  return (
    <Frame
      override={{
        p: "0 4",
        gap: 4,
        style: {
          height: 36,
          backgroundColor: "var(--surface-base)",
          borderBottom: "1px solid var(--border-color)",
        },
      }}
      grid
      columns={TABLE_COLS}
      align="center"
    >
      <Frame>
        <Text variant="caption-sm" color="tertiary" weight="medium">
          #
        </Text>
      </Frame>
      <Frame>
        <Text variant="caption-sm" color="tertiary" weight="medium">
          Name
        </Text>
      </Frame>
      <Frame>
        <Text variant="caption-sm" color="tertiary" weight="medium">
          Company
        </Text>
      </Frame>
      <Frame>
        <Text variant="caption-sm" color="tertiary" weight="medium">
          Stage
        </Text>
      </Frame>
      <Frame>
        <Text variant="caption-sm" color="tertiary" weight="medium">
          Value
        </Text>
      </Frame>
      <Frame>
        <Text variant="caption-sm" color="tertiary" weight="medium">
          Owner
        </Text>
      </Frame>
      <Frame>
        <Text variant="caption-sm" color="tertiary" weight="medium">
          Close Date
        </Text>
      </Frame>
    </Frame>
  );
}

function TableRow({
  deal,
  onClick,
  active,
}: {
  deal: Deal;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <Action
      variant={active ? "surface" : "ghost"}
      rounded="none"
      onClick={onClick}
      w="100%"
      gap={0}
    >
      <Frame
        override={{
          w: "100%",
          p: "0 4",
          gap: 4,
          style: { height: 44, borderBottom: "1px solid var(--border-color)" },
        }}
        grid
        columns={TABLE_COLS}
        align="center"
      >
        <Text variant="code" color="tertiary">
          {deal.id}
        </Text>
        <Frame override={{ gap: 3 }} row align="center">
          <Avatar initial={deal.name[0]} color={deal.avatarColor} size={20} />
          <Text variant="body-sm" weight="medium" color="primary">
            {deal.name}
          </Text>
        </Frame>
        <Frame override={{ gap: 2 }} row align="center">
          <Frame
            override={{ style: { width: 16, height: 16 }, rounded: "sm" }}
            surface="raised"
            align="center"
            justify="center"
          >
            <Icon src={Globe} size={IconSize.n10} style={{ color: "var(--text-tertiary)" }} />
          </Frame>
          <Text variant="body-sm" color="secondary">
            {deal.company}
          </Text>
        </Frame>
        <StageBadge stage={deal.stage} />
        <Text variant="code" color="secondary">
          {deal.value}
        </Text>
        <Frame override={{ gap: 2 }} row align="center">
          <Frame
            override={{ style: { width: 18, height: 18 }, rounded: "full" }}
            surface="overlay"
            align="center"
            justify="center"
          >
            <Icon src={User} size={IconSize.n10} />
          </Frame>
          <Text variant="body-sm" color="secondary">
            {deal.owner}
          </Text>
        </Frame>
        <Text variant="body-sm" color="tertiary">
          {deal.closeDate}
        </Text>
      </Frame>
    </Action>
  );
}

// Drawer Component
function Drawer({
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
      override={{
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 600,
          backgroundColor: "var(--surface-base)",
          boxShadow: "var(--shadow-lg)",
          borderLeft: "1px solid var(--border-color)",
          zIndex: 100,
        },
      }}
      flex
    >
      {/* Drawer Header */}
      <Frame
        override={{
          p: "4 6",
          style: { height: 60, borderBottom: "1px solid var(--border-color)" },
        }}
        row
        align="center"
        justify="between"
      >
        <Frame override={{ gap: 3 }} row align="center">
          <Avatar initial={deal.name[0]} color={deal.avatarColor} size={32} />
          <Frame>
            <Text variant="heading-md" color="primary">
              {deal.name}
            </Text>
            <Text variant="caption" color="tertiary">
              Added on Oct 12 • ID: {deal.id}
            </Text>
          </Frame>
        </Frame>
        <Frame override={{ gap: 2 }} row>
          <Action icon={MoreHorizontal} variant="ghost" />
          <Action icon={X} variant="ghost" onClick={onClose} />
        </Frame>
      </Frame>

      {/* Drawer Body */}
      <Frame flex fill overflow="auto">
        <Frame override={{ p: "6", gap: 6 }}>
          {/* Properties Section */}
          <Frame override={{ gap: 4 }}>
            <Text variant="caption-sm" weight="bold" color="tertiary">
              PROPERTIES
            </Text>
            <Frame override={{ gap: 1 }}>
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
          <Frame override={{ gap: 4 }}>
            <Text variant="caption-sm" weight="bold" color="tertiary">
              ACTIVITY
            </Text>
            <Frame override={{ gap: 4 }}>
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

      {/* Drawer Footer */}
      <Frame
        override={{
          p: "4 6",
          style: { borderTop: "1px solid var(--border-color)" },
          gap: 2,
        }}
        row
        justify="end"
        surface="sunken"
      >
        <Action label="Delete" variant="ghost" />
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
    <Frame override={{ style: { height: 32 }, gap: 4 }} row align="center">
      <Frame override={{ gap: 2, w: 140 }} row align="center">
        <Icon src={IconSrc} size={IconSize.n14} style={{ color: "var(--text-tertiary)" }} />
        <Text variant="body-sm" color="tertiary">
          {label}
        </Text>
      </Frame>
      <Text
        variant="body-sm"
        color={empty ? "tertiary" : primary ? "primary" : "secondary"}
        weight={primary ? "medium" : "regular"}
      >
        {value}
      </Text>
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
    <Frame override={{ gap: 3 }} row>
      <Frame
        override={{ style: { width: 24, height: 24 }, rounded: "full" }}
        surface="raised"
        align="center"
        justify="center"
      >
        <Icon src={User} size={IconSize.n14} style={{ color: "var(--text-secondary)" }} />
      </Frame>
      <Frame override={{ gap: 1 }}>
        <Frame override={{ gap: 1 }} row>
          <Text variant="body-sm" weight="medium" color="primary">
            {user}
          </Text>
          <Text variant="body-sm" color="secondary">
            {action}
          </Text>
        </Frame>
        <Text variant="caption" color="tertiary">
          {time}
        </Text>
      </Frame>
    </Frame>
  );
}

// Main App Layout
export function CRMApp() {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const selectedDeal = DEALS.find((d) => d.id === selectedDealId) || null;

  return (
    <Frame fill row surface="base">
      <Sidebar />
      <Frame
        override={{
          style: {
            position: "relative",
            borderLeft: "1px solid var(--border-color)",
          },
        }}
        fill
        flex
        overflow="hidden"
      >
        <Header />
        <Toolbar />
        <Frame flex fill overflow="auto">
          <TableHeader />
          {DEALS.map((deal) => (
            <TableRow
              key={deal.id}
              deal={deal}
              active={selectedDealId === deal.id}
              onClick={() => setSelectedDealId(deal.id)}
            />
          ))}
        </Frame>

        {/* Overlay/Drawer */}
        <Drawer
          isOpen={!!selectedDealId}
          onClose={() => setSelectedDealId(null)}
          deal={selectedDeal}
        />
      </Frame>
    </Frame>
  );
}
