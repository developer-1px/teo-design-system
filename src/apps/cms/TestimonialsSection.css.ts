import { style } from "@vanilla-extract/css";
import { vars } from "@/ui/theme.css";
import * as utils from "@/ui/utils.css";

// 1. Container
export const container = style(utils.createGrid({
    ...utils.grid12.root,
    ...utils.grid12.subgrid,
    paddingTop: vars.space.n64,
    paddingBottom: vars.space.n64,
    backgroundColor: vars.color.background, // or subtle pattern
}));

// 2. Header
export const header = style(utils.createFlex({
    ...utils.grid12.center(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: vars.space.n48,
    gap: vars.space.n16,
}));

export const title = style({
    fontSize: "32px",
    fontWeight: 700,
    color: vars.color.text,
});

export const subtitle = style({
    fontSize: "18px",
    color: vars.color.textSecondary,
    maxWidth: "600px",
});

// 3. Grid for Testimonials (3 Columns)
export const grid = style(utils.createGrid({
    ...utils.grid12.center(10), // Span 10 columns
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: vars.space.n24,

    "@container": {
        "viewport (max-width: 900px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
        },
        "viewport (max-width: 600px)": {
            gridTemplateColumns: "1fr",
        }
    }
}));

// 4. Testimonial Card
export const card = style(utils.createFlex({
    display: "flex",
    flexDirection: "column",
    padding: vars.space.n24,
    borderRadius: vars.radius.n8,
    backgroundColor: vars.color.surface,
    border: `1px solid ${vars.color.border}`,
    gap: vars.space.n16,
    height: "100%",

    // Aesthetic touch: nice shadow
    boxShadow: vars.shadow.n1,
}));

export const cardText = style({
    fontSize: "16px",
    lineHeight: 1.6,
    color: vars.color.text,
    flex: 1, // Pushes author to bottom
    fontStyle: "italic",
});

export const authorRow = style(utils.createFlex({
    display: "flex",
    alignItems: "center",
    gap: vars.space.n12,
    marginTop: vars.space.n8,
}));

export const avatar = style({
    width: "40px",
    height: "40px",
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.surface, // placeholder
    border: `1px solid ${vars.color.border}`,
});

export const authorInfo = style(utils.createFlex({
    display: "flex",
    flexDirection: "column",
}));

export const authorName = style({
    fontSize: "14px",
    fontWeight: 700,
    color: vars.color.text,
});

export const authorRole = style({
    fontSize: "13px",
    color: vars.color.textSecondary,
});
