import { style } from "@vanilla-extract/css";
import { vars } from "@/ui/theme.css";
import * as utils from "@/ui/utils.css";

// 1. Container
export const container = style(utils.createGrid({
    ...utils.grid12.root,
    ...utils.grid12.subgrid,
    paddingTop: vars.space.n64,
    paddingBottom: vars.space.n64,
}));

// 2. Main Content Wrapper (Centered 8 cols for readability)
export const contentWrapper = style(utils.createFlex({
    ...utils.grid12.center(8),
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n24,

    "@container": {
        "viewport (max-width: 768px)": {
            ...utils.grid12.center(10),
        },
        "viewport (max-width: 480px)": {
            ...utils.grid12.fullWidth, // Full width on mobile
            padding: `0 ${vars.space.n16}`,
        }
    }
}));

// 3. Typography
export const heading = style({
    fontSize: "36px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
    color: vars.color.text,
});

export const subheading = style({
    fontSize: "24px",
    fontWeight: 600,
    color: vars.color.text,
    marginTop: vars.space.n16,
});

export const paragraph = style({
    fontSize: "18px",
    lineHeight: 1.7,
    color: vars.color.textSecondary,
    marginBottom: vars.space.n16,
});

export const divider = style({
    width: "100%",
    height: "1px",
    backgroundColor: vars.color.border,
    margin: `${vars.space.n32} 0`,
});

// 4. Quote
export const quote = style(utils.createFlex({
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n16,
    padding: vars.space.n32,
    backgroundColor: vars.color.surface,
    borderLeft: `4px solid ${vars.color.primary}`,
    borderRadius: "0 8px 8px 0",
    margin: `${vars.space.n16} 0`,
}));

export const quoteText = style({
    fontSize: "20px",
    fontStyle: "italic",
    fontWeight: 500,
    color: vars.color.text,
});

export const quoteAuthor = style({
    fontSize: "14px",
    fontWeight: 700,
    color: vars.color.textSecondary,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
});
