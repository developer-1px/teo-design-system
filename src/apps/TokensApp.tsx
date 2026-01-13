
import {
  Prose,
  ProseDocument,
  ProseSection,
} from "../design-system/Prose";
import { Text } from "../design-system/Text";
import { Frame } from "../design-system/Frame";

const TEXT_COLORS = [
  { name: "text-primary", var: "--text-primary", hex: "#18181b" },
  { name: "text-body", var: "--text-body", hex: "#3f3f46" },
  { name: "text-subtle", var: "--text-subtle", hex: "#71717a" },
  { name: "text-muted", var: "--text-muted", hex: "#a1a1aa" },
  { name: "text-dim", var: "--text-dim", hex: "#d4d4d8" },
];

const ACCENT_COLORS = [
  { name: "primary-bg", var: "--primary-bg", hex: "#18181b" },
  { name: "primary-fg", var: "--primary-fg", hex: "#ffffff" },
  { name: "link-color", var: "--link-color", hex: "#646cff" },
  { name: "border-color", var: "--border-color", hex: "#e4e4e7" },
];

const INTERACTION_TOKENS = [
  {
    label: "Field Backgrounds",
    description: "States for form fields",
    tokens: [
      { name: "field-bg", var: "--field-bg" },
      { name: "field-bg-hover", var: "--field-bg-hover" },
      { name: "field-bg-focus", var: "--field-bg-focus" },
    ],
  },
  {
    label: "Link Colors",
    description: "States for text links",
    tokens: [
      { name: "link-color", var: "--link-color" },
      { name: "link-hover-color", var: "--link-hover-color" },
    ],
  },
  {
    label: "Component States",
    description: "Tab and special component states",
    tokens: [
      { name: "tab-bg-active", var: "--tab-bg-active" },
      { name: "surface-selected", var: "--surface-selected" },
      { name: "focus-ring", var: "--focus-ring" },
    ],
  },
];

const SHADOWS: any[] = ["sm", "md", "lg"];
const RADII: any[] = ["none", "rounded", "full"];
const SPACINGS = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20, 21, 24, 25,
  30, 40,
];

function ColorCard({
  name,
  variable,
  hex,
}: {
  name: string;
  variable: string;
  hex: string;
}) {
  return (
    <Frame surface="sunken" rounded="lg" overflow="hidden">
      <Frame h={24} style={{ background: `var(${variable})` }} />
      <Frame p={3} gap={1}>
        <Frame row justify="between" align="center">
          <Text weight="bold" size={3}>
            {name}
          </Text>
          <Text size={2} color="tertiary" mono>
            {hex}
          </Text>
        </Frame>
        <Text size={2} color="tertiary" mono>
          var({variable})
        </Text>
      </Frame>
    </Frame>
  );
}

