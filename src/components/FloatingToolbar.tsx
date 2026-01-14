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
import { Frame } from "../design-system/Frame";
import { Overlay } from "../design-system/Overlay";
import { Separator } from "../design-system/Separator";
import { useTheme } from "../design-system/theme";

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
        row
        gap={1}
        surface="base"
        p={1}
        rounded="full"
        shadow="lg"
        align="center"
        style={{ border: "1px solid var(--border-color)" }}
      >
        {BOTTOM_TOOLS.map((tool, i) =>
          tool.separator ? (
            <Separator key={i} orientation="vertical" length="16px" />
          ) : (
            <Action
              key={i}
              icon={tool.icon}
              iconSize={18}
              variant={tool.variant}
              rounded="full"
              tooltip={tool.tooltip}
              size={6}
            />
          ),
        )}
        <Action
          icon={theme === "light" ? Moon : Sun}
          iconSize={18}
          rounded="full"
          onClick={toggleTheme}
          tooltip="Toggle Theme"
          size={6}
        />
      </Frame>
    </Overlay>
  );
}
