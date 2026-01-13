import { HelpCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Action } from "../../design-system/Action";
import { Prose, ProseSection } from "../../design-system/Prose";
import { Text } from "../../design-system/Text";
import { Frame } from "../../design-system/Frame";

export function FAQBoardFooter() {
  return (
    <ProseSection
      w="100%"
      p="96 24"
      contentGap={12}
      surface="base"
      maxWidth={680}
    >
      <Frame gap={2} align="center" w="100%">
        <Text size={12} weight="bold" color="primary">
          SUPPORT
        </Text>
        <Prose role="h2">Common questions</Prose>
      </Frame>

      <Frame w="100%" gap={4}>
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
        p={8}
        w="100%"
        surface="raised"
        rounded="2xl"
        row
        gap={6}
        align="center"
        style={{ marginTop: 24 }}
      >
        <Frame w={56} h={56} rounded="full" surface="sunken" pack>
          <HelpCircle size={24} />
        </Frame>
        <Frame gap={1}>
          <Text weight="bold" size={18}>
            Still have questions?
          </Text>
          <Text size={15} color="secondary">
            We're here to help. Contact our support team 24/7.
          </Text>
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
    </ProseSection>
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
      w="100%"
      p="6 0"
      style={{ borderBottom: "1px solid var(--border-color)" }}
      gap={4}
      onClick={() => setIsOpen(!isOpen)}
      cursor="pointer"
    >
      <Frame row justify="between" align="center" w="100%">
        <Text size={20} weight="bold">
          {q}
        </Text>
        <Plus
          size={20}
          style={{
            transform: isOpen ? "rotate(45deg)" : "none",
          }}
          opacity={0.4}
        />
      </Frame>
      {isOpen && (
        <Frame p="0 8 4 0">
          <Text
            size={16}
            color="secondary"
            style={{ lineHeight: 1.6, opacity: 0.8 }}
          >
            {a}
          </Text>
        </Frame>
      )}
    </Frame>
  );
}
