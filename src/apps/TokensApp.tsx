import { Frame } from "@/design-system/Frame/Frame.tsx";
import { Text } from "@/design-system/text/Text";
import {
  ContainerSize,
  ElevationScale,
  FontSize,
  FontSizeScale,
  Opacity,
  OpacityScale,
  Radius,
  RadiusScale,
  Size,
  SizeScale,
  Space,
  SpaceScale,
  type SpaceToken,
  ZIndexScale,
} from "@/design-system/token/token.const.1tier";
import { Radius2 } from "@/design-system/token/radius2";

// --- Components ---

function ScaleVisualizer({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      override={{ w: Size.fill, gap: Space.n24, minHeight: Size.n40 }}
    >
      <Frame override={{ w: Size.n64 }}>
        <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>
          {label}
        </Text.Card.Code>
      </Frame>
      <Frame override={{ flex: 1, minWidth: Size.n0 }}>{children}</Frame>
      <Frame override={{ w: Size.n64, justify: "end" }}>
        <Text.Card.Code style={{ opacity: 0.3 }}>{value}</Text.Card.Code>
      </Frame>
    </Frame>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <Frame layout={Layout.Col.Center.Start} spacing={Space.n0}>
      <Frame
        override={{ gap: Space.n8, w: Size.fill, maxWidth: ContainerSize.n800 }}
      >
        <Text.Prose.Title variant="md">{title}</Text.Prose.Title>
        <Text.Prose.Body style={{ color: "var(--text-secondary)" }}>
          {desc}
        </Text.Prose.Body>
        <Frame override={{ h: Size.n16 }} />
        <Frame
          style={{ height: "1px" }}
          override={{ w: Size.fill }}
          surface="overlay"
        />
        <Frame override={{ h: Size.n16 }} />
      </Frame>
    </Frame>
  );
}

function TextColumn({
  children,
  gap = Space.n32,
}: {
  children: React.ReactNode;
  gap?: SpaceToken;
}) {
  return (
    <Frame override={{ w: Size.fill, align: "center" }}>
      <Frame override={{ w: Size.fill, maxWidth: ContainerSize.n800, gap }}>
        {children}
      </Frame>
    </Frame>
  );
}

function ScrollContainer({
  children,
  ...props
}: React.ComponentProps<typeof Frame>) {
  return (
    <Frame
      scroll="x"
      override={{ w: Size.fill, p: Space.n32, maxWidth: Size.fill }}
      style={{
        maskImage: "linear-gradient(to right, black 95%, transparent 100%)", // Prevent parent blowout
      }}
      layout={Layout.Col.Center.Start}
      spacing={Space.n0}
    >
      <Frame
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        override={{ gap: Space.n24, minWidth: Size.hug, minHeight: Size.n40 }}
        {...props}
      >
        {children}
      </Frame>
    </Frame>
  );
}

