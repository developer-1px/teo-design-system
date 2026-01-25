import { style } from "@vanilla-extract/css";
import { vars } from "@/ui/theme.css";
import * as utils from "@/ui/utils.css";

// 1. Container
export const container = style(utils.createGrid({
    ...utils.grid12.root,
    ...utils.grid12.subgrid,
    paddingTop: vars.space.n64,
    paddingBottom: vars.space.n64,
    borderTop: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.background,
}));

// 2. Footer Grid (Centered 10 cols)
export const footerGrid = style(utils.createGrid({
    ...utils.grid12.center(10), // Main content in center 10 cols
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr", // Logo/Desc taking 2fr, links 1fr each
    gap: vars.space.n40,

    "@container": {
        "viewport (max-width: 900px)": {
            gridTemplateColumns: "repeat(2, 1fr)", // 2x2 grid
        },
        "viewport (max-width: 600px)": {
            gridTemplateColumns: "1fr", // Stack
            textAlign: "center",
        }
    }
}));

// 3. Brand Column
export const brandCol = style(utils.createFlex({
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n16,

    "@container": {
        "viewport (max-width: 600px)": {
            alignItems: "center",
        }
    }
}));

export const logo = style({
    fontSize: "20px",
    fontWeight: 700,
    color: vars.color.text,
    display: "flex",
    alignItems: "center",
    gap: vars.space.n8,
});

export const copyright = style({
    fontSize: "14px",
    color: vars.color.textSecondary,
    marginTop: vars.space.n24,
});

// 4. Link Columns
export const linkCol = style(utils.createFlex({
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n16,
}));

export const colTitle = style({
    fontSize: "14px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: vars.color.textSecondary,
    marginBottom: vars.space.n8,
});

export const link = style({
    fontSize: "15px",
    color: vars.color.text,
    textDecoration: "none",
    selectors: {
        "&:hover": {
            color: vars.color.primary,
        }
    }
});
