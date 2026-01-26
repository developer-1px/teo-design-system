import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "../../design-system/theme.css";
import * as utils from "@/ui/utils.css";



// 1. Container
export const container = style(utils.styled.grid({
    parent: {
        // Positioned in the Master Viewport Grid
        ...utils.grid12.subgrid, // Inherit columns
        width: "100%", // Explicit dimension if needed
    },
    layout: {
        // Internal Grid Layout
        gridTemplateColumns: "subgrid", // Redundant with subgrid in parent, but clarifies internal structure
        paddingTop: vars.space.n64,
        paddingBottom: vars.space.n64,
        rowGap: vars.space.n24,
        alignItems: "center",
        position: "relative", // Layout context for absolute children
        minHeight: "600px", // Moved from parent
    }
}));

// 2. Badge
export const badge = style(utils.styled.flex({
    parent: {
        ...utils.grid12.center(4),
    },
    layout: {
        alignItems: "center",
        justifyContent: "center",
        height: "28px",
        padding: `0 ${vars.space.n12}`,
        borderRadius: vars.radius.full,
        backgroundColor: vars.color.surface.overlay,
        border: `1px solid ${vars.color.surface.primary}`,
        color: vars.color.surface.primary,
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    }
}));

// 3. Title (Block element, not a layout container per se, so styled.box)
export const title = style(utils.styled.box({
    parent: {
        ...utils.grid12.center(10),
    },
    layout: {
        textAlign: "center",
        fontSize: "64px",
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: "-0.03em",
        color: vars.color.text.primary,
    }
}));

export const titleGradient = style({
    background: `linear-gradient(to right bottom, ${vars.color.surface.primary}, ${vars.color.text.secondary})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
});

// 4. Description
export const description = style(utils.styled.box({
    parent: {
        ...utils.grid12.center(6),
    },
    layout: {
        textAlign: "center",
        fontSize: "20px",
        lineHeight: 1.6,
        color: vars.color.text.secondary,
    }
}));

// 5. Actions
export const actionGroup = style(utils.styled.flex({
    parent: {
        ...utils.grid12.center(8),
        marginTop: vars.space.n16,
    },
    layout: {
        alignItems: "center",
        justifyContent: "center",
        gap: vars.space.n16,
    }
}));

export const button = recipe({
    base: style(utils.styled.flex({
        layout: {
            height: "48px",
            padding: "0 32px",
            borderRadius: vars.radius.full,
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            alignItems: "center",
            gap: vars.space.n8,
            border: "1px solid transparent",
        }
    })),
    variants: {
        variant: {
            primary: {
                backgroundColor: vars.color.surface.primary,
                color: vars.color.surface.page,
                selectors: {
                    "&:hover": {
                        opacity: 0.9,
                        transform: "translateY(-1px)",
                    }
                }
            },
            secondary: {
                backgroundColor: "transparent",
                borderColor: vars.color.border.default,
                color: vars.color.text.primary,
                selectors: {
                    "&:hover": {
                        backgroundColor: vars.color.surface.panel,
                        borderColor: vars.color.text.primary,
                    }
                }
            }
        },
        fullWidth: {
            true: {
                width: "100%",
                justifyContent: "center",
            }
        }
    },
    defaultVariants: {
        variant: "primary",
        fullWidth: false,
    }
});

// 6. Visual Mockup
export const visualFrame = style(utils.styled.flex({
    parent: {
        ...utils.grid12.center(10),
        marginTop: vars.space.n40,
    },
    layout: {
        flexDirection: "column",
        aspectRatio: "16/10",
        backgroundColor: vars.color.surface.card,
        borderRadius: vars.radius.n24,
        border: `1px solid ${vars.color.border.default}`,
        boxShadow: vars.elevation.n3,
        overflow: "hidden",
        position: "relative",
    }
}));

export const browserHeader = style(utils.styled.flex({
    layout: {
        height: "40px",
        borderBottom: `1px solid ${vars.color.border.default}`,
        alignItems: "center",
        padding: `0 ${vars.space.n16}`,
        gap: vars.space.n8,
        backgroundColor: vars.color.surface.panel,
    }
}));

export const dot = style({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: vars.color.border.default, // Placeholder color
    selectors: {
        "&:nth-child(1)": { backgroundColor: "#FF5F57" },
        "&:nth-child(2)": { backgroundColor: "#FEBC2E" },
        "&:nth-child(3)": { backgroundColor: "#28C840" },
    }
});
