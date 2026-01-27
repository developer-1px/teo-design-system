import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const listPageContainer = style({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: vars.surface.base.bg,
});

export const header = style({
    padding: `${vars.spacing[16]} ${vars.spacing[24]}`,
    borderBottom: `1px solid ${vars.border.subtle}`,
    backgroundColor: vars.surface.base.bg,
});

export const headerTop = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vars.spacing[16],
});

export const title = style({
    fontSize: '20px',
    fontWeight: 600,
    color: vars.color.gray800,
});

export const actions = style({
    display: 'flex',
    gap: vars.spacing[8],
});

export const filterBar = style({
    display: 'flex',
    gap: vars.spacing[12],
    alignItems: 'center',
});

// Reuse existing SmartFilter styles or create variant?
// Let's create specific list styles
export const searchInputWrapper = style({
    position: 'relative',
    maxWidth: '300px',
    flex: 1,
});

export const searchInput = style({
    padding: '8px 12px 8px 32px',
    borderRadius: '6px',
    border: `1px solid ${vars.border.subtle}`,
    width: '100%',
    fontSize: '13px',
    outline: 'none',
    ':focus': {
        borderColor: '#3b82f6',
        boxShadow: `0 0 0 1px #3b82f6`,
    }
});

export const searchIcon = style({
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none',
});

// Selection Bar
export const selectionBar = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[16],
    padding: `${vars.spacing[8]} ${vars.spacing[24]}`,
    backgroundColor: vars.surface.subtle.bg, // Light blue/gray
    borderBottom: `1px solid ${vars.border.subtle}`,
    fontSize: '13px',
    fontWeight: 500,
});

export const clearSelection = style({
    color: '#3b82f6',
    cursor: 'pointer',
    ':hover': {
        textDecoration: 'underline',
    }
});
