import { Globe, User } from "lucide-react";
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
import type { Deal, DealStage } from "./CRMConstants";

const TABLE_COLS = "40px minmax(200px, 1.5fr) 1fr 140px 140px 120px 1fr";

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
      style={{ backgroundColor: bg, border: "1px solid var(--border-color)" }}
      override={{
        py: Space.n2,
        px: Space.n8,
        rounded: "md",
      }}
    >
      <Text.Card.Note weight="medium" style={{ color }}>
        {stage}
      </Text.Card.Note>
    </Frame>
  );
}

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

export function CRMTable({
  deals,
  selectedId,
  onSelect,
}: {
  deals: Deal[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <Frame flex fill scroll>
      {/* Header */}
      <Frame
        style={{
          height: 40,
          backgroundColor: "var(--surface-sunken)",
        }}
        override={{
          px: Space.n16,
          gap: Space.n16,
        }}
        grid
        columns={TABLE_COLS}
        align="center"
        borderBottom
      >
        <Text.Table.Head>#</Text.Table.Head>
        <Text.Table.Head>Name</Text.Table.Head>
        <Text.Table.Head>Company</Text.Table.Head>
        <Text.Table.Head>Stage</Text.Table.Head>
        <Text.Table.Head>Value</Text.Table.Head>
        <Text.Table.Head>Owner</Text.Table.Head>
        <Text.Table.Head>Close Date</Text.Table.Head>
      </Frame>

      {/* Rows */}
      {deals.map((deal) => (
        <Action
          key={deal.id}
          variant={selectedId === deal.id ? "surface" : "ghost"}
          rounded="none"
          onClick={() => onSelect(deal.id)}
          w="100%"
        >
          <Frame
            style={{ height: 48 }}
            override={{
              w: Size.full,
              px: Space.n16,
              gap: Space.n16,
            }}
            grid
            columns={TABLE_COLS}
            align="center"
            borderBottom
          >
            <Text.Table.Cell style={{ color: "var(--text-tertiary)" }}>
              {deal.id}
            </Text.Table.Cell>
            <Frame
              override={{ gap: Space.n12 }}
              layout={Layout.Row.Item.Tight}
              align="center"
            >
              <Avatar initial={deal.name[0]} color={deal.avatarColor} />
              <Text.Table.Cell
                weight="medium"
                style={{ color: "var(--text-primary)" }}
              >
                {deal.name}
              </Text.Table.Cell>
            </Frame>
            <Frame
              override={{ gap: Space.n8 }}
              layout={Layout.Row.Item.Compact}
              align="center"
            >
              <Frame
                override={{ w: Size.n16, h: Size.n16, rounded: "sm" }}
                surface="raised"
                pack
              >
                <Icon
                  src={Globe}
                  size={IconSize.n10}
                  style={{ color: "var(--text-tertiary)" }}
                />
              </Frame>
              <Text.Table.Cell style={{ color: "var(--text-secondary)" }}>
                {deal.company}
              </Text.Table.Cell>
            </Frame>
            <Frame>
              <StageBadge stage={deal.stage} />
            </Frame>
            <Text.Card.Note
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--text-secondary)",
              }}
            >
              {deal.value}
            </Text.Card.Note>
            <Frame
              override={{ gap: Space.n8 }}
              layout={Layout.Row.Item.Compact}
              align="center"
            >
              <Frame
                override={{ w: Size.n16, h: Size.n16, rounded: "full" }}
                surface="overlay"
                pack
              >
                <Icon src={User} size={IconSize.n10} />
              </Frame>
              <Text.Table.Cell style={{ color: "var(--text-secondary)" }}>
                {deal.owner}
              </Text.Table.Cell>
            </Frame>
            <Text.Table.Cell style={{ color: "var(--text-tertiary)" }}>
              {deal.closeDate}
            </Text.Table.Cell>
          </Frame>
        </Action>
      ))}
    </Frame>
  );
}
