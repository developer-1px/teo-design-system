import { Cpu, MessageSquare, Shield, Zap } from "lucide-react";
import { Frame } from "../../design-system/Frame";
import { Prose, ProseDocument, ProseSection } from "../../design-system/Prose";
import { Text } from "../../design-system/Text";
import { EditableWrapper } from "./EditableWrapper";

export function FeatureGridSection() {
    return (
        <ProseSection
            w="100%"
            p="96 24"
            contentGap={16}
            surface="base"
            border="bottom"
            maxWidth={1200}
        >
            <ProseDocument maxWidth={640} gap={3} align="center">
                <Text
                    size={12}
                    weight="bold"
                    color="primary"
                    style={{ letterSpacing: "0.05em" }}
                >
                    FEATURES
                </Text>
                <EditableWrapper>
                    <Prose role="h2">
                        Everything you need <br /> to scale.
                    </Prose>
                </EditableWrapper>
            </ProseDocument>

            <Frame gap={16} w="100%">
                {/* Row 1 */}
                <Frame row gap={16} wrap="wrap">
                    <FeatureCardLarge
                        icon={Zap}
                        title="Lightning Fast"
                        desc="Optimized for speed with zero-runtime overhead."
                        flex={2}
                        image
                    />
                    <FeatureCardSmall
                        icon={MessageSquare}
                        title="Real-time Comments"
                        desc="Collaborate with your team directly on the canvas."
                        flex={1}
                    />
                </Frame>

                {/* Row 2 */}
                <Frame row gap={16}>
                    <Frame style={{ gridColumn: "span 2" }}>
                        <FeatureCardLarge
                            icon={Shield}
                            title="Enterprise Security"
                            desc="Built for teams that demand safety and role-based access control."
                            flex={1}
                        />
                    </Frame>
                    <FeatureCardSmall
                        icon={Cpu}
                        title="AI Automation"
                        desc="Let AI generate layouts."
                    />
                </Frame>
            </Frame>
        </ProseSection>
    );
}

interface FeatureCardSmallProps {
    icon: React.ElementType;
    title: string;
    desc: string;
    flex?: number;
}

function FeatureCardSmall({
    icon: Icon,
    title,
    desc,
    flex,
}: FeatureCardSmallProps) {
    return (
        <Frame
            flex={flex}
            p={6}
            surface="base"
            rounded="2xl"
            border
            gap={4}
        >
            <Frame w={48} h={48} rounded="xl" surface="sunken" border pack>
                <Icon size={24} color="var(--color-primary)" />
            </Frame>
            <Frame gap={2}>
                <EditableWrapper>
                    <Prose role="h4">
                        {title}
                    </Prose>
                </EditableWrapper>
                <EditableWrapper>
                    <Prose role="body-sm" color="secondary">
                        {desc}
                    </Prose>
                </EditableWrapper>
            </Frame>
        </Frame>
    );
}

interface FeatureCardLargeProps extends FeatureCardSmallProps {
    image?: boolean;
}

function FeatureCardLarge({
    icon: Icon,
    title,
    desc,
    flex,
    image,
}: FeatureCardLargeProps) {
    return (
        <Frame
            flex={flex}
            surface="base"
            rounded="2xl"
            border
            overflow="hidden"
            row
        >
            <Frame flex p={6} gap={4} justify="center">
                <Frame w={48} h={48} rounded="xl" surface="sunken" border pack>
                    <Icon size={24} color="var(--color-primary)" />
                </Frame>
                <Frame gap={2}>
                    <EditableWrapper>
                        <Prose role="h3">
                            {title}
                        </Prose>
                    </EditableWrapper>
                    <EditableWrapper>
                        <Prose role="body" color="secondary">
                            {desc}
                        </Prose>
                    </EditableWrapper>
                </Frame>
            </Frame>
            {image && (
                <Frame
                    w="40%"
                    surface="raised"
                    border="left"
                    style={{
                        background:
                            "linear-gradient(45deg, var(--surface-sunken), var(--surface-overlay))",
                    }}
                    pack
                >
                    <Frame w={120} h={160} surface="base" rounded="lg" shadow="xl" border />
                </Frame>
            )}
        </Frame>
    );
}
