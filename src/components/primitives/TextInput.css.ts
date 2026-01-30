import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils';

export const container = style({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
});

export const input = recipe({
    base: [
        surface.base('input'),
        surface.field,
        {
            width: '100%',
            fontFamily: vars.font.body,
            borderRadius: vars.borderRadius.sm,
            '::placeholder': {
                color: vars.color.gray600,
                opacity: 0.7,
            },
        }
    ],
    variants: {
        size: {
            default: {
                height: 40,
                padding: '0 12px',
                fontSize: vars.fontSize.md
            },
            dense: {
                height: 32,
                padding: '0 8px',
                fontSize: vars.fontSize.sm
            },
            compact: {
                height: 28,
                padding: '0 8px', // Tighter padding
                fontSize: vars.fontSize.xs
            },
            large: {
                height: 48,
                padding: '0 16px',
                fontSize: vars.fontSize.lg
            }
        },
        hasLeftIcon: {
            true: { paddingLeft: 38 } // size-dependent padding usually ideally handled via calc() or separate variant
        },
        hasRightIcon: {
            true: { paddingRight: 38 }
        }
    },
    compoundVariants: [
        {
            variants: { size: 'dense', hasLeftIcon: true },
            style: { paddingLeft: 32 }
        },
        {
            variants: { size: 'dense', hasRightIcon: true },
            style: { paddingRight: 32 }
        },
        {
            variants: { size: 'compact', hasLeftIcon: true },
            style: { paddingLeft: 26 }
        },
        {
            variants: { size: 'compact', hasRightIcon: true },
            style: { paddingRight: 26 }
        }
    ],
    defaultVariants: {
        size: 'default',
        hasLeftIcon: false,
        hasRightIcon: false,
    }
});

const iconBase = style({
    position: 'absolute',
    color: vars.color.gray600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none', // Allow clicks to pass through to input
    height: '100%',
});

export const leftIcon = style([iconBase, { left: 0, paddingLeft: 10 }]);
export const rightIcon = style([iconBase, { right: 0, paddingRight: 10 }]);
