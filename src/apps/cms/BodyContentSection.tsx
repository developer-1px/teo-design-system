import { Check, MessageSquare, Zap } from "lucide-react";
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

export function BodyContentSection() {
  return (
    <Frame
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
      override={{
        w: Size.fill,
        py: Space.n96,
        px: Space.n24,
        pack: true,
        border: true,
      }}
      surface="sunken"
    >
      <Frame
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        override={{
          gap: Space.n48,
          w: Size.fill,
          maxWidth: ContainerSize.n1280,
        }}
      >
        <Frame override={{ gap: Space.n24 }} style={{ width: "50%" }}>
          <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
            <Text.Card.Note
              size={FontSize.n14}
              weight="bold"
              style={{ color: "var(--text-primary)" }}
            >
              THE PROCESS
            </Text.Card.Note>
            <Text.Prose.Title variant="xl" weight="bold">
              Unleash your <br />
              <span style={{ color: "var(--text-tertiary)" }}>
                inner creative.
              </span>
            </Text.Prose.Title>
          </Frame>

          <Text.Prose.Body
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.125rem",
              lineHeight: "1.6",
            }}
          >
            Workflow shouldn't be a bottleneck. Our platform allows developers
            to focus on logic while designers handle the visuals.
          </Text.Prose.Body>

          <Frame layout={Layout.Col.Left.Start} spacing={Space.n12}>
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

        <Frame override={{ pack: true, flex: 1 }}>
          <Frame
            override={{ w: Size.n160, h: Size.n208, elevation: "n5" }}
            rounded={Radius2["3xl"]}
            style={{ position: "relative" }}
            surface="raised"
          >
            {/* Floating Card 1 */}
            <Frame
              override={{
                w: Size.n64,
                h: Size.n64,
                p: Space.n24,
                gap: Space.n16,
                elevation: "n3",
              }}
              rounded={Radius2["2xl"]}
              style={{
                position: "absolute",
                top: "var(--space-n40)",
                left: "calc(-1 * var(--space-n40))",
              }}
              surface="raised"
            >
              <Icon
                src={Zap}
                size={IconSize.n32}
                style={{ color: "var(--color-warning)" }}
              />
              <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
                <Frame
                  override={{ h: Size.n12, w: Size.fill }}
                  rounded={Radius2.full}
                  surface="overlay"
                />
                <Frame
                  override={{ h: Size.n12 }}
                  rounded={Radius2.full}
                  style={{ width: "60%" }}
                  surface="overlay"
                />
              </Frame>
            </Frame>

            {/* Floating Card 2 */}
            <Frame
              override={{
                w: Size.n80,
                h: Size.n80,
                p: Space.n24,
                gap: Space.n16,
                border: true,
                elevation: "n5",
              }}
              rounded={Radius2["2xl"]}
              style={{
                position: "absolute",
                bottom: "var(--space-n40)",
                right: "calc(-1 * var(--space-n40))",
                backdropFilter: "blur(12px)",
                background: "rgba(255, 255, 255, 0.8)", // Glass effect
              }}
              surface="overlay"
            >
              <Icon
                src={MessageSquare}
                size={IconSize.n32}
                style={{ color: "var(--color-primary)" }}
              />
              <Frame layout={Layout.Col.Left.Start} spacing={Space.n12}>
                <Frame
                  layout={Layout.Row.Middle.Center}
                  spacing={Space.n4}
                  override={{ px: Space.n8, minHeight: Size.n24 }}
                >
                  <Frame
                    override={{ w: Size.n8, h: Size.n8 }}
                    rounded={Radius2.full}
                    surface="primary"
                  />
                  <Frame
                    override={{ w: Size.n24, h: Size.n4 }}
                    rounded={Radius2.full}
                    surface="sunken"
                  />
                </Frame>
                <Frame
                  override={{ w: Size.fill, h: Size.n4 }}
                  rounded={Radius2.full}
                  surface="sunken"
                />
              </Frame>
            </Frame>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}

interface CheckItemProps {
  title: string;
  desc: string;
}

function CheckItem({ title, desc }: CheckItemProps) {
  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      override={{ align: "start", minHeight: Size.n40 }}
    >
      <Frame
        override={{ w: Size.n20, h: Size.n20, pack: true }}
        rounded={Radius2.full}
        style={{ marginTop: "var(--space-n4)" }}
        surface="primary"
      >
        <Icon src={Check} size={IconSize.n12} style={{ color: "white" }} />
      </Frame>
      <Frame layout={Layout.Col.Left.Start} spacing={Space.n4}>
        <Text.Card.Title size={FontSize.n16} weight="bold">
          {title}
        </Text.Card.Title>
        <Text.Card.Desc
          size={FontSize.n14}
          style={{ color: "var(--text-secondary)", opacity: 0.7 }}
        >
          {desc}
        </Text.Card.Desc>
      </Frame>
    </Frame>
  );
}
