import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const group = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[8],
});

export const item = recipe({
    base: {
        all: 'unset',
        backgroundColor: 'white',
        width: 20,
        height: 20,
        borderRadius: '100%',
        border: `1px solid ${vars.color.gray300}`,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        selectors: {
            '&:hover': { borderColor: vars.color.gray600 },
            '&:focus-visible': { boxShadow: `0 0 0 2px ${vars.color.gray800}` },
            '&[data-state="checked"]': {
                borderColor: vars.color.gray800,
                backgroundColor: 'white', // Keep white bg for inner circle contrast
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
            sm: { width: 16, height: 16 },
        }
    },
    defaultVariants: {
        size: 'default'
    }
});

export const indicator = style({
    display: 'block',
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: vars.color.gray800,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // animation: 'scaleIn 0.2s ease' // Ideally add keyframes
});
