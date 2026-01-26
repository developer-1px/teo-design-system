import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/ui/theme.css";
// import { surface } from "@/design-system/surfaces.css"; // Surface requires recipe pattern, not mixin spread

// 1. App Shell (Root)
// Grid: Sidebar (Auto) | Main (1fr) | RightPanel (Auto)
export const app = style({
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gridTemplateRows: "100%",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: vars.color.surface.page,
    color: vars.color.text.primary,
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
});

// 2. Main Content Area
// Grid: Viewport Frame Area
export const main = style({
    display: "grid",
    gridTemplateRows: "1fr",
    placeItems: "center", // Center the viewport frame
    backgroundColor: vars.color.surface, // Sunken?
    backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
    position: "relative",
    overflow: "hidden",
});

// 3. Scrollable Canvas
export const canvasScroll = style({
    width: "100%",
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    display: "grid",
    gridTemplateRows: "min-content",
    justifyItems: "center",
    paddingBottom: "96px",
});

// 4. Viewport Frame
export const viewportFrame = recipe({
    base: {
        backgroundColor: vars.color.surface.sunken, // Subtle gray
        color: vars.color.text.primary,
        boxShadow: vars.shadow.n3, // Keeping shadow to distinguish from background
        transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        minHeight: "100vh",
        position: "relative",
        border: "none", // Requested: no border
        // Master Grid & Container Query Root
        display: "grid",
        gridTemplateColumns: `repeat(12, minmax(0, 1fr))`, // Explicitly matching utils
        gap: vars.space.n20,
        containerType: "inline-size",
        containerName: "viewport",
        maxWidth: "100%",
        boxSizing: "border-box",
    },
    variants: {
        mode: {
            mobile: {
                width: "375px",
                borderRadius: vars.radius.n24,
                marginTop: "24px",
                marginBottom: "24px",
            },
            tablet: {
                width: "768px",
                borderRadius: vars.radius.n24,
                marginTop: "24px",
                marginBottom: "24px",
            },
            desktop: {
                width: "100%",
                borderRadius: vars.radius.n0, // Desktop full width usually 0
                margin: "0",
                border: "none",
            }
        }
    },
    defaultVariants: {
        mode: "desktop"
    }
});

// 5. Overlays (Toolbar & Selector)
export const viewportSelector = style({
    position: "fixed", // Changed from absolute to fixed
    top: vars.space.n24,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,

    display: "flex",
    alignItems: "center",
    gap: vars.space.n8,
    padding: vars.space.n8,
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.surface,
    boxShadow: vars.shadow.n3,
    border: `1px solid ${vars.color.border}`,
});

export const bottomToolbar = style({
    position: "fixed", // Changed from absolute to fixed
    bottom: vars.space.n24,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,

    display: "flex",
    alignItems: "center",
    gap: vars.space.n8,
    padding: vars.space.n8,
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.surface,
    boxShadow: vars.shadow.n3,
    border: `1px solid ${vars.color.border}`,
});

// 6. Icon Buttons
export const iconBtn = recipe({
    base: {
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: vars.color.text.secondary, // Secondary?
        opacity: 0.7,
        transition: "all 0.2s",
        selectors: {
            "&:hover": {
                opacity: 1,
                backgroundColor: "rgba(0,0,0,0.05)"
            }
        }
    },
    variants: {
        active: {
            true: {
                backgroundColor: vars.color.primary,
                color: vars.color.background, // Inverse
                opacity: 1,
                selectors: {
                    "&:hover": {
                        backgroundColor: vars.color.primary, // Keep primary on hover
                    }
                }
            }
        }
    },
    defaultVariants: {
        active: false
    }
});

export const dividerV = style({
    width: "1px",
    height: "16px",
    backgroundColor: vars.color.border,
});
