import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../../styles/vars.css';

export const groupContainer = recipe({
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

export const panel = style({
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
});

export const handle = recipe({
    base: {
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor: vars.color.border,
        transition: 'background-color 0.2s, width 0.2s, height 0.2s',
        zIndex: 10,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        '::after': {
            content: '""',
            position: 'absolute',
            zIndex: 1,
        },

        ':hover': {
            backgroundColor: vars.color.blue400,
        },
    },
    variants: {
        direction: {
            horizontal: {
                width: '1px',
                cursor: 'col-resize',
                height: '100%',
                '::after': {
                    top: 0,
                    bottom: 0,
                    left: '-4px',
                    right: '-4px',
                }
            },
            vertical: {
                height: '1px',
                cursor: 'row-resize',
                width: '100%',
                '::after': {
                    left: 0,
                    right: 0,
                    top: '-4px',
                    bottom: '-4px',
                }
            }
        },
        active: {
            true: {
                backgroundColor: vars.color.blue600,
                width: '2px', // Slightly thicker when active
                '::after': {
                    // Larger hit area during drag
                    left: '-10px',
                    right: '-10px',
                }
            }
        }
    },
    defaultVariants: {
        direction: 'horizontal'
    }
});
