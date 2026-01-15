import {
  Circle,
  Image as ImageIcon,
  LayoutTemplate,
  MessageSquare,
  Moon,
  MousePointer2,
  PenTool,
  Square,
  Sun,
  Type,
} from "lucide-react";
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Overlay } from "../design-system/Overlay";
import { Separator } from "../design-system/Separator";
import { useTheme } from "../design-system/theme";
import { IconSize, Space, Radius2 } from "../design-system/token";

const BOTTOM_TOOLS = [
  { icon: MousePointer2, tooltip: "Move", variant: "surface" as const },
  { icon: LayoutTemplate, tooltip: "Slides" },
  { separator: true },
  { icon: Square, tooltip: "Frame" },
  { icon: Type, tooltip: "Text" },
  { icon: Circle, tooltip: "Shape" },
  { icon: PenTool, tooltip: "Pen" },
  { icon: ImageIcon, tooltip: "Resources" },
  { separator: true },
  { icon: MessageSquare, tooltip: "Comment" },
  { separator: true },
];

export function FloatingToolbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Overlay
      position="absolute"
      bottom={5}
      x="50%"
      zIndex={100}
      style={{ transform: "translateX(-50%)" }}
    >
      <Frame
        override={{gap: Space.n4,
          p: Space.n4,
          shadow: "lg"}} rounded={Radius2.full}
        style={{ border: "1px solid var(--border-color)" }}
        layout={Layout.Row.Toolbar.Default}
        surface="base"
        align="center"
      >
        {BOTTOM_TOOLS.map((tool, i) =>
          tool.separator ? (
            <Separator key={i} orientation="vertical" length={Space.n16} />
          ) : (
            <Action
              key={i}
              icon={tool.icon}
              iconSize={IconSize.n18}
              variant={tool.variant}
              rounded={Radius2.full}
              tooltip={tool.tooltip}
              size="sm"
            />
          ),
        )}
        <Action
          icon={theme === "light" ? Moon : Sun}
          iconSize={IconSize.n18}
          rounded={Radius2.full}
          onClick={toggleTheme}
          tooltip="Toggle Theme"
          w={6}
          h={6}
        />
      </Frame>
    </Overlay>
  );
}
