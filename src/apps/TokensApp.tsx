import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Text } from "../design-system/text/Text";
import {
  ContainerSize,
  FontSize,
  FontSizeScale,
  Opacity,
  OpacityScale,
  Radius,
  RadiusScale,
  Size,
  SizeScale,
  Space,
  type SpaceToken,
  SpaceScale,
  ZIndexScale,
} from "../design-system/token/token.const.1tier";
import { Radius2 } from "../design-system/token/token.const.2tier";

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
      layout={Layout.Row.Item.Default}
      override={{ w: Size.full, gap: Space.n24, align: "center" }}
    >
      <Frame override={{ w: Size.n64 }}>
        <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>
          {label}
        </Text.Card.Code>
      </Frame>
      <Frame flex={1} override={{ minWidth: Size.n0 }}>
        {children}
      </Frame>
      <Frame override={{ w: Size.n64, justify: "end" }}>
        <Text.Card.Code style={{ opacity: 0.3 }}>{value}</Text.Card.Code>
      </Frame>
    </Frame>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <Frame
      override={{ gap: Space.n8, w: Size.full, maxWidth: ContainerSize.n800 }}
      style={{ margin: "0 auto" }}
    >
      <Text.Prose.Title variant="md">{title}</Text.Prose.Title>
      <Text.Prose.Body style={{ color: "var(--text-secondary)" }}>
        {desc}
      </Text.Prose.Body>
      <Frame
        override={{ w: Size.full }}
        style={{ marginBlock: "var(--space-n16)", height: "1px" }}
        surface="overlay"
      />
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
    <Frame
      override={{ w: Size.full, maxWidth: ContainerSize.n800, gap }}
      style={{ margin: "0 auto" }}
    >
      {children}
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
      override={{ w: Size.full }}
      style={{
        paddingBottom: "var(--space-n16)", // Space for scrollbar
        // Hide scrollbar but allow scroll behavior if desired, or keep it.
        // Apple often hides it until scroll.
        // We'll keep standard behavior for accessibility but maybe style it later.
        // Apple often hides it until scroll.
        // We'll keep standard behavior for accessibility but maybe style it later.
        maskImage: "linear-gradient(to right, black 95%, transparent 100%)", // Fade out effect
        maxWidth: "100%", // Prevent parent blowout
      }}
    >
      <Frame
        layout={Layout.Row.Item.Default}
        override={{ gap: Space.n24, minWidth: Size.max }}
        {...props}
      >
        {children}
      </Frame>
    </Frame>
  );
}

