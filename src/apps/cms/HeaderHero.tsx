import { ArrowUpRight, Command, Sparkles } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";
import { EditableWrapper } from "./EditableWrapper";

export function HeaderHero() {
  return (
    <Frame
      override={{
        w: "100%",
        p: "21 5",
        gap: 3,
        style: {
          minHeight: "90vh",
          position: "relative",
          overflow: "hidden",
          maxWidth: 1280,
          margin: "0 auto",
        },
      }}
      surface="base"
    >
      {/* Background Decoration */}
      <Frame
        override={{
          style: {
            position: "absolute",
            top: -25,
            right: -25,
            background: "var(--color-primary)",
            filter: "blur(150px)",
            opacity: 0.1,
          },
        }}
      />
      <Frame
        override={{
          style: {
            position: "absolute",
            bottom: -25,
            left: -25,
            background: "var(--color-warning)",
            filter: "blur(150px)",
            opacity: 0.15,
          },
        }}
      />

      <Frame
        override={{
          w: "100%",
          maxWidth: 800,
          style: { margin: "0 auto" },
          gap: 1.5,
        }}
        align="center"
      >
        <Frame
          override={{ p: "1 3", rounded: "full", gap: 2 }}
          surface="raised"
          row
          align="center"
        >
          <Sparkles size={12} color="var(--color-primary)" />
          <Text.Card.Note
            style={{
              fontSize: "12px",
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
              color: "var(--text-secondary)",
              textAlign: "center",
              opacity: 0.8,
            }}
          >
            The visual engine for creators who demand perfection. No code, no
            constraints, just pure creativity.
          </Text.Prose.Body>
        </EditableWrapper>

        <Frame override={{ gap: 3 }} row align="center">
          <Action
            label="Start Creating"
            variant="primary"
            size="lg"
            glow
            h={14}
            rounded="full"
          >
            <ArrowUpRight size={20} />
          </Action>
          <Action
            label="Talk to Sales"
            variant="surface"
            size="lg"
            h={14}
            p="0 6"
            rounded="full"
          />
        </Frame>
      </Frame>

      {/* Hero Visual: Mockup UI */}
      <Frame
        override={{
          w: "100%",
          maxWidth: 250,
          h: 125,
          rounded: "2xl",
          shadow: "2xl",
          style: {
            position: "relative",
            marginTop: "64px",
            transform: "perspective(1000px) rotateX(5deg)",
            margin: "0 auto",
          },
        }}
        surface="raised"
        overflow="hidden"
      >
        <Frame
          override={{
            h: 10,
            style: { borderBottom: "1px solid var(--border-color)" },
            p: "0 1",
            gap: 0.5,
          }}
          surface="raised"
          row
          align="center"
        >
          <Frame
            override={{ w: 10, h: 10, rounded: "full" }}
            surface="overlay"
          />
          <Frame
            override={{ w: 10, h: 10, rounded: "full" }}
            surface="overlay"
          />
          <Frame
            override={{ w: 10, h: 10, rounded: "full" }}
            surface="overlay"
          />
          <Frame flex />
          <Command size={14} opacity={0.3} />
        </Frame>
        <Frame row fill justify="start">
          <Frame
            override={{
              w: 50,
              style: { borderRight: "1px solid var(--border-color)" },
              p: 1,
              gap: 1,
            }}
            surface="sunken"
          >
            <Frame
              override={{ h: 3, w: "80%", rounded: "full" }}
              surface="overlay"
            />
            <Frame
              override={{ h: 3, w: "60%", rounded: "full" }}
              surface="overlay"
            />
            <Frame flex />
            <Frame
              override={{ h: 10, w: "100%", rounded: "lg" }}
              surface="raised"
            />
          </Frame>
          <Frame override={{ p: 3, gap: 1.5 }} flex surface="base" pack>
            <Frame
              override={{ w: 20, h: 20, rounded: "2xl", shadow: "lg" }}
              surface="raised"
              pack
            >
              <Sparkles size={32} color="var(--color-primary)" />
            </Frame>
            <Frame override={{ gap: 0.5 }} align="center">
              <Frame
                override={{ h: 5, w: 50, rounded: "full" }}
                surface="overlay"
              />
              <Frame
                override={{ h: 3, w: 75, rounded: "full" }}
                surface="raised"
              />
            </Frame>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
