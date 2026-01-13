import { Check, MessageSquare, Zap } from "lucide-react";
import { Prose, ProseSection } from "../../design-system/Prose";
import { Text } from "../../design-system/Text";
import { Frame } from "../../design-system/Frame";

export function BodyContentSection() {
  return (
    <ProseSection
      w="100%"
      p="24 6"
      surface="sunken"
      border="bottom"
      maxWidth="100%"
    >
      <Frame
        row
        gap={6}
        align="center"
        w="100%"
        maxWidth={300}
        style={{ margin: "0 auto" }}
      >
        <Frame w="50%" gap={2}>
          <Frame gap={1}>
            <Text size={14} weight="bold" color="primary">
              THE PROCESS
            </Text>
            <Prose role="h2">
              Unleash your <br /> internal creative.
            </Prose>
          </Frame>
          <Prose role="body" color="secondary">
            Workflow shouldn't be a bottleneck. Our platform allows developers
            to focus on logic while designers handle the visuals.
          </Prose>
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
            border
            style={{ position: "relative" }}
          >
            <Frame
              position="absolute"
              top="40px"
              left="-40px"
              w={45}
              h={45}
              surface="base"
              rounded="2xl"
              shadow="lg"
              border
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
              position="absolute"
              bottom="40px"
              right="-40px"
              w={55}
              h={55}
              surface="base"
              rounded="2xl"
              shadow="lg"
              border
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
    </ProseSection>
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
        <Text weight="bold" size={16}>
          {title}
        </Text>
        <Text size={14} color="secondary" opacity={0.7}>
          {desc}
        </Text>
      </Frame>
    </Frame>
  );
}
