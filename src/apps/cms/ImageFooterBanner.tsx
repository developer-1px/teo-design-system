import { Cpu, Globe, Shield, Zap } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Space } from "../../design-system/token/token.const.1tier";
import { Icon } from "../../design-system/Icon";
import { IconSize, Size } from "../../design-system/token/token.const.1tier";

export function ImageFooterBanner() {
  return (
    <Frame
      override={{
        w: Size.full,
        py: Space.n96,
        px: Space.n0,
        style: { borderBottom: "1px solid var(--border-color)" },
      }}
      surface="base"
    >
      <Frame
        override={{
          w: Size.full,
          h: Size.n128,
          rounded: "3xl",
          style: {
            position: "relative",
            background: "linear-gradient(225deg, #1a1a1a, #000)",
          },
        }}
        overflow="hidden"
      >
        {/* Visual texture */}
        <Frame
          override={{
            style: {
              position: "absolute",
              opacity: 0.1,
              backgroundImage:
                "radial-gradient(circle at center, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            },
          }}
        />

        <Frame
          override={{
            p: Space.n24,
            style: { maxWidth: 640, position: "relative", zIndex: 10 },
            gap: Space.n24,
          }}
          align="center"
        >
          <Text.Prose.Title
            variant="xl"
            style={{ color: "white", textAlign: "center" }}
          >
            Ready to elevate <br /> your web presence?
          </Text.Prose.Title>
          <Text.Prose.Body
            style={{
              color: "white",
              textAlign: "center",
              opacity: 0.6,
            }}
          >
            Join 2,000+ companies building high-performance marketing sites with
            our Visual Engine.
          </Text.Prose.Body>
          <Frame override={{ gap: Space.n16 }} row>
            <Action
              label="Start for Free"
              variant="primary"
              size="lg"
              glow
              h={56}
              py={Space.n0}
              px={Space.n32}
              rounded="full"
            />
            <Action
              label="Browse Templates"
              variant="surface"
              size="lg"
              h={56}
              py={Space.n0}
              px={Space.n32}
              rounded="full"
            />
          </Frame>
        </Frame>
      </Frame>

      {/* Partner Logos */}
      <Frame
        override={{ style: { paddingTop: 48, paddingBottom: 24 }, gap: Space.n24 }}
        align="center"
      >
        <Text.Card.Note
          style={{
            fontWeight: "bold",
            color: "var(--text-tertiary)",
            opacity: 0.5,
          }}
        >
          TRUSTED WORLDWIDE
        </Text.Card.Note>
        <Frame
          override={{ gap: Space.n48, py: Space.n0, px: Space.n24, opacity: 0.3 }}
          row
          justify="center"
          wrap="wrap"
        >
          <Frame override={{ gap: Space.n8 }} row align="center">
            <Icon src={Zap} size={IconSize.n24} />
            <Text.Card.Title>Bolt</Text.Card.Title>
          </Frame>
          <Frame override={{ gap: Space.n8 }} row align="center">
            <Icon src={Globe} size={IconSize.n24} />
            <Text.Card.Title>Stripe</Text.Card.Title>
          </Frame>
          <Frame override={{ gap: Space.n8 }} row align="center">
            <Icon src={Shield} size={IconSize.n24} />
            <Text.Card.Title>Linear</Text.Card.Title>
          </Frame>
          <Frame override={{ gap: Space.n8 }} row align="center">
            <Icon src={Cpu} size={IconSize.n24} />
            <Text.Card.Title>Vercel</Text.Card.Title>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
