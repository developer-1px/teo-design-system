import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";

import { ProseSection, ProseDocument } from "../design-system/ProseOld.tsx";
import {
  Space,
  Size,
} from "../design-system/token/token.const.1tier";
import { Text } from "../design-system/text/Text";

// --- Data Structures (No Hardcoding) ---

const TEXT_CONTEXTS = [
  {
    name: "Prose",
    desc: "Long-form content and document flow",
    Component: Text.Prose,
    slots: [
      { name: "Title", sample: "Prose Title (H1-H4)", desc: "Headings" },
      {
        name: "Body",
        sample: "Prose Body - Optimized for readability in documentation.",
        desc: "Paragraphs",
      },
      {
        name: "Note",
        sample: "Prose Note - Asides and annotations.",
        desc: "Metadata",
      },
      {
        name: "Code",
        sample: "console.log('Prose Code')",
        desc: "Inline Code",
      },
    ],
  },
  {
    name: "Card",
    desc: "UI components and summarized content",
    Component: Text.Card,
    slots: [
      { name: "Title", sample: "Card Title", desc: "Component Heading" },
      {
        name: "Desc",
        sample: "Card Description - Short summary text.",
        desc: "Content",
      },
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
      {
        name: "Note",
        sample: "We'll never share your email.",
        desc: "Helper Text",
      },
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
  { id: "sunken", hex: "#F9F9FB", desc: `${Space}bars / Wells` },
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
          <Frame override={{ gap: Space.n16 }}>
            <Text.Prose.Title>Design Tokens & System</Text.Prose.Title>
            <Text.Prose.Body style={{ color: "var(--text-secondary)" }}>
              Reference for the Minimal Design Kit token system. Typography is
              organized by <b>Context</b> rather than size.
            </Text.Prose.Body>
          </Frame>

          <Frame override={{ w: Size.full, style: { height: "1px" } }} surface="overlay" />

          {/* 1. Text System (Dynamic from Data) */}
          <Frame override={{ gap: Space.n32 }}>
            <Text.Prose.Title>Text System (By Context)</Text.Prose.Title>

            <Frame override={{ gap: Space.n48 }}>
              {TEXT_CONTEXTS.map((ctx) => (
                <Frame override={{ gap: Space.n16 }} key={ctx.name}>
                  <Frame layout={Layout.Row.Item.Between} align="baseline">
                    <Text.Prose.Title
                      style={{ fontSize: "var(--font-size-2)" }}
                    >
                      {ctx.name}
                    </Text.Prose.Title>
                    <Text.Card.Note>{ctx.desc}</Text.Card.Note>
                  </Frame>

                  <Frame
                    override={{
                      rounded: "xl",
                      p: Space.n24,
                      style: { border: "1px solid var(--border-color)" },
                      gap: Space.n0,
                    }}
                    surface="sunken"
                  >
                    {ctx.slots.map((slot) => {
                      // Dynamically access the slot component
                      // @ts-ignore - We know these components exist in the MDK imports
                      const SlotComponent = ctx.Component[slot.name];

                      return (
                        <Frame
                          override={{
                            // gap: Space.n16, // Removed in favor of semantic preset default (12px)
                            py: Space.n16,
                            px: Space.n0,
                            style: {
                              borderBottom: "1px solid var(--border-color)",
                            },
                          }}
                          key={slot.name}
                          layout={Layout.Row.Item.Default}
                        >
                          {/* Slot Name */}
                          <Frame override={{ w: Size.n128 }}>
                            <Text.Card.Code
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              {ctx.name}.{slot.name}
                            </Text.Card.Code>
                          </Frame>

                          {/* Sample Render */}
                          <Frame flex={1}>
                            <SlotComponent>{slot.sample}</SlotComponent>
                          </Frame>

                          {/* Role Description */}
                          <Frame override={{ w: Size.n128 }} justify="end">
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
          <Frame override={{ gap: Space.n8 }}>
            <Text.Prose.Title>Prose Title Variants</Text.Prose.Title>
            <Frame
              override={{
                p: Space.n8,
                rounded: "xl",
                gap: Space.n16,
                style: { border: "1px solid var(--border-color)" },
              }}
              surface="sunken"
            >
              <Frame override={{ gap: Space.n2 }}>
                <Text.Prose.Title variant="xl">
                  Display Title (xl)
                </Text.Prose.Title>
                <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>
                  variant="xl" (H1 Display)
                </Text.Card.Code>
              </Frame>
              <Frame override={{ w: Size.full, style: { height: "1px" } }} surface="base" />
              <Frame override={{ gap: Space.n2 }}>
                <Text.Prose.Title variant="lg">
                  Page Title (lg)
                </Text.Prose.Title>
                <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>
                  variant="lg" (H2)
                </Text.Card.Code>
              </Frame>
              <Frame override={{ w: Size.full, style: { height: "1px" } }} surface="base" />
              <Frame override={{ gap: Space.n2 }}>
                <Text.Prose.Title variant="md">
                  Section Title (md)
                </Text.Prose.Title>
                <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>
                  variant="md" (H3)
                </Text.Card.Code>
              </Frame>
              <Frame override={{ w: Size.full, style: { height: "1px" } }} surface="base" />
              <Frame override={{ gap: Space.n2 }}>
                <Text.Prose.Title variant="sm">
                  Subsection Title (sm)
                </Text.Prose.Title>
                <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>
                  variant="sm" (H4)
                </Text.Card.Code>
              </Frame>
            </Frame>
          </Frame>

          <Frame override={{ w: Size.full, style: { height: "1px" } }} surface="overlay" />

          {/* 2. Surfaces */}
          <Frame override={{ gap: Space.n8 }}>
            <Text.Prose.Title>Surfaces</Text.Prose.Title>
            <Frame override={{ gap: Space.n24 }} layout={Layout.Wrap.Chips.Default}>
              {SURFACES.map((s) => (
                <Frame
                  override={{
                    w: Size.n128,
                    h: Size.n128,
                    rounded: "2xl",
                    shadow: "sm",
                    p: Space.n4,
                    style: { border: "1px solid var(--border-color)" },
                  }}
                  key={s.id}
                  surface={s.id as any}
                  justify="between"
                >
                  <Text.Card.Title style={{ fontSize: "var(--font-size-3)" }}>
                    {s.id}
                  </Text.Card.Title>
                  <Frame>
                    <Text.Card.Desc>{s.desc}</Text.Card.Desc>
                    <Text.Card.Code style={{ opacity: 0.5 }}>
                      {s.hex}
                    </Text.Card.Code>
                  </Frame>
                </Frame>
              ))}
            </Frame>
          </Frame>

          {/* 3. Spacing */}
          <Frame override={{ gap: Space.n8 }}>
            <Text.Prose.Title>Spacing</Text.Prose.Title>
            <Frame override={{ gap: Space.n24 }} layout={Layout.Wrap.Chips.Default}>
              {SPACING.map((sp) => (
                <Frame override={{ gap: Space.n8 }} key={sp} align="center">
                  <Frame
                    override={{
                      h: Size.n32,
                      rounded: "sm",
                      style: {
                        width: `var(--space-${String(sp).replace(".", "-")})`,
                      },
                    }}
                    surface="primary"
                  />
                  <Text.Card.Code
                    style={{ fontSize: "9px", color: "var(--text-tertiary)" }}
                  >
                    {sp}
                  </Text.Card.Code>
                </Frame>
              ))}
            </Frame>
          </Frame>

          {/* 4. Radius */}
          <Frame override={{ gap: Space.n32 }}>
            <Text.Prose.Title>Radius</Text.Prose.Title>
            <Frame override={{ gap: Space.n24 }} layout={Layout.Wrap.Chips.Default}>
              {RADIUS.map((r) => (
                <Frame
                  override={{
                    w: Size.n64,
                    h: Size.n64,
                    style: {
                      borderRadius: `var(--radius-${r})`,
                      border: "1px solid var(--border-color)",
                    },
                  }}
                  key={r}
                  surface="sunken"
                  align="center"
                  justify="center"
                >
                  <Text.Card.Code style={{ fontSize: "10px" }}>
                    {r}
                  </Text.Card.Code>
                </Frame>
              ))}
            </Frame>
          </Frame>

          {/* 5. Shadows */}
          <Frame override={{ gap: Space.n32 }}>
            <Text.Prose.Title>Shadows</Text.Prose.Title>
            <Frame
              override={{ gap: Space.n48, p: Space.n48, rounded: "3xl" }}
              override={{ gap: Space.n48, p: Space.n48, rounded: "3xl" }}
              layout={Layout.Wrap.Chips.Default}
              surface="sunken"
            >
              {SHADOWS.map((s) => (
                <Frame
                  override={{ w: Size.n80, h: Size.n80, rounded: "2xl", shadow: s as any }}
                  key={s}
                  surface="base"
                  align="center"
                  justify="center"
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
