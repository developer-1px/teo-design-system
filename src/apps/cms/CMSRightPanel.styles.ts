import { css } from "@/lib/engine";

export const panel = css({
    width: "320px",
    backgroundColor: "var(--surface-base)",
    borderLeft: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    zIndex: 10,
});

export const header = css({
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    borderBottom: "1px solid var(--border-color)",
});

export const headerTitle = css({
    fontSize: "14px",
    fontWeight: "600",
});

export const closeBtn = css({
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    borderRadius: "50%",
    color: "var(--text-secondary)",
});

export const grid = css({
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "grid",
    gridTemplateColumns: "100px 1fr 24px",
    gap: "12px 8px",
    alignContent: "start",
});

export const section = css({
    gridColumn: "1 / -1",
    display: "grid",
    gridTemplateColumns: "subgrid",
    marginTop: "8px",
});

export const sectionHeader = css({
    gridColumn: "1 / -1",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "32px",
    cursor: "pointer",
    userSelect: "none",
    borderBottom: "1px solid var(--border-color)",
    marginBottom: "8px",
});

export const sectionTitle = css({
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    letterSpacing: "0.05em",
});

export const propRow = css({
    gridColumn: "1 / -1",
    display: "grid",
    gridTemplateColumns: "subgrid",
    alignItems: "start",
    minHeight: "28px",
});

export const propLabel = css({
    gridColumn: "1",
    fontSize: "12px",
    color: "var(--text-tertiary)",
    paddingTop: "6px",
});

export const propValue = css({
    gridColumn: "2 / -1",
    display: "flex",
    alignItems: "center",
});

export const inputWrapper = css({
    width: "100%",
    display: "flex",
    alignItems: "center",
    backgroundColor: "var(--surface-sunken)",
    borderRadius: "4px",
    padding: "4px 8px",
    minHeight: "28px",
    transition: "all 0.2s",
    border: "1px solid transparent",
});

export const nativeInput = css({
    width: "100%",
    background: "transparent",
    border: "none",
    fontSize: "13px",
    color: "var(--text-primary)",
    outline: "none",
    fontFamily: "inherit",
});

export const badge = css({
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
    background: "var(--surface-raised)",
    color: "var(--text-primary)",
});

export const badgeSuccess = css({
    background: "rgba(16, 185, 129, 0.1)",
    color: "rgb(16, 185, 129)",
});