export function TokensApp() {
  return (
    <Frame fill surface="base" overflow="auto">
      <ProseSection p="96 0" layout="full">
        <Frame gap={20} w="100%">
          {/* Header */}
          <ProseDocument maxWidth="800px" gap={4}>
            <Prose role="h1">Design Tokens</Prose>
            <Prose role="body" color="secondary">
              A comprehensive reference of the design values that power the
              Minimal Design Kit.
            </Prose>
          </ProseDocument>

          {/* Surfaces - Full Width Panorama */}
          <Frame gap={8} w="100%">
            <Frame gap={2} maxWidth="800px" align="center" style={{ textAlign: "center", margin: "0 auto" }}>
              <Prose role="h2">Surfaces</Prose>
              <Prose role="body">
                The fundamental layers of our interface. Each surface provides context and depth through semantic background colors.
              </Prose>
            </Frame>

            <Frame
              row
              w="100%"
              rounded="2xl"
              overflow="hidden"
              border
              shadow="2xl"
              style={{ minHeight: "300px" }}
            >
              {[
                { id: "base", name: "Base", desc: "Root background." },
                { id: "sunken", name: "Sunken", desc: "Wells & groups." },
                { id: "raised", name: "Raised", desc: "Cards & popups." },
                { id: "overlay", name: "Overlay", desc: "Modals & menus." },
                { id: "primary", name: "Primary", desc: "Brand contrast." },
              ].map((s, i) => (
                <Frame
                  key={s.id}
                  surface={s.id as any}
                  p={8}
                  gap={3}
                  flex={1}
                  align="center"
                  justify="center"
                  style={{
                    textAlign: "center",
                    borderRight: i < 4 ? "1px solid var(--border-color)" : undefined,
                  }}
                >
                  <Frame gap={1} align="center">
                    <Text weight="bold" size={5}>
                      {s.name}
                    </Text>
                    <Text size={2} color="tertiary" mono style={{ opacity: 0.6 }}>
                      {s.id}
                    </Text>
                  </Frame>
                  <Text size={2} color="secondary" style={{ maxWidth: "160px", lineHeight: 1.4 }}>
                    {s.desc}
                  </Text>
                  <Frame h={8} />
                  <Text size={1} color="tertiary" mono style={{ opacity: 0.4 }}>
                    var(--surface-{s.id})
                  </Text>
                </Frame>
              ))}
            </Frame>
          </Frame>

          {/* Typography */}
          <ProseDocument maxWidth="1000px" gap={6}>
            <Prose role="h2">Typography</Prose>
            <Frame gap={6} surface="sunken" p={12} rounded="3xl" border>
              <Prose role="h1">Display H1</Prose>
              <Prose role="h2">Heading H2</Prose>
              <Prose role="h3">Heading H3</Prose>
              <Prose role="h4">Heading H4</Prose>
              <Prose role="body">
                Body Text - The quick brown fox jumps over the lazy dog.
              </Prose>
              <Prose role="body-sm">
                Body Small - The quick brown fox jumps over the lazy dog.
              </Prose>
              <Prose role="caption">
                CAPTION - THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.
              </Prose>
            </Frame>
          </ProseDocument>

          {/* Interaction */}
          <ProseDocument maxWidth="1200px" gap={6}>
            <Prose role="h2">Interaction</Prose>
            <Frame gap={8}>
              {INTERACTION_TOKENS.map((group) => (
                <Frame key={group.label} gap={4}>
                  <Frame>
                    <Prose role="h4">{group.label}</Prose>
                    <Prose role="body-sm" color="secondary">
                      {group.description}
                    </Prose>
                  </Frame>
                  <Frame
                    grid
                    columns="repeat(auto-fill, minmax(240px, 1fr))"
                    gap={6}
                    w="100%"
                  >
                    {group.tokens.map((token) => (
                      <Frame
                        key={token.name}
                        surface="sunken"
                        rounded="xl"
                        overflow="hidden"
                      >
                        <Frame
                          h={24}
                          style={{
                            background:
                              token.name === "focus-ring"
                                ? "transparent"
                                : `var(${token.var})`,
                            boxShadow:
                              token.name === "focus-ring"
                                ? `var(${token.var})`
                                : "none",
                          }}
                          align="center"
                          justify="center"
                        >
                          {token.name.includes("link") && (
                            <Text
                              style={{ color: `var(${token.var})` }}
                              weight="medium"
                            >
                              Sample Link
                            </Text>
                          )}
                          {token.name === "surface-selected" && (
                            <Frame
                              surface="selected"
                              p="1.5 4"
                              rounded="md"
                              border
                            >
                              <Text size={3} weight="bold">
                                Selected State
                              </Text>
                            </Frame>
                          )}
                          {token.name === "tab-bg-active" && (
                            <Frame
                              style={{ background: "var(--tab-bg-active)" }}
                              p="1.5 4"
                              rounded="md"
                            >
                              <Text size={3}>Active Tab</Text>
                            </Frame>
                          )}
                        </Frame>
                        <Frame p={4} gap={1.5}>
                          <Text weight="bold" size={3}>
                            {token.name}
                          </Text>
                          <Text size={2} color="tertiary" mono>
                            var({token.var})
                          </Text>
                        </Frame>
                      </Frame>
                    ))}
                  </Frame>
                </Frame>
              ))}
            </Frame>
          </ProseDocument>

          {/* Colors */}
          <ProseDocument maxWidth="1200px" gap={6}>
            <Prose role="h2">Text & Accents</Prose>
            <Frame
              grid
              columns="repeat(auto-fill, minmax(220px, 1fr))"
              gap={6}
              w="100%"
            >
              {[...TEXT_COLORS, ...ACCENT_COLORS].map((color) => (
                <ColorCard
                  key={color.name}
                  name={color.name}
                  variable={color.var}
                  hex={color.hex}
                />
              ))}
            </Frame>
          </ProseDocument>

          {/* Spacing */}
          <ProseDocument maxWidth="1000px" gap={6}>
            <Prose role="h2">Spacing</Prose>
            <Frame row wrap="wrap" gap={6}>
              {SPACINGS.map((space) => (
                <Frame key={space} gap={2} align="center">
                  <Frame
                    style={{
                      width: toToken(space, "space") as any,
                      height: 48,
                    }}
                    surface="primary"
                    rounded="sm"
                  />
                  <Text size={2} mono color="tertiary">
                    {space}
                  </Text>
                </Frame>
              ))}
            </Frame>
          </ProseDocument>

          {/* Radius */}
          <ProseDocument maxWidth="1000px" gap={6}>
            <Prose role="h2">Radius</Prose>
            <Frame row wrap="wrap" gap={8}>
              {RADII.map((radius) => (
                <Frame
                  key={radius}
                  w={40}
                  ratio="1"
                  surface="raised"
                  rounded={radius === "rounded" ? true : radius}
                  pack
                  p={8}
                >
                  <Text size={3} color="secondary" weight="bold">
                    {radius}
                  </Text>
                </Frame>
              ))}
            </Frame>
          </ProseDocument>

          {/* Shadows */}
          <ProseDocument maxWidth="1000px" gap={6}>
            <Prose role="h2">Shadows</Prose>
            <Frame row gap={10} p={12} surface="sunken" rounded="3xl">
              {SHADOWS.map((shadow) => (
                <Frame
                  key={shadow}
                  w={48}
                  h={48}
                  surface="base"
                  rounded="2xl"
                  align="center"
                  pack
                  shadow={shadow}
                >
                  <Text weight="bold" color="secondary" size={4}>
                    {shadow}
                  </Text>
                </Frame>
              ))}
            </Frame>
          </ProseDocument>
        </Frame>
      </ProseSection>
    </Frame>
  );
}

// Helper to resolve tokens for spacing visualization
function toToken(value: number | string, prefix: string) {
  return `var(--${prefix}-${String(value).replace(".", "-")})`;
}
