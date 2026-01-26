import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";
import { vars } from "./theme.css";

const responsiveProperties = defineProperties({
    conditions: {
        mobile: {},
        tablet: { "@media": "screen and (min-width: 768px)" },
        desktop: { "@media": "screen and (min-width: 1024px)" },
    },
    defaultCondition: "mobile",
    properties: {
        // 1. Layout: External -----------------------------------------------
        display: ["none", "flex", "inline-flex", "grid", "inline-grid", "block", "inline", "inline-block"],
        position: ["static", "absolute", "relative", "fixed", "sticky"],
        flexBasis: ["auto", "0", "100%", "content", "max-content", "min-content"],
        flexGrow: [0, 1],
        flexShrink: [0, 1],
        order: [0, 1, -1, 9999],
        float: ["none", "left", "right"],

        // 2. Layout: Internal -----------------------------------------------
        flexDirection: ["row", "column", "row-reverse", "column-reverse"],
        flexWrap: ["nowrap", "wrap", "wrap-reverse"],
        justifyContent: [
            "stretch", "flex-start", "center", "flex-end",
            "space-between", "space-around", "space-evenly"
        ],
        alignItems: ["stretch", "flex-start", "center", "flex-end", "baseline"],
        alignContent: ["stretch", "flex-start", "center", "flex-end", "space-between"],
        gap: vars.space,
        overflow: ["visible", "hidden", "scroll", "auto", "clip"],
        overflowX: ["visible", "hidden", "scroll", "auto", "clip"],
        overflowY: ["visible", "hidden", "scroll", "auto", "clip"],
        scrollSnapType: ["x mandatory", "y mandatory", "x proximity", "y proximity", "both mandatory", "none"],
        scrollSnapAlign: ["start", "end", "center", "none"],

        // 3. Spacing & Rhythm -----------------------------------------------
        paddingTop: vars.space,
        paddingBottom: vars.space,
        paddingLeft: vars.space,
        paddingRight: vars.space,
        scrollPadding: vars.space,
        scrollPaddingTop: vars.space,
        scrollPaddingBottom: vars.space,
        scrollPaddingLeft: vars.space,
        scrollPaddingRight: vars.space,
        marginTop: vars.space, // TODO: Add 'auto' if needed
        marginBottom: vars.space,
        marginLeft: vars.space,
        marginRight: vars.space,

        // 4. Sizing & Box ---------------------------------------------------
        width: ["100%", "100vh", "auto", "min-content", "max-content", "0"],
        minWidth: ["0", "100%", "min-content", "max-content"],
        maxWidth: ["100%", "min-content", "max-content", "65ch"],
        height: ["100%", "100vh", "auto", "0"],
        minHeight: ["0", "100%", "100vh"],
        maxHeight: ["100%", "100vh"],
        aspectRatio: vars.aspect,
        borderRadius: vars.radius,
        boxSizing: ["border-box", "content-box"],

        // 5. Overlay & Stack ------------------------------------------------
        zIndex: {
            ...vars.layer,
            // Compatibility mapping
            0: 0,
            10: 10,
            100: 100,
            1000: 1000,
        },
        opacity: vars.opacity,
        isolation: ["isolate", "auto"],
        inset: ["0"],
        top: ["0"], bottom: ["0"], left: ["0"], right: ["0"],

        // 6. Surface & Theme (Layout-related) -------------------------------
        cursor: ["default", "pointer", "not-allowed", "text", "move", "grab", "grabbing", "col-resize", "row-resize"],
        mixBlendMode: ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"],

        // 7. Typography -----------------------------------------------------
        fontSize: vars.font.size,
        fontWeight: vars.font.weight,
        lineHeight: vars.font.lineHeight,
        letterSpacing: vars.font.letterSpacing,
        textAlign: ["left", "center", "right", "justify"],
        whiteSpace: ["nowrap", "pre", "pre-wrap", "pre-line", "normal"],
        wordBreak: ["break-word", "break-all", "keep-all", "normal"],
        textTransform: ["uppercase", "lowercase", "capitalize", "none"],
    },
    shorthands: {
        padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
        paddingX: ["paddingLeft", "paddingRight"],
        paddingY: ["paddingTop", "paddingBottom"],
        margin: ["marginTop", "marginBottom", "marginLeft", "marginRight"],
        marginX: ["marginLeft", "marginRight"],
        marginY: ["marginTop", "marginBottom"],
        placeItems: ["alignItems", "justifyContent"],
        insetAll: ["top", "right", "bottom", "left"],
        size: ["width", "height"],
    },
});

const colorProperties = defineProperties({
    conditions: {
        light: {},
        dark: { "@media": "(prefers-color-scheme: dark)" },
    },
    defaultCondition: "light",
    properties: {
        color: vars.color.text,
        backgroundColor: vars.color.surface,
        borderColor: vars.color.border,
        boxShadow: vars.elevation,
    },
});

export const atoms = createSprinkles(responsiveProperties, colorProperties);
