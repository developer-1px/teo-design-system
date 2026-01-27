import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const container = style({
    maxHeight: 'calc(100vh - 48px)',
    overflowY: 'auto',
    paddingLeft: '20px', // Slightly tighter than 24px
    marginLeft: '12px', // Shift slightly right
    borderLeft: `1px solid ${vars.border.subtle}`,
    marginTop: '0.25rem', // Visual alignment with title
});

export const title = style({
    fontSize: '11px', // Smaller, more label-like
    fontWeight: '600',
    textTransform: 'uppercase',
    color: vars.color.gray600,
    marginBottom: '12px',
    letterSpacing: '0.05em',
});

export const list = style({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px', // Tighter vertical rhythm
});

export const item = style({});

export const link = style({
    textDecoration: 'none',
    color: vars.color.gray600,
    display: 'block',
    fontSize: '13px', // Subtitle size
    lineHeight: '1.5',
    transition: 'all 0.15s ease',
    ':hover': {
        color: vars.color.gray800,
        transform: 'translateX(2px)', // Subtle interaction hint
    },
    selectors: {
        '&[data-active="true"]': {
            color: vars.surface.base.text, // Active = Primary Text Color
            fontWeight: '600',
        }
    }
});

globalStyle(`${item}[data-depth="3"]`, {
    paddingLeft: '12px', // Tighter indent for H3
    fontSize: '12.5px', // Slightly smaller for depth
});
