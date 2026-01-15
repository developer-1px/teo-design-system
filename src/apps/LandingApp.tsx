import {
  ArrowRight,
  Component,
  Layers,
  LayoutTemplate,
  MousePointerClick,
  PanelTop,
  PenTool,
  Type,
  Zap,
} from "lucide-react";
import { Action } from "../design-system/Action";
import { Experience } from "../design-system/Experience";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../design-system/Icon";
import { Text } from "../design-system/text/Text";
import { TeoLogo } from "../design-system/TeoLogo";
import {
  IconSize,
  Size,
  Space,
} from "../design-system/token/token.const.1tier";

export function LandingApp() {
  return (
    <Experience value="landing">
      <Frame override={{ p: Space.n0 }} fill surface="base" scroll>
        {/* Navigation */}
        <Frame
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            borderBottom: "1px solid var(--border-subtle)",
          }}
          override={{
            py: Space.n20,
            px: Space.n24,
          }}
          layout={Layout.Row.Header.Sticky}
        >
          <TeoLogo height={24} />
          <Frame
            override={{ gap: Space.n8 }}
            layout={Layout.Row.Actions.Default}
          >
            <Action label="Documentation" variant="ghost" />
            <Action label="Components" variant="ghost" />
            <Action label="Download" variant="primary" />
          </Frame>
        </Frame>

        {/* Hero Section */}
        <Frame
          override={{ py: Space.n128, px: Space.n24, gap: Space.n24 }}
          align="center"
        >
          <Frame
            style={{ border: "1px solid var(--border-color)" }}
            override={{
              py: Space.n4,
              px: Space.n12,
              rounded: "full",
              gap: Space.n8,
              cursor: "pointer",
            }}
            surface="sunken"
            layout={Layout.Row.Item.Tight}
            align="center"
          >
            <Icon
              src={Zap}
              size={IconSize.n12}
              style={{ fill: "currentColor", color: "var(--text-tertiary)" }}
            />
            <Text.Card.Note
              style={{ fontWeight: 600, color: "var(--text-secondary)" }}
            >
              New: Layout Engine v2.0
            </Text.Card.Note>
          </Frame>

          <Text.Prose.Title
            variant="xl"
            style={{ maxWidth: 800, textAlign: "center" }}
          >
            Build faster with the Teo's Minimal Design Kit
          </Text.Prose.Title>

          <Text.Prose.Body
            style={{
              maxWidth: 600,
              fontSize: "1.125rem",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            A collection of high-quality, accessible, and performant React
            components crafted for modern web applications.
          </Text.Prose.Body>

          <Frame
            override={{
              gap: Space.n12,
              pt: Space.n32,
              px: Space.n0,
              pb: Space.n0,
            }}
            layout={Layout.Row.Actions.Center}
          >
            {/* Main CTA */}
            <Action
              variant="primary"
              rounded="full"
              py={Space.n12}
              px={Space.n20}
              gap={Space.n8}
            >
              <Text.Menu.Item style={{ color: "white", fontWeight: 600 }}>
                Get Started
              </Text.Menu.Item>
              <Icon
                src={ArrowRight}
                size={IconSize.n16}
                style={{ color: "white" }}
              />
            </Action>

            {/* Secondary CTA */}
            <Action
              variant="surface"
              rounded="full"
              py={Space.n12}
              px={Space.n20}
              gap={Space.n8}
              border
            >
              <Text.Menu.Item
                style={{ color: "var(--text-secondary)", fontWeight: 600 }}
              >
                View Components
              </Text.Menu.Item>
            </Action>
          </Frame>
        </Frame>

        {/* Why Section */}
        <Frame
          override={{ gap: Space.n24, py: Space.n96, px: Space.n24 }}
          align="center"
        >
          <Text.Prose.Title variant="lg" style={{ textAlign: "center" }}>
            왜 만들었는가?
          </Text.Prose.Title>
          <Text.Prose.Body
            style={{
              maxWidth: 800,
              fontSize: "1.25rem",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            프론트엔드 디자인은 결국 '수렴진화'하고 있으며, 그 최종 형태는
            불필요한 장식이 배제된 채 오직 기능과 의도만이 남는 것이라 믿습니다.{" "}
            <br />
            우리는 복잡한 설정 없이도{" "}
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              Web Application
            </span>
            의 본질을 완벽하게 구현할 수 있는, <br />
            가장 순수하고 효율적인 디자인 도구를 지향합니다. <br />
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              이것이 바로 Minimal Design Kit가 추구하는 방향입니다.
            </span>
          </Text.Prose.Body>
        </Frame>

        {/* Features Grid */}
        <Frame override={{ py: Space.n96, px: Space.n24, gap: Space.n48 }}>
          <Frame
            override={{
              gap: Space.n16,
              pb: Space.n32,
              pt: Space.n0,
              px: Space.n0,
            }}
            align="center"
          >
            <Text.Prose.Title variant="lg">
              Everything you need
            </Text.Prose.Title>
            <Text.Prose.Body style={{ color: "var(--text-secondary)" }}>
              Comprehensive primitives for any layout.
            </Text.Prose.Body>
          </Frame>

          <Frame
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              maxWidth: 1200,
              margin: "0 auto",
              width: "100%",
            }}
            override={{
              gap: Space.n16,
            }}
            grid
          >
            <FeatureCard
              icon={Type}
              title="Text"
              description="Semantic typography system based on 4-level hierarchy: Experience > Context > Slot > Variant."
            />
            <FeatureCard
              icon={Layers}
              title="Surface"
              description="Intelligent layering system (Base, Sunken, Raised, Overlay) that manages depth and hierarchy."
            />
            <FeatureCard
              icon={PanelTop}
              title="Section"
              description="Layout partitioning components that handle content width, spacing, and alignment automatically."
            />
            <FeatureCard
              icon={Component}
              title="Overlay"
              description="Floating context managers for Dialogs, Menus, and Tooltips with z-index discipline."
            />
            <FeatureCard
              icon={Zap}
              title="Experience"
              description="Global context scaler that adapts all child spacing and typography (App, Landing, Document)."
            />
            <FeatureCard
              icon={LayoutTemplate}
              title="Frame"
              description="The universal layout primitive. Flexbox/Grid wrapper with zero-runtime token resolution."
            />
            <FeatureCard
              icon={PenTool}
              title="Field"
              description="Input primitive for forms. Manages labels, values, and notes with semantic precision."
            />
            <FeatureCard
              icon={MousePointerClick}
              title="Action"
              description="Interactive primitive for buttons and links. Handles states, variants, and icon composition."
            />
          </Frame>
        </Frame>

        {/* Footer */}
        <Frame override={{ py: Space.n96, px: Space.n24, gap: Space.n16 }}>
          <Frame
            style={{ height: "1px" }}
            override={{ w: Size.full }}
            surface="sunken"
          />
          <Frame
            override={{ pt: Space.n32, pb: Space.n0, px: Space.n0 }}
            layout={Layout.Row.Header.Default}
          >
            <Text.Card.Note>
              © 2026 Minimal Design Kit. All rights reserved.
            </Text.Card.Note>
            <Frame
              override={{ gap: Space.n16 }}
              layout={Layout.Row.Actions.Default}
            >
              <Text.Card.Note style={{ cursor: "pointer" }}>
                Twitter
              </Text.Card.Note>
              <Text.Card.Note style={{ cursor: "pointer" }}>
                GitHub
              </Text.Card.Note>
              <Text.Card.Note style={{ cursor: "pointer" }}>
                Discord
              </Text.Card.Note>
            </Frame>
          </Frame>
        </Frame>
      </Frame>
    </Experience>
  );
}

function FeatureCard({
  icon: IconSrc,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Frame
      style={{ border: "1px solid var(--border-color)" }}
      override={{
        p: Space.n24,
        rounded: "2xl",
        gap: Space.n16,
      }}
      surface="sunken"
    >
      <Frame
        style={{ border: "1px solid var(--border-color)" }}
        override={{
          w: Size.n40,
          h: Size.n40,
          p: Space.n8,
          rounded: "xl",
          shadow: "sm",
        }}
        surface="base"
        pack
      >
        <Icon
          src={IconSrc}
          size={IconSize.n24}
          style={{ color: "var(--text-primary)" }}
        />
      </Frame>
      <Frame override={{ gap: Space.n8 }}>
        <Text.Card.Title>{title}</Text.Card.Title>
        <Text.Card.Desc>{description}</Text.Card.Desc>
      </Frame>
    </Frame>
  );
}
