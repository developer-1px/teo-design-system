
import { style } from "@vanilla-extract/css";

export const pageContainer = style({
    display: "flex",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
});

export const container = style({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    position: "relative",
});

export const toolbar = style({
    height: "48px",
    borderBottom: "1px solid #e2e2e2",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
});

export const titleGroup = style({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
});

export const divider = style({
    width: "1px",
    height: "16px",
    backgroundColor: "#e2e2e2",
    margin: "0 8px",
});

export const actionButton = style({
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "transparent",
    color: "#555",
    cursor: "pointer",
    ":hover": {
        backgroundColor: "#f5f5f5",
    },
});

export const searchContainer = style({
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: "6px",
    padding: "4px 8px",
    gap: "8px",
    width: "300px",
    border: "1px solid #e2e2e2",
});

export const searchInput = style({
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "13px",
    flex: 1,
});

export const searchCounter = style({
    fontSize: "11px",
    color: "#888",
    whiteSpace: "nowrap",
});
