import { style } from "@vanilla-extract/css";
import { atoms } from "../../design-system/sprinkles.css";
import { vars } from "../../design-system/theme.css";
import { surface } from "../../design-system/surfaces.css";
import { createNamedGrid } from "../../ui/utils.css";

// 1. Root Layout (Header vs Content)
const rootLayout = createNamedGrid({
    areas: ["header", "main"],
    rows: "max-content 1fr",
    templateAreas: [
        "header",
        "main"
    ]
});

// 2. Main Layout (Slides | Canvas | Properties)
const mainLayout = createNamedGrid({
    areas: ["slides", "canvas", "properties"],
    columns: "240px 1fr 280px",
    templateAreas: [
        "slides canvas properties"
    ]
});

// App Container
export const app = style([
    atoms({
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "page",
        color: "primary",
    }),
    rootLayout.container,
    {
        fontFamily: "var(--font-sans)",
    }
]);

// Header
export const header = style([
    atoms({
        display: "flex", // Inner layout
        alignItems: "center",
        justifyContent: "space-between",
        paddingX: "n16",
    }),
    rootLayout.assign("header"),
    {
        height: "48px",
        borderBottom: `1px solid ${vars.color.border.subtle}`,
    },
    surface({ kind: "base" }),
]);

export const headerLeft = atoms({
    display: "flex",
    alignItems: "center",
    gap: "n12",
});

export const headerRight = atoms({
    display: "flex",
    alignItems: "center",
    gap: "n12",
});

export const titleGroup = atoms({
    display: "flex",
    alignItems: "center",
    gap: "n4",
});

export const title = atoms({
    fontSize: "n14",
    fontWeight: "medium",
});

// Main Layout Container
export const main = style([
    atoms({
        overflow: "hidden",
    }),
    rootLayout.assign("main"), // Placed in root grid
    mainLayout.container,      // Acts as main grid container
    surface({ kind: "sunken" }),
]);

export const slidesPanel = style([
    mainLayout.assign("slides"),
    {
        borderRight: `1px solid ${vars.color.border.subtle}`,
        backgroundColor: "white",
    }
]);

export const propertiesPanel = style([
    mainLayout.assign("properties"),
    {
        borderLeft: `1px solid ${vars.color.border.subtle}`,
        backgroundColor: "white",
    }
]);

// Canvas Area
export const canvasArea = style([
    atoms({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "n32",
    }),
    mainLayout.assign("canvas")
]);

export const canvas = style([
    atoms({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "video",
        width: "100%",
        maxWidth: "65ch", // Arbitrary specific width for demo
        backgroundColor: "page",
        borderRadius: "n12",
        // layout-internal
        padding: "n32",
    }),
    surface({ kind: "raised" }), // Raised surface for the slide itself
]);

export const canvasContent = atoms({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "n16",
    textAlign: "center",
});

export const heroText = atoms({
    fontSize: "n32",
    fontWeight: "bold",
    color: "primary",
});

export const subText = atoms({
    fontSize: "n16",
    color: "secondary",
});

// Slides Panel Internals
export const slidesList = atoms({
    display: "flex",
    flexDirection: "column",
    gap: "n8",
    padding: "n16",
    overflowY: "auto",
});

export const slideItem = style([
    atoms({
        display: "flex",
        flexDirection: "column",
        gap: "n4",
        padding: "n8",
        borderRadius: "n8",
        cursor: "pointer",
        position: "relative",
    }),
    surface({ kind: "base" }), // Or standard list item
    {
        transition: "all 0.2s",
        selectors: {
            "&:hover": { backgroundColor: vars.color.surface.panel },
            "&.active": {
                backgroundColor: vars.color.surface.selected,
                outline: `2px solid ${vars.color.surface.primary}`
            }
        }
    }
]);

export const slidePreview = style({
    aspectRatio: "16/9",
    scale: "1", // Avoid shrink
    backgroundColor: vars.color.surface.page,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.n4,
});

