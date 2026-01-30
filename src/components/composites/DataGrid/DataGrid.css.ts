import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const container = style({
    flex: 1,
    overflow: 'auto',
    width: '100%',
});

export const table = style({
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px', // Dense font size
});

export const thead = style({
    position: 'sticky',
    top: 0,
    backgroundColor: vars.surface.base.bg,
    zIndex: 1,
    boxShadow: `0 1px 0 ${vars.border.subtle}`, // Border only on bottom
});

export const th = style({
    textAlign: 'left',
    padding: `${vars.spacing[8]} ${vars.spacing[16]}`,
    fontSize: '11px',
    fontWeight: '500',
    color: vars.color.gray600,
    textTransform: 'uppercase', // Linear style headers
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
});

export const tr = style({
    borderBottom: `1px solid ${vars.border.subtle}`,
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.1s',
    ':hover': {
        backgroundColor: vars.surface.subtle.bg,
    },
    selectors: {
        '&:last-child': {
            borderBottom: 'none',
        },
        '&[data-selected="true"]': {
            backgroundColor: vars.color.blue50,
        },
        '&[data-focused="true"]': {
            boxShadow: `inset 2px 0 0 ${vars.color.blue500}`,
            backgroundColor: vars.surface.subtle.bg,
        },
        '&[data-selected="true"][data-focused="true"]': {
            backgroundColor: '#e0f2fe',
        }
    }
});


export const td = style({
    padding: `${vars.spacing[8]} ${vars.spacing[16]}`, // Compact padding (8px vertical)
    color: vars.surface.base.text,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});
