import { recipe } from "@vanilla-extract/recipes";
import { vars } from "../../design-system/theme.css.ts";

export const root = recipe({
    base: {
        display: "flex",
        backgroundColor: vars.color.surface.sunken,
        padding: vars.space.n2,
        borderRadius: vars.radius.n8, // mapped to Radius2.md -> n8 or n10? legacy used Radius2.md which is often 6 or 8. Let's use vars.radius.n8 (8px)
        gap: vars.space.n2,
        width: "fit-content",
    },
});

export const item = recipe({
    base: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${vars.space.n4} ${vars.space.n8}`,
        border: "none",
        background: "transparent",
        color: vars.color.text.subtle,
        borderRadius: vars.radius.n6, // Radius2.sm -> approx 4 or 6.
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontSize: vars.font.size.n12,
        fontWeight: vars.font.weight.medium,
        selectors: {
            "&:hover": {
                color: vars.color.text.primary,
                background: vars.color.border.hover, // subtle hover equivalent
            }
        }
    },
    variants: {
        active: {
            true: {
                background: vars.color.surface.base,
                color: vars.color.text.primary,
                boxShadow: vars.elevation.n1,
                selectors: {
                    "&:hover": {
                        background: vars.color.surface.base, // Keep white/base on hover if active
                    }
                }
            },
            false: {}
        },
    },
    defaultVariants: {
        active: false,
    },
});
