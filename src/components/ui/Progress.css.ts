import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const progressRoot = recipe({
    base: {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: vars.color.gray100, // Track color
        borderRadius: vars.borderRadius.full,
        width: '100%',
        transform: 'translateZ(0)',
    },
    variants: {
        size: {
            sm: { height: 4 },
            md: { height: 8 },
            lg: { height: 12 },
        }
    },
    defaultVariants: {
        size: 'md'
    }
});

export const progressIndicator = recipe({
    base: {
        width: '100%',
        height: '100%',
        transition: 'transform 660ms cubic-bezier(0.65, 0, 0.35, 1)',
        borderRadius: 'inherit',
    },
    variants: {
        intent: {
            primary: { backgroundColor: vars.color.primary },
            success: { backgroundColor: vars.color.green500 },
            warning: { backgroundColor: vars.color.amber500 },
            critical: { backgroundColor: vars.color.red500 },
            neutral: { backgroundColor: vars.color.gray500 },
        }
    },
    defaultVariants: {
        intent: 'primary'
    }
});
