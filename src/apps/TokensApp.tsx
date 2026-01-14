
import { Frame } from "../design-system/Frame";

import { ProseSection, ProseDocument } from "../design-system/ProseOld.tsx";
import { Text } from "../design-system/text/Text";

// --- Data Structures (No Hardcoding) ---

const TEXT_CONTEXTS = [
  {
    name: "Prose",
    desc: "Long-form content and document flow",
    Component: Text.Prose,
    slots: [
      { name: "Title", sample: "Prose Title (H1-H4)", desc: "Headings" },
      { name: "Body", sample: "Prose Body - Optimized for readability in documentation.", desc: "Paragraphs" },
      { name: "Note", sample: "Prose Note - Asides and annotations.", desc: "Metadata" },
      { name: "Code", sample: "console.log('Prose Code')", desc: "Inline Code" },
    ],
  },
  {
    name: "Card",
    desc: "UI components and summarized content",
    Component: Text.Card,
    slots: [
      { name: "Title", sample: "Card Title", desc: "Component Heading" },
      { name: "Desc", sample: "Card Description - Short summary text.", desc: "Content" },
      { name: "Note", sample: "Card Note - 12m ago", desc: "Metadata" },
      { name: "Code", sample: "git commit", desc: "Technical Data" },
    ],
  },
  {
    name: "Field",
    desc: "Form inputs and key-value pairs",
    Component: Text.Field,
    slots: [
      { name: "Label", sample: "Email Address", desc: "Input Label" },
      { name: "Value", sample: "user@example.com", desc: "Input Display" },
      { name: "Note", sample: "We'll never share your email.", desc: "Helper Text" },
    ],
  },
  {
    name: "Table",
    desc: "Tabular data",
    Component: Text.Table,
    slots: [
      { name: "Head", sample: "COLUMN NAME", desc: "Header Cell" },
      { name: "Cell", sample: "Table Cell Content", desc: "Body Cell" },
    ],
  },
  {
    name: "Menu",
    desc: "Navigation and lists",
    Component: Text.Menu,
    slots: [
      { name: "Group", sample: "SECTION", desc: "Group Label" },
      { name: "Item", sample: "Menu Item Label", desc: "Action Item" },
    ],
  },
];

const SURFACES = [
  { id: "base", hex: "#FFFFFF", desc: "Page Background" },
  { id: "sunken", hex: "#F9F9FB", desc: "Sidebars / Wells" },
  { id: "raised", hex: "#FFFFFF", desc: "Cards / Sheets" },
  { id: "overlay", hex: "#FFFFFF", desc: "Dialogs / Menus" },
  { id: "selected", hex: "#F4F4F5", desc: "Active States" },
];

const SPACING = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32];
const RADIUS = ["none", "sm", "md", "lg", "xl", "2xl", "3xl", "full"];
const SHADOWS = ["sm", "md", "lg"];

// --- Components ---

