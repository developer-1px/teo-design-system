import { HelpCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";
import { Space } from "../../design-system/token/token.const.1tier";
import { Icon } from "../../design-system/Icon";
import { IconSize, Size } from "../../design-system/token/token.const.1tier";

export function FAQBoardFooter() {
  return (
    <Frame
      override={{
        w: Size.full,
        py: Space.n96,
        px: Space.n24,
        gap: Space.n48,
        style: { maxWidth: 680, margin: "0 auto" },
      }}
      surface="base"
    >
      <Frame override={{ gap: Space.n8, w: Size.full }} align="center">
        <Text.Card.Note
          style={{ fontWeight: "bold", color: "var(--text-primary)" }}
        >
          SUPPORT
        </Text.Card.Note>
        <Text.Prose.Title variant="lg">Common questions</Text.Prose.Title>
      </Frame>

      <Frame override={{ w: Size.full, gap: Space.n16 }}>
        <FAQRow
          q="How secure is my data?"
          a="We use industry-standard encryption and SOC2 certification to ensure your data stays protected at all times."
        />
        <FAQRow
          q="Can I export code for local hosting?"
          a="Yes, you can export your site as a static bundle and host it anywhere you like."
        />
        <FAQRow
          q="Do you support custom domains?"
          a="Absolutely. You can connect any domain you own with a single click."
        />
        <FAQRow
          q="Is there a limit on bandwidth?"
          a="Our Enterprise plans offer unlimited bandwidth, while Pro plans have generous limits."
        />
      </Frame>

      <Frame
        override={{
          p: Space.n32,
          w: Size.full,
          rounded: "2xl",
          gap: Space.n24,
          style: { marginTop: 24 },
        }}
        surface="raised"
        row
        align="center"
      >
        <Frame
          override={{ w: Size.n56, h: Size.n56, rounded: "full" }}
          surface="sunken"
          pack
        >
          <Icon src={HelpCircle} size={IconSize.n24} />
        </Frame>
        <Frame override={{ gap: Space.n4 }}>
          <Text.Card.Title>Still have questions?</Text.Card.Title>
          <Text.Card.Desc>
            We're here to help. Contact our support team 24/7.
          </Text.Card.Desc>
        </Frame>
        <Frame flex />
        <Action
          label="Chat with us"
          variant="surface"
          h={44}
          py={Space.n0}
          px={Space.n16}
          rounded="lg"
        />
      </Frame>
    </Frame>
  );
}

interface FAQRowProps {
  q: string;
  a: string;
}

function FAQRow({ q, a }: FAQRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Frame
      override={{
        w: Size.full,
        py: Space.n24,
        px: Space.n0,
        style: { borderBottom: "1px solid var(--border-color)" },
        gap: Space.n16,
      }}
      onClick={() => setIsOpen(!isOpen)}
      cursor="pointer"
    >
      <Frame override={{ w: Size.full }} row justify="between" align="center">
        <Text.Card.Title>{q}</Text.Card.Title>
        <Icon
          src={Plus}
          size={IconSize.n20}
          style={{
            transform: isOpen ? "rotate(45deg)" : "none",
            opacity: 0.4,
          }}
        />
      </Frame>
      {isOpen && (
        <Frame override={{ pt: Space.n0, pr: Space.n32, pb: Space.n16, pl: Space.n0 }}>
          <Text.Prose.Body style={{ opacity: 0.8 }}>{a}</Text.Prose.Body>
        </Frame>
      )}
    </Frame>
  );
}
