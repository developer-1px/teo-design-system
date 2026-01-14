import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";
import { Space } from "../../design-system/token/token.const.1tier";

export interface SiteHeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function SiteHeader({
  isSidebarOpen: _isSidebarOpen,
  onToggleSidebar: _onToggleSidebar,
}: SiteHeaderProps) {
  return (
    <Frame
      override={{
        w: "100%",
        h: "header",
        p: "0 6",
        style: {
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid var(--border-color)",
        },
      }}
      row
      align="center"
      justify="center"
      surface="base"
    >
      <Frame
        override={{ w: "100%", maxWidth: 300 }}
        row
        justify="between"
        align="center"
      >
        <Frame override={{ gap: Space.n8 }} row align="center">
          <Frame
            override={{
              w: 32,
              h: 32,
              rounded: "lg",
              style: { border: "1px solid var(--border-color)" },
              shadow: "sm",
            }}
            surface="primary"
            pack
          >
            <Text.Card.Title style={{ color: "white" }}>M</Text.Card.Title>
          </Frame>
          <Text.Card.Title>Minimal</Text.Card.Title>
        </Frame>

        <Frame override={{ gap: Space.n24 }} row>
          <Frame override={{ gap: Space.n8 }} row>
            <Action label="Features" variant="ghost" />
            <Action label="Pricing" variant="ghost" />
            <Action label="Resources" variant="ghost" />
          </Frame>

          <Frame override={{ gap: Space.n16 }} row align="center">
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
