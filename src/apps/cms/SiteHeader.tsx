import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Text } from "../../design-system/text/Text";
import { FontSize, Size, Space } from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";

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
      }}
      style={{
        height: "var(--header-height)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid var(--border-color)",
      }}
      layout={Layout.Row.Header.Default}
      align="center"
      justify="center"
      surface="base"
    >
      <Frame
        override={{ w: Size.full }}
        style={{
          maxWidth: "var(--container-n1280)",
          padding: "0 var(--space-n24)",
        }}
        layout={Layout.Row.Header.Default}
        justify="between"
        align="center"
      >
        <Frame
          override={{ gap: Space.n8 }}
          layout={Layout.Row.Item.Default}
          align="center"
        >
          <Frame
            override={{w: Size.n32,
              h: Size.n32,
              shadow: "sm"}} rounded={Radius2.lg}
            style={{ border: "1px solid var(--border-color)" }}
            surface="primary"
            pack
          >
            <Text.Card.Title
              size={FontSize.n16}
              weight="bold"
              style={{ color: "white" }}
            >
              M
            </Text.Card.Title>
          </Frame>
          <Text.Card.Title size={FontSize.n18} weight="bold">
            Minimal
          </Text.Card.Title>
        </Frame>

        <Frame
          override={{ gap: Space.n32 }}
          layout={Layout.Row.Actions.Default}
          align="center"
          flex
        >
          <Frame
            override={{ gap: Space.n8 }}
            layout={Layout.Row.Actions.Default}
          >
            <Action label="Features" variant="ghost" rounded={Radius2.md} />
            <Action label="Pricing" variant="ghost" rounded={Radius2.md} />
            <Action label="Resources" variant="ghost" rounded={Radius2.md} />
          </Frame>

          <Frame
            override={{ gap: Space.n12 }}
            layout={Layout.Row.Actions.Between}
            align="center"
          >
            <Action
              label="Log in"
              variant="ghost"
              h={Size.n36}
              px={Space.n16}
              rounded={Radius2.md}
            />
            <Action
              label="Get Started"
              variant="primary"
              h={Size.n36}
              px={Space.n20}
              rounded={Radius2.full}
              glow
            />
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
