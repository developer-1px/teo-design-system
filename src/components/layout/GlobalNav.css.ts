import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils';

export const navContainer = style([
    surface('base'), // Back to white/base surface
    {
        width: '48px', // Ultra compact
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: vars.spacing[8], // Reduced padding
        gap: vars.spacing[4], // Tighter gap
        borderRight: `1px solid ${vars.border.subtle}`,
        zIndex: vars.zIndices.floating,
    }
]);

export const navItem = style([
    surface('ghost'),
    {
        width: '36px', // Reduced from 40px
        height: '36px', // Square alignment
        borderRadius: '6px', // Tighter radius
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        textDecoration: 'none',
        flexDirection: 'column',
        // Removed gap/font size since we hide labels usually in compact mode
    }
]);

export const activeNavItem = style([
    surface('highlight'),
    {
        color: vars.color.gray800,
        backgroundColor: vars.color.gray200, // Slightly stronger active state
    }
]);

export const bottomSpacer = style({
    marginTop: 'auto',
    marginBottom: vars.spacing[16],
});
