import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const filterBar = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
    padding: `${vars.spacing[4]} ${vars.spacing[12]}`, // Dense padding
    borderRadius: '6px',
    backgroundColor: vars.surface.subtle.bg, // Gray background for input area
    border: `1px solid transparent`,
    transition: 'all 0.1s ease',
    width: '100%',
    maxWidth: '600px',
    ':focus-within': {
        backgroundColor: vars.surface.base.bg, // White on focus
        border: `1px solid ${vars.color.gray300}`, // Subtle focus border
        boxShadow: vars.shadow.raised,
    }
});

export const icon = style({
    color: vars.color.gray600,
    width: '14px',
    height: '14px',
});

export const input = style({
    border: 'none',
    background: 'transparent',
    fontSize: '13px',
    color: vars.surface.base.text,
    flex: 1,
    outline: 'none',
    '::placeholder': {
        color: vars.color.gray600,
    }
});

export const tag = style({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: vars.color.gray200, // Tag background
    fontSize: '11px',
    fontWeight: '500',
    color: vars.color.gray800,
    whiteSpace: 'nowrap',
    userSelect: 'none',
});

export const tagClose = style({
    cursor: 'pointer',
    opacity: 0.6,
    ':hover': {
        opacity: 1,
    }
});
