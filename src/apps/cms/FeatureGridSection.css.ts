import { style } from "@vanilla-extract/css";
import { vars } from "@/ui/theme.css";
import * as utils from "@/ui/utils.css";

// 1. Section Container
export const container = style(utils.createGrid({
    ...utils.grid12.root,
    ...utils.grid12.subgrid,
    paddingTop: vars.space.n64,
    paddingBottom: vars.space.n64,
}));

// 2. Header (Title + Subtitle)
export const header = style(utils.createFlex({
    ...utils.grid12.center(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: vars.space.n40,
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
    lineHeight: 1.6,
});

// 3. Grid for Cards
// This needs to be a subgrid or a new grid within the master 10/12 cols
// Let's use the centered 10 cols as the container for the grid
export const cardGrid = style(utils.createGrid({
    ...utils.grid12.center(10), // Occupies the center 10 columns of the parent
    display: "grid",
    // We want a 3-column layout. 
    // Since we are spanning 10 global columns, it's hard to divide evenly by 3 if we use subgrid directly 
    // unless the global grid is 12 (divisible by 3).
    // 10 / 3 is not integer.
    // So we should probably define a NEW grid here, OR span 12 and use margins.
    // Let's Span 12 (Full Width) but constrain max-width or use 4 columns of 3 spans.

    // Better Approach: Use Flex Wrap or a new Grid context.
    // Let's use a standard 3-column grid here independent of the master 12-col alignment for items,
    // BUT aligned to the master grid's edges.

    // Changing strategy: Span 12 (full), but use padding/gap to look centered?
    // Or just span 12 and use repeat(3, 1fr) with gap.
    gridColumn: "2 / 12", // Span 10 columns (from line 2 to 12)
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: vars.space.n32,

    "@container": {
        "viewport (max-width: 900px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
        },
        "viewport (max-width: 600px)": {
            gridTemplateColumns: "1fr",
        }
    }
}));

// 4. Feature Card
export const card = style(utils.createFlex({
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n16,
    padding: vars.space.n24,
    borderRadius: vars.radius.n8,
    backgroundColor: vars.color.surface,
    border: `1px solid ${vars.color.border}`,
    transition: "transform 0.2s, box-shadow 0.2s",
    textDecoration: "none",
    color: "inherit",

    selectors: {
        "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: vars.shadow.n2,
            borderColor: vars.color.primary,
        }
    }
}));

export const iconWrapper = style(utils.createFlex({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    borderRadius: vars.radius.n8,
    backgroundColor: vars.color.surface, // sunken?
    color: vars.color.primary,
    marginBottom: vars.space.n8,
    border: `1px solid ${vars.color.border}`,
}));

export const cardTitle = style({
    fontSize: "18px",
    fontWeight: 600,
    color: vars.color.text,
});

export const cardText = style({
    fontSize: "15px",
    lineHeight: 1.6,
    color: vars.color.textSecondary,
});
