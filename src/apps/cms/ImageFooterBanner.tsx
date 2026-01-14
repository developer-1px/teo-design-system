import { Cpu, Globe, Shield, Zap } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";

export function ImageFooterBanner() {
  return (
    <Frame w="100%" p="24 0" surface="base" style={{ borderBottom: "1px solid var(--border-color)" }}>
      <Frame
        w="100%"
        h={125}
        rounded="3xl"
        overflow="hidden"
        position="relative"
        pack
        style={{ background: "linear-gradient(225deg, #1a1a1a, #000)" }}
      >
        {/* Visual texture */}
        <Frame
          position="absolute"
          fill
          style={{
            opacity: 0.1,
            backgroundImage:
              "radial-gradient(circle at center, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <Frame p={6} style={{ maxWidth: 640 }} gap={6} align="center" zIndex={10}>
          <Text.Prose.Title variant="xl" style={{ color: "white", textAlign: "center" }}>
            Ready to elevate <br /> your web presence?
          </Text.Prose.Title>
          <Text.Prose.Body
            style={{
              color: "white",
              textAlign: "center",
              opacity: 0.6
            }}
          >
            Join 2,000+ companies building high-performance marketing sites with
            our Visual Engine.
          </Text.Prose.Body>
          <Frame row gap={4}>
            <Action
              label="Start for Free"
              variant="primary"
              size="lg"
              glow
              h={56}
              p="0 8"
              rounded="full"
            />
            <Action
              label="Browse Templates"
              variant="surface"
              size="lg"
              h={56}
              p="0 8"
              rounded="full"
            />
          </Frame>
        </Frame>
      </Frame>

      {/* Partner Logos */}
      <Frame style={{ paddingTop: 48, paddingBottom: 24 }} gap={6} align="center">
        <Text.Card.Note style={{ fontWeight: "bold", color: "var(--text-tertiary)", opacity: 0.5 }}>
          TRUSTED WORLDWIDE
        </Text.Card.Note>
        <Frame row gap={12} p="0 6" justify="center" opacity={0.3} wrap="wrap">
          <Frame row gap={2} align="center">
            <Zap size={24} />
            <Text.Card.Title>
              Bolt
            </Text.Card.Title>
          </Frame>
          <Frame row gap={2} align="center">
            <Globe size={24} />
            <Text.Card.Title>
              Stripe
            </Text.Card.Title>
          </Frame>
          <Frame row gap={2} align="center">
            <Shield size={24} />
            <Text.Card.Title>
              Linear
            </Text.Card.Title>
          </Frame>
          <Frame row gap={2} align="center">
            <Cpu size={24} />
            <Text.Card.Title>
              Vercel
            </Text.Card.Title>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
