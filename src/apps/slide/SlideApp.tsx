import {
  ChevronDown,
  Circle,
  Grid,
  Play,
  Plus,
  Share,
  Square,
  Type,
} from "lucide-react";
import { useState } from "react";
import { FloatingToolbar } from "./components/FloatingToolbar";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { SlidesPanel } from "./components/SlidesPanel";
import * as styles from "./SlideApp.css";

// Temporary minimal Token usage until components are fully refactored
import { SegmentedControl } from "@/ui/SegmentedControl/SegmentedControl";
import { Icon } from "@/ui/primitives/Icon";
import { Action } from "@/ui/primitives/Action";

export function SlideApp() {
  const [activeTool, setActiveTool] = useState("square");

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.iconBtn} style={{ width: 32, height: 32 }}>
            <Grid size={18} />
          </button>
          <div className={styles.titleGroup}>
            <span className={styles.title}>Untitled Presentation</span>
            <button className={styles.iconBtn} style={{ width: 20, height: 20, opacity: 0.5 }}>
              <ChevronDown size={12} />
            </button>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className="avatar-group">
            {/* TODO: Refactor AvatarGroup */}
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#E5E5E5" }} />
            <button className={styles.iconBtn} style={{ width: 20, height: 20 }}>
              <Plus size={12} />
            </button>
          </div>

          <Action
            icon={Play}
            label="Present"
            variant="primary"
            size="sm"
          />
          <Action
            icon={Share}
            label="Share"
            variant="surface"
            size="sm"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.slidesPanel}>
          <SlidesPanel />
        </div>

        <div className={styles.canvasArea}>
          <div className={styles.canvas}>
            <div className={styles.canvasContent}>
              <h1 className={styles.heroText}>Minimal Design Kit</h1>
              <p className={styles.subText}>Refined & Polished UI.</p>

              <div style={{ marginTop: 24 }}>
                <SegmentedControl
                  value={activeTool}
                  onChange={setActiveTool}
                  options={[
                    { value: "square", label: <Icon src={Square} size={16} /> },
                    { value: "circle", label: <Icon src={Circle} size={16} /> },
                    { value: "type", label: <Icon src={Type} size={16} /> },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.propertiesPanel}>
          <PropertiesPanel />
        </div>
      </main>

      <FloatingToolbar />
    </div>
  );
}

