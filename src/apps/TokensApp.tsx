
import {
  Prose,
  ProseDocument,
  ProseSection,
} from "../design-system/Prose";
import { Text } from "../design-system/Text";
import { Frame } from "../design-system/Frame";



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

function TokenLabel({ name, role }: { name: string; role: string }) {
  return (
    <Frame row align="center" gap={2}>
      <Text size={2} mono style={{ color: "var(--text-tertiary)", opacity: 0.7 }}>
        var(--{name})
      </Text>
      <Text size={2} color="tertiary" style={{ opacity: 0.5 }}>
        •
      </Text>
      <Text size={2} color="secondary">
        {role}
      </Text>
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
              gap={6}
              style={{ minHeight: "300px" }}
            >
              {[
                { id: "base", name: "Page", desc: "App Background", hex: "#FFFFFF" },
                { id: "sunken", name: "Panel", desc: "Sidebar / Wells", hex: "#F9F9FB" },
                { id: "raised", name: "Card", desc: "Content Areas", hex: "#FFFFFF" },
                { id: "overlay", name: "Overlay", desc: "Menus / Dialogs", hex: "#FFFFFF" },
                { id: "primary", name: "Primary", desc: "Brand Action", hex: "#18181B" },
              ].map((s) => (
                <Frame
                  key={s.id}
                  surface={s.id as any}
                  p={8}
                  gap={4}
                  flex={1}
                  rounded="2xl"
                  align="center"
                  justify="center"
                  style={{ textAlign: "center" }}
                >
                  <Frame gap={1} align="center">
                    <Text weight="bold" size={5}>
                      {s.name}
                    </Text>
                    <Text size={2} color="tertiary" mono>
                      {s.hex}
                    </Text>
                  </Frame>
                  <Text size={2} color="secondary" style={{ maxWidth: "160px", lineHeight: 1.4, opacity: 0.8 }}>
                    {s.desc}
                  </Text>

                  {/* Token Reference */}
                  <Text size={1} color="tertiary" mono style={{ marginTop: 8, opacity: 0.5 }}>
                    surface-{s.id}
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
            <Frame gap={8} w="100%">
              {/* Text Hierarchy Group */}
              <Frame gap={4}>
                <Prose role="h3">Content Hierarchy</Prose>
                <Prose role="body" color="secondary">
                  Appropriate color usage establishes reading order and importance.
                </Prose>

                <Frame
                  surface="sunken"
                  p={8}
                  gap={6}
                  rounded="xl"
                  border
                >
                  <Frame gap={1}>
                    <Text size={5} weight="bold" style={{ color: "var(--text-primary)" }}>
                      The Design System
                    </Text>
                    <TokenLabel name="text-primary" role="Headings / Titles" />
                  </Frame>

                  <Frame gap={1}>
                    <Text size={3} style={{ color: "var(--text-body)", lineHeight: 1.6 }}>
                      Our design system provides a comprehensive suite of components and tokens to build consistent, high-quality interfaces.
                    </Text>
                    <TokenLabel name="text-body" role="Main Content" />
                  </Frame>

                  <Frame gap={1}>
                    <Text size={2} style={{ color: "var(--text-subtle)" }}>
                      Last updated on Jan 12, 2024 by @antigravity
                    </Text>
                    <TokenLabel name="text-subtle" role="Metadata / Secondary" />
                  </Frame>
                  <Frame gap={1}>
                    <Text size={2} style={{ color: "var(--text-muted)" }}>
                      Enter your comments here...
                    </Text>
                    <TokenLabel name="text-muted" role="Placeholders / Disabled" />
                  </Frame>
                </Frame>
              </Frame>

              {/* UI Elements Group */}
              <Frame gap={4}>
                <Prose role="h3">Core Actions</Prose>
                <Prose role="body" color="secondary">
                  Semantic colors for interactive elements and structural borders.
                </Prose>

                <Frame
                  row
                  gap={8}
                  wrap="wrap"
                >
                  {/* Primary Button Example */}
                  <Frame
                    surface="base"
                    p={6}
                    rounded="xl"
                    border
                    gap={3}
                    flex={1}
                    style={{ minWidth: "240px" }}
                  >
                    <Frame
                      surface="primary"
                      p="2 4"
                      rounded="md"
                      align="center"
                      w="min-content"
                    >
                      <Text style={{ color: "var(--primary-fg)" }} weight="medium">
                        Save Changes
                      </Text>
                    </Frame>
                    <Frame gap={1}>
                      <TokenLabel name="primary-bg" role="Action Background" />
                      <TokenLabel name="primary-fg" role="Action Text" />
                    </Frame>
                  </Frame>

                  {/* Links Example */}
                  <Frame
                    surface="base"
                    p={6}
                    rounded="xl"
                    border
                    gap={3}
                    flex={1}
                    style={{ minWidth: "240px" }}
                  >
                    <Text style={{ color: "var(--link-color)" }} weight="medium">
                      View Documentation →
                    </Text>
                    <TokenLabel name="link-color" role="Interactive Links" />
                  </Frame>

                  {/* Border Example */}
                  <Frame
                    surface="base"
                    p={6}
                    rounded="xl"
                    border
                    gap={3}
                    flex={1}
                    style={{ minWidth: "240px" }}
                  >
                    <Frame
                      p={4}
                      rounded="lg"
                      style={{ border: "1px solid var(--border-color)" }}
                    >
                      <Text size={2} color="secondary">Card with Border</Text>
                    </Frame>
                    <TokenLabel name="border-color" role="Structural Dividers" />
                  </Frame>
                </Frame>
              </Frame>
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
