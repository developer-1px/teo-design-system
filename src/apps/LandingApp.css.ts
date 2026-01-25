import { style } from "@vanilla-extract/css";
import { vars } from "@/ui/theme.css";
import * as utils from "@/ui/utils.css";

// 1. Root Container
export const root = style(utils.styled.grid({
    layout: {
        ...utils.grid12.root,
        width: "100%",
        minHeight: "100%",
        backgroundColor: vars.color.background,
        overflowY: "auto",
        overflowX: "hidden",
    }
}));

// 2. Navigation (Sticky)
export const nav = style(utils.styled.flex({
    parent: {
        ...utils.grid12.fullWidth,
        position: "sticky",
        top: 0,
        zIndex: 100,
    },
    layout: {
        borderBottom: `1px solid ${vars.color.border}`,
        backgroundColor: "rgba(255, 255, 255, 0.9)", // slightly translucent
        backdropFilter: "blur(8px)",
        height: "64px",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${vars.space.n24}`,
    }
}));

export const navGroup = style(utils.styled.flex({
    layout: {
        gap: vars.space.n16,
        alignItems: "center",
    }
}));

// 3. Hero Section
export const heroSection = style(utils.styled.grid({
    parent: {
        ...utils.grid12.fullWidth,
    },
    layout: {
        paddingTop: vars.space.n64,
        paddingBottom: vars.space.n64,
        rowGap: vars.space.n24,
        // Internal subgrid to place items
        gridTemplateColumns: "subgrid",
        textAlign: "center",
    }
}));

export const heroBadge = style(utils.styled.flex({
    parent: {
        ...utils.grid12.center(12), // Center in full width
        marginBottom: vars.space.n8,
    },
    layout: {
        display: "inline-flex",
        justifySelf: "center",
        alignItems: "center",
        gap: vars.space.n8,
        padding: `${vars.space.n4} ${vars.space.n12}`,
        backgroundColor: vars.color.surface,
        borderRadius: vars.radius.full,
        border: `1px solid ${vars.color.border}`,
        fontSize: "12px",
        color: vars.color.textSecondary,
        cursor: "pointer",
        width: "fit-content",
    }
}));

export const heroTitle = style(utils.styled.box({
    parent: {
        ...utils.grid12.center(8), // Limit width for readability
    },
    layout: {
        fontSize: "56px",
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        color: vars.color.text,
        textAlign: "center",

        "@media": {
            "screen and (max-width: 768px)": {
                fontSize: "40px",
            }
        }
    }
}));

export const heroDesc = style(utils.styled.box({
    parent: {
        ...utils.grid12.center(6),
    },
    layout: {
        fontSize: "20px",
        lineHeight: 1.6,
        color: vars.color.textSecondary,
        textAlign: "center",
    }
}));

export const heroActions = style(utils.styled.flex({
    parent: {
        ...utils.grid12.center(12),
        marginTop: vars.space.n32,
    },
    layout: {
        justifyContent: "center",
        gap: vars.space.n12,
    }
}));

// 4. "Why" Section
export const whySection = style(utils.styled.grid({
    parent: {
        ...utils.grid12.fullWidth, // spans 12
    },
    layout: {
        paddingTop: vars.space.n64,
        paddingBottom: vars.space.n64,
        rowGap: vars.space.n24,
        gridTemplateColumns: "subgrid",
        textAlign: "center",
    }
}));

export const whyTitle = style(utils.styled.box({
    parent: {
        ...utils.grid12.center(12),
    },
    layout: {
        fontSize: "32px",
        fontWeight: 700,
        color: vars.color.text,
    }
}));

export const whyText = style(utils.styled.box({
    parent: {
        ...utils.grid12.center(8),
    },
    layout: {
        fontSize: "20px",
        lineHeight: 1.7,
        color: vars.color.textSecondary,
        textAlign: "center",
    }
}));

// 5. Features Grid
export const featuresSection = style(utils.styled.grid({
    parent: {
        ...utils.grid12.fullWidth,
    },
    layout: {
        paddingTop: vars.space.n64,
        paddingBottom: vars.space.n64,
        rowGap: vars.space.n48,
        gridTemplateColumns: "subgrid",
    }
}));

export const featuresHeader = style(utils.styled.box({
    parent: {
        ...utils.grid12.center(8),
        marginBottom: vars.space.n16,
    },
    layout: {
        textAlign: "center",
    }
}));

export const featuresGrid = style(utils.styled.grid({
    parent: {
        ...utils.grid12.center(10), // Limit to 10 cols
    },
    layout: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: vars.space.n24,

        "@media": {
            "screen and (max-width: 900px)": {
                gridTemplateColumns: "repeat(2, 1fr)",
            },
            "screen and (max-width: 600px)": {
                gridTemplateColumns: "1fr",
            }
        }
    }
}));

export const featureCard = style(utils.styled.flex({
    layout: {
        flexDirection: "column",
        padding: vars.space.n24,
        gap: vars.space.n16,
        borderRadius: vars.radius.n24, // Increased rounding
        backgroundColor: vars.color.surface,
        border: `1px solid ${vars.color.border}`,
        transition: "transform 0.2s, box-shadow 0.2s",

        selectors: {
            "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: vars.shadow.n2,
                borderColor: vars.color.primary,
            }
        }
    }
}));

export const featureIcon = style(utils.styled.flex({
    layout: {
        width: "40px",
        height: "40px",
        borderRadius: vars.radius.n8,
        backgroundColor: vars.color.background,
        border: `1px solid ${vars.color.border}`,
        alignItems: "center",
        justifyContent: "center",
        color: vars.color.primary,
    }
}));

export const featureTitle = style(utils.styled.box({
    layout: {
        fontSize: "18px",
        fontWeight: 600,
        color: vars.color.text,
    }
}));

export const featureDesc = style(utils.styled.box({
    layout: {
        fontSize: "15px",
        lineHeight: 1.5,
        color: vars.color.textSecondary,
    }
}));


// 6. Footer
export const footer = style(utils.styled.flex({
    parent: {
        ...utils.grid12.fullWidth,
        marginTop: "auto",
    },
    layout: {
        borderTop: `1px solid ${vars.color.border}`,
        backgroundColor: vars.color.surface,
        flexDirection: "column",
        alignItems: "center",
        padding: `${vars.space.n48} 0`,
        gap: vars.space.n24,
    }
}));

export const footerLinks = style(utils.styled.flex({
    layout: {
        gap: vars.space.n24,
    }
}));

export const footerLink = style(utils.styled.box({
    layout: {
        color: vars.color.textSecondary,
        fontSize: "14px",
        cursor: "pointer",
        selectors: {
            "&:hover": { color: vars.color.text }
        }
    }
}));
