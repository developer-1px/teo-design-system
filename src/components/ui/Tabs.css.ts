import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const tabsRoot = style({
    display: 'flex',
    width: '100%',
});

export const tabTrigger = recipe({
    base: {
        all: 'unset',
        cursor: 'pointer',
        fontFamily: vars.font.body,
        fontSize: vars.fontSize.sm,
        fontWeight: vars.weight.medium,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        position: 'relative',

        ':disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
        },
    },
    variants: {
        variant: {
            line: {
                padding: `${vars.spacing[12]} ${vars.spacing[16]}`,
                color: vars.color.gray500,
                borderBottom: `2px solid transparent`,
                ':hover': {
                    color: vars.color.gray700,
                },
                selectors: {
                    '&[data-state="active"]': {
                        color: vars.color.primary,
                        borderColor: vars.color.primary,
                        fontWeight: vars.weight.bold,
                    }
                }
            },
            segment: {
                padding: `6px ${vars.spacing[12]}`,
                color: vars.color.gray600,
                borderRadius: vars.borderRadius.md,
                zIndex: 1,
                ':hover': {
                    color: vars.color.gray900,
                },
                selectors: {
                    '&[data-state="active"]': {
                        color: vars.color.gray900,
                        backgroundColor: vars.color.white,
                        boxShadow: vars.shadow.raised,
                        fontWeight: vars.weight.bold,
                    }
                }
            }
        },
        size: {
            sm: { fontSize: vars.fontSize.xs },
            md: { fontSize: vars.fontSize.sm },
            lg: { fontSize: vars.fontSize.md },
        },
        fullWidth: {
            true: { flex: 1 },
            false: { flex: '0 0 auto' }
        }
    },
    defaultVariants: {
        variant: 'line',
        size: 'md',
        fullWidth: false
    }
});

export const tabsList = recipe({
    base: {
        display: 'flex',
        width: '100%',
    },
    variants: {
        variant: {
            line: {
                borderBottom: `1px solid ${vars.color.gray200}`,
                gap: vars.spacing[16],
            },
            segment: {
                backgroundColor: vars.color.gray100,
                padding: vars.spacing[4],
                borderRadius: vars.borderRadius.lg,
                gap: vars.spacing[4],
            }
        }
    },
    defaultVariants: {
        variant: 'line'
    }
});
