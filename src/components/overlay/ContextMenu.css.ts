
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils.css';

export const contextMenu = style([
    surface('card'), // Consistent card visual
    {
        position: 'fixed',
        zIndex: vars.zIndices.popover,
        minWidth: '180px',
        maxWidth: '240px',
        padding: vars.spacing[8],
        borderRadius: '8px',
        boxShadow: vars.shadow.overlay, // Level 2 or 3 shadow
        display: 'flex',
        flexDirection: 'column',
        gap: vars.spacing[4],
        outline: 'none',
    }
]);

export const menuItem = style([
    surface('ghost'), // Interactive item style
    {
        padding: `${vars.spacing[8]} ${vars.spacing[8]}`,
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: vars.fontSize.sm,
        textAlign: 'left',
        border: 'none',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: vars.spacing[8],
        transition: 'background-color 0.1s',
        color: vars.color.gray800,
        textDecoration: 'none',
    }
]);

export const separator = style({
    height: '1px',
    backgroundColor: vars.color.gray200,
    margin: `${vars.spacing[4]} 0`,
});
