import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface, ui } from '../../styles/utils';

export const root = style([
    surface('subtle'),
    {
        display: 'flex',
        padding: '2px',
        borderRadius: vars.borderRadius.md,
        gap: '2px',
        border: `1px solid ${vars.border.subtle}`
    }
]);

export const item = style([
    ui.label('xs'),
    {
        padding: `${vars.spacing[4]} ${vars.spacing[8]}`,
        borderRadius: vars.borderRadius.sm,
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        color: vars.color.gray600,
        display: 'flex',
        alignItems: 'center',
        gap: vars.spacing[4],
        transition: 'all 0.1s ease-out',
        ':hover': {
            color: vars.color.gray800
        },
        selectors: {
            '&[data-active="true"]': {
                backgroundColor: vars.color.white,
                color: vars.color.gray800,
                boxShadow: vars.shadow.raised,
                fontWeight: vars.weight.medium
            }
        }
    }
]);
