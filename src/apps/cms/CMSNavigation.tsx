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
import { Card } from "../../design-system/text/Card";
import { Frame } from "../../design-system/Frame";
import { Overlay } from "../../design-system/Overlay";

export function TopCenterBar() {
  return (
    <Overlay
      position="fixed"
      y="12px"
      x="50%"
      zIndex={200}
      style={{ transform: "translateX(-50%)", pointerEvents: "auto" }}
      clickOutsideToDismiss={false}
    >
      <Frame
        row
        align="center"
      >
        <Action icon={Monitor} variant="ghost" size="sm" rounded="full" />
        <Frame w={0.5} h={4} surface="overlay" />
        <Frame row gap={2} align="center" style={{ padding: "0 8px" }}>
          <Card.Note style={{ fontSize: 13, fontWeight: "medium" }}>
            Page:
          </Card.Note>
          <Frame row gap={1} align="center" cursor="pointer">
            <Card.Title style={{ fontSize: 13, fontWeight: "bold" }}>
              Marketing Home
            </Card.Title>
            <ChevronDown size={12} opacity={0.5} />
          </Frame>
        </Frame>
        <Frame w={0.5} h={4} surface="overlay" />
        <Action icon={Play} variant="ghost" size="sm" rounded="full" />
      </Frame>
    </Overlay>
  );
}

export function TopRightBar() {
  return (
    <Overlay
      position="fixed"
      y="12px"
      right="12px"
      zIndex={200}
      clickOutsideToDismiss={false}
      style={{ pointerEvents: "auto" }}
    >
      <Frame
        row
        gap={2}
        align="center"
      >
        <Frame row gap={1} surface="raised" p={1} rounded="full" shadow="lg">
          <Frame p={1.5} rounded="full">
            <Moon size={16} />
          </Frame>
          <Frame p={1.5} rounded="full">
            <Bell size={16} />
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
      y="12px"
      x="12px"
      zIndex={200}
      clickOutsideToDismiss={false}
      style={{ pointerEvents: "auto" }}
    >
      <Frame
        surface="base"
        p={2}
        rounded="full"
        style={{ border: "1px solid var(--border-color)" }}
        shadow="lg"
        cursor="pointer"
        className=""
        onClick={onClick}
      >
        {isOpen ? <Layout size={20} /> : <Menu size={20} />}
      </Frame>
    </Overlay>
  );
}
