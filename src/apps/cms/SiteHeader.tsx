import {Action} from "../../design-system/Action"
import {Frame} from "../../design-system/Frame/Frame.tsx"
import {Layout} from "../../design-system/Frame/Layout/Layout.ts"
import {Text} from "../../design-system/text/Text"
import {FontSize, Size, Space, ZIndex,} from "../../design-system/token/token.const.1tier"
import {Radius2} from "../../design-system/token/token.const.2tier"

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
      style={
        {
          height: "var(--header-height)",
          position: "sticky",
          top: 0,
        } as React.CSSProperties
      }
      layout={Layout.Row.Header.Default}
      surface="base"
      override={{
        w: Size.fill,
        align: "center",
        zIndex: ZIndex.n100,
        border: true,
      }}
    >
      <Frame
        style={
          {
            maxWidth: "var(--container-n1280)",
            padding: "0 var(--space-n24)",
          } as React.CSSProperties
        }
        layout={Layout.Row.Header.Default}
        override={{ w: Size.fill, justify: "between" }}
      >
        <Frame
          layout={Layout.Row.Item.Default}
          override={{ gap: Space.n8, align: "center" }}
        >
          <Frame
            override={{
              w: Size.n32,
              h: Size.n32,
              shadow: "sm",
              r: Radius2.lg,
              border: true,
            }}
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
          layout={Layout.Row.Actions.Default}
          flex
          override={{ gap: Space.n32, align: "center" }}
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
            layout={Layout.Row.Actions.Between}
            override={{ gap: Space.n12, align: "center" }}
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
