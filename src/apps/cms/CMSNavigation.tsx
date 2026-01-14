import {
  Bell,
  ChevronDown,
  Layout,
  Menu,
  Monitor,
  Moon,
  Play,
  Share,
} from "lucide-react";
import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Space } from "../../design-system/token/token.const.1tier";
import { Overlay } from "../../design-system/Overlay";
import { Icon } from "../../design-system/Icon";
import { IconSize, Size } from "../../design-system/token/token.const.1tier";

export function TopCenterBar() {
  return (
    <Overlay
      position="fixed"
      y="3px"
      x="50%"
      zIndex={200}
      style={{ transform: "translateX(-50%)", pointerEvents: "auto" }}
      clickOutsideToDismiss={false}
    >
      <Frame row align="center">
        <Action icon={Monitor} variant="ghost" size="sm" rounded="full" />
        <Frame override={{ style: { width: "0.5px" }, h: Size.n4 }} surface="overlay" />
        <Frame
          override={{ gap: Space.n8, style: { padding: "0 8px" } }}
          row
          align="center"
        >
          <Text.Card.Note style={{ fontSize: 13, fontWeight: "medium" }}>
            Page:
          </Text.Card.Note>
          <Frame override={{ gap: Space.n4 }} row align="center" cursor="pointer">
            <Text.Card.Title style={{ fontSize: 13, fontWeight: "bold" }}>
              Marketing Home
            </Text.Card.Title>
            <Icon src={ChevronDown} size={IconSize.n12} style={{ opacity: 0.5 }} />
          </Frame>
        </Frame>
        <Frame override={{ style: { width: "0.5px" }, h: Size.n4 }} surface="overlay" />
        <Action icon={Play} variant="ghost" size="sm" rounded="full" />
      </Frame>
    </Overlay>
  );
}

export function TopRightBar() {
  return (
    <Overlay
      position="fixed"
      y="3px"
      right="3px"
      zIndex={200}
      clickOutsideToDismiss={false}
      style={{ pointerEvents: "auto" }}
    >
      <Frame override={{ gap: Space.n8 }} row align="center">
        <Frame
          override={{ gap: Space.n4, p: Space.n4, rounded: "full", shadow: "lg" }}
          row
          surface="raised"
        >
          <Frame override={{ p: Space.n6, rounded: "full" }}>
            <Icon src={Moon} size={IconSize.n16} />
          </Frame>
          <Frame override={{ p: Space.n6, rounded: "full" }}>
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
      y="3px"
      x="3px"
      zIndex={200}
      clickOutsideToDismiss={false}
      style={{ pointerEvents: "auto" }}
    >
      <Frame
        override={{
          p: Space.n8,
          rounded: "full",
          style: { border: "1px solid var(--border-color)" },
          shadow: "lg",
        }}
        surface="base"
        cursor="pointer"
        className=""
        onClick={onClick}
      >
        {isOpen ? <Icon src={Layout} size={IconSize.n20} /> : <Icon src={Menu} size={IconSize.n20} />}
      </Frame>
    </Overlay>
  );
}
