import { Cpu, Globe, Shield, Zap } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  IconSize,
  Opacity,
  Size,
  Space, ZIndex } from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";

export function ImageFooterBanner() {
  return (
    <Frame
      override={{
        w: Size.fill,
        py: Space.n96,
        px: Space.n24,
      }}
      surface="base" border="bottom"
    >
      <Frame
        override={{ w: Size.fill, h: Size.n128 }}
        rounded={Radius2["3xl"]}
        style={{
          position: "relative",
          background: "linear-gradient(225deg, #1a1a1a, #000)",
          maxWidth: "var(--container-n1280)",
          margin: "0 auto",
        }}
        clip
      >
        {/* Visual texture */}
        <Frame
          override={{
            opacity: Opacity.n10,
            w: Size.fill,
            h: Size.fill,
          }}
          style={{
            position: "absolute",
            backgroundImage:
              "radial-gradient(circle at center, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <Frame
          style={{
            maxWidth: "var(--container-n640)",
            position: "relative",
            margin: "0 auto",
          }}
          fill
          override={{ p: Space.n24, gap: Space.n24, align: "center",
              zIndex: ZIndex.n10
        }}
        >
          <Text.Prose.Title
            variant="xl"
            style={{ color: "white", textAlign: "center" }}
          >
            Ready to elevate <br /> your web presence?
          </Text.Prose.Title>
          <Text.Prose.Body
            size={FontSize.n16}
            style={{
              color: "white",
              textAlign: "center",
              opacity: Opacity.n60,
            }}
          >
            Join 2,000+ companies building high-performance marketing sites with
            our Visual Engine.
          </Text.Prose.Body>
          <Frame
            override={{ gap: Space.n16 }}
            layout={Layout.Row.Actions.Default}
          >
            <Action
              label="Start for Free"
              variant="primary"
              size="lg"
              glow
              h={Size.n56}
              px={Space.n32}
              rounded={Radius2.full}
            />
            <Action
              label="Browse Templates"
              variant="surface"
              size="lg"
              h={Size.n56}
              px={Space.n32}
              rounded={Radius2.full}
            />
          </Frame>
        </Frame>
      </Frame>

      {/* Partner Logos */}
      <Frame
        override={{
          gap: Space.n32,
          pt: Space.n48,
          pb: Space.n24,
          align: "center",
        }}
      >
        <Text.Card.Note
          size={FontSize.n12}
          weight="bold"
          style={{
            color: "var(--text-tertiary)",
            opacity: Opacity.n50,
            letterSpacing: "0.05em",
          }}
        >
          TRUSTED WORLDWIDE
        </Text.Card.Note>
        <Frame
          layout={Layout.Wrap.Chips.Loose}
          wrap
          override={{
            gap: Space.n48,
            py: Space.n0,
            px: Space.n24,
            opacity: Opacity.n40,
            justify: "center",
          }}
        >
          <Frame
            layout={Layout.Row.Item.Tight}
            override={{ gap: Space.n8, align: "center" }}
          >
            <Icon src={Zap} size={IconSize.n24} />
            <Text.Card.Title size={FontSize.n16} weight="bold">
              Bolt
            </Text.Card.Title>
          </Frame>
          <Frame
            layout={Layout.Row.Item.Tight}
            override={{ gap: Space.n8, align: "center" }}
          >
            <Icon src={Globe} size={IconSize.n24} />
            <Text.Card.Title size={FontSize.n16} weight="bold">
              Stripe
            </Text.Card.Title>
          </Frame>
          <Frame
            layout={Layout.Row.Item.Tight}
            override={{ gap: Space.n8, align: "center" }}
          >
            <Icon src={Shield} size={IconSize.n24} />
            <Text.Card.Title size={FontSize.n16} weight="bold">
              Linear
            </Text.Card.Title>
          </Frame>
          <Frame
            layout={Layout.Row.Item.Tight}
            override={{ gap: Space.n8, align: "center" }}
          >
            <Icon src={Cpu} size={IconSize.n24} />
            <Text.Card.Title size={FontSize.n16} weight="bold">
              Vercel
            </Text.Card.Title>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
