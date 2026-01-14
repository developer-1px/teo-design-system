import { Cpu, MessageSquare, Shield, Zap } from "lucide-react";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";
import { Space } from "../../design-system/token/token.const.1tier";
import { EditableWrapper } from "./EditableWrapper";
import { Icon } from "../../design-system/Icon";
import { IconSize, Size } from "../../design-system/token/token.const.1tier";

export function FeatureGridSection() {
  return (
    <Frame
      override={{
        w: Size.full,
        py: Space.n24,
        px: Space.n6,
        gap: Space.n16,
        style: {
          borderBottom: "1px solid var(--border-color)",
          maxWidth: 1280,
          margin: "0 auto",
        },
      }}
      surface="base"
    >
      <Frame
        override={{ style: { maxWidth: 800, margin: "0 auto" }, gap: Space.n4 }}
        align="center"
      >
        <Text.Card.Note
          style={{
            fontWeight: "bold",
            color: "var(--text-primary)",
            letterSpacing: "0.05em",
            fontSize: "12px",
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

      <Frame override={{ gap: Space.n16, w: Size.full }}>
        {/* Row 1 */}
        <Frame override={{ gap: Space.n16 }} row wrap="wrap">
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
        <Frame override={{ gap: Space.n16 }} row>
          <Frame override={{ style: { gridColumn: "span 2" } }}>
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
  icon: IconSrc,
  title,
  desc,
  flex,
}: FeatureCardSmallProps) {
  return (
    <Frame
      override={{ p: Space.n24, rounded: "2xl", gap: Space.n16 }}
      flex={flex}
      surface="raised"
    >
      <Frame
        override={{
          w: Size.n48,
          h: Size.n48,
          rounded: "xl",
          style: { border: "1px solid var(--border-color)" },
        }}
        surface="sunken"
        pack
      >
        <Icon src={IconSrc} size={IconSize.n24} style={{ color: "var(--color-primary)" }} />
      </Frame>
      <Frame override={{ gap: Space.n8 }}>
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
  icon: IconSrc,
  title,
  desc,
  flex,
  image,
}: FeatureCardLargeProps) {
  return (
    <Frame
      override={{ rounded: "2xl" }}
      flex={flex}
      surface="raised"
      overflow="hidden"
      row
    >
      <Frame override={{ p: Space.n24, gap: Space.n16 }} flex justify="center">
        <Frame
          override={{
            w: Size.n12,
            h: Size.n12,
            rounded: "xl",
            style: { border: "1px solid var(--border-color)" },
          }}
          surface="sunken"
          pack
        >
          <Icon src={IconSrc} size={IconSize.n24} style={{ color: "var(--color-primary)" }} />
        </Frame>
        <Frame override={{ gap: Space.n8 }}>
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
          override={{
            style: {
              width: "40%",
              background:
                "linear-gradient(45deg, var(--surface-sunken), var(--surface-overlay))",
            },
          }}
          surface="raised"
          pack
        >
          <Frame
            override={{
              w: Size.n32,
              h: Size.n40,
              rounded: "lg",
              shadow: "xl",
              style: { border: "1px solid var(--border-color)" },
            }}
            surface="base"
          />
        </Frame>
      )}
    </Frame>
  );
}