export function TokensApp() {
  return (
    <Frame fill surface="base" overflow="auto">
      <ProseSection p="80 0" layout="full">
        <ProseDocument maxWidth="1000px" gap={12}>

          {/* Header */}
          <Frame gap={4}>
            <Text.Prose.Title>Design Tokens & System</Text.Prose.Title>
            <Text.Prose.Body style={{ color: "var(--text-secondary)" }}>
              Reference for the Minimal Design Kit token system.
              Typography is organized by <b>Context</b> rather than size.
            </Text.Prose.Body>
          </Frame>

          <Frame w="100%" h="1px" surface="overlay" />

          {/* 1. Text System (Dynamic from Data) */}
          <Frame gap={8}>
            <Text.Prose.Title>Text System (By Context)</Text.Prose.Title>

            <Frame gap={12}>
              {TEXT_CONTEXTS.map((ctx) => (
                <Frame key={ctx.name} gap={4}>
                  <Frame row justify="between" align="baseline">
                    <Text.Prose.Title style={{ fontSize: "var(--font-size-2)" }}>{ctx.name}</Text.Prose.Title>
                    <Text.Card.Note>{ctx.desc}</Text.Card.Note>
                  </Frame>

                  <Frame
                    surface="sunken"
                    rounded="xl"
                    p={6}
                    style={{ border: "1px solid var(--border-color)" }}
                    gap={0}
                  >
                    {ctx.slots.map((slot) => {
                      // Dynamically access the slot component
                      // @ts-ignore - We know these components exist in the MDK imports
                      const SlotComponent = ctx.Component[slot.name];

                      return (
                        <Frame
                          key={slot.name}
                          row
                          align="center"
                          gap={4}
                          p="4 0"
                          style={{ borderBottom: "1px solid var(--border-color)" }}
                        >
                          {/* Slot Name */}
                          <Frame w={120}>
                            <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>
                              {ctx.name}.{slot.name}
                            </Text.Card.Code>
                          </Frame>

                          {/* Sample Render */}
                          <Frame flex={1}>
                            <SlotComponent>
                              {slot.sample}
                            </SlotComponent>
                          </Frame>

                          {/* Role Description */}
                          <Frame w={120} justify="end">
                            <Text.Card.Note>{slot.desc}</Text.Card.Note>
                          </Frame>
                        </Frame>
                      );
                    })}
                  </Frame>
                </Frame>
              ))}
            </Frame>
          </Frame>

          {/* 1.1 Prose Title Variants */}
          <Frame gap={8}>
            <Text.Prose.Title>Prose Title Variants</Text.Prose.Title>
            <Frame surface="sunken" p={8} rounded="xl" gap={4} style={{ border: "1px solid var(--border-color)" }}>
              <Frame gap={2}>
                <Text.Prose.Title variant="xl">Display Title (xl)</Text.Prose.Title>
                <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>variant="xl" (H1 Display)</Text.Card.Code>
              </Frame>
              <Frame w="100%" h="1px" surface="base" />
              <Frame gap={2}>
                <Text.Prose.Title variant="lg">Page Title (lg)</Text.Prose.Title>
                <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>variant="lg" (H2)</Text.Card.Code>
              </Frame>
              <Frame w="100%" h="1px" surface="base" />
              <Frame gap={2}>
                <Text.Prose.Title variant="md">Section Title (md)</Text.Prose.Title>
                <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>variant="md" (H3)</Text.Card.Code>
              </Frame>
              <Frame w="100%" h="1px" surface="base" />
              <Frame gap={2}>
                <Text.Prose.Title variant="sm">Subsection Title (sm)</Text.Prose.Title>
                <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>variant="sm" (H4)</Text.Card.Code>
              </Frame>
            </Frame>
          </Frame>

          <Frame w="100%" h="1px" surface="overlay" />

          {/* 2. Surfaces */}
          <Frame gap={8}>
            <Text.Prose.Title>Surfaces</Text.Prose.Title>
            <Frame row wrap="wrap" gap={6}>
              {SURFACES.map((s) => (
                <Frame
                  key={s.id}
                  surface={s.id as any}
                  w={120}
                  h={120}
                  rounded="2xl"
                  shadow="sm"
                  p={4}
                  justify="between"
                  style={{ border: "1px solid var(--border-color)" }}
                >
                  <Text.Card.Title style={{ fontSize: "var(--font-size-3)" }}>{s.id}</Text.Card.Title>
                  <Frame>
                    <Text.Card.Desc>{s.desc}</Text.Card.Desc>
                    <Text.Card.Code style={{ opacity: 0.5 }}>{s.hex}</Text.Card.Code>
                  </Frame>
                </Frame>
              ))}
            </Frame>
          </Frame>

          {/* 3. Spacing */}
          <Frame gap={8}>
            <Text.Prose.Title>Spacing</Text.Prose.Title>
            <Frame row wrap="wrap" gap={4}>
              {SPACING.map((sp) => (
                <Frame key={sp} align="center" gap={2}>
                  <Frame
                    h={32}
                    style={{ width: `var(--space-${String(sp).replace(".", "-")})` }}
                    surface="primary"
                    rounded="sm"
                  />
                  <Text.Card.Code style={{ fontSize: "9px", color: "var(--text-tertiary)" }}>
                    {sp}
                  </Text.Card.Code>
                </Frame>
              ))}
            </Frame>
          </Frame>

          {/* 4. Radius */}
          <Frame gap={8}>
            <Text.Prose.Title>Radius</Text.Prose.Title>
            <Frame row wrap="wrap" gap={6}>
              {RADIUS.map((r) => (
                <Frame
                  key={r}
                  w={64}
                  h={64}
                  surface="sunken"
                  align="center"
                  justify="center"
                  style={{ borderRadius: `var(--radius-${r})`, border: "1px solid var(--border-color)" }}
                >
                  <Text.Card.Code style={{ fontSize: "10px" }}>{r}</Text.Card.Code>
                </Frame>
              ))}
            </Frame>
          </Frame>

          {/* 5. Shadows */}
          <Frame gap={8}>
            <Text.Prose.Title>Shadows</Text.Prose.Title>
            <Frame row wrap="wrap" gap={12} surface="sunken" p={12} rounded="3xl">
              {SHADOWS.map((s) => (
                <Frame
                  key={s}
                  w={80}
                  h={80}
                  surface="base"
                  rounded="2xl"
                  align="center"
                  justify="center"
                  shadow={s as any}
                >
                  <Text.Card.Title>{s}</Text.Card.Title>
                </Frame>
              ))}
            </Frame>
          </Frame>

        </ProseDocument>
      </ProseSection>
    </Frame>
  );
}
