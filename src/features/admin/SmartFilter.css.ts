import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface, ui } from '../../styles/utils';



export const rootContainer = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
    width: '100%',
    maxWidth: '600px',
});

// Search Bar (Now pure search)
export const filterBar = style({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: `${vars.spacing[4]} ${vars.spacing[12]}`,
    borderRadius: '6px',
    backgroundColor: vars.surface.subtle.bg,
    border: `1px solid transparent`,
    transition: 'all 0.1s ease',
    ':focus-within': {
        backgroundColor: vars.surface.base.bg,
        border: `1px solid ${vars.color.gray300}`,
        boxShadow: vars.shadow.raised,
    }
});

export const searchSection = style({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    gap: vars.spacing[8],
});

// External Filter Button
export const standaloneFilterButton = style({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    color: vars.color.gray600,
    cursor: 'pointer',
    backgroundColor: vars.surface.subtle.bg,
    border: `1px solid transparent`,
    transition: 'all 0.1s ease',
    flexShrink: 0,
    ':hover': {
        backgroundColor: vars.color.gray200,
        color: vars.color.gray800,
    },
    selectors: {
        '&[data-active="true"]': {
            backgroundColor: vars.surface.base.bg,
            border: `1px solid ${vars.color.gray300}`,
            boxShadow: vars.shadow.raised,
            color: vars.color.gray800,
        }
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

export const dropdownPosition = style({
    position: 'absolute',
    top: 'calc(100% + 4px)',
    right: 0,
    width: '240px',
    zIndex: vars.zIndices.popover,
});

// Old Dropdown Styles (Deprecated but kept for reference if needed, can delete)
export const dropdown = style([
    surface('card'),
    {
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        width: '100%',
        maxHeight: '300px',
        overflowY: 'auto',
        borderRadius: '8px',
        border: `1px solid ${vars.border.subtle}`,
        boxShadow: vars.shadow.popover,
        zIndex: vars.zIndices.popover,
        padding: vars.spacing[8],
        display: 'flex',
        flexDirection: 'column',
        gap: vars.spacing[8],
    }
]);

export const sectionTitle = style([
    ui.overline(),
    {
        padding: `0 ${vars.spacing[8]}`,
        color: vars.color.gray600,
        marginTop: vars.spacing[8],
        marginBottom: vars.spacing[4],
        selectors: {
            '&:first-child': { marginTop: 0 }
        }
    }
]);

export const item = style([
    ui.menu(),
    {
        padding: `${vars.spacing[8]} ${vars.spacing[8]}`,
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: vars.color.gray800,
        ':hover': {
            backgroundColor: vars.color.gray100,
        },
    }
]);

export const itemSelected = style({
    backgroundColor: vars.surface.highlight.bg,
    color: vars.surface.highlight.text,
    ':hover': {
        backgroundColor: vars.surface.highlight.hoverBg,
    }
});
