import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const container = recipe({
    base: {
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    variants: {
        direction: {
            horizontal: { flexDirection: 'row' },
            vertical: { flexDirection: 'column' }
        }
    },
    defaultVariants: {
        direction: 'horizontal'
    }
});

export const pane = style({
    overflow: 'auto',
    display: 'flex', // Allow pane to be a flex container itself
    flexDirection: 'column',
});

// The resize handle
export const handle = recipe({
    base: {
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor: vars.color.border, // Subtle default
        transition: 'background-color 0.2s',
        zIndex: 10,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        ':hover': {
            backgroundColor: vars.color.blue400,
        },
    },
    variants: {
        direction: {
            horizontal: {
                width: '4px',
                cursor: 'col-resize',
                height: '100%',
            },
            vertical: {
                height: '4px',
                cursor: 'row-resize',
                width: '100%',
            }
        },
        active: {
            true: {
                backgroundColor: vars.color.blue600,
            }
        }
    },
    defaultVariants: {
        direction: 'horizontal'
    }
});
