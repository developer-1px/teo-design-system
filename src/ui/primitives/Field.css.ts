import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/design-system/theme.css.ts";

export const fieldLabel = recipe({
    base: {
        transition: "all 0.15s ease",
        gap: vars.space.n6,
        paddingTop: vars.space.n6,
        paddingBottom: vars.space.n6,
        paddingLeft: vars.space.n8,
        paddingRight: vars.space.n8,

        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: vars.color.surface.sunken,
        borderRadius: vars.radius.n6,
        cursor: "text",
        width: "100%",

        selectors: {
            "&:focus-within": {
                backgroundColor: vars.color.surface.base,
                boxShadow: `0 0 0 1px ${vars.color.border.focus}`,
            }
        }
    },
});

export const fieldInput = recipe({
    base: {
        border: "none",
        background: "transparent",
        outline: "none",
        padding: 0,
        minWidth: 0,
        flex: 1,
        color: vars.color.text.primary,
        fontSize: vars.font.size.n11, // Compact UI
        height: "100%",
    },
});
