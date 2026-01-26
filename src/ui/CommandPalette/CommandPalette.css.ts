import { style } from "@vanilla-extract/css";
import { vars } from "../../design-system/theme.css.ts";

export const overlay = style({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 200, // vars.zIndex.n200
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: vars.space.n0,
});

export const panel = style({
    width: "640px",
    maxWidth: "90vw",
    backgroundColor: vars.color.surface.base,
    borderRadius: vars.radius.n12, // Radius2.lg
    boxShadow: vars.elevation.n5,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: `1px solid ${vars.color.border.subtle}`,
    color: vars.color.text.primary,
});

export const searchArea = style({
    padding: vars.space.n16,
    borderBottom: `1px solid ${vars.color.border.subtle}`,
    display: "flex",
    alignItems: "center",
    gap: vars.space.n12,
});

export const input = style({
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: vars.font.size.n16,
    color: vars.color.text.primary,
    outline: "none",
    "::placeholder": {
        color: vars.color.text.tertiary,
    },
});

export const resultsArea = style({
    maxHeight: "300px",
    overflowY: "auto",
    padding: vars.space.n8,
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n4,
});

export const item = style({
    padding: `${vars.space.n8} ${vars.space.n12}`,
    borderRadius: vars.radius.n6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: vars.space.n8,
    color: vars.color.text.primary,
    fontSize: vars.font.size.n14,
    selectors: {
        "&[data-focused='true']": {
            backgroundColor: vars.color.surface.sunken, // or primary selection?
        },
        "&:hover": {
            backgroundColor: vars.color.surface.sunken,
        }
    }
});

export const itemShortcut = style({
    fontSize: vars.font.size.n12,
    color: vars.color.text.tertiary,
    backgroundColor: vars.color.surface.raised,
    padding: `2px 6px`,
    borderRadius: vars.radius.n4,
});

export const footer = style({
    padding: `${vars.space.n8} ${vars.space.n16}`,
    backgroundColor: vars.color.surface.sunken,
    borderTop: `1px solid ${vars.color.border.subtle}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: vars.font.size.n12,
    color: vars.color.text.tertiary,
});
