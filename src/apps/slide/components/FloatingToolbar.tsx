
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
import { Action } from "@/design-system/Action";
import { useTheme } from "@/design-system/theme";

// Temporary: importing Token to not break if Action used it, but Action is reusable.
// Actually Action is from legacy design system but it renders a Frame.
// I should ideally replace Action too, but for now I can wrap it or use it if it produces a button.
// The user said "remove legacy design". 
// So I will replace Action with the .icon-btn class or similar.

const BOTTOM_TOOLS = [
  { icon: MousePointer2, tooltip: "Move", active: true },
  { icon: LayoutTemplate, tooltip: "Slides" },
  { separator: true },
  { icon: Square, tooltip: "Frame" },
  { icon: Type, tooltip: "Text" },
  { icon: Circle, tooltip: "Shape" },
  { icon: PenTool, tooltip: "Pen" },
  { icon: ImageIcon, tooltip: "Resources" },
  { separator: true },
  { icon: MessageSquare, tooltip: "Comment" },
];

export function FloatingToolbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="floating-toolbar">
      {BOTTOM_TOOLS.map((tool, i) =>
        tool.separator ? (
          <div key={i} className="toolbar-separator" />
        ) : (
          <button
            key={i}
            className="icon-btn"
            style={{
              width: 36,
              height: 36,
              backgroundColor: tool.active ? "var(--surface-sunken)" : "transparent",
              color: tool.active ? "var(--text-primary)" : "inherit"
            }}
            title={tool.tooltip}
          >
            <tool.icon size={18} />
          </button>
        )
      )}
      <div className="toolbar-separator" />
      <button
        className="icon-btn"
        style={{ width: 36, height: 36 }}
        onClick={toggleTheme}
        title="Toggle Theme"
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </div>
  );
}
