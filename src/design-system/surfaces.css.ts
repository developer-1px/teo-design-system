import { recipe } from "@vanilla-extract/recipes";

// Local Palette Definition based on User Matrix
// This ensures precision matching the requested hex codes while keeping theme clear.
const palette = {
    white: "#FFFFFF",
    gray50: "#F8F9FA",
    gray100: "#F1F3F5",
    gray200: "#E9ECEF",
    gray300: "#DEE2E6", // Assumed from #DEE
    gray400: "#CED4DA",
    blue50: "#E7F5FF",
    blue100: "#D0EBFF",
    blue500: "#007AFF", // User's Primary Blue
    blue600: "#0063CC",
    blue700: "#0051A8",
    blue800: "#004494",
    red50: "#FFF5F5",
    red500: "#FF4757", // User's Error Red
};

// Shadow defines
const shadows = {
    none: "none",
    inset1: "inset 0 0 0 1px",
    inset2: "inset 0 0 0 2px",
    inset4: "inset 0 0 0 4px",
    sm: "0 2px 4px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.05)",
    lg: "0 8px 12px rgba(0,0,0,0.1)",
    xl: "0 12px 24px rgba(0,0,0,0.1)",
    xxl: "0 20px 40px rgba(0,0,0,0.1)",
    primaryRing: `0 0 0 2px ${palette.white}, 0 0 0 4px ${palette.blue500}`,
};

// Interactive definitions moved out of kinds to be applied conditionally
const interactiveStyles = {
    base: {
        true: {
            cursor: "pointer",
            ":hover": { backgroundColor: palette.white }, // No change per matrix
            ":active": { backgroundColor: palette.gray50 },
        }
    },
    subtle: {
        true: {
            cursor: "pointer",
            ":hover": { backgroundColor: palette.gray100, borderColor: palette.gray300 },
            ":active": { backgroundColor: palette.gray200, borderColor: palette.gray400 },
        }
    },
    sunken: {
        true: {
            cursor: "pointer",
            ":hover": { backgroundColor: palette.gray200, boxShadow: shadows.inset4 },
            ":active": { backgroundColor: palette.gray300, boxShadow: shadows.inset1 },
        }
    },
    raised: {
        true: {
            cursor: "pointer",
            ":hover": { boxShadow: shadows.lg },
            ":active": { backgroundColor: palette.gray50, boxShadow: shadows.sm },
        }
    },
    overlay: {
        true: {
            cursor: "pointer",
            ":hover": { borderColor: palette.gray300, boxShadow: shadows.xxl },
            ":active": { backgroundColor: palette.gray100, borderColor: palette.gray400, boxShadow: shadows.lg },
        }
    },
    primary: {
        true: {
            cursor: "pointer",
            ":hover": { backgroundColor: palette.blue600, boxShadow: "0 4px 8px rgba(0,0,0,0.2)" },
            ":active": { backgroundColor: palette.blue700 },
        }
    }
};

export const surface = recipe({
    base: {
        transition: "all 0.2s ease-in-out",
        cursor: "default",
        borderStyle: "solid",
        borderWidth: 0,
        outline: "none",
    },

    variants: {
        kind: {
            // 1. Base
            base: {
                backgroundColor: palette.white,
                borderColor: "transparent",
                boxShadow: shadows.none,
                // Focus state (using Focus Ring pattern)
                ":focus-visible": {
                    zIndex: 1,
                    boxShadow: `0 0 0 2px ${palette.blue500}`,
                },
                selectors: {
                    "&[data-selected]": { backgroundColor: palette.white },
                    "&[disabled]": { backgroundColor: palette.gray100, color: palette.gray400, cursor: "not-allowed" },
                    "&[data-error]": { backgroundColor: palette.white, borderColor: palette.red500, borderWidth: "1px" },
                }
            },

            // 2. Subtle
            subtle: {
                backgroundColor: palette.gray50,
                borderWidth: "1px",
                borderColor: palette.gray200,
                boxShadow: shadows.none,
                selectors: {
                    "&:focus-within": { borderColor: palette.blue500, backgroundColor: palette.gray50 },
                    "&[data-selected]": { backgroundColor: palette.blue50, borderColor: palette.blue100 },
                    "&[disabled]": { backgroundColor: palette.gray50, borderColor: palette.gray200, opacity: 0.6 },
                    "&[data-error]": { backgroundColor: palette.red50, borderColor: palette.red500 },
                }
            },

            // 3. Sunken
            sunken: {
                backgroundColor: palette.gray100,
                boxShadow: shadows.inset2,
                selectors: {
                    "&:focus-within": { backgroundColor: palette.white, boxShadow: `0 0 0 1px ${palette.blue500}` },
                    "&[data-selected]": { backgroundColor: palette.blue50, boxShadow: `inset 0 0 0 1px ${palette.blue500}` },
                    "&[disabled]": { backgroundColor: palette.gray200, boxShadow: "none" },
                    "&[data-error]": { backgroundColor: palette.red50, boxShadow: `inset 0 0 0 2px ${palette.red500}` },
                }
            },

            // 4. Raised
            raised: {
                backgroundColor: palette.white,
                boxShadow: shadows.md,
                selectors: {
                    "&:focus-visible": { boxShadow: `0 0 0 1px ${palette.blue500}, ${shadows.md}` },
                    "&[data-selected]": { boxShadow: `0 0 0 2px ${palette.blue500}, ${shadows.sm}` },
                    "&[disabled]": { backgroundColor: palette.gray100, boxShadow: "none" },
                    "&[data-error]": { boxShadow: `0 0 0 1px ${palette.red500}, ${shadows.md}` },
                }
            },

            // 5. Overlay
            overlay: {
                backgroundColor: palette.white,
                borderWidth: "1px",
                borderColor: palette.gray200,
                boxShadow: shadows.xl,
                selectors: {
                    "&:focus-visible": { borderColor: palette.blue500, borderWidth: "2px" },
                    "&[data-selected]": { backgroundColor: palette.blue50, borderColor: palette.blue500, borderWidth: "2px" },
                    "&[disabled]": { backgroundColor: palette.gray50, borderColor: palette.gray200, boxShadow: shadows.sm },
                    "&[data-error]": { borderColor: palette.red500 },
                }
            },

            // 6. Primary
            primary: {
                backgroundColor: palette.blue500,
                color: palette.white,
                boxShadow: shadows.none,
                selectors: {
                    "&:focus-visible": { boxShadow: `0 0 0 2px ${palette.white}, 0 0 0 4px ${palette.blue500}` },
                    "&[data-selected]": { backgroundColor: palette.blue800, boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.2)" },
                    "&[disabled]": { backgroundColor: palette.blue100, color: palette.blue500, opacity: 0.5 },
                    "&[data-error]": { backgroundColor: palette.red500 },
                }
            }
        },
        interactive: {
            true: {},
            false: {}
        }
    },

    compoundVariants: [
        {
            variants: { kind: "base", interactive: true },
            style: interactiveStyles.base.true
        },
        {
            variants: { kind: "subtle", interactive: true },
            style: interactiveStyles.subtle.true
        },
        {
            variants: { kind: "sunken", interactive: true },
            style: interactiveStyles.sunken.true
        },
        {
            variants: { kind: "raised", interactive: true },
            style: interactiveStyles.raised.true
        },
        {
            variants: { kind: "overlay", interactive: true },
            style: interactiveStyles.overlay.true
        },
        {
            variants: { kind: "primary", interactive: true },
            style: interactiveStyles.primary.true
        }
    ],

    defaultVariants: {
        kind: "base",
        interactive: false
    }
});
