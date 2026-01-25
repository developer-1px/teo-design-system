import { style } from "@vanilla-extract/css";
import { vars } from "@/ui/theme.css";
import * as utils from "@/ui/utils.css";

// 1. Header Container
// Sticky, spans full width (subgrid), but acts as a container for its children (logo, nav)
export const siteHeader = style(utils.styled.grid({
    parent: {
        ...utils.grid12.subgrid, // If strictly using grid
        // OR better yet, if we want it to span full width and be a flex container internally for simple left/right split?
        // But user asked for Grid usage verification.
        // Let's stick to subgrid as the parent positioning context, but we can't easily do `display: flex` AND `display: subgrid`.
        // Grid items can be flex containers.
        // Subgrid MUST be display: grid (or inline-grid).
        // So internal layout MUST be grid columns.

        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${vars.color.border}`,
    },
    // Since parent uses subgrid, we don't declare layout: `display: flex` here. 
    // We declare the subgrid tracks if we want to align children to the master grid.
    layout: {
        gridTemplateColumns: "subgrid",
        alignItems: "center",
        height: "64px",
    }
}));

// 2. Brand Section (Left side)
export const brandSection = style(utils.styled.flex({
    parent: {
        // e.g., Cols 2-4
        gridColumn: "2 / span 3",
        // Or specific start?
        // Let's say it starts at 2 (since 1 is margin)
    },
    layout: {
        alignItems: "center",
        gap: vars.space.n12,
        height: "100%",
    }
}));

export const logoWrapper = style(utils.styled.flex({
    layout: {
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        backgroundColor: vars.color.primary,
        alignItems: "center",
        justifyContent: "center",
        color: vars.color.background,
        fontSize: "18px",
        fontWeight: 700,
    }
}));

export const brandName = style(utils.styled.box({
    layout: {
        fontSize: "16px",
        fontWeight: 700,
        color: vars.color.text,
        letterSpacing: "-0.01em",
    }
}));


// 3. Navigation Section (Right side)
export const navSection = style(utils.styled.flex({
    parent: {
        gridColumn: "5 / 12", // Spans from 5 to 12 (right side)
        justifySelf: "end", // Push to right
    },
    layout: {
        alignItems: "center",
        gap: vars.space.n24,
        height: "100%",
    }
}));

export const navLinks = style(utils.styled.flex({
    layout: {
        display: "flex", // Redundant but safe with strict type? No, createFlex enforces it.
        gap: vars.space.n8, // Tabs style

        "@media": {
            "screen and (max-width: 768px)": {
                display: "none",
            }
        }
    }
}));

export const navLink = style(utils.styled.box({
    layout: {
        fontSize: "14px",
        fontWeight: 500,
        color: vars.color.textSecondary,
        padding: "8px 12px",
        borderRadius: vars.radius.n6,
        cursor: "pointer",
        transition: "all 0.2s",
        backgroundColor: "transparent",
        border: "none",

        selectors: {
            "&:hover": {
                color: vars.color.text,
                backgroundColor: vars.color.surface,
            }
        }
    }
}));

export const divider = style({
    width: "1px",
    height: "24px",
    backgroundColor: vars.color.border,
});

export const actionSection = style(utils.styled.flex({
    layout: {
        gap: vars.space.n12,
        alignItems: "center",
    }
}));

export const loginBtn = style(utils.styled.box({
    layout: {
        fontSize: "14px",
        fontWeight: 600,
        color: vars.color.text,
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "8px 16px",
        borderRadius: vars.radius.full,

        selectors: {
            "&:hover": {
                backgroundColor: vars.color.surface,
            }
        }
    }
}));

export const ctaBtn = style(utils.styled.box({
    layout: {
        fontSize: "14px",
        fontWeight: 600,
        color: vars.color.background,
        backgroundColor: vars.color.primary,
        border: "none",
        cursor: "pointer",
        padding: "8px 20px",
        borderRadius: vars.radius.full,
        transition: "transform 0.1s",

        selectors: {
            "&:hover": {
                opacity: 0.9,
                transform: "translateY(-1px)",
            },
            "&:active": {
                transform: "translateY(0)",
            }
        }
    }
}));
