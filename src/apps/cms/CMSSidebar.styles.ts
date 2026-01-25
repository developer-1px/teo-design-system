import { css } from "@/lib/engine";

export const sidebar = css({
    width: "240px",
    backgroundColor: "var(--surface-sunken)",
    borderRight: "1px solid var(--border-color)",
    display: "grid",
    gridTemplateRows: "auto 1fr auto", // Header | Content | Footer
    overflow: "hidden",
    transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    position: "relative",
    zIndex: 20,
});

export const sidebarCollapsed = css({
    width: "64px",
});

export const sidebarHeader = css({
    height: "44px",
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
});

export const sidebarContent = css({
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "8px 0",
});

export const sidebarSection = css({
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
});

export const sectionLabel = css({
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.05em",
    color: "var(--text-tertiary)",
});

export const navItem = css({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 8px 6px 16px",
    fontSize: "13px",
    color: "var(--text-secondary)",
    cursor: "pointer",
    borderRadius: "4px",
    margin: "0 8px",
    transition: "all 0.2s",
});

export const navItemActive = css({
    backgroundColor: "var(--surface-raised)",
    color: "var(--text-primary)",
    fontWeight: "500",
});

export const sidebarFooter = css({
    padding: "12px",
    borderTop: "1px solid var(--border-color)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

export const iconBtn = css({
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "var(--text-secondary)",
    transition: "all 0.2s",
});

export const treeItemGroup = css({
    display: "flex",
    flexDirection: "column",
});

export const treeChildren = css({
    display: "flex",
    flexDirection: "column",
});
