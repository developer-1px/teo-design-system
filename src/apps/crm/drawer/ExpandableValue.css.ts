import { style } from "@vanilla-extract/css";
import { vars } from "@/design-system/theme.css.ts";

export const container = style({
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n4,
});

export const tagContainer = style({
    display: "flex",
    flexWrap: "wrap",
    gap: vars.space.n4,
    alignItems: "center",
});

export const tag = style({
    padding: `${vars.space.n2} ${vars.space.n8}`,
    backgroundColor: vars.color.surface.sunken,
    borderRadius: vars.radius.n2,
    display: "flex",
    alignItems: "center",
});

export const textValue = style({
    fontSize: vars.font.size.n12,
    lineHeight: "1.5",
    color: vars.color.text.secondary,
    wordBreak: "break-all",
});

export const showMoreButton = style({
    cursor: "pointer",
    padding: `${vars.space.n2} ${vars.space.n8}`,
    backgroundColor: vars.color.surface.sunken,
    borderRadius: vars.radius.n2,
    fontSize: vars.font.size.n11,
    color: vars.color.text.primary,
    border: "none",
    selectors: {
        "&:hover": {
            backgroundColor: vars.color.surface.raised, // hover effect?
        }
    }
});

export const emptyText = style({
    color: vars.color.text.tertiary,
    fontSize: vars.font.size.n12,
});
