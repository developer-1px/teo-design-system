import { ArrowUpRight, Command, Sparkles } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text";
import {
  ContainerSize,
  FontSize,
  IconSize,
  Opacity,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
import { EditableWrapper } from "./EditableWrapper";

export function HeaderHero() {
  return (
    <Frame
      override={{ w: Size.fill, clip: true }}
      style={{ position: "relative" }}
      surface="base"
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
    >
      <Frame
        layout={Layout.Col.Center.Start}
        spacing={Space.n0}
        h={Size.fill}
        override={{
          py: Space.n88,
          px: Space.n24,
          gap: Space.n12,
        }}
      >
        {/* Background Decoration */}
        <Frame
          override={{
            opacity: Opacity.n10,
          }}
          style={{
            position: "absolute",
            top: "-25px",
            right: "-25px",
            background: "var(--color-primary)",
            filter: "blur(150px)",
          }}
        />
        <Frame
          override={{
            opacity: Opacity.n15,
          }}
          style={{
            position: "absolute",
            bottom: "-25px",
            left: "-25px",
            background: "var(--color-warning)",
            filter: "blur(150px)",
          }}
        />

        <Frame
          layout={Layout.Col.Left.Start}
          spacing={Space.n16}
          override={{
            align: "center",
            maxWidth: ContainerSize.n800,
            w: Size.fill,
            gap: Space.n24,
          }}
        >
          <Frame
            override={{
              r: Radius2.full,
              py: Space.n4,
              px: Space.n12,
              gap: Space.n8,
              minHeight: Size.n24,
            }}
            surface="raised"
            layout={Layout.Row.Middle.Center}
            spacing={Space.n4}
          >
            <Icon
              src={Sparkles}
              size={IconSize.n12}
              style={{ color: "var(--color-primary)" }}
            />
            <Text.Card.Note
              size={FontSize.n12}
              weight="bold"
              style={{
                color: "var(--text-secondary)",
                letterSpacing: "0.02em",
              }}
            >
              NEXT GENERATION CMS IS HERE
            </Text.Card.Note>
          </Frame>

          <EditableWrapper style={{ width: "100%" }}>
            <Text.Prose.Title
              variant="2xl"
              weight="bold"
              style={{ textAlign: "center", lineHeight: "1.1" }}
            >
              Build your dream site <br />
              <span
                style={{
                  background:
                    "linear-gradient(to right, var(--color-primary), var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                pixel by pixel.
              </span>
            </Text.Prose.Title>
          </EditableWrapper>

          <Frame override={{ maxWidth: ContainerSize.n640 }}>
            <EditableWrapper>
              <Text.Prose.Body
                size={FontSize.n14}
                weight="medium"
                style={{
                  textAlign: "center",
                  letterSpacing: "0.01em",
                  opacity: 0.8,
                }}
              >
                The visual engine for creators who demand perfection. No code,
                no constraints, just pure creativity.
              </Text.Prose.Body>
            </EditableWrapper>
          </Frame>

          <Frame
            layout={Layout.Row.Middle.End}
            spacing={Space.n8}
            override={{ gap: Space.n12 }}
          >
            <Action
              label="Start Creating"
              variant="primary"
              size="lg"
              glow
              h={Size.n56}
              px={Space.n32}
              rounded={Radius2.full}
            >
              <Icon src={ArrowUpRight} size={IconSize.n20} />
            </Action>
            <Action
              label="Talk to Sales"
              variant="surface"
              size="lg"
              h={Size.n56}
              px={Space.n32}
              rounded={Radius2.full}
            />
          </Frame>
        </Frame>

        {/* Hero Visual: Mockup UI */}
        <Frame
          override={{
            w: Size.fill,
            maxWidth: Size.n384 as any,
            r: Radius2["2xl"],
          }}
          style={
            {
              position: "relative",
              marginTop: "var(--space-n64)",
              transform: "perspective(1000px) rotateX(5deg)",
              margin: "0 auto",
              overflow: "hidden",
            } as React.CSSProperties
          }
          surface="raised"
        >
          <Frame
            surface="raised"
            layout={Layout.Row.Middle.Center}
            spacing={Space.n8}
            override={{
              h: Size.n12,
              px: Space.n4,
              gap: Space.n2,
              border: true,
              minHeight: Size.n32,
            }}
          >
            <Frame
              override={{ w: Size.n12, h: Size.n12, r: Radius2.full }}
              style={{ background: "#FF5F57" }} // Mac Red
            />
            <Frame
              override={{ w: Size.n12, h: Size.n12, r: Radius2.full }}
              style={{ background: "#FEBC2E" }} // Mac Yellow
            />
            <Frame
              override={{ w: Size.n12, h: Size.n12, r: Radius2.full }}
              style={{ background: "#28C840" }} // Mac Green
            />
            <Frame override={{ flex: 1 }} />
            <Icon src={Command} size={IconSize.n14} style={{ opacity: 0.3 }} />
          </Frame>
          <Frame
            layout={Layout.Row.Stretch.Start}
            spacing={Space.n0}
            w={Size.fill}
            h={Size.fill}
            override={{ fill: true, clip: true }}
            surface="base"
          >
            {/* Sidebar Mockup */}
            <Frame
              override={{
                w: Size.n64,
                h: Size.fill,
                borderRight: true,
                p: Space.n8,
                gap: Space.n6,
                align: "center",
              }}
              surface="sunken"
            >
              <Frame
                override={{ w: Size.n32, h: Size.n32, r: Radius2.md }}
                surface="overlay"
              />
              <Frame
                override={{ w: Size.n4, h: Size.n4, r: Radius2.full }}
                surface="overlay"
              />
              <Frame
                override={{ w: Size.n4, h: Size.n4, r: Radius2.full }}
                surface="overlay"
              />
            </Frame>

            {/* Main Content Mockup */}
            <Frame override={{ flex: 1, p: Space.n16, gap: Space.n12 }}>
              <Frame
                override={{ w: Size.fill, h: Size.n32, r: Radius2.lg }}
                surface="raised"
              />
              <Frame
                layout={Layout.Row.Middle.Center}
                spacing={Space.n8}
                override={{ w: Size.fill, pack: "start" }}
              >
                <Frame
                  override={{ flex: 1, h: Size.n64, r: Radius2.lg }}
                  surface="raised"
                />
                <Frame
                  override={{ flex: 1, h: Size.n64, r: Radius2.lg }}
                  surface="raised"
                />
              </Frame>
              <Frame
                override={{ w: Size.fill, h: Size.n128, r: Radius2.lg }}
                surface="raised"
              />
            </Frame>

            {/* Right Panel Mockup */}
            <Frame
              override={{
                w: Size.n48,
                h: Size.fill,
                borderLeft: true,
                p: Space.n8,
                gap: Space.n4,
              }}
              surface="sunken"
            >
              <Frame
                override={{ w: Size.fill, h: Size.n4, r: Radius2.full }}
                surface="overlay"
              />
              <Frame
                override={{ w: Size.fill, h: Size.n4, r: Radius2.full }}
                surface="overlay"
              />
              <Frame
                override={{ w: Size.fill, h: Size.n4, r: Radius2.full }}
                surface="overlay"
              />
            </Frame>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
