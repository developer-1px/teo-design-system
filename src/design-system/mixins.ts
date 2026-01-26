import type { StyleRule } from "@vanilla-extract/css";
import { vars } from "./theme.css";

/**
 * Text Truncation
 * Forces text to a single line and adds an ellipsis at the end.
 */
export const truncate: StyleRule = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

/**
 * Line Clamp
 * Limits text to a specific number of lines.
 */
export const lineClamp = (lines: number): StyleRule => ({
    display: "-webkit-box",
    WebkitLineClamp: lines.toString() as any, // Type cast for non-standard property
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
});

/**
 * Absolute Fill
 * Positions an element absolutely to cover its positioned parent.
 */
export const absoluteFill: StyleRule = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
};

/**
 * Visually Hidden
 * Hides content visually but ensures it remains accessible to screen readers.
 */
export const visuallyHidden: StyleRule = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
};

/**
 * Hide Scrollbar
 * Hides the scrollbar while allowing scrolling.
 */
export const hideScrollbar: StyleRule = {
    scrollbarWidth: "none",
    "::-webkit-scrollbar": {
        display: "none",
    },
};

/**
 * Transition Helper
 * Standardizes transition usage with theme tokens.
 */
export const transition = (
    properties: string | string[],
    duration: keyof typeof vars.motion.duration = "normal",
    timing: keyof typeof vars.motion.timing = "easeInOut"
): StyleRule => {
    const props = Array.isArray(properties) ? properties.join(", ") : properties;
    return {
        transitionProperty: props,
        transitionDuration: vars.motion.duration[duration],
        transitionTimingFunction: vars.motion.timing[timing],
    };
};

/**
 * Surface Mixin
 * Composes background, border, shadow, and interactive states into a single style rule.
 */
interface SurfaceConfig {
    bg?: keyof typeof vars.color.surface;
    color?: keyof typeof vars.color.text;
    border?: keyof typeof vars.color.border;
    shadow?: keyof typeof vars.elevation;
    interactive?: boolean;
}

export const surface = ({
    bg,
    color,
    border,
    shadow,
    interactive = false,
}: SurfaceConfig): StyleRule => {
    const rules: StyleRule = {};

    if (bg) rules.backgroundColor = vars.color.surface[bg];
    if (color) rules.color = vars.color.text[color];
    if (border) {
        rules.borderWidth = "1px";
        rules.borderStyle = "solid";
        rules.borderColor = vars.color.border[border];
    }
    if (shadow) rules.boxShadow = vars.elevation[shadow];

    if (interactive) {
        rules.cursor = "pointer";
        rules.transition = `all ${vars.motion.duration.fast} ${vars.motion.timing.easeInOut}`;

        rules[":hover"] = {
            opacity: vars.opacity.hover, // Simple default interaction
        };
        rules[":active"] = {
            opacity: vars.opacity.subtle,
            transform: "scale(0.98)",
        };

        // Enhance border interaction if present
        if (border) {
            rules[":hover"] = {
                ...rules[":hover"],
                borderColor: vars.color.border.hover,
            };
            rules[":focus-visible"] = {
                borderColor: vars.color.border.focus,
                outline: `2px solid ${vars.color.border.focus}`,
                outlineOffset: "2px",
            };
        }
    }

    return rules;
};

/**
 * Surface Presets
 * Pre-configured surface styles matching the design matrix.
 */
export const surfaces = {
    card: surface({ bg: "card", border: "subtle", shadow: "n1" }),
    panel: surface({ bg: "panel", border: "subtle" }),
    elevated: surface({ bg: "raised", shadow: "n3" }),

    // Interactive Surfaces
    action: surface({
        bg: "primary",
        color: "inverse",
        interactive: true
    }),
    ghost: surface({
        bg: "sunken",
        color: "primary",
        interactive: true
    }),
};
