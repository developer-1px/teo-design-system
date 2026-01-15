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
import { Space } from "../design-system/token/token.const.1tier";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { IconSize, Size } from "../design-system/token/token.const.1tier";
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
        override={{
          gap: Space.n4,
          p: Space.n4,
          rounded: "full",
          shadow: "lg",
        }}
        style={{ border: "1px solid var(--border-color)" }}
        layout={Layout.Row.Toolbar.Default}
        surface="base"
        align="center"
      >
        {BOTTOM_TOOLS.map((tool, i) =>
          tool.separator ? (
            <Separator key={i} orientation="vertical" length="16px" />
          ) : (
            <Action
              key={i}
              icon={tool.icon}
              iconSize={IconSize.n18}
              variant={tool.variant}
              rounded="full"
              tooltip={tool.tooltip}
              size={Size.n32}
            />
          ),
        )}
        <Action
          icon={theme === "light" ? Moon : Sun}
          iconSize={IconSize.n18}
          rounded="full"
          onClick={toggleTheme}
          tooltip="Toggle Theme"
          size={6}
        />
      </Frame>
    </Overlay >
  );
}
