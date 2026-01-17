import { Cpu, MessageSquare, Shield, Zap } from "lucide-react";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text";
import {
  ContainerSize,
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
      override={{ w: Size.fill, border: true }}
      surface="base"
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
    >
      <Frame
        layout={Layout.Col.Center.Start}
        spacing={Space.n0}
        h={Size.fill}
        override={{
          py: Space.n96,
          px: Space.n24,
          gap: Space.n48,
          maxWidth: ContainerSize.n1280,
        }}
      >
        <Frame
          layout={Layout.Col.Center.Start}
          spacing={Space.n16}
          override={{
            maxWidth: ContainerSize.n800,
            gap: Space.n24,
          }}
        >
          <Frame
            surface="sunken"
            rounded={Radius2.full}
            override={{ px: Space.n12, py: Space.n4, border: true }}
            layout={Layout.Row.Middle.Center}
            spacing={Space.n4}
          >
            <Text.Card.Note
              size={FontSize.n12}
              weight="bold"
              style={{
                color: "var(--text-secondary)",
                letterSpacing: "0.05em",
              }}
            >
              POWERFUL FEATURES
            </Text.Card.Note>
          </Frame>

          <EditableWrapper>
            <Text.Prose.Title
              variant="xl"
              style={{ textAlign: "center", letterSpacing: "-0.02em" }}
            >
              Everything you need to <br />
              <span style={{ color: "var(--text-tertiary)" }}>
                scale without limits.
              </span>
            </Text.Prose.Title>
          </EditableWrapper>
        </Frame>

        <Frame override={{ gap: Space.n16, w: Size.fill }}>
          {/* Row 1 */}
          <Frame
            override={{ gap: Space.n16, wrap: true }}
            layout={Layout.Row.Middle.Center}
            spacing={Space.n12}
            minHeight={Size.n40}
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
            override={{ gap: Space.n16, wrap: true }}
            layout={Layout.Row.Middle.Center}
            spacing={Space.n12}
            minHeight={Size.n40}
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
      override={{ p: Space.n24, gap: Space.n24, flex, border: true }}
      rounded={Radius2["2xl"]}
      surface="base" // Cleaner look
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
    >
      <Frame layout={Layout.Row.Middle.Between} spacing={Space.n8}>
        <Frame
          override={{ w: Size.n40, h: Size.n40, pack: true, border: true }}
          rounded={Radius2.lg}
          surface="sunken" // Contrast
        >
          <Icon
            src={IconSrc}
            size={IconSize.n20}
            style={{ color: "var(--text-primary)", opacity: 0.8 }}
          />
        </Frame>
      </Frame>

      <Frame
        layout={Layout.Col.Left.Start}
        spacing={Space.n8}
        override={{ pt: Space.n16 }}
      >
        <EditableWrapper>
          <Text.Card.Title size={FontSize.n16} weight="bold">
            {title}
          </Text.Card.Title>
        </EditableWrapper>
        <EditableWrapper>
          <Text.Card.Desc
            size={FontSize.n14}
            style={{ color: "var(--text-secondary)", lineHeight: "1.5" }}
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
      surface="raised" // Keep raised for importance
      override={{ clip: true, flex, border: true }}
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      minHeight={Size.n40}
    >
      <Frame
        override={{
          p: Space.n32,
          gap: Space.n24,
          justify: "start",
          flex: 1,
          align: "start",
        }}
        layout={Layout.Col.Left.Start}
        spacing={Space.n0}
        w={Size.fill}
        h={Size.fill}
      >
        <Frame
          override={{ w: Size.n40, h: Size.n40, pack: true, border: true }}
          rounded={Radius2.lg}
          surface="sunken"
        >
          <Icon
            src={IconSrc}
            size={IconSize.n20}
            style={{ color: "var(--text-primary)" }}
          />
        </Frame>
        <Frame
          layout={Layout.Col.Left.Start}
          spacing={Space.n8}
          override={{ pt: Space.n16 }}
        >
          <EditableWrapper>
            <Text.Card.Title size={FontSize.n18} weight="bold">
              {title}
            </Text.Card.Title>
          </EditableWrapper>
          <EditableWrapper>
            <Text.Card.Desc
              size={FontSize.n14}
              style={{ color: "var(--text-secondary)", lineHeight: "1.5" }}
            >
              {desc}
            </Text.Card.Desc>
          </EditableWrapper>
        </Frame>
      </Frame>
      {image && (
        <Frame
          style={{
            width: "45%",
            background:
              "linear-gradient(135deg, var(--surface-sunken), var(--surface-base))",
            borderLeft: "1px solid var(--border-color)",
          }}
          override={{ pack: true, h: Size.fill }}
        >
          <Frame
            override={{
              w: Size.n160,
              h: Size.n160,
              border: true,
              shadow: "2xl",
              r: Radius2.lg, // Use specific radius token
            }}
            style={{
              background: "var(--surface-base)",
              transform: "rotate(-5deg) translateX(20px)",
            }}
          />
        </Frame>
      )}
    </Frame>
  );
}
