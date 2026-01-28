import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const alert = recipe({
    base: {
        display: 'flex',
        alignItems: 'flex-start',
        padding: vars.spacing[12],
        borderRadius: vars.borderRadius.md,
        borderWidth: '1px',
        borderStyle: 'solid',
        gap: vars.spacing[12],
        width: '100%',
    },
    variants: {
        intent: {
            info: {
                backgroundColor: vars.color.blue50,
                borderColor: vars.color.blue100,
                color: vars.color.blue800,
            },
            success: {
                backgroundColor: vars.color.green50,
                borderColor: vars.color.green100,
                color: vars.color.green800,
            },
            warning: {
                backgroundColor: vars.color.amber50,
                borderColor: vars.color.amber100,
                color: vars.color.amber800,
            },
            danger: {
                backgroundColor: vars.color.red50,
                borderColor: vars.color.red100,
                color: vars.color.red800,
            },
            neutral: {
                backgroundColor: vars.color.gray50,
                borderColor: vars.color.gray200,
                color: vars.color.text,
            }
        },
        variant: {
            subtle: {}, // Default behavior uses the intent colors above
            outline: {
                backgroundColor: 'transparent',
                // Border colors inherited from intent in base? No, need to override if we want strong borders.
                // Actually, intent definitions above set borderColor relative to bg.
            },
            solid: {} // Skipping solid for now as it needs text color inversion logic we haven't fully fleshed out in vars
        }
    },
    defaultVariants: {
        intent: 'info',
        variant: 'subtle',
    },
});

export const icon = recipe({
    base: {
        flexShrink: 0,
        marginTop: 2, // Align with text line-height roughly
    },
    variants: {
        intent: {
            info: { color: vars.color.blue600 },
            success: { color: vars.color.green600 },
            warning: { color: vars.color.amber600 },
            danger: { color: vars.color.red600 },
            neutral: { color: vars.color.gray600 }
        }
    },
    defaultVariants: {
        intent: 'info'
    }
});

export const content = recipe({
    base: {
        display: 'flex',
        flexDirection: 'column',
        gap: vars.spacing[4],
    }
});

export const title = recipe({
    base: {
        fontWeight: vars.weight.bold,
        fontSize: vars.fontSize.md,
        lineHeight: vars.lineHeight.tight,
    }
});

export const description = recipe({
    base: {
        fontSize: vars.fontSize.sm,
        lineHeight: vars.lineHeight.standard,
        opacity: 0.9,
    }
});

export type AlertVariants = RecipeVariants<typeof alert>;
