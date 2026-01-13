import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/Text";
import { Frame } from "../../design-system/Frame";

export function SiteHeader() {
  return (
    <Frame
      w="100%"
      h="header"
      p="0 6"
      row
      align="center"
      justify="center"
      border="bottom"
      surface="base"
      style={{ position: "sticky", top: 0, zIndex: 40 }}
    >
      <Frame
        w="100%"
        maxWidth={300}
        row
        justify="between"
        align="center"
      >
        <Frame row gap={2} align="center">
          <Frame
            w={32}
            h={32}
            rounded="lg"
            surface="primary"
            border
            pack
            shadow="sm"
          >
            <Text weight="bold" color="white">
              M
            </Text>
          </Frame>
          <Text weight="bold" size={18}>
            Minimal
          </Text>
        </Frame>

        <Frame row gap={6}>
          <Frame row gap={2}>
            <Action label="Features" variant="ghost" />
            <Action label="Pricing" variant="ghost" />
            <Action label="Resources" variant="ghost" />
          </Frame>

          <Frame row gap={4} align="center">
            <Action
              label="Log in"
              variant="ghost"
              h="action"
              p="0 4"
              rounded="lg"
            />
            <Action
              label="Get Started"
              variant="primary"
              h="action"
              p="0 6"
              rounded="full"
              glow
            />
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
