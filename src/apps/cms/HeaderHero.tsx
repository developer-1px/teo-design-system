import { ArrowUpRight, Command, Sparkles } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  IconSize,
  Size,
  Space, Opacity, ContainerSize
} from "../../design-system/token/token.const.1tier";
import {
  Radius2
} from "../../design-system/token/token.const.2tier";
import { EditableWrapper } from "./EditableWrapper";

export function HeaderHero() {
  return (
    <Frame
      override={{ w: Size.fill, clip: true }}
      style={{ position: "relative" }}
      surface="base"
    >
      <Frame
        override={{
          w: Size.fill,
          py: Space.n88,
          px: Space.n24,
          gap: Space.n12,
        }}
        style={{
          minHeight: "90vh",
          maxWidth: "var(--container-n1280)",
          margin: "0 auto",
        } as React.CSSProperties}
      >
        {/* Background Decoration */}
        <Frame
          override={{
            opacity: Opacity.n10
          }}
          style={{
            position: "absolute",
            top: "-25px",
            right: "-25px",
            background: "var(--color-primary)",
            filter: "blur(150px)"
          }}
        />
        <Frame
          override={{
            opacity: Opacity.n15
          }}
          style={{
            position: "absolute",
            bottom: "-25px",
            left: "-25px",
            background: "var(--color-warning)",
            filter: "blur(150px)"
          }}
        />

        <Frame
          override={{ maxWidth: ContainerSize.n800, w: Size.fill, gap: Space.n24, align: "center" }}
        >
          <Frame
            override={{ r: Radius2.full, py: Space.n4, px: Space.n12, gap: Space.n8, align: "center" }}
            surface="raised"
            layout={Layout.Row.Item.Compact}
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
            <Text.Prose.Title variant="xl" style={{ textAlign: "center" }}>
              Build your dream site <br />
              <span style={{ color: "var(--color-primary)" }}>
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
                The visual engine for creators who demand perfection. No code, no
                constraints, just pure creativity.
              </Text.Prose.Body>
            </EditableWrapper>
          </Frame>

          <Frame
            layout={Layout.Row.Actions.Default}
            override={{ gap: Space.n12, align: "center" }}
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
          style={{
            position: "relative",
            marginTop: "var(--space-n64)",
            transform: "perspective(1000px) rotateX(5deg)",
            margin: "0 auto",
          } as React.CSSProperties}
          surface="raised"
          clip
        >
          <Frame
            surface="raised"
            layout={Layout.Row.Item.Tight}
            override={{
              h: Size.n12,
              px: Space.n4,
              gap: Space.n2,
              align: "center",
              border: true,
            }}
          >
            <Frame
              override={{ w: Size.n12, h: Size.n12, r: Radius2.full }}
              surface="overlay"
            />
            <Frame
              override={{ w: Size.n12, h: Size.n12, r: Radius2.full }}
              surface="overlay"
            />
            <Frame
              override={{ w: Size.n12, h: Size.n12, r: Radius2.full }}
              surface="overlay"
            />
            <Frame flex />
            <Icon src={Command} size={IconSize.n14} style={{ opacity: 0.3 }} />
          </Frame>
          <Frame
            layout={Layout.Row.AppContainer.Default}
            fill
            override={{ justify: "start" }}
          >
            <Frame
              override={{
                w: Size.n64,
                p: Space.n4,
                gap: Space.n4,
                border: true,
              }}
              surface="sunken"
            >
              <Frame
                override={{ h: Size.n16, r: Radius2.full }}
                style={{ width: "80%" } as React.CSSProperties}
                surface="overlay"
              />
              <Frame
                override={{ h: Size.n4, r: Radius2.full }}
                style={{ width: "60%" } as React.CSSProperties}
                surface="overlay"
              />
              <Frame flex />
              <Frame
                override={{ h: Size.n12, w: Size.fill, r: Radius2.lg }}
                surface="raised"
              />
            </Frame>
            <Frame
              override={{ p: Space.n12, gap: Space.n6 }}
              flex
              surface="base"
              pack
            >
              <Frame
                override={{ w: Size.n32, h: Size.n32, shadow: "lg", r: Radius2["2xl"] }}
                surface="raised"
                pack
              >
                <Icon
                  src={Sparkles}
                  size={IconSize.n20}
                  style={{ color: "var(--color-primary)" }}
                />
              </Frame>
              <Frame override={{ gap: Space.n4, align: "center" }}>
                <Frame
                  override={{ h: Size.n4, w: Size.n48, r: Radius2.full }}
                  surface="overlay"
                />
                <Frame
                  override={{ h: Size.n4, w: Size.n72, r: Radius2.full }}
                  surface="raised"
                />
              </Frame>
            </Frame>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
