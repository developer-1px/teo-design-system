import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils.css';

export const sidebar = style({
    gridColumn: '1',
    gridRow: '2',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: vars.spacing[16], // Increased breathing room
    paddingLeft: vars.spacing[8], // Add slight left padding for floating feel
    paddingRight: vars.spacing[8],
});

export const composeBtn = style([
    surface('card'), // Use card surface for a clean, elevated look instead of highlight
    {
        height: '56px',
        minWidth: '56px',
        width: 'fit-content',
        padding: `0 ${vars.spacing[24]} 0 ${vars.spacing[16]}`,
        display: 'flex',
        alignItems: 'center',
        gap: vars.spacing[12],
        borderRadius: '16px', // Rounded sqaure/rect
        cursor: 'pointer',
        fontSize: vars.fontSize.md,
        fontWeight: vars.weight.medium,
        color: vars.color.gray800,
        transition: 'all 0.2s ease',
        boxShadow: vars.shadow.raised,
        marginBottom: vars.spacing[24],
        ':hover': {
            boxShadow: vars.shadow.overlay,
            transform: 'translateY(-1px)',
        },
        ':active': {
            transform: 'translateY(0)',
            boxShadow: vars.shadow.raised,
        }
    }
]);

export const navGroup = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '2px', // Tight gap for items
});

export const navItemParent = style({
    display: 'flex',
    alignItems: 'center',
    height: '32px',
    padding: `0 ${vars.spacing[16]} 0 ${vars.spacing[16]}`,
    borderRadius: vars.borderRadius.full, // Pill shape
    cursor: 'pointer',
    color: vars.color.gray600,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.weight.medium,
    textDecoration: 'none',
    gap: vars.spacing[12],
    transition: 'background-color 0.1s ease, color 0.1s ease',
    ':hover': {
        backgroundColor: vars.color.gray100,
        color: vars.color.gray800,
    }
});

export const itemState = styleVariants({
    active: {
        backgroundColor: vars.surface.highlight.bg,
        color: vars.surface.highlight.text,
        fontWeight: vars.weight.bold,
        ':hover': {
            backgroundColor: vars.surface.highlight.hoverBg
        }
    },
    inactive: {}
});
