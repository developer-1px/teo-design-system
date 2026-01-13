import { Check, MessageSquare, Zap } from "lucide-react";
import { Frame } from "../../design-system/Frame";
import { Prose, ProseSection } from "../../design-system/Prose";
import { Text } from "../../design-system/Text";

export function BodyContentSection() {
    return (
        <ProseSection
            w="100%"
            p="96 24"
            surface="sunken"
            border="bottom"
            maxWidth="100%"
        >
            <Frame
                row
                gap={24}
                align="center"
                w="100%"
                maxWidth={1200}
                style={{ margin: "0 auto" }}
            >
                <Frame w="50%" gap={8}>
                    <Frame gap={4}>
                        <Text size={14} weight="bold" color="primary">
                            THE PROCESS
                        </Text>
                        <Prose role="h2">
                            Unleash your <br /> internal creative.
                        </Prose>
                    </Frame>
                    <Prose role="body" color="secondary">
                        Workflow shouldn't be a bottleneck. Our platform allows developers to
                        focus on logic while designers handle the visuals.
                    </Prose>
                    <Frame gap={4}>
                        <CheckItem
                            title="Pure Token-based design"
                            desc="Align with your existing CSS/Tailwind system effortlessly."
                        />
                        <CheckItem
                            title="Developer-friendly export"
                            desc="Export clean React, Vue, or HTML code at any time."
                        />
                        <CheckItem
                            title="Real-time collaboration"
                            desc="Work with your team in the same canvas simultaneously."
                        />
                    </Frame>
                </Frame>
                <Frame flex pack>
                    <Frame
                        w={400}
                        h={500}
                        surface="raised"
                        rounded="3xl"
                        shadow="2xl"
                        border
                        style={{ position: "relative" }}
                    >
                        <Frame
                            position="absolute"
                            top={40}
                            left={-40}
                            w={180}
                            h={180}
                            surface="base"
                            rounded="2xl"
                            shadow="lg"
                            border
                            p={6}
                            gap={4}
                        >
                            <Zap size={32} color="var(--color-warning)" />
                            <Frame gap={2}>
                                <Frame h={10} w="100%" surface="overlay" rounded="full" />
                                <Frame h={10} w="60%" surface="overlay" rounded="full" />
                            </Frame>
                        </Frame>
                        <Frame
                            position="absolute"
                            bottom={40}
                            right={-40}
                            w={220}
                            h={220}
                            surface="base"
                            rounded="2xl"
                            shadow="lg"
                            border
                            p={6}
                            gap={4}
                        >
                            <MessageSquare size={32} color="var(--color-primary)" />
                            <Frame gap={2}>
                                <Frame row gap={2} align="center">
                                    <Frame w={24} h={24} rounded="full" surface="overlay" />
                                    <Frame h={8} w={100} surface="overlay" rounded="full" />
                                </Frame>
                                <Frame h={8} w="100%" surface="raised" rounded="full" />
                            </Frame>
                        </Frame>
                    </Frame>
                </Frame>
            </Frame>
        </ProseSection>
    );
}

interface CheckItemProps {
    title: string;
    desc: string;
}

function CheckItem({ title, desc }: CheckItemProps) {
    return (
        <Frame row gap={4} align="start">
            <Frame
                w={24}
                h={24}
                rounded="full"
                surface="primary"
                pack
                style={{ marginTop: 2 }}
            >
                <Check size={14} color="#fff" />
            </Frame>
            <Frame gap={1}>
                <Text weight="bold" size={16}>
                    {title}
                </Text>
                <Text size={14} color="secondary" opacity={0.7}>
                    {desc}
                </Text>
            </Frame>
        </Frame>
    );
}
