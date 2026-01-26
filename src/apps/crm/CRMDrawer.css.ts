import { style } from "@vanilla-extract/css";
import { vars } from "@/design-system/theme.css.ts";

export const drawer = style({
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: vars.color.surface.base,
    borderLeft: `1px solid ${vars.color.border.subtle}`,
    boxShadow: vars.elevation.n5,
    display: "flex",
    flexDirection: "column",
    zIndex: 100, // ZIndex.n100
    transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
});

export const content = style({
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n12,
    flex: 1,
    overflowY: "auto",
});

export const section = style({
    padding: vars.space.n24,
    gap: vars.space.n32,
    display: "flex",
    flexDirection: "column",
});

export const header = style({
    height: vars.space.n64,
    paddingLeft: vars.space.n24,
    paddingRight: vars.space.n24,
    borderBottom: `1px solid ${vars.color.border.subtle}`,
    display: "flex",
    alignItems: "center",
    gap: vars.space.n12,
});

export const headerContent = style({
    display: "flex",
    alignItems: "center",
    gap: vars.space.n12,
    flex: 1,
});

export const avatar = style({
    width: vars.space.n32,
    height: vars.space.n32,
    borderRadius: vars.radius.full,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: vars.font.size.n12,
    fontWeight: vars.font.weight.bold,
});

export const textMeta = style({
    display: "flex",
    flexDirection: "column",
});

export const title = style({
    fontWeight: vars.font.weight.bold,
    fontSize: vars.font.size.n14,
    color: vars.color.text.primary,
});

export const subtitle = style({
    fontSize: vars.font.size.n12,
    color: vars.color.text.tertiary,
});

export const footer = style({
    height: vars.space.n56,
    padding: `${vars.space.n12} ${vars.space.n24}`,
    borderTop: `1px solid ${vars.color.border.subtle}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: vars.space.n8,
    backgroundColor: vars.color.surface.sunken,
});
