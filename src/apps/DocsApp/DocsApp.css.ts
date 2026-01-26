
import { style } from "@vanilla-extract/css";
import { vars } from "@/design-system/theme.css";

export const container = style({
    padding: vars.space.n32,
});

export const title = style({
    fontSize: vars.font.size.n32,
    marginBottom: vars.space.n24,
});

export const grid = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: vars.space.n16,
});

export const cardLink = style({
    padding: vars.space.n24,
    backgroundColor: vars.color.surface.card,
    borderRadius: vars.radius.n12,
    boxShadow: vars.elevation.n1,
    textDecoration: 'none',
    color: vars.color.text.primary,
    border: `1px solid ${vars.color.border.subtle}`,
    display: 'block',
    transition: 'all 0.2s',
    ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: vars.elevation.n2,
    }
});

export const cardTitle = style({
    fontSize: vars.font.size.n20,
    marginBottom: vars.space.n8,
    fontWeight: vars.font.weight.bold,
});

export const cardDesc = style({
    color: vars.color.text.secondary,
});
