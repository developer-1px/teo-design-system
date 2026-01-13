import {Frame} from "../design-system/Frame"
import {Section} from "../design-system/Section"
import {Card} from "../design-system/text/Card"

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
      <Frame overflow="auto" surface="sunken" flex fill style={{ minHeight: 0 }}>
        {slides.map((num) => (
          <Frame
            key={num}
            gap={1}
            p={2}
            border={num === 1}
          >
            <Frame row justify="between" align="end" gap={1}>
              <Card.Note
                style={{
                  color:
                    num === 1 ? "var(--text-white)" : "var(--text-subtle)",
                }}
              >
                {num}
              </Card.Note>
              <Frame
                w="100%"
                ratio="16/9"
                surface="raised"
                rounded="round"
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
