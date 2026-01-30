import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { recipe } from '@vanilla-extract/recipes';

export const triggerWrapper = style({
    position: 'relative',
    display: 'inline-block',
    width: '100%',
});

export const popover = style({
    backgroundColor: vars.surface.card.bg,
    border: vars.surface.card.border,
    borderRadius: vars.borderRadius.md,
    boxShadow: vars.shadow.popover,
    width: 'var(--trigger-width)', // Needs to be set dynamically or same as trigger
    minWidth: '200px',
    maxHeight: '300px',
    overflowY: 'auto',
    padding: vars.spacing[4],
    marginTop: vars.spacing[4],
    zIndex: vars.zIndices.popover,
});

export const item = recipe({
    base: {
        padding: `${vars.spacing[8]} ${vars.spacing[12]}`,
        borderRadius: vars.borderRadius.sm,
        fontSize: vars.fontSize.sm,
        cursor: 'pointer',
        color: vars.color.gray900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background-color 0.1s',

        ':hover': {
            backgroundColor: vars.color.gray100,
        },
    },
    variants: {
        selected: {
            true: {
                backgroundColor: vars.color.blue50, // Or some highlight
                color: vars.color.blue600,
                fontWeight: vars.weight.medium,
                ':hover': {
                    backgroundColor: vars.color.blue100,
                }
            }
        },
        highlighted: { // For keyboard nav later
            true: {
                backgroundColor: vars.color.gray100,
            }
        }
    }
});

export const empty = style({
    padding: vars.spacing[12],
    fontSize: vars.fontSize.sm,
    color: vars.color.mutedForeground,
    textAlign: 'center',
});
