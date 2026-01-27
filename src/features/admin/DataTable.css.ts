import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const tableContainer = style({
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
    transition: 'background-color 0.05s',
    ':hover': {
        backgroundColor: vars.surface.subtle.bg,
    },
    selectors: {
        '&:last-child': {
            borderBottom: 'none',
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

// Linear Utility Styles
export const idCell = style({
    fontFamily: vars.font.code,
    color: vars.color.gray600,
    fontSize: '12px',
});

export const statusBadge = style({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '500',
});

export const statusDot = style({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
});
