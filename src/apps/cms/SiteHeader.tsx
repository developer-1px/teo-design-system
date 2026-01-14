import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Space, Size } from "../../design-system/token/token.const.1tier";

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
        w: Size.full,
        style: {
          height: "var(--header-height)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid var(--border-color)",
        },
      }}
      layout={Layout.Row.Header.Default}
      align="center"
      justify="center"
      surface="base"
    >
      <Frame
        override={{ w: Size.full, style: { maxWidth: "300px" } }}
        layout={Layout.Row.Header.Default}
        justify="between"
        align="center"
      >
        <Frame override={{ gap: Space.n8 }} layout={Layout.Row.Item.Default} align="center">
          <Frame
            override={{
              w: Size.n32,
              h: Size.n32,
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

        <Frame override={{ gap: Space.n24 }} layout={Layout.Row.Actions.Default}>
          <Frame override={{ gap: Space.n8 }} layout={Layout.Row.Actions.Default}>
            <Action label="Features" variant="ghost" />
            <Action label="Pricing" variant="ghost" />
            <Action label="Resources" variant="ghost" />
          </Frame>

          <Frame override={{ gap: Space.n16 }} layout={Layout.Row.Actions.Between} align="center">
            <Action
              label="Log in"
              variant="ghost"
              h="action"
              py={Space.n0}
              px={Space.n16}
              rounded="lg"
            />
            <Action
              label="Get Started"
              variant="primary"
              h="action"
              py={Space.n0}
              px={Space.n24}
              rounded="full"
              glow
            />
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
