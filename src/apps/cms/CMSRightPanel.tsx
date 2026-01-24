import { ChevronDown, ChevronRight, X } from "lucide-react";
import "./CMSApp.css";

export function CMSRightPanel({ onClose }: { onClose: () => void }) {
  return (
    <aside className="cms-right-panel">
      {/* Header */}
      <header
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600 }}>Page Properties</span>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            borderRadius: "50%",
            color: "var(--text-secondary)",
          }}
        >
          <X size={16} />
        </button>
      </header>

      {/* Inspector Grid Content */}
      <div className="cms-inspector-grid">
        <InspectorSection title="Identity" expanded={true}>
          <PropertyRow label="Title" value="Marketing Home" />
          <PropertyRow label="Slug" value="/" />
          <PropertyRow label="Status" value="Published" badge="success" />
        </InspectorSection>

        <InspectorSection title="SEO" expanded={true}>
          <PropertyRow label="Meta Title" value="Modern CMS for React" />
          <PropertyRow label="Description" value="The best CMS..." />
          <PropertyRow label="Indexable" value="Yes" />
        </InspectorSection>

        <InspectorSection title="Appearance" expanded={true}>
          <PropertyRow label="Theme" value="Dark Mode" />
          <PropertyRow label="Layout" value="Full Width" />
        </InspectorSection>
      </div>
    </aside>
  );
}

function InspectorSection({
  title,
  children,
  expanded = true,
}: {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
}) {
  return (
    <div className="cms-inspector-section">
      <div className="cms-section-header">
        <span className="cms-section-title">{title}</span>
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </div>
      {expanded && children}
    </div>
  );
}

function PropertyRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="cms-prop-row">
      <label className="cms-prop-label">{label}</label>
      <div className="cms-prop-value">
        {badge ? (
          <span className={`cms-badge ${badge}`}>{value}</span>
        ) : (
          <div className="cms-input-wrapper">
            <input className="cms-native-input" defaultValue={value} />
          </div>
        )}
      </div>
    </div>
  );
}
