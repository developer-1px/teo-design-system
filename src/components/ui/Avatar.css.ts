import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const avatarRoot = recipe({
    base: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        borderRadius: '50%', // Always circle for now
        backgroundColor: vars.color.gray100,
        color: vars.color.gray600,
        flexShrink: 0,
    },
    variants: {
        size: {
            xs: { width: 24, height: 24, fontSize: '0.625rem' },
            sm: { width: 32, height: 32, fontSize: '0.75rem' },
            md: { width: 40, height: 40, fontSize: '0.875rem' },
            lg: { width: 48, height: 48, fontSize: '1rem' },
            xl: { width: 64, height: 64, fontSize: '1.25rem' },
        }
    },
    defaultVariants: {
        size: 'md'
    }
});

export const image = style({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 'inherit',
});

export const fallback = style({
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: vars.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
});

export const statusIndicator = recipe({
    base: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: '50%',
        border: `2px solid ${vars.color.white}`,
        boxSizing: 'content-box',
    },
    variants: {
        status: {
            online: { backgroundColor: vars.color.green500 },
            offline: { backgroundColor: vars.color.gray400 },
            busy: { backgroundColor: vars.color.red500 },
        },
        size: {
            xs: { width: 6, height: 6, right: -1, bottom: -1 },
            sm: { width: 8, height: 8, right: -1, bottom: -1 },
            md: { width: 10, height: 10, right: 0, bottom: 0 },
            lg: { width: 12, height: 12, right: 1, bottom: 1 },
            xl: { width: 14, height: 14, right: 2, bottom: 2 },
        }
    },
    defaultVariants: {
        status: 'offline'
    }
});
