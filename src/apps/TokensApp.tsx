import { Action } from "../design-system/Action";
import { Field } from "../design-system/Field";
import { Frame } from "../design-system/Frame";
import { Prose, ProseDocument, ProseSection } from "../design-system/Prose";
import { Text } from "../design-system/Text";

const SURFACE_COLORS = [
    { name: "surface-base", var: "--surface-base", hex: "#ffffff" },
    { name: "surface-sunken", var: "--surface-sunken", hex: "#f4f4f5" },
    { name: "surface-raised", var: "--surface-raised", hex: "#e4e4e7" },
    { name: "surface-overlay", var: "--surface-overlay", hex: "#d4d4d8" },
    { name: "surface-primary", var: "--surface-primary", hex: "#18181b" },
    { name: "surface-selected", var: "--surface-selected", hex: "#ffffff" },
];

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
            { name: "focus-ring", var: "--focus-ring" },
        ],
    },
];

const SHADOWS = ["sm", "md", "lg"];
const RADII = [
    "none",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "full",
    "round",
    "round-md",
];
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
        <Frame surface="sunken" border rounded="lg" overflow="hidden">
            <Frame h={24} style={{ background: hex }} />
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
            <ProseSection p="96 24">
                <ProseDocument maxWidth="1000px" gap={8}>
                    {/* Header */}
                    <Frame gap={4}>
                        <Prose role="h1">Design Tokens</Prose>
                        <Prose role="body" color="secondary">
                            A comprehensive reference of the design values that power the
                            Minimal Design Kit.
                        </Prose>
                    </Frame>

                    {/* Surfaces */}
                    <Frame gap={4}>
                        <Prose role="h2">Surfaces</Prose>
                        <Prose role="body">
                            Background colors for widely used layers.
                        </Prose>
                        <Frame
                            grid
                            columns="repeat(auto-fill, minmax(200px, 1fr))"
                            gap={4}
                            w="100%"
                        >
                            {SURFACE_COLORS.map((color) => (
                                <ColorCard
                                    key={color.name}
                                    name={color.name}
                                    variable={color.var}
                                    hex={color.hex}
                                />
                            ))}
                        </Frame>
                    </Frame>

                    {/* Interaction */}
                    <Frame gap={4}>
                        <Prose role="h2">Interaction</Prose>
                        <Prose role="body">
                            State-based tokens for interactive elements.
                        </Prose>
                        <Frame gap={6}>
                            {INTERACTION_TOKENS.map((group) => (
                                <Frame key={group.label} gap={3}>
                                    <Frame>
                                        <Prose role="h4">{group.label}</Prose>
                                        <Prose role="body-sm" color="secondary">
                                            {group.description}
                                        </Prose>
                                    </Frame>
                                    <Frame
                                        grid
                                        columns="repeat(auto-fill, minmax(200px, 1fr))"
                                        gap={4}
                                        w="100%"
                                    >
                                        {group.tokens.map((token) => (
                                            <Frame
                                                key={token.name}
                                                surface="sunken"
                                                border
                                                rounded="lg"
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
                                                    {token.name === "link-hover-color" && (
                                                        <Text
                                                            style={{ color: "var(--link-hover-color)" }}
                                                            weight="medium"
                                                        >
                                                            Link Hover
                                                        </Text>
                                                    )}
                                                    {token.name === "link-color" && (
                                                        <Text
                                                            style={{ color: "var(--link-color)" }}
                                                            weight="medium"
                                                        >
                                                            Link
                                                        </Text>
                                                    )}
                                                </Frame>
                                                <Frame p={3} gap={1}>
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
                                    {/* Live Demo for Interactions */}
                                    <Frame
                                        surface="sunken"
                                        p={4}
                                        rounded="lg"
                                        border
                                        gap={4}
                                        w="100%"
                                    >
                                        <Text size={2} weight="bold" color="secondary">
                                            LIVE PREVIEW
                                        </Text>
                                        <Frame row gap={4} align="center" wrap="wrap">
                                            {group.label.includes("Field") && (
                                                <>
                                                    <Field value="Default" style={{ width: 150 }} />
                                                    <Field
                                                        value="Focused"
                                                        style={{
                                                            width: 150,
                                                            background: "var(--field-bg-focus)",
                                                            boxShadow: "var(--focus-ring)",
                                                        }}
                                                    />
                                                </>
                                            )}
                                            {group.label.includes("Link") && (
                                                <>
                                                    <Text style={{ color: "var(--link-color)" }}>
                                                        Regular Link
                                                    </Text>
                                                    <Text style={{ color: "var(--link-hover-color)" }}>
                                                        Hover Link
                                                    </Text>
                                                </>
                                            )}
                                            {group.label.includes("Component") && (
                                                <>
                                                    <Action label="Tab Active" variant="surface" />
                                                    <Frame
                                                        p="1 3"
                                                        rounded="md"
                                                        style={{
                                                            background: "var(--tab-bg-active)",
                                                            border: "1px solid var(--border-color)",
                                                        }}
                                                    >
                                                        <Text size={3}>Active Tab bg</Text>
                                                    </Frame>
                                                </>
                                            )}
                                        </Frame>
                                    </Frame>
                                </Frame>
                            ))}
                        </Frame>
                    </Frame>

                    {/* Text & Accents */}
                    <Frame gap={4}>
                        <Prose role="h2">Text & Accents</Prose>
                        <Prose role="body">
                            Typography colors and primary accents.
                        </Prose>
                        <Frame
                            grid
                            columns="repeat(auto-fill, minmax(200px, 1fr))"
                            gap={4}
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
                    </Frame>

                    {/* Other sections unchanged... */}
                    {/* Typography */}
                    <Frame gap={4}>
                        <Prose role="h2">Typography</Prose>
                        {/* ... */}
                        <Frame
                            gap={6}
                            surface="sunken"
                            p={8}
                            rounded="xl"
                            border
                        >
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
                    </Frame>

                    {/* Spacing */}
                    <Frame gap={4}>
                        <Prose role="h2">Spacing</Prose>
                        <Frame row wrap="wrap" gap={4}>
                            {SPACINGS.map((space) => (
                                <Frame key={space} gap={1}>
                                    <Frame
                                        style={{
                                            width: `var(--space-${space.toString().replace(".", "-")})`,
                                            height: 24,
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
                    </Frame>

                    {/* Radius */}
                    <Frame gap={4}>
                        <Prose role="h2">Radius</Prose>
                        <Frame row wrap="wrap" gap={4}>
                            {RADII.map((radius) => (
                                <Frame
                                    key={radius}
                                    w={24}
                                    h={24}
                                    surface="raised"
                                    border
                                    style={{ borderRadius: `var(--radius-${radius})` }}
                                    align="center"
                                    pack
                                >
                                    <Text size={2} color="secondary">
                                        {radius.replace("radius-", "")}
                                    </Text>
                                </Frame>
                            ))}
                        </Frame>
                    </Frame>

                    {/* Shadows */}
                    <Frame gap={4}>
                        <Prose role="h2">Shadows</Prose>
                        <Frame row gap={6} p={4} surface="sunken" rounded="xl">
                            {SHADOWS.map((shadow) => (
                                <Frame
                                    key={shadow}
                                    w={32}
                                    h={32}
                                    surface="base"
                                    rounded="lg"
                                    align="center"
                                    pack
                                    style={{ boxShadow: `var(--shadow-${shadow})` }}
                                >
                                    <Text weight="bold" color="secondary">
                                        {shadow}
                                    </Text>
                                </Frame>
                            ))}
                        </Frame>
                    </Frame>
                </ProseDocument>
            </ProseSection>
        </Frame>
    );
}
