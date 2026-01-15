import { ArrowUpRight, Globe, MessageSquare, Sparkles } from "lucide-react";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text";
import { FontSize, IconSize, Size, Space } from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";

export function MainFooter() {
  return (
    <Frame override={{ w: Size.full }} surface="sunken">
      <Frame
        override={{
          w: Size.full,
          py: Space.n96,
          px: Space.n24,
          gap: Space.n48,
        }}
        style={{
          maxWidth: "var(--container-n1280)",
          margin: "0 auto",
        }}
      >
        <Frame
          override={{ w: Size.full }}
          layout={Layout.Row.Header.Default}
          justify="between"
          align="start"
        >
          <Frame override={{ gap: Space.n24 }} style={{ width: "35%" }}>
            <Frame
              override={{ gap: Space.n12 }}
              layout={Layout.Row.Item.Tight}
              align="center"
            >
              <Frame
                override={{ w: Size.n40, h: Size.n40}} rounded={Radius2.xl}
                surface="primary"
                pack
              >
                <Icon
                  src={Sparkles}
                  size={IconSize.n20}
                  style={{ color: "white" }}
                />
              </Frame>
              <Text.Card.Title
                size={FontSize.n20}
                weight="bold"
                style={{ letterSpacing: "-0.02em" }}
              >
                VisualEngine
              </Text.Card.Title>
            </Frame>
            <Text.Card.Desc
              size={FontSize.n16}
              style={{
                lineHeight: "1.6",
                opacity: 0.7,
                color: "var(--text-secondary)",
              }}
            >
              Building the future of the visual web. Join us in redefining how
              websites are crafted.
            </Text.Card.Desc>
            <Frame
              override={{ gap: Space.n16 }}
              layout={Layout.Row.Actions.Default}
            >
              <Icon src={Globe} size={IconSize.n20} style={{ opacity: 0.4 }} />
              <Icon
                src={MessageSquare}
                size={IconSize.n20}
                style={{ opacity: 0.4 }}
              />
              <Icon
                src={ArrowUpRight}
                size={IconSize.n20}
                style={{ opacity: 0.4 }}
              />
            </Frame>
          </Frame>

          <Frame
            override={{ gap: Space.n48 }}
            layout={Layout.Row.Actions.Default}
            align="start"
          >
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
            pt: Space.n32,
            w: Size.full,
          }}
          style={{ borderTop: "1px solid var(--border-color)" }}
          layout={Layout.Row.Header.Default}
          justify="between"
          align="center"
        >
          <Text.Card.Note
            size={FontSize.n13}
            style={{ color: "var(--text-tertiary)" }}
          >
            © 2024 VisualEngine Inc. All rights reserved.
          </Text.Card.Note>
          <Frame
            override={{ gap: Space.n16 }}
            layout={Layout.Row.Actions.Default}
          >
            <Text.Card.Note
              size={FontSize.n13}
              style={{ color: "var(--text-tertiary)", cursor: "pointer" }}
            >
              Privacy Policy
            </Text.Card.Note>
            <Text.Card.Note
              size={FontSize.n13}
              style={{ color: "var(--text-tertiary)", cursor: "pointer" }}
            >
              Terms of Service
            </Text.Card.Note>
          </Frame>
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
    <Frame override={{ gap: Space.n12 }}>
      <Text.Card.Note
        size={FontSize.n11}
        weight="bold"
        style={{
          letterSpacing: "0.05em",
          color: "var(--text-tertiary)",
        }}
      >
        {title}
      </Text.Card.Note>
      <Frame override={{ gap: Space.n6 }}>
        {links.map((link: string) => (
          <Text.Card.Desc
            key={link}
            size={FontSize.n14}
            style={{
              color: "var(--text-secondary)",
              opacity: 0.6,
              cursor: "pointer",
            }}
          >
            {link}
          </Text.Card.Desc>
        ))}
      </Frame>
    </Frame>
  );
}
