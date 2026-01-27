import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const container = style({
    display: 'flex',
    flexWrap: 'wrap',
    gap: vars.spacing[32],
    marginTop: vars.spacing[24],
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: vars.spacing[24],
    // Optional: Grid background pattern for "Cool" vibe
    backgroundImage: `radial-gradient(${vars.color.gray200} 1px, transparent 1px)`,
    backgroundSize: '20px 20px',
    borderRadius: vars.borderRadius.lg,
    border: `1px solid ${vars.border.subtle}`,
});

export const itemWrapper = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: vars.spacing[12],
});

export const demoBox = style({
    width: '100px',
    height: '100px', // Square
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: vars.shadow.raised,
    transition: 'transform 0.2s',
    ':hover': {
        transform: 'scale(1.05)',
        boxShadow: vars.shadow.popover,
    }
});

// Variants for different surface visuals
export const surfaceVariant = styleVariants({
    base: {
        backgroundColor: vars.surface.base.bg,
        border: `1px solid ${vars.color.gray200}`,
        color: vars.color.gray800,
    },
    subtle: {
        backgroundColor: vars.surface.subtle.bg,
        border: `1px solid ${vars.color.gray200}`,
        color: vars.color.gray800,
    },
    card: {
        backgroundColor: vars.surface.card.bg,
        border: vars.surface.card.border,
        color: vars.color.gray800,
    },
    highlight: {
        backgroundColor: vars.surface.highlight.bg,
        color: vars.surface.highlight.text,
        border: 'none'
    },
    input: {
        backgroundColor: vars.surface.input.bg,
        border: vars.surface.input.border,
        color: vars.color.gray800,
    },
    primary: { // Custom "Cool" accent
        backgroundColor: vars.color.gray800,
        color: vars.color.white,
        border: 'none',
    }
});

export const label = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.weight.bold,
    color: vars.color.gray800,
    fontFamily: vars.font.code,
    marginTop: vars.spacing[8],
});

export const subLabel = style({
    fontSize: vars.fontSize.xs,
    color: vars.color.gray600,
});
