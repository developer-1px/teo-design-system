import { ArrowRight, Box, Component, Grid, Layers, Zap } from "lucide-react";
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame";
import { Prose, ProseDocument, ProseSection } from "../design-system/Prose";
import { Text } from "../design-system/Text";

export function LandingApp() {
    return (
        <Frame fill surface="base" overflow="auto">
            {/* Navigation */}
            <Frame
                row
                justify="between"
                align="center"
                p="24 40"
                position="sticky"
                top={0}
                zIndex={100}
                style={{
                    backdropFilter: "blur(12px)",
                    background: "rgba(255,255,255,0.7)",
                    borderBottom: "1px solid var(--border-subtle)",
                }}
            >
                <Prose role="h4">MDK</Prose>
                <Frame row gap={2}>
                    <Action label="Documentation" variant="ghost" />
                    <Action label="Components" variant="ghost" />
                    <Action label="Download" variant="primary" />
                </Frame>
            </Frame>

            {/* Main Content wrapped in ProseDocument */}
            <ProseDocument maxWidth="1200px" gap={0}>
                {/* Hero Section */}
                <ProseSection p="120 24" align="center" contentGap={6}>
                    <Frame
                        p="1 3"
                        surface="sunken"
                        rounded="full"
                        border
                        row
                        gap={2}
                        align="center"
                        cursor="pointer"
                    >
                        <Zap size={12} fill="currentColor" color="var(--text-tertiary)" />
                        <Prose role="caption" style={{ fontWeight: 600 }}>
                            New: Layout Engine v2.0
                        </Prose>
                    </Frame>

                    <Prose role="h1" align="center" style={{ maxWidth: 800 }}>
                        Build faster with the Minimal Design Kit
                    </Prose>

                    <Prose
                        role="body"
                        align="center"
                        color="secondary"
                        style={{ maxWidth: 600, fontSize: "1.125rem", lineHeight: "1.75rem" }}
                    >
                        A collection of high-quality, accessible, and performant React components
                        crafted for modern web applications.
                    </Prose>

                    <Frame row gap={3} p="4 0 0 0">
                        {/* Main CTA */}
                        <Action variant="primary" rounded="full" p="3 5" gap={2}>
                            <Text variant={3} weight="bold" style={{ color: "white" }}>
                                Get Started
                            </Text>
                            <ArrowRight size={16} color="white" />
                        </Action>

                        {/* Secondary CTA */}
                        <Action variant="surface" rounded="full" p="3 5" gap={2} border>
                            <Text variant={3} weight="bold" color="secondary">
                                View Components
                            </Text>
                        </Action>
                    </Frame>
                </ProseSection>

                {/* Why Section */}
                <ProseSection align="center" contentGap={6}>
                    <Prose role="h2" align="center">
                        왜 만들었는가?
                    </Prose>
                    <Prose
                        role="body"
                        align="center"
                        color="secondary"
                        style={{ fontSize: "1.25rem", lineHeight: "1.8" }}
                    >
                        프론트엔드 디자인은 결국 '수렴진화'하고 있으며, 그 최종 형태는 불필요한 장식이 배제된 채 오직 기능과 의도만이 남는 것이라 믿습니다. <br />
                        우리는 복잡한 설정 없이도 <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Web Application</span>의 본질을 완벽하게 구현할 수 있는, <br />
                        가장 순수하고 효율적인 디자인 도구를 지향합니다. <br />
                        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                            이것이 바로 Minimal Design Kit가 추구하는 방향입니다.
                        </span>
                    </Prose>
                </ProseSection>

                {/* Features Grid */}
                <ProseSection p="96 24" contentGap={12}>
                    <Frame gap={4} align="center" p="0 0 8 0">
                        <Prose role="h2">Everything you need</Prose>
                        <Prose role="body" color="secondary">
                            Comprehensive primitives for any layout.
                        </Prose>
                    </Frame>

                    <Frame
                        grid
                        gap={4}
                        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
                    >
                        <FeatureCard
                            icon={Box}
                            title="Atomic Components"
                            description="Button, Input, Checkbox, and more. All the basics covered with strict type safety."
                        />
                        <FeatureCard
                            icon={Layers}
                            title="Layout Engine"
                            description="Powerful Frame component for Flexbox and Grid layouts without writing CSS."
                        />
                        <FeatureCard
                            icon={Grid}
                            title="Design Tokens"
                            description="Consistent spacing, typography, and colors via our IDDL token system."
                        />
                        <FeatureCard
                            icon={Component}
                            title="React Ready"
                            description="Built with React best practices, ready to drop into your Vite or Next.js app."
                        />
                    </Frame>
                </ProseSection>

                {/* Footer */}
                <ProseSection p="96 24" contentGap={4}>
                    <Frame h={1} surface="sunken" w="100%" />
                    <Frame row justify="between" p="8 0 0 0" align="center">
                        <Prose role="caption" color="tertiary">
                            © 2026 Minimal Design Kit. All rights reserved.
                        </Prose>
                        <Frame row gap={4}>
                            <Prose
                                role="caption"
                                color="secondary"
                                style={{ textDecoration: "none", cursor: "pointer" }}
                            >
                                Twitter
                            </Prose>
                            <Prose
                                role="caption"
                                color="secondary"
                                style={{ textDecoration: "none", cursor: "pointer" }}
                            >
                                GitHub
                            </Prose>
                            <Prose
                                role="caption"
                                color="secondary"
                                style={{ textDecoration: "none", cursor: "pointer" }}
                            >
                                Discord
                            </Prose>
                        </Frame>
                    </Frame>
                </ProseSection>
            </ProseDocument>
        </Frame>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    description,
}: { icon: any; title: string; description: string }) {
    return (
        <Frame
            p={6}
            surface="raised"
            rounded="2xl"
            border
            gap={4}
        >
            <Frame
                w={48}
                h={48}
                surface="base"
                rounded="xl"
                pack
                border
                shadow="sm"
            >
                <Icon size={24} color="var(--text-primary)" />
            </Frame>
            <Frame gap={2}>
                <Prose role="h3" style={{ fontSize: "1.1rem" }}>
                    {title}
                </Prose>
                <Prose role="body-sm" color="secondary">
                    {description}
                </Prose>
            </Frame>
        </Frame>
    );
}
