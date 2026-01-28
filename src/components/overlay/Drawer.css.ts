import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '@/styles/vars.css';
import { surface } from '@/styles/utils';

const fadeIn = keyframes({
    '0%': { opacity: 0 },
    '100%': { opacity: 1 }
});

const slideIn = keyframes({
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(0)' }
});

export const backdrop = style({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dimmed background
    zIndex: vars.zIndices.modal, // High z-index
    display: 'flex',
    justifyContent: 'flex-end', // Align drawer to right
    animation: `${fadeIn} 0.2s ease-out`,
});

export const drawer = style([
    surface('card'),
    {
        height: '100%',
        width: '600px',
        maxWidth: '90vw',
        padding: vars.spacing[24],
        display: 'flex',
        flexDirection: 'column',
        gap: vars.spacing[16],
        boxShadow: vars.shadow.overlay,
        animation: `${slideIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1)`, // Apple-like slide
    }
]);

export const header = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vars.spacing[16],
});

export const title = style({
    margin: 0,
    fontSize: vars.fontSize.xl,
    fontWeight: vars.weight.bold,
});

export const closeButton = style({
    background: 'transparent',
    border: 'none',
    fontSize: vars.fontSize.xl,
    cursor: 'pointer',
    color: vars.color.gray600,
    padding: vars.spacing[8],
    borderRadius: '4px',
    lineHeight: 1,
    ':hover': {
        backgroundColor: vars.surface.ghost.hoverBg,
    }
});

export const content = style({
    flex: 1,
    overflowY: 'auto',
    fontSize: vars.fontSize.md,
    lineHeight: vars.lineHeight.standard,
});
