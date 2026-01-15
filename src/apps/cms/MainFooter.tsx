import { ArrowUpRight, Globe, MessageSquare, Sparkles } from "lucide-react";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Space } from "../../design-system/token/token.const.1tier";
import { Icon } from "../../design-system/Icon";
import { IconSize, Size } from "../../design-system/token/token.const.1tier";

export function MainFooter() {
  return (
    <Frame
      override={{
        w: Size.full,
        py: Space.n64,
        px: Space.n24,
        gap: Space.n16,
      }}
      style={{ maxWidth: "1200px", margin: "0 auto" }}
      surface="sunken"
    >
      <Frame override={{ w: Size.full }} layout={Layout.Row.Header.Default} justify="between" align="start">
        <Frame override={{ gap: Space.n6 }} style={{ width: "35%" }}>
          <Frame override={{ gap: Space.n4 }} layout={Layout.Row.Item.Tight} align="center">
            <Frame
              override={{ rounded: "xl" }}
              style={{ width: 40, height: 40 }}
              surface="primary"
              pack
            >
              <Icon src={Sparkles} size={IconSize.n20} color="#fff" />
            </Frame>
            <Text.Card.Title
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                letterSpacing: "-0.02em",
              }}
            >
              VisualEngine
            </Text.Card.Title>
          </Frame>
          <Text.Card.Desc
            style={{
              fontSize: "var(--font-size-n16)",
              lineHeight: "1.6",
              opacity: 0.7,
              color: "var(--text-secondary)",
            }}
          >
            Building the future of the visual web. Join us in redefining how
            websites are crafted.
          </Text.Card.Desc>
          <Frame override={{ gap: Space.n4 }} layout={Layout.Row.Actions.Default}>
            <Icon src={Globe} size={IconSize.n20} style={{ opacity: 0.4 }} />
            <Icon src={MessageSquare} size={IconSize.n20} style={{ opacity: 0.4 }} />
            <Icon src={ArrowUpRight} size={IconSize.n20} style={{ opacity: 0.4 }} />
          </Frame>
        </Frame>

        <Frame override={{ gap: Space.n16 }} layout={Layout.Row.Actions.Default}>
          <FooterLinkColumn
            title="PRODUCT"
            links={["Features", "Design", "Automation", "Templates"]}
          />
          <FooterLinkColumn
            title="RESOURCES"
            links={["Documentation", "API", "Community", "Guides"]}
          />
          <FooterLinkColumn
            title="COMPANY"
            links={["About Us", "Legal", "Careers", "News"]}
          />
        </Frame>
      </Frame>

      <Frame
        override={{
          pt: Space.n8,
          pr: Space.n0,
          pb: Space.n0,
          pl: Space.n0,
          w: Size.full,
        }}
        style={{ borderTop: "1px solid var(--border-color)" }}
        layout={Layout.Row.Header.Default}
        justify="between"
        align="center"
      >
        <Text.Card.Note style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
          © 2024 VisualEngine Inc. All rights reserved.
        </Text.Card.Note>
        <Frame override={{ gap: Space.n6 }} layout={Layout.Row.Actions.Default}>
          <Text.Card.Note
            style={{ fontSize: 13, color: "var(--text-tertiary)" }}
          >
            Privacy Policy
          </Text.Card.Note>
          <Text.Card.Note
            style={{ fontSize: 13, color: "var(--text-tertiary)" }}
          >
            Terms of Service
          </Text.Card.Note>
        </Frame>
      </Frame>
    </Frame>
  );
}

interface FooterLinkColumnProps {
  title: string;
  links: string[];
}

function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <Frame override={{ gap: Space.n4 }}>
      <Text.Card.Note
        style={{
          fontSize: 11,
          letterSpacing: "0.05em",
          fontWeight: "bold",
          color: "var(--text-tertiary)",
        }}
      >
        {title}
      </Text.Card.Note>
      {links.map((link: string) => (
        <Text.Card.Desc
          key={link}
          style={{ fontSize: 15, color: "var(--text-secondary)", opacity: 0.6 }}
        >
          {link}
        </Text.Card.Desc>
      ))}
    </Frame>
  );
}