export function TokensApp() {
  return (
    <Frame fill surface="base" scroll={"y"} override={{ align: "center" }}>
      <Frame
        override={{ w: Size.full, maxWidth: ContainerSize.n1024, p: Space.n0 }}
        layout={Layout.Row.AppContainer.Default}
      >
        <Frame
          override={{
            gap: Space.n40,
            py: Space.n40,
            px: Space.n24,
            w: Size.full,
            minWidth: Size.n0,
          }}
        >
          {/* Header & Philosophy - Centered Prose */}
          <TextColumn gap={Space.n32}>
            <Frame override={{ gap: Space.n8 }}>
              <Text.Prose.Title variant="xl">
                Design System Metrics
              </Text.Prose.Title>
              <Text.Prose.Body
                variant="lg"
                style={{ color: "var(--text-secondary)" }}
              >
                The physics and constraints of our digital universe.
              </Text.Prose.Body>
            </Frame>

            {/* Philosophy Cards - Stacked or Grid within Prose Width */}
            <Frame
              layout={Layout.Row.Item.Default}
              override={{ gap: Space.n24, w: Size.full }}
            >
              <Frame
                flex={1}
                surface="sunken"
                override={{ p: Space.n32, gap: Space.n12 }}
                rounded={Radius2["2xl"]}
              >
                <Text.Card.Title>The Whitelist Concept</Text.Card.Title>
                <Text.Card.Desc>
                  We explicitly <b>whitelist</b> allowed values to enforce
                  rhythm. No magic numbers allowed.
                </Text.Card.Desc>
              </Frame>

              <Frame
                flex={1}
                surface="sunken"
                override={{ p: Space.n32, gap: Space.n12 }}
                rounded={Radius2["2xl"]}
              >
                <Text.Card.Title>The Meaning of 'n'</Text.Card.Title>
                <Text.Card.Desc>
                  <b>'n'</b> represents an abstract numeric scale, decoupling
                  logic from raw pixels.
                </Text.Card.Desc>
              </Frame>
            </Frame>
          </TextColumn>

          {/* 1. Spacing Scale - Centered Prose List */}
          <Frame override={{ w: Size.full, gap: Space.n32 }}>
            <SectionHeader
              title="Space"
              desc="The rhythm of the page. Margins, paddings, gaps."
            />
            {/* Spacing is vertical list, fits well in prose width */}
            <TextColumn>
              <Frame override={{ gap: Space.n12, w: Size.full }}>
                {SpaceScale.map((val) => (
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
          <Frame override={{ w: Size.full, gap: Space.n32, minWidth: Size.n0 }}>
            <SectionHeader
              title="Size"
              desc="Component widths and heights. Defines density."
            />
            {/* Scrollable Container breaking prose width constraints */}
            <ScrollContainer>
              {SizeScale.map((val) => (
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
                  override={{ align: "center", justify: "center" }}
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
          <Frame override={{ w: Size.full, gap: Space.n32, minWidth: Size.n0 }}>
            <SectionHeader title="Radius" desc="Softness of shapes." />
            <ScrollContainer>
              {RadiusScale.map((val) => (
                <Frame
                  key={val}
                  surface="raised"
                  layout={Layout.Center.Default}
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

          {/* 4. Z-Index Scale - Visual Stack (Prose Width) */}
          <Frame override={{ w: Size.full, gap: Space.n32 }}>
            <SectionHeader title="Z-Index" desc="Elevation depth & Stacking." />
            <TextColumn>
              <Frame
                rounded={Radius2["3xl"]}
                surface="sunken"
                override={{
                  h: Size.n256,
                  w: Size.full,
                  p: Space.n48,
                  align: "center",
                }}
              >
                <Frame
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {ZIndexScale.filter((_, i) => i % 2 === 0).map((val, i) => (
                    <Frame
                      key={val}
                      surface="base"
                      style={{
                        position: "absolute",
                        zIndex: `var(--z-index-n${val})`,
                        top: `${i * 20}px`,
                        left: `${i * 40}px`,
                        boxShadow: "var(--shadow-lg)",
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
          <Frame override={{ w: Size.full, gap: Space.n32, minWidth: Size.n0 }}>
            <SectionHeader title="Opacity" desc="Transparency levels." />
            <ScrollContainer>
              {OpacityScale.filter((x) => x % 10 === 0).map((val) => (
                <Frame key={val} override={{ gap: Space.n8, align: "center" }}>
                  <Frame
                    surface="base"
                    opacity={Opacity[`n${val}` as keyof typeof Opacity]}
                    style={{
                      backgroundColor: "black",
                    }}
                    override={{ w: Size.n64, h: Size.n64, minWidth: Size.n64 }}
                    rounded={Radius2.lg}
                  />
                  <Text.Card.Code>n{val}</Text.Card.Code>
                </Frame>
              ))}
            </ScrollContainer>
          </Frame>

          {/* 6. Font Size Scale - Prose Width */}
          <Frame override={{ w: Size.full, gap: Space.n32, minWidth: Size.n0 }}>
            <SectionHeader title="Font Size" desc="Typography scale." />
            <TextColumn>
              <Frame override={{ gap: Space.n16, w: Size.full }}>
                {FontSizeScale.map((val) => (
                  <Frame
                    key={val}
                    layout={Layout.Row.Item.Default}
                    override={{ align: "baseline" }}
                  >
                    <Frame override={{ w: Size.n64 }}>
                      <Text.Card.Code style={{ color: "var(--text-tertiary)" }}>
                        n{val}
                      </Text.Card.Code>
                    </Frame>
                    <Frame flex={1} override={{ minWidth: Size.n0 }}>
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
