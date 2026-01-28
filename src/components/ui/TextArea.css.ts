import { recipe } from '@vanilla-extract/recipes';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const container = recipe({
    base: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
    },
});

export const textarea = recipe({
    base: {
        width: '100%',
        minHeight: '80px',
        padding: vars.spacing[8],
        borderRadius: vars.borderRadius.md,
        backgroundColor: vars.color.input,
        border: `1px solid ${vars.color.border}`,
        color: vars.color.primary,
        fontFamily: vars.font.body,
        fontSize: vars.fontSize.sm,
        lineHeight: vars.lineHeight.standard,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        outline: 'none',

        ':focus': {
            borderColor: vars.color.ring,
            boxShadow: `0 0 0 2px ${vars.color.ring}20`, // 20 = approx 12% opacity hex
        },

        ':disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            backgroundColor: vars.color.gray100,
        },

        '::placeholder': {
            color: vars.color.mutedForeground,
        },
    },
    variants: {
        resize: {
            none: { resize: 'none' },
            vertical: { resize: 'vertical' },
            horizontal: { resize: 'horizontal' },
            both: { resize: 'both' },
        },
        error: {
            true: {
                borderColor: vars.color.destructive,
                ':focus': {
                    borderColor: vars.color.destructive,
                    boxShadow: `0 0 0 2px ${vars.color.destructive}20`,
                }
            },
        },
    },
    defaultVariants: {
        resize: 'vertical',
    },
});

export type TextAreaVariants = RecipeVariants<typeof textarea>;
