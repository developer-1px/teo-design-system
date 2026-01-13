import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame";
import { Prose, ProseDocument } from "../../design-system/Prose";
import { Text } from "../../design-system/Text";
import { Cpu, Globe, Shield, Zap } from "lucide-react";

export function ImageFooterBanner() {
    return (
        <Frame w="100%" p="96 24" surface="base" border="bottom">
            <Frame
                w="100%"
                h={500}
                rounded="3xl"
                overflow="hidden"
                position="relative"
                pack
                style={{ background: "linear-gradient(225deg, #1a1a1a, #000)" }}
            >
                {/* Visual texture */}
                <Frame
                    position="absolute"
                    fill
                    style={{
                        opacity: 0.1,
                        backgroundImage:
                            "radial-gradient(circle at center, #fff 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />

                <ProseDocument maxWidth={640} gap={6} align="center" zIndex={10}>
                    <Prose
                        color="white"
                        role="h2"
                        align="center"
                    >
                        Ready to elevate <br /> your web presence?
                    </Prose>
                    <Prose
                        color="white"
                        role="body"
                        align="center"
                        style={{ opacity: 0.6 }}
                    >
                        Join 2,000+ companies building high-performance marketing sites with
                        our Visual Engine.
                    </Prose>
                    <Frame row gap={4}>
                        <Action
                            label="Start for Free"
                            variant="primary"
                            size="lg"
                            glow
                            h={56}
                            p="0 8"
                            rounded="full"
                        />
                        <Action
                            label="Browse Templates"
                            variant="surface"
                            size="lg"
                            h={56}
                            p="0 8"
                            rounded="full"
                        />
                    </Frame>
                </ProseDocument>
            </Frame>

            {/* Partner Logos */}
            <Frame p="12 0 0 0" gap={6} align="center">
                <Text size={12} weight="bold" color="tertiary" opacity={0.5}>
                    TRUSTED WORLDWIDE
                </Text>
                <Frame row gap={12} justify="center" opacity={0.3} wrap="wrap">
                    <Frame row gap={2} align="center">
                        <Zap size={24} />
                        <Text size={24} weight="bold">
                            Bolt
                        </Text>
                    </Frame>
                    <Frame row gap={2} align="center">
                        <Globe size={24} />
                        <Text size={24} weight="bold">
                            Stripe
                        </Text>
                    </Frame>
                    <Frame row gap={2} align="center">
                        <Shield size={24} />
                        <Text size={24} weight="bold">
                            Linear
                        </Text>
                    </Frame>
                    <Frame row gap={2} align="center">
                        <Cpu size={24} />
                        <Text size={24} weight="bold">
                            Vercel
                        </Text>
                    </Frame>
                </Frame>
            </Frame>
        </Frame>
    );
}
