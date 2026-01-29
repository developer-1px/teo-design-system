import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils';

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
    surface.interactive('base'), // Base interaction
    {
        height: '44px', // Sleeker height
        minWidth: 'fit-content', // Remove forced large width or reduce it
        // OR keep specific min-width but smaller
        // minWidth: '120px', 
        padding: `0 ${vars.spacing[16]} 0 ${vars.spacing[12]}`, // Align icon (left) but give space for text
        // Actually, if we want exact alignment with NavItem (padding 16), valid.
        // But NavItem has Icon then text.
        // Let's do paddingLeft 16px to match NavItem.
        paddingLeft: vars.spacing[16],
        paddingRight: vars.spacing[24],

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // Left align content like NavItems? No, button usually centered or left.
        // If users says "grid alignment", left-aligning the icon with the list icons below is key.

        gap: vars.spacing[12],
        borderRadius: vars.borderRadius.full,
        // Primary Action Look
        backgroundColor: vars.color.primary,
        color: vars.color.white,

        fontSize: vars.fontSize.md,
        fontWeight: vars.weight.medium,

        marginBottom: vars.spacing[16], // Tighter spacing
        transition: 'all 0.2s ease',

        ':hover': {
            opacity: 0.9,
            transform: 'translateY(-1px)',
            boxShadow: vars.shadow.raised,
        },
        ':active': {
            transform: 'translateY(0)',
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
