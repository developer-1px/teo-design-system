import { Check, MessageSquare, Zap } from "lucide-react";
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

export function BodyContentSection() {
  return (
    <Frame
      override={{
        w: Size.full,
        py: Space.n96,
        px: Space.n24,
      }}
      style={{ borderBottom: "1px solid var(--border-color)" }}
      surface="sunken"
    >
      <Frame
        override={{
          gap: Space.n48,
          w: Size.full,
        }}
        style={{ maxWidth: "var(--container-n1280)", margin: "0 auto" }}
        layout={Layout.Row.Item.Default}
        align="center"
      >
        <Frame override={{ gap: Space.n24 }} style={{ width: "50%" }}>
          <Frame override={{ gap: Space.n8 }}>
            <Text.Card.Note
              size={FontSize.n14}
              weight="bold"
              style={{ color: "var(--text-primary)" }}
            >
              THE PROCESS
            </Text.Card.Note>
            <Text.Prose.Title variant="lg">
              Unleash your <br /> internal creative.
            </Text.Prose.Title>
          </Frame>

          <Text.Prose.Body style={{ color: "var(--text-secondary)" }}>
            Workflow shouldn't be a bottleneck. Our platform allows developers
            to focus on logic while designers handle the visuals.
          </Text.Prose.Body>

          <Frame override={{ gap: Space.n12 }}>
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
            override={{
              w: Size.n160,
              h: Size.n208,
              rounded: "3xl",
              shadow: "2xl",
            }}
            style={{ position: "relative" }}
            surface="raised"
          >
            {/* Floating Card 1 */}
            <Frame
              override={{
                w: Size.n64,
                h: Size.n64,
                rounded: "2xl",
                shadow: "lg",
                p: Space.n24,
                gap: Space.n16,
              }}
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
              <Frame override={{ gap: Space.n8 }}>
                <Frame
                  override={{ h: Size.n12, w: Size.full, rounded: "full" }}
                  surface="overlay"
                />
                <Frame
                  override={{ h: Size.n12, rounded: "full" }}
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
                rounded: "2xl",
                shadow: "lg",
                p: Space.n24,
                gap: Space.n16,
              }}
              style={{
                position: "absolute",
                bottom: "var(--space-n40)",
                right: "calc(-1 * var(--space-n40))",
              }}
              surface="raised"
            >
              <Icon
                src={MessageSquare}
                size={IconSize.n32}
                style={{ color: "var(--color-primary)" }}
              />
              <Frame override={{ gap: Space.n12 }}>
                <Frame
                  override={{ gap: Space.n4 }}
                  layout={Layout.Row.Item.Compact}
                  align="center"
                >
                  <Frame
                    override={{ w: Size.n8, h: Size.n8, rounded: "full" }}
                    surface="overlay"
                  />
                  <Frame
                    override={{ w: Size.n24, rounded: "full" }}
                    style={{ height: "var(--space-n4)" }}
                    surface="overlay"
                  />
                </Frame>
                <Frame
                  override={{ w: Size.full, rounded: "full" }}
                  style={{ height: "var(--space-n4)" }}
                  surface="raised"
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
      override={{ gap: Space.n12 }}
      layout={Layout.Row.Item.Default}
      align="start"
    >
      <Frame
        override={{ w: Size.n20, h: Size.n20, rounded: "full" }}
        style={{ marginTop: "var(--space-n4)" }}
        surface="primary"
        pack
      >
        <Icon src={Check} size={IconSize.n12} style={{ color: "white" }} />
      </Frame>
      <Frame override={{ gap: Space.n4 }}>
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
