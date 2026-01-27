import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface, ui } from '../../styles/utils';

export const menu = style([
    surface('card'), // Use card elevation
    {
        minWidth: '200px',
        padding: vars.spacing[4],
        borderRadius: '8px',
        border: `1px solid ${vars.border.subtle}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    }
]);

export const menuItem = style([
    ui.menu(),
    {
        position: 'relative', // Anchor for sub-menu
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${vars.spacing[8]} ${vars.spacing[8]}`,
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: vars.fontSize.sm,
        color: vars.color.gray800,
        ':hover': {
            backgroundColor: vars.color.gray100,
        },
        selectors: {
            '&[data-active="true"]': {
                backgroundColor: vars.color.gray100,
            }
        }
    }
]);

export const itemLabel = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
});

export const chevron = style({
    width: 14,
    height: 14,
    color: vars.color.gray300,
});

// The Sub Menu (Flyout)
export const subMenuPosition = style({
    position: 'absolute',
    top: -4, // Align top with parent item
    left: '100%',
    marginLeft: vars.spacing[4], // Small gap
    zIndex: vars.zIndices.popover,
});