export function TokensApp() {
  return (
    <Frame
      surface="base"
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      w={Size.fill}
      override={{ p: Space.n0 }}
    >
      <Frame
        override={{ w: Size.fill, maxWidth: ContainerSize.n1024, p: Space.n0 }}
        layout={Layout.Row.Stretch.Start}
        spacing={Space.n0}
        w={Size.fill}
        h={Size.fill}
      >
        <Frame
          override={{
            gap: Space.n64,
            py: Space.n40,
            px: Space.n24,
            w: Size.fill,
            minWidth: Size.n0,
          }}
        >
          {/* Header & Philosophy */}
          <TextColumn gap={Space.n40}>
            <Frame layout={Layout.Col.Left.Start} spacing={Space.n16}>
              <Frame layout={Layout.Row.Middle.Start} spacing={Space.n12}>
                <Frame surface="primary" override={{ p: Space.n8, r: Radius.n8 }}>
                  <Text.Card.Code style={{ color: "white" }}>V</Text.Card.Code>
                </Frame>
                <Text.Prose.Title variant="xl">
                  Vanilla-Native Architecture
                </Text.Prose.Title>
              </Frame>
              <Text.Prose.Body
                variant="lg"
                style={{ color: "var(--text-secondary)", maxWidth: "48ch" }}
              >
                We shifted from utility-first to <b>Type-Safe Fidelity</b>.
                Using Vanilla Extract, we enforce design tokens at the compiler level,
                eliminating AI hallucinations.
              </Text.Prose.Body>
            </Frame>

            {/* Philosophy Cards */}
            <Frame
              layout={Layout.Row.Stretch.Start}
              spacing={Space.n0}
              override={{ gap: Space.n24, w: Size.fill }}
            >
              <Frame
                override={{ flex: 1, p: Space.n32, gap: Space.n12 }}
                rounded={Radius2.xl}
                surface="sunken"
                style={{ border: "1px solid var(--surface-border)" }}
              >
                <Text.Card.Title>Zero-Runtime</Text.Card.Title>
                <Text.Card.Desc>
                  Styles are static CSS. No JS calculation overhead during render.
                </Text.Card.Desc>
              </Frame>

              <Frame
                override={{ flex: 1, p: Space.n32, gap: Space.n12 }}
                rounded={Radius2.xl}
                surface="sunken"
                style={{ border: "1px solid var(--surface-border)" }}
              >
                <Text.Card.Title>Type-Safe Recipes</Text.Card.Title>
                <Text.Card.Desc>
                  Variants are typed unions (e.g., <code>'primary' | 'secondary'</code>).
                  Invalid props are build errors.
                </Text.Card.Desc>
              </Frame>

              <Frame
                override={{ flex: 1, p: Space.n32, gap: Space.n12 }}
                rounded={Radius2.xl}
                surface="sunken"
                style={{ border: "1px solid var(--surface-border)" }}
              >
                <Text.Card.Title>The Whitelist</Text.Card.Title>
                <Text.Card.Desc>
                  No magic numbers. We use <b>Space Scale</b> and <b>Size Scale</b> strictly.
                </Text.Card.Desc>
              </Frame>
            </Frame>
          </TextColumn>

          {/* 1. Spacing Scale - Centered Prose List */}
          <Frame override={{ w: Size.fill, gap: Space.n32 }}>
            <SectionHeader
              title="Space"
              desc="The rhythm of the page. Margins, paddings, gaps."
            />
            {/* Spacing is vertical list, fits well in prose width */}
            <TextColumn>
              <Frame override={{ gap: Space.n12, w: Size.fill }}>
                {SpaceScale.map((val: any) => (
                  <ScaleVisualizer
                    key={val}
                    label={`n${val}`}
                    value={`${val}px`}
                  >
                    <Frame
                      surface="primary"
                      style={{
                        width: `var(--space-n${val})`,
                        transition: "width 0.3s ease",
                      }}
                      override={{ h: Size.n24 }}
                      rounded={Radius2.sm}
                    />
                  </ScaleVisualizer>
                ))}
              </Frame>
            </TextColumn>
          </Frame>

          {/* 2. Size Scale - Horizontal Scroll (Breakout) */}
          <Frame override={{ w: Size.fill, gap: Space.n32, minWidth: Size.n0 }}>
            <SectionHeader
              title="Size"
              desc="Component widths and heights. Defines density."
            />
            {/* Scrollable Container breaking prose width constraints */}
            <ScrollContainer>
              {SizeScale.map((val: any) => (
                <Frame
                  key={val}
                  surface="overlay"
                  style={{
                    border: "var(--border-width-n1) solid var(--border-color)",
                    width: `var(--size-n${val})`,
                    height: `var(--size-n${val})`,
                    minWidth: `var(--size-n${val})`, // Ensure it doesn't shrink
                    minHeight: `var(--size-n${val})`,
                  }}
                  rounded={Radius2.xl}
                  layout={Layout.Col.Center.Start}
                  spacing={Space.n0}
                >
                  <Text.Card.Code
                    style={{ fontSize: "var(--font-size-n10)", opacity: 0.5 }}
                  >
                    n{val}
                  </Text.Card.Code>
                </Frame>
              ))}
            </ScrollContainer>
          </Frame>

          {/* 3. Radius Scale - Horizontal Scroll */}
          <Frame override={{ w: Size.fill, gap: Space.n32, minWidth: Size.n0 }}>
            <SectionHeader title="Radius" desc="Softness of shapes." />
            <ScrollContainer>
              {RadiusScale.map((val: any) => (
                <Frame
                  key={val}
                  surface="raised"
                  layout={Layout.Col.Center.Start}
                  spacing={Space.n0}
                  override={{
                    w: Size.n96,
                    h: Size.n96,
                    minWidth: Size.n96,
                    r: Radius[`n${val}` as keyof typeof Radius],
                  }}
                >
                  <Text.Card.Code>n{val}</Text.Card.Code>
                </Frame>
              ))}
            </ScrollContainer>
          </Frame>

          {/* 4. Elevation Scale - Horizontal Scroll */}
          <Frame override={{ w: Size.fill, gap: Space.n32, minWidth: Size.n0 }}>
            <SectionHeader
              title="Elevation"
              desc="Depth, Shadow, and Z-axis hierarchy."
            />
            <ScrollContainer>
              {ElevationScale.map((val: any) => (
                <Frame
                  key={val}
                  style={{
                    backgroundColor: "white",
                    boxShadow: `var(--elevation-n${val})`,
                  }}
                  layout={Layout.Col.Center.Start}
                  spacing={Space.n0}
                  override={{
                    w: Size.n96,
                    h: Size.n96,
                    minWidth: Size.n96,
                    r: Radius.n12,
                  }}
                >
                  <Text.Card.Code>n{val}</Text.Card.Code>
                </Frame>
              ))}
            </ScrollContainer>
          </Frame>

          {/* 5. Z-Index Scale - Visual Stack (Prose Width) */}
          <Frame override={{ w: Size.fill, gap: Space.n32 }}>
            <SectionHeader title="Z-Index" desc="Elevation depth & Stacking." />
            <TextColumn>
              <Frame
                rounded={Radius2["3xl"]}
                surface="sunken"
                override={{
                  h: Size.n256,
                  w: Size.fill,
                  p: Space.n48,
                  align: "center",
                }}
              >
                <Frame
                  style={{
                    position: "relative",
                  }}
                  override={{ w: Size.fill, h: Size.fill }}
                >
                  {ZIndexScale.filter((_: any, i: any) => i % 2 === 0).map((val: any, i: any) => (
                    <Frame
                      key={val}
                      surface="base"
                      style={{
                        position: "absolute",
                        zIndex: `var(--z-index-n${val})`,
                        top: `${i * 20}px`,
                        left: `${i * 40}px`,
                        boxShadow: "var(--elevation-n2)",
                        border:
                          "var(--border-width-n1) solid var(--border-color)",
                      }}
                      override={{ w: Size.n160, h: Size.n128, p: Space.n16 }}
                      rounded={Radius2.xl}
                    >
                      <Text.Card.Title>n{val}</Text.Card.Title>
                    </Frame>
                  ))}
                </Frame>
              </Frame>
            </TextColumn>
          </Frame>

          {/* 5. Opacity Scale - Horizontal Scroll */}
          <Frame override={{ w: Size.fill, gap: Space.n32, minWidth: Size.n0 }}>
            <SectionHeader title="Opacity" desc="Transparency levels." />
            <ScrollContainer>
              {OpacityScale.filter((x: any) => x % 10 === 0).map((val: any) => (
                <Frame
                  key={val}
                  layout={Layout.Col.Left.Start}
                  spacing={Space.n8}
                >
                  <Frame
                    surface="primary"
                    opacity={Opacity[`n${val}` as keyof typeof Opacity]}
                    override={{ w: Size.n64, h: Size.n64, minWidth: Size.n64 }}
                    rounded={Radius2.lg}
                  />
                  <Text.Card.Code>n{val}</Text.Card.Code>
                </Frame>
              ))}
            </ScrollContainer>
          </Frame>

          {/* 6. Font Size Scale - Prose Width */}
          <Frame override={{ w: Size.fill, gap: Space.n32, minWidth: Size.n0 }}>
            <SectionHeader title="Font Size" desc="Typography scale." />
            <TextColumn>
              <Frame override={{ gap: Space.n16, w: Size.fill }}>
                {FontSizeScale.map((val: any) => (
                  <Frame
                    key={val}
                    layout={Layout.Row.Middle.Center}
                    spacing={Space.n12}
                    override={{ align: "baseline", minHeight: Size.n40 }}
                  >
                    <Frame override={{ w: Size.n64 }}>
                      <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>
                        n{val}
                      </Text.Card.Code>
                    </Frame>
                    <Frame override={{ flex: 1, minWidth: Size.n0 }}>
                      <Text
                        size={FontSize[`n${val}` as keyof typeof FontSize]}
                        style={{ color: "var(--text-primary)" }}
                      >
                        The quick brown fox.
                      </Text>
                    </Frame>
                  </Frame>
                ))}
              </Frame>
            </TextColumn>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
