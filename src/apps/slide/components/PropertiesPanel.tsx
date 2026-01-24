
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronDown,
  ChevronRight,
  CornerUpRight,
  Eye,
  Lock,
  Minus,
  MoreHorizontal,
  Plus,
  Settings,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { useAccordion, useTabs } from "@/design-system/hooks"; // Keeping headless logic

// Minimal Input Component adapted for Grid
const GridInput = ({ label, value, readOnly, fullWidth }: { label?: string; value: string; readOnly?: boolean; fullWidth?: boolean }) => (
  <>
    {label && <label className="grid-label">{label}</label>}
    <div className={`grid-value ${fullWidth ? 'full-width' : ''}`} style={fullWidth ? { gridColumn: '2 / -1' } : {}}>
      <div className="input-wrapper">
        <input className="native-input" defaultValue={value} readOnly={readOnly} />
      </div>
    </div>
  </>
);

const ALIGNMENT_TOOLS = [
  { icon: AlignLeft, label: "Left" },
  { icon: AlignCenter, label: "Center", active: true },
  { icon: AlignRight, label: "Right" },
  { separator: true },
  { icon: AlignJustify, label: "Justify" },
  { icon: AlignCenter, label: "Middle", rotation: 90 },
  { icon: CornerUpRight, label: "Distribute" },
];

export function PropertiesPanel() {
  const tabs = ["DESIGN", "ANIMATE"];
  const { selectedTab, getTabListProps, getTabProps } = useTabs({
    tabs,
    defaultTab: "DESIGN",
  });

  const sections = ["LAYER", "TEXT", "FILL", "STROKE", "EFFECTS", "EXPORT"];
  const { getItemProps, getPanelProps } = useAccordion({
    items: sections,
    defaultExpanded: ["LAYER", "TEXT", "FILL"],
    allowMultiple: true,
  });

  return (
    <aside className="slide-panel-right">
      {/* Tabs */}
      <div className="props-tabs" {...getTabListProps()}>
        {tabs.map(tab => {
          const { onClick } = getTabProps(tab);
          return (
            <button
              key={tab}
              className={`props-tab ${selectedTab === tab ? 'active' : ''}`}
              onClick={onClick}
            >
              {tab}
            </button>
          )
        })}
      </div>

      <div className="props-content">
        {/* Alignment Toolbar - Custom Row */}
        <div className="alignment-row">
          {ALIGNMENT_TOOLS.map((tool: any, i) => (
            tool.separator ? (
              <div key={i} className="divider-v" style={{ height: 16 }} />
            ) : (
              <button key={i} className={`icon-btn ${tool.active ? 'active' : ''}`} style={{ width: 24, height: 24 }} title={tool.label}>
                <tool.icon size={12} style={{ transform: tool.rotation ? `rotate(${tool.rotation}deg)` : undefined }} />
              </button>
            )
          ))}
        </div>

        <div className="divider-h" />

        {/* Transform Section - Uses Master Grid */}
        <div className="prop-row">
          <GridInput label="X" value="400" />
          <GridInput label="Y" value="225" />
          <div /> {/* Suffix spacer */}
        </div>
        <div className="prop-row">
          <GridInput label="W" value="800" />
          <GridInput label="H" value="450" />
          <button className="icon-btn" style={{ width: 24, padding: 0, justifySelf: "center" }}><Lock size={12} /></button>
        </div>
        <div className="prop-row">
          <GridInput label="°" value="0" />
          <GridInput label="R" value="0" />
          <div />
        </div>

        <div className="divider-h" />

        {/* Layer Section */}
        <div className="prop-section">
          <div className="prop-header" onClick={getItemProps("LAYER").onToggle}>
            <div className="prop-title">
              {getItemProps("LAYER").expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              LAYER
            </div>
            <Plus size={12} style={{ opacity: 0.5 }} />
          </div>
          {getItemProps("LAYER").expanded && (
            <div className="prop-body">
              <div className="prop-row">
                {/* Manually placing items in grid cells for irregular layout */}
                <div className="grid-value" style={{ gridColumn: '1 / 4' }}>
                  <div className="input-wrapper">
                    <input className="native-input" defaultValue="Normal" readOnly />
                    <ChevronDown size={10} style={{ opacity: 0.5 }} />
                  </div>
                </div>
                <div className="grid-value" style={{ gridColumn: '4 / -1' }}>
                  <div className="input-wrapper">
                    <Eye size={10} style={{ marginRight: 6, opacity: 0.5 }} />
                    <input className="native-input" defaultValue="100%" readOnly />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="divider-h" />

        {/* Text Section */}
        <div className="prop-section">
          <div className="prop-header" onClick={getItemProps("TEXT").onToggle}>
            <div className="prop-title">
              {getItemProps("TEXT").expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              TEXT
            </div>
            <Plus size={12} style={{ opacity: 0.5 }} />
          </div>
          {getItemProps("TEXT").expanded && (
            <div className="prop-body">
              {/* Full width font family */}
              <div className="prop-row">
                <div className="grid-value" style={{ gridColumn: '1 / -1' }}>
                  <div className="input-wrapper">
                    <input className="native-input" defaultValue="Inter" readOnly />
                    <ChevronDown size={10} style={{ opacity: 0.5 }} />
                  </div>
                </div>
              </div>
              <div className="prop-row">
                <div className="grid-value" style={{ gridColumn: '1 / 4' }}>
                  <div className="input-wrapper">
                    <input className="native-input" defaultValue="Regular" readOnly />
                    <ChevronDown size={10} style={{ opacity: 0.5 }} />
                  </div>
                </div>
                <GridInput value="42" readOnly />
                <div />
              </div>
            </div>
          )}
        </div>

        <div className="divider-h" />

        {/* Fill Section */}
        <div className="prop-section">
          <div className="prop-header" onClick={getItemProps("FILL").onToggle}>
            <div className="prop-title">
              {getItemProps("FILL").expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              FILL
            </div>
            <Plus size={12} style={{ opacity: 0.5 }} />
          </div>
          {getItemProps("FILL").expanded && (
            <div className="prop-body">
              <div className="prop-row">
                <div style={{ width: 24, height: 24, border: "1px solid var(--border-color)", borderRadius: 4, background: "#F4F4F5", gridColumn: '1' }} />
                <div className="grid-value" style={{ gridColumn: '2 / 5' }}>
                  <div className="input-wrapper">
                    <input className="native-input" defaultValue="F4F4F5" readOnly />
                    <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>100%</span>
                  </div>
                </div>
                <div style={{ gridColumn: '5', justifySelf: 'center' }}>
                  <button className="icon-btn" style={{ width: 24, padding: 0 }}><Minus size={12} /></button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}
