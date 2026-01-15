import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Section } from "../design-system/Section";
import { Text } from "../design-system/text/Text";
import { Size, Space } from "../design-system/token/token.const.1tier";

export function SlidesPanel() {
  const slides = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Section
      title="LAYERS"
      style={{ width: "160px", minWidth: "160px" }}
      surface="base"
      rounded="round"
      shadow="sm"
    >
      <Frame style={{ minHeight: 0 }} scroll surface="sunken" flex fill>
        {slides.map((num) => (
          <Frame
            override={{ gap: Space.n4, p: Space.n8 }}
            key={num}
            border={num === 1}
          >
            <Frame
              override={{ gap: Space.n4 }}
              layout={Layout.Row.LabelValue.Default}
              justify="between"
              align="end"
            >
              <Text.Card.Note
                style={{
                  color: num === 1 ? "var(--text-white)" : "var(--text-subtle)",
                }}
              >
                {num}
              </Text.Card.Note>
              <Frame
                override={{ w: Size.full, rounded: "round" }}
                ratio="16/9"
                surface="raised"
                flex
                pack
                clip
              />
            </Frame>
          </Frame>
        ))}
      </Frame>
    </Section>
  );
}
