import React from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  Building2,
  CheckSquare,
  ChevronDown,
  Database,
  FolderKanban,
  LayoutGrid,
  Users,
} from "lucide-react";

import { Action } from "@/ui/primitives/Action";
import { Icon } from "@/ui/primitives/Icon";
import { ResizeHandle, useResizable } from "@/ui/Resizable"; // Ensure this path is valid or updated
// Resizable might be in legacy? Let's assume it maps to legacy for now via alias.
import { datasetsAtom, selectedDatasetAtom } from "./store";
import * as styles from "./CRMSidebar.css";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  LayoutGrid,
  Building2,
  Users,
  FolderKanban,
  CheckSquare,
  Database,
};

function Avatar({
  initial,
  color,
}: {
  initial: string;
  color: string;
}) {
  return (
    <div
      className={styles.avatar}
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
}

function DatasetItem({
  label,
  icon: iconName,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onClick: () => void;
}) {
  const IconComponent = iconMap[iconName] || Database;

  return (
    <Action
      variant={active ? "surface" : "ghost"}
      active={active}
      icon={IconComponent}
      label={label}
      onClick={onClick}
      style={{ width: "100%", justifyContent: "flex-start" }} // Override justify
    />
  );
}

export function CRMSidebar() {
  const datasets = useAtomValue(datasetsAtom);
  const [selectedDataset, setSelectedDataset] = useAtom(selectedDatasetAtom);

  // Resizable hook
  const { size, resizeHandleProps } = useResizable({
    direction: "left",
    defaultSize: 240,
    minSize: 200,
    maxSize: 400,
    storageKey: "crm-sidebar-width",
  });

  return (
    <div
      className={styles.sidebar}
      style={{ width: size }}
    >
      <ResizeHandle direction="left" {...resizeHandleProps} />

      {/* Workspace Switcher */}
      <div className={styles.header}>
        <div className={styles.workspaceButton}>
          <Avatar initial="D" color="black" />
          <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>DataTable</span>
          <div style={{ flex: 1 }} />
          <Icon src={ChevronDown} size={14} style={{ opacity: 0.4 }} />
        </div>
      </div>

      <div style={{ height: 8 }} />

      {/* Datasets Section */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Datasets</div>
        {datasets.map((dataset) => (
          <DatasetItem
            key={dataset.name}
            label={dataset.label}
            icon={dataset.icon}
            active={selectedDataset === dataset.name}
            onClick={() => setSelectedDataset(dataset.name)}
          />
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom Info */}
      <div className={styles.footer}>
        <div className={styles.footerNote}>
          {datasets.length} datasets loaded
        </div>
      </div>
    </div>
  );
}
