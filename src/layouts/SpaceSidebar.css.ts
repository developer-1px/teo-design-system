import { style } from '@vanilla-extract/css';
import { vars } from '../styles/vars.css';

export const sidebar = style({
    width: '40px', // Even more compact rail
    backgroundColor: vars.surface.subtle.bg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: vars.spacing[12],
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    flexShrink: 0
});

export const item = style({
    width: '28px',
    height: '28px',
    borderRadius: vars.borderRadius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.color.mutedForeground,
    marginBottom: vars.spacing[8],
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    ':hover': {
        color: vars.color.primary,
        backgroundColor: vars.color.accent,
    }
});

export const activeItem = style({
    color: vars.color.primary,
    backgroundColor: vars.color.accent,
});

export const icon = style({
    width: '14px',
    height: '14px',
});
