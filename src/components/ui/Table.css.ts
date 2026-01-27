import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const tableContainer = style({
    width: '100%',
    overflowX: 'auto',
    borderRadius: vars.borderRadius.lg,
    border: `1px solid ${vars.color.gray200}`,
    backgroundColor: vars.color.white,
});

export const table = style({
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontSize: vars.fontSize.sm,
});

export const thead = style({
    backgroundColor: vars.color.gray50,
    position: 'sticky',
    top: 0,
    zIndex: 1,
});

export const th = recipe({
    base: {
        textAlign: 'left',
        fontWeight: vars.weight.medium,
        color: vars.color.gray600,
        borderBottom: `1px solid ${vars.color.gray200}`,
        whiteSpace: 'nowrap',
        userSelect: 'none',
    },
    variants: {
        density: {
            standard: { padding: '12px 16px' },
            compact: { padding: '8px 12px' },
        }
    },
    defaultVariants: {
        density: 'standard'
    }
});

export const tr = style({
    transition: 'background-color 0.1s ease',
    ':hover': {
        backgroundColor: vars.color.gray50,
    },
});

export const td = recipe({
    base: {
        color: vars.color.gray800,
        borderBottom: `1px solid ${vars.color.gray100}`,
        verticalAlign: 'middle',
        selectors: {
            [`${tr}:last-child &`]: {
                borderBottom: 'none'
            }
        }
    },
    variants: {
        density: {
            standard: { padding: '12px 16px' },
            compact: { padding: '8px 12px' },
        }
    },
    defaultVariants: {
        density: 'standard'
    }
});

export const caption = style({
    captionSide: 'bottom',
    padding: '8px',
    fontSize: vars.fontSize.xs,
    color: vars.color.gray500,
    textAlign: 'center',
    borderTop: `1px solid ${vars.color.gray200}`,
});
