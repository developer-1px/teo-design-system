import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const root = recipe({
    base: {
        all: 'unset',
        width: 42,
        height: 25,
        backgroundColor: vars.color.gray300,
        borderRadius: '9999px',
        position: 'relative',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        boxShadow: `0 2px 2px ${vars.color.gray200}`,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',
        selectors: {
            '&:focus-visible': { boxShadow: `0 0 0 2px ${vars.color.gray800}` },
            '&[data-state="checked"]': { backgroundColor: vars.color.gray800 },
            '&[disabled]': { opacity: 0.5, cursor: 'not-allowed' },
        },
    },
    variants: {
        size: {
            default: { width: 42, height: 25 },
            sm: { width: 32, height: 20 },
        }
    },
    defaultVariants: {
        size: 'default'
    }
});

export const thumb = recipe({
    base: {
        display: 'block',
        width: 21,
        height: 21,
        backgroundColor: 'white',
        borderRadius: '9999px',
        boxShadow: `0 2px 2px ${vars.color.gray300}`,
        transition: 'transform 0.2s ease-in-out',
        transform: 'translateX(2px)',
        willChange: 'transform',
        selectors: {
            '[data-state="checked"] &': { transform: 'translateX(19px)' },
        },
    },
    variants: {
        size: {
            default: { width: 21, height: 21, selectors: { '[data-state="checked"] &': { transform: 'translateX(19px)' } } },
            sm: { width: 16, height: 16, transform: 'translateX(2px)', selectors: { '[data-state="checked"] &': { transform: 'translateX(14px)' } } },
        }
    },
    defaultVariants: {
        size: 'default'
    }
});
