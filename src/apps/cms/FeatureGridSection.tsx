import { Cpu, MessageSquare, Shield, Zap } from "lucide-react";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
import { EditableWrapper } from "./EditableWrapper";

export function FeatureGridSection() {
  return (
    <Frame
      override={{ w: Size.full }}
      style={{ borderBottom: "1px solid var(--border-color)" }}
      surface="base"
    >
      <Frame
        override={{
          w: Size.full,
          py: Space.n96,
          px: Space.n24,
          gap: Space.n48,
        }}
        style={{ maxWidth: "var(--container-n1280)" }}
      >
        <Frame
          style={{ maxWidth: "var(--container-n800)" }}
          override={{ gap: Space.n12, align: "center" }}
        >
          <Text.Card.Note
            size={FontSize.n12}
            weight="bold"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "0.05em",
            }}
          >
            FEATURES
          </Text.Card.Note>
          <EditableWrapper>
            <Text.Prose.Title variant="md" style={{ textAlign: "center" }}>
              Everything you need <br /> to scale.
            </Text.Prose.Title>
          </EditableWrapper>
        </Frame>

        <Frame override={{ gap: Space.n16, w: Size.full }}>
          {/* Row 1 */}
          <Frame
            override={{ gap: Space.n16 }}
            layout={Layout.Row.Item.Default}
            wrap
          >
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
          <Frame
            override={{ gap: Space.n16 }}
            layout={Layout.Row.Item.Default}
            wrap
          >
            <FeatureCardLarge
              icon={Shield}
              title="Enterprise Security"
              desc="Built for teams that demand safety and role-based access control."
              flex={1}
            />
            <FeatureCardSmall
              icon={Cpu}
              title="AI Automation"
              desc="Let AI generate layouts for you instantly."
              flex={1}
            />
          </Frame>
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
      override={{ p: Space.n32, gap: Space.n24 }}
      rounded={Radius2["2xl"]}
      flex={flex}
      surface="raised"
    >
      <Frame
        override={{ w: Size.n48, h: Size.n48 }}
        rounded={Radius2.xl}
        style={{ border: "1px solid var(--border-color)" }}
        surface="sunken"
        pack
      >
        <Icon
          src={IconSrc}
          size={IconSize.n24}
          style={{ color: "var(--color-primary)" }}
        />
      </Frame>
      <Frame override={{ gap: Space.n8 }}>
        <EditableWrapper>
          <Text.Card.Title size={FontSize.n18} weight="bold">
            {title}
          </Text.Card.Title>
        </EditableWrapper>
        <EditableWrapper>
          <Text.Card.Desc
            size={FontSize.n14}
            style={{ color: "var(--text-secondary)" }}
          >
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
      rounded={Radius2["2xl"]}
      flex={flex}
      surface="raised"
      clip
      layout={Layout.Row.Item.Default}
    >
      <Frame
        override={{ p: Space.n32, gap: Space.n24, justify: "center" }}
        flex
      >
        <Frame
          override={{ w: Size.n48, h: Size.n48 }}
          rounded={Radius2.xl}
          style={{ border: "1px solid var(--border-color)" }}
          surface="sunken"
          pack
        >
          <Icon
            src={IconSrc}
            size={IconSize.n24}
            style={{ color: "var(--color-primary)" }}
          />
        </Frame>
        <Frame override={{ gap: Space.n8 }}>
          <EditableWrapper>
            <Text.Card.Title size={FontSize.n18} weight="bold">
              {title}
            </Text.Card.Title>
          </EditableWrapper>
          <EditableWrapper>
            <Text.Card.Desc
              size={FontSize.n14}
              style={{ color: "var(--text-secondary)" }}
            >
              {desc}
            </Text.Card.Desc>
          </EditableWrapper>
        </Frame>
      </Frame>
      {image && (
        <Frame
          style={{
            width: "40%",
            background:
              "linear-gradient(45deg, var(--surface-sunken), var(--surface-overlay))",
          }}
          surface="raised"
          pack
        >
          <Frame
            override={{ w: Size.n128, h: Size.n160, shadow: "xl" }}
            rounded={Radius2.lg}
            style={{ border: "1px solid var(--border-color)" }}
            surface="base"
          />
        </Frame>
      )}
    </Frame>
  );
}
