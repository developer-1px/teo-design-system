import { ArrowUpRight, Command, Sparkles } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame";
import { Prose, ProseSection } from "../../design-system/Prose";
import { Text } from "../../design-system/Text";
import { EditableWrapper } from "./EditableWrapper";

export function HeaderHero() {
    return (
        <ProseSection
            w="100%"
            p="84 24"
            contentGap={12}
            surface="base"
            style={{ minHeight: "90vh", position: "relative", overflow: "hidden" }}
            maxWidth={1200}
        >
            {/* Background Decoration */}
            <Frame
                position="absolute"
                top={-100}
                right={-100}
                w={400}
                h={400}
                rounded="full"
                style={{
                    background: "var(--color-primary)",
                    filter: "blur(150px)",
                    opacity: 0.1,
                }}
            />
            <Frame
                position="absolute"
                bottom={-100}
                left={-100}
                w={400}
                h={400}
                rounded="full"
                style={{
                    background: "var(--color-warning)",
                    filter: "blur(150px)",
                    opacity: 0.15,
                }}
            />

            <Frame
                w="100%"
                maxWidth={800}
                style={{ margin: "0 auto" }}
                gap={6}
                align="center"
            >
                <Frame
                    p="1 3"
                    rounded="full"
                    surface="raised"
                    border
                    row
                    gap={2}
                    align="center"
                    align="center"
                >
                    <Sparkles size={12} color="var(--color-primary)" />
                    <Text
                        size={12}
                        weight="bold"
                        color="secondary"
                        style={{ letterSpacing: "0.02em" }}
                    >
                        NEXT GENERATION CMS IS HERE
                    </Text>
                </Frame>

                <EditableWrapper style={{ width: "100%" }}>
                    <Prose role="h1" align="center">
                        Build your dream site <br />
                        <span style={{ color: "var(--color-primary)" }}>
                            pixel by pixel.
                        </span>
                    </Prose>
                </EditableWrapper>

                <EditableWrapper style={{ maxWidth: 600 }}>
                    <Prose
                        role="body"
                        color="secondary"
                        align="center"
                        style={{ opacity: 0.8 }}
                    >
                        The visual engine for creators who demand perfection. No code, no
                        constraints, just pure creativity.
                    </Prose>
                </EditableWrapper>

                <Frame row gap={4} p={4}>
                    <Action
                        label="Start Creating"
                        variant="primary"
                        size="lg"
                        glow
                        h={56}
                        rounded="full"
                    >
                        <ArrowUpRight size={20} />
                    </Action>
                    <Action
                        label="Talk to Sales"
                        variant="surface"
                        size="lg"
                        h={56}
                        p="0 8"
                        rounded="full"
                    />
                </Frame>
            </Frame>

            {/* Hero Visual: Mockup UI */}
            <Frame
                w="100%"
                maxWidth={1000}
                h={500}
                surface="sunken"
                rounded="2xl"
                border
                shadow="2xl"
                style={{
                    position: "relative",
                    marginTop: 80,
                    transform: "perspective(1000px) rotateX(5deg)",
                    margin: "80px auto 0",
                }}
                overflow="hidden"
            >
                <Frame
                    h={40}
                    surface="raised"
                    border="bottom"
                    row
                    align="center"
                    p="0 4"
                    gap={1.5}
                >
                    <Frame w={10} h={10} rounded="full" surface="overlay" />
                    <Frame w={10} h={10} rounded="full" surface="overlay" />
                    <Frame w={10} h={10} rounded="full" surface="overlay" />
                    <Frame flex />
                    <Command size={14} opacity={0.3} />
                </Frame>
                <Frame row fill justify="start">
                    <Frame w={200} border="right" surface="sunken" p={4} gap={4}>
                        <Frame h={12} w="80%" surface="overlay" rounded="full" />
                        <Frame h={12} w="60%" surface="overlay" rounded="full" />
                        <Frame flex />
                        <Frame h={40} w="100%" surface="overlay" rounded="lg" />
                    </Frame>
                    <Frame flex surface="base" p={12} gap={6} pack>
                        <Frame
                            w={80}
                            h={80}
                            rounded="2xl"
                            surface="raised"
                            shadow="lg"
                            border
                            pack
                        >
                            <Sparkles size={32} color="var(--color-primary)" />
                        </Frame>
                        <Frame gap={2} align="center">
                            <Frame h={20} w={200} surface="overlay" rounded="full" />
                            <Frame h={12} w={300} surface="raised" rounded="full" />
                        </Frame>
                    </Frame>
                </Frame>
            </Frame>
        </ProseSection>
    );
}
