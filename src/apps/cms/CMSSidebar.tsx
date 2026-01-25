import {
  ChevronRight,
  FileText,
  Grid2X2,
  PanelLeft,
  Plus,
  Settings,
} from "lucide-react";
import { useState } from "react";
import * as styles from "./CMSSidebar.styles";

interface CMSSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function CMSSidebar({ isOpen, onToggle }: CMSSidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? "" : styles.sidebarCollapsed}`}>
      {/* Header */}
      <div className={styles.sidebarHeader}>
        <button
          className={styles.iconBtn}
          onClick={onToggle}
          title={isOpen ? "Collapse" : "Expand"}
          style={{ marginLeft: 'auto' }}
        >
          <PanelLeft size={16} />
        </button>
      </div>

      {isOpen && (
        <>
          <div className={styles.sidebarContent}>
            <SidebarSection title="PAGES" />
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 8px' }}>
              <TreeItem label="Home" icon={FileText} level={0} active />
              <TreeItem label="Features" icon={FileText} level={0} />
              <TreeItem label="Pricing" icon={FileText} level={0} />
              <TreeItem label="Blog" icon={FileText} level={0} collapsed>
                <TreeItem label="2024 Design Trends" icon={FileText} level={1} />
                <TreeItem label="Engineering Culture" icon={FileText} level={1} />
              </TreeItem>
              <TreeItem label="Contact" icon={FileText} level={0} />
            </div>

            <div style={{ height: 16 }} />

            <SidebarSection title="COMPONENTS" />
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 8px' }}>
              <TreeItem label="Navigation" icon={Grid2X2} level={0} />
              <TreeItem label="Hero Section" icon={Grid2X2} level={0} />
              <TreeItem label="Feature Grid" icon={Grid2X2} level={0} />
              <TreeItem label="Testimonials" icon={Grid2X2} level={0} />
              <TreeItem label="Footer" icon={Grid2X2} level={0} />
            </div>
          </div>

          <div className={styles.sidebarFooter}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={16} color="var(--text-secondary)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Site Settings</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>General, SEO, Analytics</div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

function SidebarSection({ title }: { title: string }) {
  return (
    <div className={styles.sidebarSection}>
      <span className={styles.sectionLabel}>{title}</span>
      <button className={styles.iconBtn} style={{ width: 20, height: 20 }}>
        <Plus size={12} />
      </button>
    </div>
  );
}

interface TreeItemProps {
  label: string;
  icon: React.ElementType;
  level: number;
  active?: boolean;
  collapsed?: boolean;
  children?: React.ReactNode;
}

function TreeItem({
  label,
  icon: IconSrc,
  level,
  active,
  collapsed,
  children,
}: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  return (
    <div className={styles.treeItemGroup}>
      <div
        className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ paddingLeft: 8 + level * 12 }}
      >
        <div style={{ width: 16, display: 'flex', justifyContent: 'center' }}>
          {children ? (
            <ChevronRight
              size={12}
              style={{
                transform: isExpanded ? "rotate(90deg)" : "none",
                transition: "transform 0.2s",
                opacity: 0.6
              }}
            />
          ) : active ? (
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary)' }} />
          ) : null}
        </div>

        <IconSrc size={14} style={{ opacity: active ? 1 : 0.7 }} />
        <span style={{ flex: 1 }}>{label}</span>
      </div>
      {isExpanded && children && (
        <div className={styles.treeChildren}>
          {children}
        </div>
      )}
    </div>
  );
}
