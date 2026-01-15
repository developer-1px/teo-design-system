import { ArrowUpRight, Command, Sparkles } from "lucide-react";
import { Action } from "../../design-system/Action";
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
import { EditableWrapper } from "./EditableWrapper";

export function HeaderHero() {
  return (
    <Frame
      override={{ w: Size.full, clip: true }}
      style={{ position: "relative" }}
      surface="base"
    >
      <Frame
        override={{
          w: Size.full,
          py: Space.n88,
          px: Space.n24,
          gap: Space.n12,
        }}
        style={{
          minHeight: "90vh",
          maxWidth: "var(--container-n1280)",
          margin: "0 auto",
        }}
      >
        {/* Background Decoration */}
        <Frame
          override={{}}
          style={{
            position: "absolute",
            top: "-25px",
            right: "-25px",
            background: "var(--color-primary)",
            filter: "blur(150px)",
            opacity: 0.1,
          }}
        />
        <Frame
          override={{}}
          style={{
            position: "absolute",
            bottom: "-25px",
            left: "-25px",
            background: "var(--color-warning)",
            filter: "blur(150px)",
            opacity: 0.15,
          }}
        />

        <Frame
          override={{
            w: Size.full,
            gap: Space.n24,
          }}
          style={{ maxWidth: "var(--container-n800)", margin: "0 auto" }}
          align="center"
        >
          <Frame
            override={{
              py: Space.n4,
              px: Space.n12,
              rounded: "full",
              gap: Space.n8,
            }}
            surface="raised"
            layout={Layout.Row.Item.Compact}
            align="center"
          >
            <Icon
              src={Sparkles}
              size={IconSize.n12}
              style={{ color: "var(--color-primary)" }}
            />
            <Text.Card.Note
              size={FontSize.n12}
              weight="bold"
              style={{
                color: "var(--text-secondary)",
                letterSpacing: "0.02em",
              }}
            >
              NEXT GENERATION CMS IS HERE
            </Text.Card.Note>
          </Frame>

          <EditableWrapper style={{ width: "100%" }}>
            <Text.Prose.Title variant="xl" style={{ textAlign: "center" }}>
              Build your dream site <br />
              <span style={{ color: "var(--color-primary)" }}>
                pixel by pixel.
              </span>
            </Text.Prose.Title>
          </EditableWrapper>

          <EditableWrapper style={{ maxWidth: "var(--container-n640)" }}>
            <Text.Prose.Body
              size={FontSize.n14}
              weight="medium"
              style={{
                textAlign: "center",
                letterSpacing: "0.01em",
                opacity: 0.8,
              }}
            >
              The visual engine for creators who demand perfection. No code, no
              constraints, just pure creativity.
            </Text.Prose.Body>
          </EditableWrapper>

          <Frame
            override={{ gap: Space.n12 }}
            layout={Layout.Row.Actions.Default}
            align="center"
          >
            <Action
              label="Start Creating"
              variant="primary"
              size="lg"
              glow
              h={Size.n56}
              px={Space.n32}
              rounded="full"
            >
              <Icon src={ArrowUpRight} size={IconSize.n20} />
            </Action>
            <Action
              label="Talk to Sales"
              variant="surface"
              size="lg"
              h={Size.n56}
              px={Space.n32}
              rounded="full"
            />
          </Frame>
        </Frame>

        {/* Hero Visual: Mockup UI */}
        <Frame
          override={{
            w: Size.full,
            rounded: "2xl",
          }}
          style={{
            maxWidth: "var(--size-n384)",
            position: "relative",
            marginTop: "var(--space-n64)",
            transform: "perspective(1000px) rotateX(5deg)",
            margin: "0 auto",
          }}
          surface="raised"
          clip
        >
          <Frame
            override={{
              h: Size.n12,
              py: Space.n0,
              px: Space.n4,
              gap: Space.n2,
            }}
            style={{ borderBottom: "1px solid var(--border-color)" }}
            surface="raised"
            layout={Layout.Row.Item.Tight}
            align="center"
          >
            <Frame
              override={{ w: Size.n12, h: Size.n12, rounded: "full" }}
              surface="overlay"
            />
            <Frame
              override={{ w: Size.n12, h: Size.n12, rounded: "full" }}
              surface="overlay"
            />
            <Frame
              override={{ w: Size.n12, h: Size.n12, rounded: "full" }}
              surface="overlay"
            />
            <Frame flex />
            <Icon src={Command} size={IconSize.n14} style={{ opacity: 0.3 }} />
          </Frame>
          <Frame layout={Layout.Row.AppContainer.Default} fill justify="start">
            <Frame
              override={{
                w: Size.n64,
                p: Space.n4,
                gap: Space.n4,
              }}
              style={{ borderRight: "1px solid var(--border-color)" }}
              surface="sunken"
            >
              <Frame
                override={{ rounded: "full" }}
                style={{ height: "var(--space-n4)", width: "80%" }}
                surface="overlay"
              />
              <Frame
                override={{ h: Size.n4, rounded: "full" }}
                style={{ width: "60%" }}
                surface="overlay"
              />
              <Frame flex />
              <Frame
                override={{ h: Size.n12, w: Size.full, rounded: "lg" }}
                surface="raised"
              />
            </Frame>
            <Frame
              override={{ p: Space.n12, gap: Space.n6 }}
              flex
              surface="base"
              pack
            >
              <Frame
                override={{
                  w: Size.n32,
                  h: Size.n32,
                  rounded: "2xl",
                  shadow: "lg",
                }}
                surface="raised"
                pack
              >
                <Icon
                  src={Sparkles}
                  size={IconSize.n20}
                  style={{ color: "var(--color-primary)" }}
                />
              </Frame>
              <Frame override={{ gap: Space.n4 }} align="center">
                <Frame
                  override={{ h: Size.n4, w: Size.n48, rounded: "full" }}
                  surface="overlay"
                />
                <Frame
                  override={{ h: Size.n4, w: Size.n72, rounded: "full" }}
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
