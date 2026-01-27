import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const container = style({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
});

export const input = recipe({
    base: {
        width: '100%',
        fontFamily: vars.font.body,
        outline: 'none',
        border: `1px solid ${vars.color.gray300}`,
        borderRadius: vars.borderRadius.sm,
        backgroundColor: vars.surface.input.bg,
        color: vars.surface.input.text,
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        '::placeholder': {
            color: vars.color.gray600,
            opacity: 0.7,
        },
        selectors: {
            '&:focus': {
                borderColor: vars.color.gray800,
                boxShadow: `0 0 0 1px ${vars.color.gray800}`,
            },
            '&:disabled': {
                backgroundColor: vars.color.gray100,
                cursor: 'not-allowed',
                opacity: 0.7,
            },
            '&[data-invalid="true"]': {
                borderColor: 'red', // Semantic error color needed in vars, using red fallback
                boxShadow: 'none',
            },
            '&[data-invalid="true"]:focus': {
                boxShadow: `0 0 0 1px red`,
            }
        },
    },
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
