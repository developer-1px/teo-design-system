import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const grid = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: vars.spacing[24],
    marginTop: vars.spacing[24],
});

const cardBase = style({
    padding: vars.spacing[24],
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[8],
    minHeight: '120px',
    transition: 'all 0.2s ease',
});

export const label = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.weight.bold,
    marginBottom: vars.spacing[4],
});

export const desc = style({
    fontSize: vars.fontSize.xs,
    opacity: 0.8,
});

// Implement using the actual contract vars
export const baseCard = style([cardBase, {
    backgroundColor: vars.surface.base.bg,
    color: vars.surface.base.text,
    border: '1px dashed #ccc', // Artificial border just to see it on white bg
}]);

export const subtleCard = style([cardBase, {
    backgroundColor: vars.surface.subtle.bg,
    color: vars.surface.subtle.text,
}]);

export const cardSurface = style([cardBase, {
    backgroundColor: vars.surface.card.bg,
    border: vars.surface.card.border,
    boxShadow: vars.surface.card.shadow,
    color: vars.surface.card.text,
}]);

export const highlightCard = style([cardBase, {
    backgroundColor: vars.surface.highlight.bg,
    color: vars.surface.highlight.text,
}]);

export const inputCard = style([cardBase, {
    backgroundColor: vars.surface.input.bg,
    border: vars.surface.input.border,
    color: vars.surface.input.text,
}]);

export const ghostCard = style([cardBase, {
    backgroundColor: vars.surface.ghost.bg,
    color: vars.surface.ghost.text,
    border: '1px dashed #ccc',
    ':hover': {
        backgroundColor: vars.surface.ghost.hoverBg,
    }
}]);
