import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/ui/theme.css";
import * as utils from "@/ui/utils.css";

// 1. Container
export const container = style(utils.createGrid({
    ...utils.grid12.root,
    ...utils.grid12.subgrid,
    paddingTop: vars.space.n64,
    paddingBottom: vars.space.n64,
    backgroundColor: vars.color.surface, // Often distinct background
}));

// 2. Header
export const header = style(utils.createFlex({
    ...utils.grid12.center(8), // Center 8 columns
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: vars.space.n48,
    gap: vars.space.n16,
}));

export const title = style({
    fontSize: "40px",
    fontWeight: 800,
    color: vars.color.text,
    letterSpacing: "-0.03em",
});

export const subtitle = style({
    fontSize: "18px",
    color: vars.color.textSecondary,
});

// 3. Pricing Grid (3 Columns)
export const pricingGrid = style(utils.createGrid({
    ...utils.grid12.center(10),
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: vars.space.n24,
    alignItems: "start", // Align top

    "@container": {
        "viewport (max-width: 900px)": {
            gridTemplateColumns: "1fr", // Stack on smaller screens
            gap: vars.space.n32,
        }
    }
}));

// 4. Pricing Card
export const card = recipe({
    base: style(utils.createFlex({
        display: "flex",
        flexDirection: "column",
        padding: vars.space.n32,
        borderRadius: vars.radius.n8,
        backgroundColor: vars.color.background,
        border: `1px solid ${vars.color.border}`,
        transition: "transform 0.2s",
        gap: vars.space.n24,
        position: "relative",
    })),
    variants: {
        featured: {
            true: {
                borderColor: vars.color.primary,
                boxShadow: vars.shadow.n3,
                transform: "scale(1.02)", // Slightly larger
                zIndex: 1,
            },
            false: {
                selectors: {
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: vars.shadow.n2,
                    }
                }
            }
        }
    }
});

export const planName = style({
    fontSize: "18px",
    fontWeight: 700,
    color: vars.color.text,
});

export const price = style({
    fontSize: "48px",
    fontWeight: 800,
    color: vars.color.text,
    letterSpacing: "-0.03em",
});

export const period = style({
    fontSize: "16px",
    fontWeight: 500,
    color: vars.color.textSecondary,
});

export const features = style(utils.createFlex({
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n16,
    marginBottom: vars.space.n24,
}));

export const featureItem = style(utils.createFlex({
    display: "flex",
    alignItems: "center",
    gap: vars.space.n12,
    fontSize: "15px",
    color: vars.color.textSecondary,
}));

// 5. Button
export const button = recipe({
    base: utils.createFlex({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "48px",
        borderRadius: vars.radius.full,
        fontWeight: 600,
        fontSize: "16px",
        cursor: "pointer",
        width: "100%",
        border: "none",
        transition: "all 0.2s",
    }),
    variants: {
        variant: {
            primary: {
                backgroundColor: vars.color.primary,
                color: vars.color.background,
                selectors: {
                    "&:hover": { opacity: 0.9 }
                }
            },
            outline: {
                backgroundColor: "transparent",
                border: `1px solid ${vars.color.border}`,
                color: vars.color.text,
                selectors: {
                    "&:hover": { borderColor: vars.color.text }
                }
            }
        }
    }
});

export const badge = style({
    position: "absolute",
    top: -12,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "4px 12px",
    backgroundColor: vars.color.primary,
    color: vars.color.background,
    fontSize: "12px",
    fontWeight: 700,
    borderRadius: vars.radius.full,
    textTransform: "uppercase",
});
