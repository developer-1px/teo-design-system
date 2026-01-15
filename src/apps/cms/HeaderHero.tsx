import { ArrowUpRight, Command, Sparkles } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Space } from "../../design-system/token/token.const.1tier";
import { EditableWrapper } from "./EditableWrapper";
import { Icon } from "../../design-system/Icon";
import { IconSize, Size } from "../../design-system/token/token.const.1tier";

export function HeaderHero() {
  return (
    <Frame
      override={{
        w: Size.full,
        py: Space.n88,
        px: Space.n20,
        gap: Space.n12,
        clip: true,
      }}
      style={{
        minHeight: "90vh",
        position: "relative",
        maxWidth: 1280,
        margin: "0 auto",
      }}
      surface="base"
    >
      {/* Background Decoration */}
      < Frame
        override={{}}
        style={{
          position: "absolute",
          top: -25,
          right: -25,
          background: "var(--color-primary)",
          filter: "blur(150px)",
          opacity: 0.1,
        }}
      />
      < Frame
        override={{}}
        style={{
          position: "absolute",
          bottom: -25,
          left: -25,
          background: "var(--color-warning)",
          filter: "blur(150px)",
          opacity: 0.15,
        }}
      />

      < Frame
        override={{
          w: Size.full,
          gap: Space.n6,
        }}
        style={{ maxWidth: "var(--container-n800)", margin: "0 auto" }}
        align="center"
      >
        <Frame
          override={{ py: Space.n4, px: Space.n12, rounded: "full", gap: Space.n8 }}
          surface="raised"
          layout={Layout.Row.Item.Compact}
          align="center"
        >
          <Icon src={Sparkles} size={IconSize.n12} style={{ color: "var(--color-primary)" }} />
          <Text.Card.Note
            style={{
              fontSize: "var(--font-size-n12)",
              fontWeight: "bold",
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

        <EditableWrapper style={{ maxWidth: 600 }}>
          <Text.Prose.Body
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "var(--font-size-n12)",
              fontWeight: 600,
              opacity: 0.8,
            }}
          >
            The visual engine for creators who demand perfection. No code, no
            constraints, just pure creativity.
          </Text.Prose.Body>
        </EditableWrapper>

        <Frame override={{ gap: Space.n12 }} layout={Layout.Row.Actions.Default} align="center">
          <Action
            label="Start Creating"
            variant="primary"
            size="lg"
            glow
            h={14}
            rounded="full"
          >
            <Icon src={ArrowUpRight} size={IconSize.n20} />
          </Action>
          <Action
            label="Talk to Sales"
            variant="surface"
            size="lg"
            h={14}
            py={Space.n0}
            px={Space.n24}
            rounded="full"
          />
        </Frame>
      </Frame >

      {/* Hero Visual: Mockup UI */}
      < Frame
        override={{
          w: Size.full,
        }}
        style={{
          maxWidth: "250px",
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
          <Command size={14} opacity={0.3} />
        </Frame>
        <Frame layout={Layout.Row.AppContainer.Default} fill justify="start">
          <Frame
            override={{
              w: Size.n48,
              p: Space.n4,
              gap: Space.n4,
            }}
            style={{ borderRight: "1px solid var(--border-color)" }}
            surface="sunken"
          >
            <Frame
              override={{ rounded: "full" }}
              style={{ height: 3, width: "80%" }}
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
          <Frame override={{ p: Space.n12, gap: Space.n6 }} flex surface="base" pack>
            <Frame
              override={{ w: Size.n20, h: Size.n20, rounded: "2xl", shadow: "lg" }}
              surface="raised"
              pack
            >
              <Sparkles size={32} color="var(--color-primary)" />
            </Frame>
            <Frame override={{ gap: Space.n2 }} align="center">
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
      </Frame >
    </Frame >
  );
}
