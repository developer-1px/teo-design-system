import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const root = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
    width: '100%',
});

export const filterBar = style({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: `${vars.spacing[4]} ${vars.spacing[12]}`,
    minHeight: '40px',
    borderRadius: '8px',
    backgroundColor: vars.surface.subtle.bg,
    border: `1px solid transparent`,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'text',
    ':hover': {
        backgroundColor: vars.color.gray100,
    },
    ':focus-within': {
        backgroundColor: vars.surface.base.bg,
        border: `1px solid ${vars.border.subtle}`,
        boxShadow: vars.shadow.raised,
    }
});

export const searchSection = style({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    gap: vars.spacing[8],
    flexWrap: 'wrap',
    padding: `${vars.spacing[4]} 0`,
});

export const icon = style({
    color: vars.color.gray600,
    flexShrink: 0,
});

export const input = style({
    border: 'none',
    background: 'transparent',
    fontSize: '13px',
    color: vars.surface.base.text,
    flex: 1,
    minWidth: '80px',
    outline: 'none',
    '::placeholder': {
        color: vars.color.gray500,
    }
});

export const tag = style({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '6px',
    backgroundColor: vars.color.gray200,
    fontSize: '12px',
    fontWeight: '500',
    color: vars.color.gray800,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    border: `1px solid ${vars.color.gray300}`,
    transition: 'transform 0.1s ease',
    ':hover': {
        transform: 'translateY(-1px)',
        backgroundColor: vars.color.gray300,
    }
});

export const tagLabel = style({
    color: vars.color.gray600,
    fontWeight: '600',
    marginRight: '2px',
});

export const tagValue = style({
    color: vars.color.gray900,
});

export const tagClose = style({
    cursor: 'pointer',
    opacity: 0.6,
    marginLeft: '2px',
    borderRadius: '4px',
    transition: 'all 0.1s ease',
    ':hover': {
        opacity: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
    }
});

export const filterButton = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    color: vars.color.gray600,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: `1px solid transparent`,
    transition: 'all 0.1s ease',
    flexShrink: 0,
    ':hover': {
        backgroundColor: vars.color.gray200,
        color: vars.color.gray800,
    },
    selectors: {
        '&[data-active="true"]': {
            backgroundColor: vars.color.gray200,
            border: `1px solid ${vars.border.subtle}`,
            color: vars.color.gray900,
        }
    }
});
