import { Check, MessageSquare, Zap } from "lucide-react";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";

export function BodyContentSection() {
  return (
    <Frame
      w="100%"
      p="24 6"
      surface="sunken"
      style={{ borderBottom: "1px solid var(--border-color)" }}
    >
      <Frame
        row
        gap={6}
        align="center"
        w="100%"
        maxWidth={1280}
        style={{ margin: "0 auto" }}
      >
        <Frame w="50%" gap={2}>
          <Frame gap={1}>
            <Text.Card.Note style={{ fontSize: 14, fontWeight: "bold", color: "var(--text-primary)" }}>
              THE PROCESS
            </Text.Card.Note>
            <Text.Prose.Title variant="lg">
              Unleash your <br /> internal creative.
            </Text.Prose.Title>
          </Frame>
          <Text.Prose.Body style={{ color: "var(--text-secondary)" }}>
            Workflow shouldn't be a bottleneck. Our platform allows developers
            to focus on logic while designers handle the visuals.
          </Text.Prose.Body>
          <Frame gap={1}>
            <CheckItem
              title="Pure Token-based design"
              desc="Align with your existing CSS/Tailwind system effortlessly."
            />
            <CheckItem
              title="Developer-friendly export"
              desc="Export clean React, Vue, or HTML code at any time."
            />
            <CheckItem
              title="Real-time collaboration"
              desc="Work with your team in the same canvas simultaneously."
            />
          </Frame>
        </Frame>
        <Frame flex pack>
          <Frame
            w={100}
            h={125}
            surface="raised"
            rounded="3xl"
            shadow="2xl"
            style={{ position: "relative" }}
          >
            <Frame
              style={{ position: "absolute", top: "40px", left: "-40px" }}
              w={45}
              h={45}
              surface="raised"
              rounded="2xl"
              shadow="lg"
              p={6}
              gap={4}
            >
              <Zap size={32} color="var(--color-warning)" />
              <Frame gap={2}>
                <Frame h={10} w="100%" surface="overlay" rounded="full" />
                <Frame h={10} w="60%" surface="overlay" rounded="full" />
              </Frame>
            </Frame>
            <Frame
              style={{ position: "absolute", bottom: "40px", right: "-40px" }}
              w={55}
              h={55}
              surface="raised"
              rounded="2xl"
              shadow="lg"
              p={6}
              gap={4}
            >
              <MessageSquare size={32} color="var(--color-primary)" />
              <Frame gap={2}>
                <Frame row gap={0.5} align="center">
                  <Frame w={6} h={6} rounded="full" surface="overlay" />
                  <Frame h={2} w={25} surface="overlay" rounded="full" />
                </Frame>
                <Frame h={2} w="100%" surface="raised" rounded="full" />
              </Frame>
            </Frame>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}

interface CheckItemProps {
  title: string;
  desc: string;
}

function CheckItem({ title, desc }: CheckItemProps) {
  return (
    <Frame row gap={1} align="start">
      <Frame
        w={6}
        h={6}
        rounded="full"
        surface="primary"
        pack
        style={{ marginTop: 2 }}
      >
        <Check size={14} color="#fff" />
      </Frame>
      <Frame gap={1}>
        <Text.Card.Title style={{ fontSize: 16, fontWeight: "bold" }}>
          {title}
        </Text.Card.Title>
        <Text.Card.Desc style={{ fontSize: 14, color: "var(--text-secondary)", opacity: 0.7 }}>
          {desc}
        </Text.Card.Desc>
      </Frame>
    </Frame>
  );
}
