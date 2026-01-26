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
import { useTheme } from "@/design-system/theme";
import * as styles from "../SlideApp.css";

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
    <div className={styles.floatingToolbar}>
      {BOTTOM_TOOLS.map((tool, i) =>
        tool.separator ? (
          <div key={i} className={styles.toolbarSeparator} />
        ) : (
          <button
            key={i}
            className={`${styles.iconBtn} ${tool.active ? 'active' : ''}`}
            style={{
              width: 36,
              height: 36,
            }}
            title={tool.tooltip}
          >
            {tool.icon && <tool.icon size={18} />}
          </button>
        )
      )}
      <div className={styles.toolbarSeparator} />
      <button
        className={styles.iconBtn}
        style={{ width: 36, height: 36 }}
        onClick={toggleTheme}
        title="Toggle Theme"
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </div>
  );
}
