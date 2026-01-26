import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/design-system/theme.css.ts";

export const action = recipe({
    base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: vars.space.n4,
        borderRadius: vars.radius.n6,
        cursor: "pointer",
        border: "1px solid transparent",
        transition: "all 0.1s ease",
        fontSize: vars.font.size.n12,
        fontWeight: vars.font.weight.medium,
        lineHeight: 1,
        whiteSpace: "nowrap",
        color: vars.color.text.primary,

        selectors: {
            "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed",
            }
        }
    },
    variants: {
        variant: {
            ghost: {
                background: "transparent",
                color: vars.color.text.secondary,
                selectors: {
                    "&:hover": {
                        background: vars.color.surface.sunken, // or hover color
                        color: vars.color.text.primary,
                    },
                    "&:active": {
                        background: vars.color.surface.raised,
                    }
                }
            },
            surface: {
                background: vars.color.surface.raised,
                border: `1px solid ${vars.color.border.subtle}`,
                boxShadow: vars.elevation.n1,
                selectors: {
                    "&:hover": {
                        borderColor: vars.color.border.hover,
                    },
                    "&:active": {
                        background: vars.color.surface.sunken,
                    }
                }
            },
            primary: {
                background: vars.color.surface.primary,
                color: vars.color.text.inverse,
                selectors: {
                    "&:hover": {
                        opacity: 0.9,
                    }
                }
            },
            outline: {
                background: "transparent",
                border: `1px solid ${vars.color.border.default}`,
                selectors: {
                    "&:hover": {
                        background: vars.color.surface.sunken,
                    }
                }
            }
        },
        size: {
            xs: {
                height: vars.space.n24,
                padding: `0 ${vars.space.n4}`,
                fontSize: vars.font.size.n11,
            },
            sm: {
                height: vars.space.n32, // Size.n32? Action legacy default was sm=32px? 
                padding: `0 ${vars.space.n8}`,
            },
            md: {
                height: vars.space.n40,
                padding: `0 ${vars.space.n12}`,
            },
            lg: {
                height: vars.space.n48,
                padding: `0 ${vars.space.n16}`,
                fontSize: vars.font.size.n14,
            },
            icon: {
                width: vars.space.n32,
                height: vars.space.n32,
                padding: 0,
            }
        },
        active: {
            true: {
                background: vars.color.surface.selected,
                color: vars.color.text.primary,
            }
        }
    },
    defaultVariants: {
        variant: "ghost",
        size: "sm",
    },
});
