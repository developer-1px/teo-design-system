import { ArrowUpRight, Globe, MessageSquare, Sparkles } from "lucide-react";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";

export function MainFooter() {
  return (
    <Frame
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
      override={{ w: Size.fill }}
      surface="sunken"
    >
      <Frame
        override={{
          w: Size.fill,
          py: Space.n96,
          px: Space.n24,
          gap: Space.n48,
        }}
        style={
          {
            maxWidth: "var(--container-n1280)",
            margin: "0 auto",
          } as React.CSSProperties
        }
      >
        <Frame
          layout={Layout.Row.Middle.Between}
          spacing={Space.n8}
          override={{ w: Size.fill }}
        >
          <Frame
            override={{ gap: Space.n24 }}
            style={{ width: "35%" } as React.CSSProperties}
          >
            <Frame
              layout={Layout.Row.Middle.Center}
              spacing={Space.n8}
              override={{ gap: Space.n12, minHeight: Size.n32 }}
            >
              <Frame
                override={{
                  w: Size.n40,
                  h: Size.n40,
                  r: Radius2.xl,
                  pack: true,
                }}
                surface="primary"
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
              layout={Layout.Row.Middle.End}
              spacing={Space.n8}
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
            layout={Layout.Row.Middle.End}
            spacing={Space.n8}
            override={{ gap: Space.n48, align: "start" }}
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
          layout={Layout.Row.Middle.Center}
          spacing={Space.n12}
          h={Size.n44}
          override={{
            pt: Space.n32,
            w: Size.fill,
            justify: "between",
            border: true,
          }}
        >
          <Text.Card.Note
            size={FontSize.n13}
            style={{ color: "var(--text-tertiary)" }}
          >
            © 2024 VisualEngine Inc. All rights reserved.
          </Text.Card.Note>
          <Frame
            override={{ gap: Space.n16 }}
            layout={Layout.Row.Middle.End}
            spacing={Space.n8}
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
    <Frame layout={Layout.Col.Left.Start} spacing={Space.n12}>
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
