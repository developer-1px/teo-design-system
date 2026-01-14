import { HelpCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";

export function FAQBoardFooter() {
  return (
    <Frame
      override={{
        w: "100%",
        p: "96 24",
        gap: 12,
        style: { maxWidth: 680, margin: "0 auto" },
      }}
      surface="base"
    >
      <Frame override={{ gap: 2, w: "100%" }} align="center">
        <Text.Card.Note
          style={{ fontWeight: "bold", color: "var(--text-primary)" }}
        >
          SUPPORT
        </Text.Card.Note>
        <Text.Prose.Title variant="lg">Common questions</Text.Prose.Title>
      </Frame>

      <Frame override={{ w: "100%", gap: 4 }}>
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
          p: 8,
          w: "100%",
          rounded: "2xl",
          gap: 6,
          style: { marginTop: 24 },
        }}
        surface="raised"
        row
        align="center"
      >
        <Frame
          override={{ w: 56, h: 56, rounded: "full" }}
          surface="sunken"
          pack
        >
          <HelpCircle size={24} />
        </Frame>
        <Frame override={{ gap: 1 }}>
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
          p="0 4"
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
        w: "100%",
        p: "6 0",
        style: { borderBottom: "1px solid var(--border-color)" },
        gap: 4,
      }}
      onClick={() => setIsOpen(!isOpen)}
      cursor="pointer"
    >
      <Frame override={{ w: "100%" }} row justify="between" align="center">
        <Text.Card.Title>{q}</Text.Card.Title>
        <Plus
          size={20}
          style={{
            transform: isOpen ? "rotate(45deg)" : "none",
          }}
          opacity={0.4}
        />
      </Frame>
      {isOpen && (
        <Frame override={{ p: "0 8 4 0" }}>
          <Text.Prose.Body style={{ opacity: 0.8 }}>{a}</Text.Prose.Body>
        </Frame>
      )}
    </Frame>
  );
}
