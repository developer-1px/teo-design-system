import { style } from "@vanilla-extract/css";
import { vars } from "@/design-system/theme.css.ts";

export const sidebar = style({
    position: "relative",
    height: "100%",
    padding: vars.space.n8,
    gap: vars.space.n4,
    borderRight: `1px solid ${vars.color.border.subtle}`,
    display: "flex",
    flexDirection: "column",
    backgroundColor: vars.color.surface.sunken,
});

export const header = style({
    height: vars.space.n64,
    paddingLeft: vars.space.n8,
    paddingRight: vars.space.n8,
    borderBottom: `1px solid ${vars.color.border.subtle}`,
    display: "flex",
    alignItems: "center",
    backgroundColor: vars.color.surface.sunken,
});

export const workspaceButton = style({
    width: "100%",
    padding: vars.space.n4,
    minHeight: vars.space.n40,
    display: "flex",
    alignItems: "center",
    gap: vars.space.n12,
});

export const avatar = style({
    width: vars.space.n20,
    height: vars.space.n20,
    borderRadius: vars.radius.full,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "10px",
    fontWeight: vars.font.weight.bold,
});

export const section = style({
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n2,
});

export const sectionLabel = style({
    padding: `${vars.space.n4} ${vars.space.n8}`,
    fontSize: vars.font.size.n11,
    fontWeight: vars.font.weight.medium,
    color: vars.color.text.tertiary,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
});

export const footer = style({
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n4,
});

export const footerNote = style({
    padding: `${vars.space.n6} ${vars.space.n8}`,
    backgroundColor: vars.color.surface.sunken,
    borderRadius: vars.radius.n2,
    color: vars.color.text.tertiary,
    fontSize: vars.font.size.n11,
});
