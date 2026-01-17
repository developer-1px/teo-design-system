import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Section } from "../design-system/Section";
import { Text } from "../design-system/text/Text";
import { Radius2, Size, Space } from "../design-system/token";

export function SlidesPanel() {
  const slides = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Section
      title="LAYERS"
      w={Size.n160}
      surface="base"
      rounded={Radius2.md}
      style={{ boxShadow: "var(--elevation-n1)" }}
    >
      <Frame
        surface="sunken"
        layout={Layout.Col.Left.Start}
        spacing={Space.n4}
        override={{
          flex: 1,
          minHeight: Size.n0,
          scroll: true,
          align: "stretch",
          p: Space.n8, // Padding around the list
        }}
        w={Size.fill}
        h={Size.fill}
      >
        {slides.map((num) => (
          <Frame
            key={num}
            rounded={Radius2.md}
            layout={Layout.Row.Middle.Start}
            spacing={Space.n8}
            override={{
              p: Space.n8,
              border: num === 1,
              gap: Space.n4, // Keep tight gap from original design
            }}
          >
            <Text.Card.Note
              style={{
                color: num === 1 ? "var(--text-white)" : "var(--text-subtle)",
              }}
            >
              {num}
            </Text.Card.Note>
            <Frame
              surface="raised"
              override={{
                w: Size.fill,
                ratio: "16/9",
                clip: true,
                align: "center",
                justify: "center",
                flex: 1,
              }}
            />
          </Frame>
        ))}
      </Frame>
    </Section>
  );
}
