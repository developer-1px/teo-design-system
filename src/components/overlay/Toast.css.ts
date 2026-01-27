
import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils.css';

const slideIn = keyframes({
    '0%': { transform: 'translateY(100%)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
});

export const toastContainer = style({
    position: 'fixed',
    bottom: vars.spacing[24],
    right: vars.spacing[24],
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[8],
    zIndex: vars.zIndices.toast,
    pointerEvents: 'none', // Allow clicks to pass through container areas
});

export const toast = style([
    surface('card'), // Use surface card for consistent look
    {
        minWidth: '300px',
        padding: `${vars.spacing[12]} ${vars.spacing[16]}`,
        borderRadius: '8px',
        boxShadow: vars.shadow.popover, // Higher elevation
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'auto', // Re-enable pointer events for the toast itself
        animation: `${slideIn} 0.3s ease-out`,
        fontSize: vars.fontSize.md,
        gap: vars.spacing[12],
    }
]);

export const message = style({
    margin: 0,
    flex: 1,
});

export const closeButton = style({
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: vars.color.gray600,
    padding: vars.spacing[4],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
        color: vars.color.gray800,
    }
});
