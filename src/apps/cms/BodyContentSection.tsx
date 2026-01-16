import {Check, MessageSquare, Zap} from "lucide-react"
import {Frame} from "../../design-system/Frame/Frame.tsx"
import {Layout} from "../../design-system/Frame/Layout/Layout.ts"
import {Icon} from "../../design-system/Icon"
import {Text} from "../../design-system/text/Text"
import {ContainerSize, FontSize, IconSize, Size, Space,} from "../../design-system/token/token.const.1tier"
import {Radius2} from "../../design-system/token/token.const.2tier"

export function BodyContentSection() {
  return (
    <Frame
      override={{
        w: Size.fill,
        py: Space.n96,
        px: Space.n24,
      }}
      surface="sunken"
      pack
      border={true}
    >
      <Frame
        layout={Layout.Row.Item.Default}
        override={{
          gap: Space.n48,
          w: Size.fill,
          align: "center",
          maxWidth: ContainerSize.n1280,
        }}
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
            override={{ w: Size.n160, h: Size.n208, shadow: "2xl" }}
            rounded={Radius2["3xl"]}
            style={{ position: "relative" }}
            surface="raised"
          >
            {/* Floating Card 1 */}
            <Frame
              override={{
                w: Size.n64,
                h: Size.n64,
                shadow: "lg",
                p: Space.n24,
                gap: Space.n16,
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
              <Frame override={{ gap: Space.n8 }}>
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
                shadow: "lg",
                p: Space.n24,
                gap: Space.n16,
              }}
              rounded={Radius2["2xl"]}
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
                  layout={Layout.Row.Item.Compact}
                  override={{ gap: Space.n4, align: "center" }}
                >
                  <Frame
                    override={{ w: Size.n8, h: Size.n8 }}
                    rounded={Radius2.full}
                    surface="overlay"
                  />
                  <Frame
                    override={{ w: Size.n24, h: Size.n16 }}
                    rounded={Radius2.full}
                    surface="overlay"
                  />
                </Frame>
                <Frame
                  override={{ w: Size.fill, h: Size.n16 }}
                  rounded={Radius2.full}
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
      layout={Layout.Row.Item.Default}
      override={{ gap: Space.n12, align: "start" }}
    >
      <Frame
        override={{ w: Size.n20, h: Size.n20 }}
        rounded={Radius2.full}
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
