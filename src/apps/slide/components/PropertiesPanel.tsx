import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronDown,
  ChevronRight,
  CornerUpRight,
  Plus,
} from "lucide-react";
import { useAccordion, useTabs } from "@/design-system/hooks";
import * as styles from "../SlideApp.css";

// Minimal Input Component adapted for Grid
// Renders 2 elements: Label and Input wrapper
const GridInput = ({ label, value, readOnly, fullWidth, span }: { label?: string; value: string; readOnly?: boolean; fullWidth?: boolean; span?: number }) => (
  <>
    {label && <label className={styles.label} style={fullWidth ? { gridColumn: "1" } : {}}>{label}</label>}
    <div className={styles.inputWrapper} style={fullWidth ? { gridColumn: "2 / -1" } : span ? { gridColumn: `span ${span}` } : {}}>
      <input className={styles.input} defaultValue={value} readOnly={readOnly} />
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
  const { selectedTab, getTabProps } = useTabs({
    tabs,
    defaultTab: "DESIGN",
  });

  const sections = ["LAYER", "TEXT", "FILL", "STROKE", "EFFECTS", "EXPORT"];
  const { getItemProps } = useAccordion({
    items: sections,
    defaultExpanded: ["LAYER", "TEXT", "FILL"],
    allowMultiple: true,
  });

  return (
    <div className={styles.panelRoot}>
      {/* Tabs */}
      <div className={styles.panelTabs}>
        {tabs.map(tab => {
          const { onClick } = getTabProps(tab);
          const isActive = selectedTab === tab;
          return (
            <button
              key={tab}
              onClick={onClick}
              className={styles.propHeader}
              style={{
                flex: 1, // Reset flex since it's now grid item? No, propHeader is style({...}).
                // Actually tabs are in 1fr 1fr grid. Button should fill.
                // propHeader has width:100% implicitly? No.
                // I will use inline style for simple fill + active state border.
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                borderBottom: isActive ? "2px solid black" : "2px solid transparent",
                color: isActive ? "black" : "gray",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 12
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      <div className={styles.panelScroll}>
        {/* Alignment Toolbar */}
        <div className={styles.alignmentBar}>
          {ALIGNMENT_TOOLS.map((tool: any, i) => (
            tool.separator ? (
              <div key={i} className={styles.toolbarSeparator} style={{ height: 16, margin: "auto" }} />
            ) : (
              <button key={i} className={`${styles.iconBtn} ${tool.active ? 'active' : ''}`} style={{ width: "100%", aspectRatio: "1" }} title={tool.label}>
                <tool.icon size={14} style={{ transform: tool.rotation ? `rotate(${tool.rotation}deg)` : undefined }} />
              </button>
            )
          ))}
        </div>

        <div className={styles.divider} />

        {/* Transform Section - Direct Items in Panel Grid */}
        <GridInput label="X" value="400" />
        <GridInput label="Y" value="225" />
        <GridInput label="W" value="800" />
        <GridInput label="H" value="450" />
        <GridInput label="°" value="0" />
        <GridInput label="R" value="0" />

        <div className={styles.divider} />

        {/* Sections */}
        {sections.map(section => (
          <div key={section} style={{ display: "contents" }}>
            <div className={styles.propHeader} onClick={getItemProps(section).onToggle}>
              <div className={styles.titleGroup}>
                {getItemProps(section).expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {section}
              </div>
              <Plus size={12} style={{ opacity: 0.5 }} />
            </div>
            {getItemProps(section).expanded && (
              <div className={styles.sectionBody}>
                {/* Replicating subgrid behavior or just using the grid directly for items */}
                {section === "TEXT" ? (
                  <>
                    <div style={{ gridColumn: '1 / -1', display: 'flex' }}>
                      {/* Font Family - Spans Full Row */}
                      <div className={styles.inputWrapper}>
                        <input className={styles.input} defaultValue="Inter" />
                        <ChevronDown size={10} style={{ opacity: 0.5 }} />
                      </div>
                    </div>
                    <GridInput label="S" value="Regular" fullWidth />
                    <GridInput label="Px" value="42" />
                    <div /> {/* Spacer for 4th col */}
                  </>
                ) : (
                  <GridInput label="Val" value="Normal" fullWidth />
                )}
              </div>
            )}
            <div className={styles.divider} />
          </div>
        ))}
      </div>
    </div>
  );
}
