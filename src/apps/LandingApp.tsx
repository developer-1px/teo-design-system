import { ArrowRight, Box, Component, Grid, Layers, Zap, Type, Monitor, PanelTop } from "lucide-react";
import { Action } from "../design-system/Action";
import { Experience } from "../design-system/Experience";
import { Frame } from "../design-system/Frame";
import { Prose } from "../design-system/text/Prose";
import { Card } from "../design-system/text/Card";
import { Menu } from "../design-system/text/Menu";

export function LandingApp() {
  return (
    <Experience value="landing">
      <Frame fill surface="base" overflow="auto" p={0}>
        {/* Navigation */}
        <Frame
          row
          justify="between"
          align="center"
          p="5 6"
          position="sticky"
          top={0}
          zIndex={100}
          surface="base"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <Prose.Title variant="sm">TMDK</Prose.Title>
          <Frame row gap={2}>
            <Action label="Documentation" variant="ghost" />
            <Action label="Components" variant="ghost" />
            <Action label="Download" variant="primary" />
          </Frame>
        </Frame>

        {/* Hero Section */}
        <Frame p="30 6" align="center" gap={6}>
          <Frame
            p="1 3"
            surface="sunken"
            rounded="full"
            style={{ border: "1px solid var(--border-color)" }}
            row
            gap={2}
            align="center"
            cursor="pointer"
          >
            <Zap size={12} fill="currentColor" color="var(--text-tertiary)" />
            <Card.Note style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
              New: Layout Engine v2.0
            </Card.Note>
          </Frame>

          <Prose.Title variant="xl" style={{ maxWidth: 800, textAlign: "center" }}>
            Build faster with the Teo's Minimal Design Kit
          </Prose.Title>

          <Prose.Body
            style={{
              maxWidth: 600,
              fontSize: "1.125rem",
              textAlign: "center",
              color: "var(--text-secondary)"
            }}
          >
            A collection of high-quality, accessible, and performant React
            components crafted for modern web applications.
          </Prose.Body>

          <Frame row gap={3} p="8 0 0 0" justify="center">
            {/* Main CTA */}
            <Action variant="primary" rounded="full" p="3 5" gap={2}>
              <Menu.Item style={{ color: "white", fontWeight: 600 }}>Get Started</Menu.Item>
              <ArrowRight size={16} color="white" />
            </Action>

            {/* Secondary CTA */}
            <Action variant="surface" rounded="full" p="3 5" gap={2} border>
              <Menu.Item style={{ color: "var(--text-secondary)", fontWeight: 600 }}>View Components</Menu.Item>
            </Action>
          </Frame>
        </Frame>

        {/* Why Section */}
        <Frame align="center" gap={6} p="24 6">
          <Prose.Title variant="lg" style={{ textAlign: "center" }}>
            왜 만들었는가?
          </Prose.Title>
          <Prose.Body
            style={{
              maxWidth: 800,
              fontSize: "1.25rem",
              textAlign: "center",
              color: "var(--text-secondary)"
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
          </Prose.Body>
        </Frame>

        {/* Features Grid */}
        <Frame p="24 6" gap={12}>
          <Frame gap={4} align="center" p="0 0 8 0">
            <Prose.Title variant="lg">Everything you need</Prose.Title>
            <Prose.Body style={{ color: "var(--text-secondary)" }}>
              Comprehensive primitives for any layout.
            </Prose.Body>
          </Frame>

          <Frame
            grid
            gap={4}
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              maxWidth: 1200,
              margin: "0 auto",
              width: "100%"
            }}
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
          </Frame>
        </Frame>

        {/* Footer */}
        <Frame p="24 6" gap={4}>
          <Frame h="1px" surface="sunken" w="100%" />
          <Frame row justify="between" p="8 0 0 0" align="center">
            <Card.Note>
              © 2026 Minimal Design Kit. All rights reserved.
            </Card.Note>
            <Frame row gap={4}>
              <Card.Note style={{ cursor: "pointer" }}>Twitter</Card.Note>
              <Card.Note style={{ cursor: "pointer" }}>GitHub</Card.Note>
              <Card.Note style={{ cursor: "pointer" }}>Discord</Card.Note>
            </Frame>
          </Frame>
        </Frame>
      </Frame>
    </Experience>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Frame p={6} surface="sunken  " rounded="2xl" style={{ border: "1px solid var(--border-color)" }} gap={4}>
      <Frame w={8} h={8} surface="base" rounded="xl" pack style={{ border: "1px solid var(--border-color)" }} shadow="sm">
        <Icon size={24} color="var(--text-primary)" />
      </Frame>
      <Frame gap={2}>
        <Card.Title>{title}</Card.Title>
        <Card.Desc>{description}</Card.Desc>
      </Frame>
    </Frame>
  );
}
