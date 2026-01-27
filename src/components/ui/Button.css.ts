import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils';

export const button = recipe({
    base: [
        surface.interactive('base'), // Default base interaction
        {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: vars.weight.medium,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            gap: vars.spacing[8],
            whiteSpace: 'nowrap',
            border: `1px solid transparent`, // Ensure border box
            ':focus-visible': {
                outline: `2px solid ${vars.color.ring}`,
                outlineOffset: '2px',
            },
            selectors: {
                '&[disabled], &[aria-disabled="true"], &[data-disabled="true"]': {
                    opacity: 0.6,
                    cursor: 'not-allowed',
                    pointerEvents: 'none',
                }
            }
        }
    ],

    variants: {
        intent: {
            primary: {},
            secondary: {},
            danger: {},
            neutral: {},
        },
        shape: {
            square: { borderRadius: vars.borderRadius.md },
            circle: { borderRadius: vars.borderRadius.full },
            pill: { borderRadius: vars.borderRadius.full },
        },
        variant: {
            /* ... */
            solid: {},
            outline: {},
            ghost: {},
            link: {
                backgroundColor: 'transparent',
                border: 'none',
                textDecoration: 'underline',
                padding: 0,
                height: 'auto',
                minWidth: '0',
            }
        },
        size: {
            xs: {
                padding: '0 8px',
                height: '24px',
                fontSize: vars.fontSize.xs,
            },
            sm: {
                padding: '0 12px',
                height: '32px', // Standard input height
                fontSize: vars.fontSize.sm,
            },
            md: {
                padding: '0 16px',
                height: '36px',
                fontSize: vars.fontSize.sm,
            },
            lg: {
                padding: '0 24px',
                height: '44px',
                fontSize: vars.fontSize.md,
            },
            icon: {
                padding: 0,
                width: '32px', // Default to sm height
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }
        }
    },

    compoundVariants: [
        // --- Solid Variants ---
        {
            variants: { intent: 'primary', variant: 'solid' },
            style: {
                backgroundColor: vars.color.primary,
                color: vars.color.primaryForeground,
                ':hover': { backgroundColor: vars.color.primary }, // Hover state handled by surface if opacity used, but here simpler
                // Note: For solid primary, we might need a distinct hover token if not using opacity
            }
        },
        {
            variants: { intent: 'danger', variant: 'solid' },
            style: {
                backgroundColor: vars.color.destructive,
                color: vars.color.destructiveForeground,
                ':hover': { backgroundColor: vars.color.destructive },
            }
        },
        {
            variants: { intent: 'neutral', variant: 'solid' },
            style: {
                backgroundColor: vars.color.muted,
                color: vars.color.mutedForeground,
                ':hover': { backgroundColor: vars.color.muted },
            }
        },
        // --- Outline Variants ---
        {
            variants: { intent: 'primary', variant: 'outline' },
            style: {
                ...surface.interactive('outlined'),
                borderColor: vars.color.primary,
                color: vars.color.primary,
                backgroundColor: 'transparent',
                ':hover': { backgroundColor: vars.color.accent },
            }
        },
        {
            variants: { intent: 'danger', variant: 'outline' },
            style: {
                ...surface.interactive('outlined'),
                borderColor: vars.color.destructive,
                color: vars.color.destructive,
                backgroundColor: 'transparent',
                ':hover': { backgroundColor: vars.color.red50 }, // Keep specific hover for now or map to destructive-subtle
            }
        },
        {
            variants: { intent: 'neutral', variant: 'outline' },
            style: {
                ...surface.interactive('outlined'),
                borderColor: vars.color.border,
                color: vars.color.secondaryForeground,
            }
        },
        // --- Ghost Variants ---
        {
            variants: { intent: 'primary', variant: 'ghost' },
            style: {
                ...surface.interactive('ghost'),
                color: vars.color.blue600,
                ':hover': { backgroundColor: vars.color.blue50 },
            }
        },
        {
            variants: { intent: 'danger', variant: 'ghost' },
            style: {
                ...surface.interactive('ghost'),
                color: vars.color.red600,
                ':hover': { backgroundColor: vars.color.red50 },
            }
        },
        {
            variants: { intent: 'neutral', variant: 'ghost' },
            style: {
                ...surface.interactive('ghost'),
                color: vars.color.gray600,
                ':hover': { backgroundColor: vars.color.gray100, color: vars.color.gray900 },
            }
        },
    ],

    defaultVariants: {
        intent: 'primary',
        size: 'sm',
        variant: 'solid',
        shape: 'square',
    }
});

import { keyframes, style } from '@vanilla-extract/css';

const rotate = keyframes({
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
});

export const spinner = style({
    animation: `${rotate} 1s linear infinite`,
});
