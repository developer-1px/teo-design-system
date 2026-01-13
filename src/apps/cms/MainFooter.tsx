import { ArrowUpRight, Globe, MessageSquare, Sparkles } from "lucide-react";
import { Card } from "../../design-system/text/Card";
import { Frame } from "../../design-system/Frame";

export function MainFooter() {
  return (
    <Frame
      w="100%"
      p="64px 24px"
      surface="sunken"
      gap="16px"
      style={{ maxWidth: "1200px", margin: "0 auto" }}
    >
      <Frame row justify="between" align="start" w="100%">
        <Frame gap="6px" w="35%">
          <Frame row gap="3px" align="center">
            <Frame
              style={{ width: 40, height: 40 }}
              rounded="xl"
              surface="primary"
              pack
            >
              <Sparkles size={20} color="#fff" />
            </Frame>
            <Card.Title
              style={{ fontWeight: "bold", fontSize: "20px", letterSpacing: "-0.02em" }}
            >
              VisualEngine
            </Card.Title>
          </Frame>
          <Card.Desc
            style={{ fontSize: "16px", lineHeight: "1.6", opacity: 0.7, color: "var(--text-secondary)" }}
          >
            Building the future of the visual web. Join us in redefining how
            websites are crafted.
          </Card.Desc>
          <Frame row gap="4px">
            <Globe size={20} opacity={0.4} />
            <MessageSquare size={20} opacity={0.4} />
            <ArrowUpRight size={20} opacity={0.4} />
          </Frame>
        </Frame>

        <Frame row gap="16px">
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
        style={{ borderTop: "1px solid var(--border-color)" }}
        p="8px 0 0 0"
        row
        justify="between"
        align="center"
        w="100%"
      >
        <Card.Note style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
          © 2024 VisualEngine Inc. All rights reserved.
        </Card.Note>
        <Frame row gap="6px">
          <Card.Note style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
            Privacy Policy
          </Card.Note>
          <Card.Note style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
            Terms of Service
          </Card.Note>
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
    <Frame gap="4px">
      <Card.Note
        style={{ fontSize: 11, letterSpacing: "0.05em", fontWeight: "bold", color: "var(--text-tertiary)" }}
      >
        {title}
      </Card.Note>
      {links.map((link: string) => (
        <Card.Desc
          key={link}
          style={{ fontSize: 15, color: "var(--text-secondary)", opacity: 0.6 }}
        >
          {link}
        </Card.Desc>
      ))}
    </Frame>
  );
}
