import {
  Bell,
  ChevronDown,
  Layout as LayoutIcon,
  Menu,
  Monitor,
  Moon,
  Play,
  Share,
} from "lucide-react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Overlay } from "../../design-system/Overlay";
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  IconSize,
  Opacity,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";

export function TopCenterBar() {
  return (
    <Overlay
      position="fixed"
      y="var(--space-n4)"
      x="50%"
      zIndex={200}
      style={{ transform: "translateX(-50%)", pointerEvents: "auto" }}
      clickOutsideToDismiss={false}
    >
      <Frame
        layout={Layout.Row.Toolbar.Default}
        align="center"
        surface="overlay"
        override={{ px: Space.n8, rounded: "full" }}
      >
        <Action icon={Monitor} variant="ghost" size="sm" rounded="full" />
        <Frame
          override={{ h: Size.n16 }}
          style={{ width: "1px" }}
          surface="sunken"
          opacity={Opacity.n30}
        />
        <Frame
          override={{ gap: Space.n8, px: Space.n8 }}
          layout={Layout.Row.Meta.Default}
          align="center"
        >
          <Text.Card.Note
            size={FontSize.n12}
            weight="medium"
            style={{ opacity: 0.5 }}
          >
            PAGE
          </Text.Card.Note>
          <Frame
            override={{ gap: Space.n4 }}
            layout={Layout.Row.Item.Compact}
            align="center"
            cursor="pointer"
          >
            <Text.Card.Title size={FontSize.n13} weight="bold">
              Marketing Home
            </Text.Card.Title>
            <Icon
              src={ChevronDown}
              size={IconSize.n12}
              style={{ opacity: 0.5 }}
            />
          </Frame>
        </Frame>
        <Frame
          override={{ h: Size.n16 }}
          style={{ width: "1px" }}
          surface="sunken"
          opacity={Opacity.n30}
        />
        <Action icon={Play} variant="ghost" size="sm" rounded="full" />
      </Frame>
    </Overlay>
  );
}

export function TopRightBar() {
  return (
    <Overlay
      position="fixed"
      y="var(--space-n4)"
      right="var(--space-n4)"
      zIndex={200}
      clickOutsideToDismiss={false}
      style={{ pointerEvents: "auto" }}
    >
      <Frame
        override={{ gap: Space.n8 }}
        layout={Layout.Row.Actions.Default}
        align="center"
      >
        <Frame
          override={{
            gap: Space.n4,
            p: Space.n4,
            rounded: "full",
            shadow: "lg",
          }}
          layout={Layout.Row.Actions.Default}
          surface="overlay"
        >
          <Frame override={{ p: Space.n6, rounded: "full" }} cursor="pointer">
            <Icon src={Moon} size={IconSize.n16} />
          </Frame>
          <Frame override={{ p: Space.n6, rounded: "full" }} cursor="pointer">
            <Icon src={Bell} size={IconSize.n16} />
          </Frame>
        </Frame>
        <Action
          label="Share"
          icon={Share}
          variant="primary"
          size="sm"
          glow
          rounded="full"
        />
      </Frame>
    </Overlay>
  );
}

export interface SidebarToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function SidebarToggle({ isOpen, onClick }: SidebarToggleProps) {
  return (
    <Overlay
      position="fixed"
      y="var(--space-n4)"
      x="var(--space-n4)"
      zIndex={200}
      clickOutsideToDismiss={false}
      style={{ pointerEvents: "auto" }}
    >
      <Frame
        override={{
          p: Space.n8,
          rounded: "full",
          shadow: "lg",
        }}
        surface="overlay"
        cursor="pointer"
        onClick={onClick}
      >
        {isOpen ? (
          <Icon src={LayoutIcon} size={IconSize.n20} />
        ) : (
          <Icon src={Menu} size={IconSize.n20} />
        )}
      </Frame>
    </Overlay>
  );
}
