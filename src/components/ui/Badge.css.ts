import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const badge = recipe({
    base: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: vars.borderRadius.full,
        fontWeight: vars.weight.medium,
        textTransform: 'none', // Badges don't necessarily need to be uppercase
        whiteSpace: 'nowrap',
        transition: 'all 0.1s ease',
    },

    variants: {
        intent: {
            neutral: {},
            success: {},
            warning: {},
            danger: {},
            info: {},
        },
        variant: {
            solid: {},
            subtle: {},
            outline: {},
        },
        size: {
            sm: {
                fontSize: vars.fontSize.xs,
                padding: '0 6px',
                height: '20px',
            },
            md: {
                fontSize: vars.fontSize.sm,
                padding: '0 8px',
                height: '24px',
            },
            lg: {
                fontSize: vars.fontSize.md,
                padding: '0 10px',
                height: '28px',
            },
        },
        interactive: {
            true: {
                cursor: 'pointer',
                ':hover': {
                    opacity: 0.8
                }
            }
        }
    },

    compoundVariants: [
        // SOLID VARIANTS
        {
            variants: { intent: 'neutral', variant: 'solid' },
            style: { backgroundColor: vars.color.gray800, color: vars.color.white },
        },
        {
            variants: { intent: 'success', variant: 'solid' },
            style: { backgroundColor: vars.color.green600, color: vars.color.white },
        },
        {
            variants: { intent: 'warning', variant: 'solid' },
            style: { backgroundColor: vars.color.amber500, color: vars.color.gray900 }, // Amber text needs contrast
        },
        {
            variants: { intent: 'danger', variant: 'solid' },
            style: { backgroundColor: vars.color.red600, color: vars.color.white },
        },
        {
            variants: { intent: 'info', variant: 'solid' },
            style: { backgroundColor: vars.color.blue600, color: vars.color.white },
        },

        // SUBTLE VARIANTS (Preferred for Admin UI)
        {
            variants: { intent: 'neutral', variant: 'subtle' },
            style: { backgroundColor: vars.color.gray200, color: vars.color.gray800 },
        },
        {
            variants: { intent: 'success', variant: 'subtle' },
            style: { backgroundColor: vars.color.green100, color: vars.color.green800 },
        },
        {
            variants: { intent: 'warning', variant: 'subtle' },
            style: { backgroundColor: vars.color.amber100, color: vars.color.amber800 },
        },
        {
            variants: { intent: 'danger', variant: 'subtle' },
            style: { backgroundColor: vars.color.red100, color: vars.color.red800 },
        },
        {
            variants: { intent: 'info', variant: 'subtle' },
            style: { backgroundColor: vars.color.blue100, color: vars.color.blue800 },
        },

        // OUTLINE VARIANTS
        {
            variants: { intent: 'neutral', variant: 'outline' },
            style: {
                border: `1px solid ${vars.color.gray400}`,
                color: vars.color.gray700
            },
        },
        {
            variants: { intent: 'success', variant: 'outline' },
            style: {
                border: `1px solid ${vars.color.green400}`,
                color: vars.color.green700
            },
        },
        {
            variants: { intent: 'warning', variant: 'outline' },
            style: {
                border: `1px solid ${vars.color.amber400}`,
                color: vars.color.amber700
            },
        },
        {
            variants: { intent: 'danger', variant: 'outline' },
            style: {
                border: `1px solid ${vars.color.red400}`,
                color: vars.color.red700
            },
        },
        {
            variants: { intent: 'info', variant: 'outline' },
            style: {
                border: `1px solid ${vars.color.blue400}`,
                color: vars.color.blue700
            },
        },
    ],

    defaultVariants: {
        intent: 'neutral',
        variant: 'subtle',
        size: 'sm',
    },
});
