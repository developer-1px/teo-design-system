import { Frame } from "../design-system/Frame";
import { Section } from "../design-system/Section";
import { Text } from "../design-system/text/Text";

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
      <Frame
        override={{ style: { minHeight: 0 } }}
        overflow="auto"
        surface="sunken"
        flex
        fill
      >
        {slides.map((num) => (
          <Frame override={{ gap: 1, p: 2 }} key={num} border={num === 1}>
            <Frame override={{ gap: 1 }} row justify="between" align="end">
              <Text.Card.Note
                style={{
                  color: num === 1 ? "var(--text-white)" : "var(--text-subtle)",
                }}
              >
                {num}
              </Text.Card.Note>
              <Frame
                override={{ w: "100%", rounded: "round" }}
                ratio="16/9"
                surface="raised"
                flex
                pack
                overflow="hidden"
              />
            </Frame>
          </Frame>
        ))}
      </Frame>
    </Section>
  );
}
