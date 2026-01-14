import { Cpu, MessageSquare, Shield, Zap } from "lucide-react";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";
import { EditableWrapper } from "./EditableWrapper";

export function FeatureGridSection() {
  return (
    <Frame
      w="100%"
      p="24px 6px"
      gap={4}
      surface="base"
      style={{ borderBottom: "1px solid var(--border-color)", maxWidth: 1280, margin: "0 auto" }}
    >
      <Frame style={{ maxWidth: 800, margin: "0 auto" }} gap={1} align="center">
        <Text.Card.Note
          style={{
            fontWeight: "bold",
            color: "var(--text-primary)",
            letterSpacing: "0.05em",
            fontSize: "12px"
          }}
        >
          FEATURES
        </Text.Card.Note>
        <EditableWrapper>
          <Text.Prose.Title variant="md">
            Everything you need <br /> to scale.
          </Text.Prose.Title>
        </EditableWrapper>
      </Frame>

      <Frame gap={4} w="100%">
        {/* Row 1 */}
        <Frame row gap={4} wrap="wrap">
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
        <Frame row gap={4}>
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
    </Frame>
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
    <Frame flex={flex} p={6} surface="raised" rounded="2xl" gap={4}>
      <Frame w={48} h={48} rounded="xl" surface="sunken" style={{ border: "1px solid var(--border-color)" }} pack>
        <Icon size={24} color="var(--color-primary)" />
      </Frame>
      <Frame gap={2}>
        <EditableWrapper>
          <Text.Card.Title>{title}</Text.Card.Title>
        </EditableWrapper>
        <EditableWrapper>
          <Text.Card.Desc style={{ color: "var(--text-secondary)" }}>
            {desc}
          </Text.Card.Desc>
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
      surface="raised"
      rounded="2xl"
      overflow="hidden"
      row
    >
      <Frame flex p={6} gap={4} justify="center">
        <Frame w={12} h={12} rounded="xl" surface="sunken" style={{ border: "1px solid var(--border-color)" }} pack>
          <Icon size={24} color="var(--color-primary)" />
        </Frame>
        <Frame gap={2}>
          <EditableWrapper>
            <Text.Card.Title>{title}</Text.Card.Title>
          </EditableWrapper>
          <EditableWrapper>
            <Text.Card.Desc style={{ color: "var(--text-secondary)" }}>
              {desc}
            </Text.Card.Desc>
          </EditableWrapper>
        </Frame>
      </Frame>
      {image && (
        <Frame
          w="40%"
          surface="raised"
          style={{
            background:
              "linear-gradient(45deg, var(--surface-sunken), var(--surface-overlay))",
          }}
          pack
        >
          <Frame w={30} h={40} surface="base" rounded="lg" shadow="xl" style={{ border: "1px solid var(--border-color)" }} />
        </Frame>
      )}
    </Frame>
  );
}
