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
import "./SlideApp.css";

// Temporary minimal Token usage until components are fully refactored
import { SegmentedControl } from "@/design-system/SegmentedControl";
import { Icon } from "@/design-system/Icon";
import { Action } from "@/design-system/Action";

export function SlideApp() {
  const [activeTool, setActiveTool] = useState("square");

  return (
    <div className="slide-app">
      {/* Header */}
      <header className="slide-header">
        <div className="slide-header-left">
          <button className="icon-btn" style={{ width: 32, height: 32 }}>
            <Grid size={18} />
          </button>
          <div className="slide-title-group">
            <span className="slide-title">Untitled Presentation</span>
            <button className="icon-btn" style={{ width: 20, height: 20, opacity: 0.5 }}>
              <ChevronDown size={12} />
            </button>
          </div>
        </div>

        <div className="slide-header-right">
          <div className="avatar-group">
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--surface-overlay)" }} />
            <button className="icon-btn" style={{ width: 20, height: 20 }}>
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
      <main className="slide-main">
        <SlidesPanel />

        <div className="slide-canvas-area">
          <div className="slide-canvas">
            <div className="slide-canvas-content">
              <h1 className="slide-hero-text">Minimal Design Kit</h1>
              <p className="slide-sub-text">Refined & Polished UI.</p>

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

        <PropertiesPanel />
      </main>

      <FloatingToolbar />
    </div>
  );
}
