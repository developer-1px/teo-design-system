import { Check, MessageSquare, Zap } from "lucide-react";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";

export function BodyContentSection() {
  return (
    <Frame
      override={{
        w: "100%",
        p: "24 6",
        style: { borderBottom: "1px solid var(--border-color)" },
      }}
      surface="sunken"
    >
      <Frame
        override={{
          gap: 6,
          w: "100%",
          maxWidth: 1280,
          style: { margin: "0 auto" },
        }}
        row
        align="center"
      >
        <Frame override={{ w: "50%", gap: 2 }}>
          <Frame override={{ gap: 1 }}>
            <Text.Card.Note
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "var(--text-primary)",
              }}
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
          <Frame override={{ gap: 1 }}>
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
              w: 100,
              h: 125,
              rounded: "3xl",
              shadow: "2xl",
              style: { position: "relative" },
            }}
            surface="raised"
          >
            <Frame
              override={{
                style: { position: "absolute", top: "40px", left: "-40px" },
                w: 45,
                h: 45,
                rounded: "2xl",
                shadow: "lg",
                p: 6,
                gap: 4,
              }}
              surface="raised"
            >
              <Zap size={32} color="var(--color-warning)" />
              <Frame override={{ gap: 2 }}>
                <Frame
                  override={{ h: 10, w: "100%", rounded: "full" }}
                  surface="overlay"
                />
                <Frame
                  override={{ h: 10, w: "60%", rounded: "full" }}
                  surface="overlay"
                />
              </Frame>
            </Frame>
            <Frame
              override={{
                style: { position: "absolute", bottom: "40px", right: "-40px" },
                w: 55,
                h: 55,
                rounded: "2xl",
                shadow: "lg",
                p: 6,
                gap: 4,
              }}
              surface="raised"
            >
              <MessageSquare size={32} color="var(--color-primary)" />
              <Frame override={{ gap: 2 }}>
                <Frame override={{ gap: 0.5 }} row align="center">
                  <Frame
                    override={{ w: 6, h: 6, rounded: "full" }}
                    surface="overlay"
                  />
                  <Frame
                    override={{ h: 2, w: 25, rounded: "full" }}
                    surface="overlay"
                  />
                </Frame>
                <Frame
                  override={{ h: 2, w: "100%", rounded: "full" }}
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
    <Frame override={{ gap: 1 }} row align="start">
      <Frame
        override={{ w: 6, h: 6, rounded: "full", style: { marginTop: 2 } }}
        surface="primary"
        pack
      >
        <Check size={14} color="#fff" />
      </Frame>
      <Frame override={{ gap: 1 }}>
        <Text.Card.Title style={{ fontSize: 16, fontWeight: "bold" }}>
          {title}
        </Text.Card.Title>
        <Text.Card.Desc
          style={{ fontSize: 14, color: "var(--text-secondary)", opacity: 0.7 }}
        >
          {desc}
        </Text.Card.Desc>
      </Frame>
    </Frame>
  );
}
