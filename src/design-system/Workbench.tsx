import type React from "react";
import "./tokens.css";

interface WorkbenchProps {
  children?: React.ReactNode;
  columns?: string;
  rows?: string;
  areas?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Workbench({
  children,
  columns = "250px 1fr", // Default Sidebar + Editor
  rows = "auto 1fr auto", // Default Header + Body + Status
  areas,
  className = "",
  style,
}: WorkbenchProps) {
  return (
    <div
      className={`workbench ${className}`}
      style={{
        display: "grid",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
        gridTemplateAreas: areas,
        backgroundColor: "var(--surface-base)",
        color: "var(--text-base)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
