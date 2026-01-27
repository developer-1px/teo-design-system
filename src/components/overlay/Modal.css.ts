import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils';

const fadeIn = keyframes({
    '0%': { opacity: 0 },
    '100%': { opacity: 1 }
});

const scaleIn = keyframes({
    '0%': { opacity: 0, transform: 'scale(0.95)' },
    '100%': { opacity: 1, transform: 'scale(1)' }
});

export const backdrop = style({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly darker for modal
    zIndex: vars.zIndices.modal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: `${fadeIn} 0.2s ease-out`,
});

export const modal = style([
    surface('card'), // Standard card surface
    {
        width: '500px',
        maxWidth: '90vw',
        padding: vars.spacing[24],
        borderRadius: '12px',
        boxShadow: vars.shadow.overlay,
        display: 'flex',
        flexDirection: 'column',
        gap: vars.spacing[16],
        animation: `${scaleIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1)`,
        position: 'relative', // For close button absolute pos if needed
    }
]);

export const header = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vars.spacing[8],
});

export const title = style({
    margin: 0,
    fontSize: vars.fontSize.lg,
    fontWeight: vars.weight.bold,
    color: vars.color.gray800,
});

export const closeButton = style({
    background: 'transparent',
    border: 'none',
    color: vars.color.gray600,
    cursor: 'pointer',
    padding: vars.spacing[4],
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
        backgroundColor: vars.surface.ghost.hoverBg,
        color: vars.color.gray800,
    }
});

export const footer = style({
    marginTop: vars.spacing[16],
    display: 'flex',
    justifyContent: 'flex-end',
    gap: vars.spacing[8],
});
