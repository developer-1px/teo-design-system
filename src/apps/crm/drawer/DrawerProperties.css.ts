import { style } from "@vanilla-extract/css";
import { vars } from "@/design-system/theme.css.ts";

export const groupHeader = style({
    display: "flex",
    alignItems: "center",
    gap: vars.space.n8,
    cursor: "pointer",
    padding: `0 ${vars.space.n8}`,
    minHeight: vars.space.n32,
    borderRadius: vars.radius.n6,
    transition: "all 0.15s ease",
});

export const groupPanel = style({
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n12,
    paddingLeft: vars.space.n24,
    paddingBottom: vars.space.n20,
});

export const propertyRow = style({
    display: "flex",
    flexDirection: "row",
    gap: vars.space.n16,
    alignItems: "flex-start",
    minHeight: vars.space.n32, // approximately n40 was minHeight in legacy
});
