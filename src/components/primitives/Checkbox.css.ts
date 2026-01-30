import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const root = recipe({
    base: {
        all: 'unset',
        backgroundColor: 'white',
        width: 20,
        height: 20,
        borderRadius: 6, // Slightly rounded for modern look
        border: `1px solid ${vars.color.gray300}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        selectors: {
            '&:hover': { borderColor: vars.color.gray600 },
            '&:focus-visible': { boxShadow: `0 0 0 2px ${vars.color.gray800}` },
            '&[data-state="checked"]': {
                backgroundColor: vars.color.gray800,
                borderColor: vars.color.gray800,
                color: 'white'
            },
            '&[disabled]': {
                opacity: 0.5,
                cursor: 'not-allowed',
                backgroundColor: vars.color.gray100
            },
        },
    },
    variants: {
        size: {
            default: { width: 20, height: 20 },
            sm: { width: 16, height: 16, borderRadius: 4 },
        }
    },
    defaultVariants: {
        size: 'default'
    }
});

export const indicator = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
});
