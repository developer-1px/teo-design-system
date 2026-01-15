import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Section } from "../design-system/Section";
import { Text } from "../design-system/text/Text";
import { Size, Space, Radius2 } from "../design-system/token";

export function SlidesPanel() {
  const slides = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Section
      title="LAYERS"
      style={{ width: "160px", minWidth: "160px" }}
      surface="base"
      rounded={Radius2.md}
      shadow="sm"
    >
      <Frame style={{ minHeight: 0 }} scroll surface="sunken" flex fill>
        {slides.map((num) => (
          <Frame
            override={{ gap: Space.n4, p: Space.n8 }}
            border={num === 1}
            key={num}
          >
            <Frame
              layout={Layout.Row.LabelValue.Default}
              override={{ gap: Space.n4, justify: "between" }}
            >
              <Text.Card.Note
                style={{
                  color: num === 1 ? "var(--text-white)" : "var(--text-subtle)",
                }}
              >
                {num}
              </Text.Card.Note>
              <Frame
                override={{ w: Size.full }}
                rounded={Radius2.md}
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
