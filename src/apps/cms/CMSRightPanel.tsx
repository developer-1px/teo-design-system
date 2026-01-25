import { ChevronDown, ChevronRight, X } from "lucide-react";
import * as styles from "./CMSRightPanel.styles";
import { useState } from "react";

export function CMSRightPanel({ onClose }: { onClose: () => void }) {
  return (
    <aside className={styles.panel}>
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.headerTitle}>Page Properties</span>
        <button
          onClick={onClose}
          className={styles.closeBtn}
        >
          <X size={16} />
        </button>
      </header>

      {/* Inspector Grid Content */}
      <div className={styles.grid}>
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
  expanded: defaultExpanded = true,
}: {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} onClick={() => setExpanded(!expanded)}>
        <span className={styles.sectionTitle}>{title}</span>
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </div>
      {expanded && children}
    </div>
  );
}

function PropertyRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className={styles.propRow}>
      <label className={styles.propLabel}>{label}</label>
      <div className={styles.propValue}>
        {badge ? (
          <span className={`${styles.badge} ${badge === 'success' ? styles.badgeSuccess : ''}`}>{value}</span>
        ) : (
          <div className={styles.inputWrapper}>
            <input className={styles.nativeInput} defaultValue={value} />
          </div>
        )}
      </div>
    </div>
  );
}
