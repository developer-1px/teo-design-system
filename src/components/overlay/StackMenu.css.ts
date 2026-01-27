import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface, ui } from '../../styles/utils';

const slideIn = keyframes({
    '0%': { transform: 'translateX(100%)', opacity: 0 },
    '100%': { transform: 'translateX(0)', opacity: 1 }
});



export const container = style([
    surface('card'),
    {
        width: '100%',
        overflow: 'hidden', // Essential for sliding effect
        borderRadius: '8px',
        border: `1px solid ${vars.border.subtle}`,
        boxShadow: vars.shadow.popover,
        display: 'flex',
        flexDirection: 'column',
    }
]);

export const viewContainer = style({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    animation: `${slideIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1)`,
});

export const header = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
    padding: `${vars.spacing[8]} ${vars.spacing[8]}`,
    borderBottom: `1px solid ${vars.border.subtle}`,
    color: vars.color.gray600,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.weight.medium,
});

export const backButton = style({
    cursor: 'pointer',
    borderRadius: '4px',
    padding: '4px',
    ':hover': {
        backgroundColor: vars.color.gray100,
        color: vars.color.gray800,
    }
});

export const list = style({
    padding: vars.spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: '2px', // Tight vertical rhythm
    maxHeight: '300px',
    overflowY: 'auto',
});

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
        fontSize: vars.fontSize.sm,
        ':hover': {
            backgroundColor: vars.color.gray100,
        },
    }
]);

export const itemLabel = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
});

export const icon = style({
    width: 14,
    height: 14,
    color: vars.color.gray600,
});

export const chevron = style({
    width: 14,
    height: 14,
    color: vars.color.gray300,
});