export const slideNum = atoms({
    fontSize: "n12",
    color: "secondary",
    fontWeight: "medium",
});

// Properties Panel Internals
// Properties Layout
export const panelRoot = style({
    display: "grid",
    gridTemplateRows: "max-content 1fr", // Tabs | Content
    height: "100%",
});

export const panelTabs = style({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    borderBottom: `1px solid ${vars.color.border.subtle}`,
});

export const panelScroll = style({
    display: "grid",
    gridTemplateColumns: "n16 1fr n16 1fr", // Label Value Label Value
    gridAutoRows: "max-content",
    gap: vars.space.n8,
    padding: vars.space.n16,
    overflowY: "auto",
});

export const alignmentBar = style({
    gridColumn: "1 / -1",
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: vars.space.n4,
});

export const propertiesGrid = style({
    display: "grid",
    gridTemplateColumns: "subgrid",
    gridColumn: "1 / -1",
    gap: vars.space.n8,
    alignItems: "center",
});

export const sectionBody = style({
    gridColumn: "1 / -1",
    display: "grid",
    gridTemplateColumns: "subgrid",
    rowGap: vars.space.n8,
});

export const propHeader = style([
    atoms({
        display: "flex", // Keep flex for internal alignment of header content? Or subgrid?
        alignItems: "center",
        justifyContent: "space-between",
        // padding: "n16" -> handled by parent or internal
        cursor: "pointer",
        fontSize: "n11",
        fontWeight: "bold",
        color: "secondary",
    }),
    {
        gridColumn: "1 / -1",
        height: vars.space.n32,
        userSelect: "none",
        selectors: {
            "&:hover": { color: vars.color.text.primary }
        }
    }
]);

export const fullRow = style({
    gridColumn: "1 / -1",
    display: "grid",
    gridTemplateColumns: "subgrid",
});

export const spanHalf = style({
    gridColumn: "span 2",
    display: "grid",
    gridTemplateColumns: "subgrid",
});

export const spanFull = style({
    gridColumn: "1 / -1",
});

export const inputWrapper = style([
    atoms({
        display: "flex",
        alignItems: "center",
        paddingX: "n8",
        borderRadius: "n4",
    }),
    surface({ kind: "sunken" }),
    {
        height: vars.space.n28,
        width: "100%",
        selectors: {
            "&:focus-within": {
                boxShadow: `0 0 0 1px ${vars.color.surface.primary}`,
                backgroundColor: vars.color.surface.page,
            }
        }
    }
]);

export const input = style({
    width: "100%",
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: vars.font.size.n12,
    color: vars.color.text.primary,
    fontFamily: "inherit",
});

export const label = style([
    atoms({
        fontSize: "n11",
        color: "secondary",
    }),
    {
        width: vars.space.n16,
    }
]);

export const divider = style({
    gridColumn: "1 / -1",
    height: "1px",
    backgroundColor: vars.color.border.subtle,
    margin: `${vars.space.n8} 0`,
});

// Floating Toolbar
export const floatingToolbar = style([
    atoms({
        display: "flex",
        alignItems: "center",
        padding: "n4",
        gap: "n4",
        position: "absolute",
        borderRadius: "full",
        // bottom atoms only has "0"
    }),
    surface({ kind: "overlay" }), // Floating surface
    {
        bottom: vars.space.n32,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: vars.layer.floating,
    }
]);

export const toolbarSeparator = style({
    width: "1px",
    height: "20px",
    backgroundColor: vars.color.border.default,
    margin: "0 4px",
});

// Components
export const iconBtn = style([
    atoms({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "n4",
        cursor: "pointer",
        // border: "none", // atoms mismatch? Check
    }),
    {
        border: "none",
        background: "transparent",
        transition: "all 0.2s",
        color: vars.color.text.secondary,
        selectors: {
            "&:hover": {
                backgroundColor: vars.color.surface.panel,
                color: vars.color.text.primary,
            },
            "&.active": {
                backgroundColor: vars.color.surface.selected,
                color: vars.color.surface.primary,
            }
        }
    }
]);
