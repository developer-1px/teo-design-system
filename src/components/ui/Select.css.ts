import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils';

export const container = style({
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
});

export const select = recipe({
    base: [
        surface.base('input'),
        surface.field,
        {
            appearance: 'none',
            width: '100%',
            fontFamily: vars.font.body,
            borderRadius: vars.borderRadius.sm,
            cursor: 'pointer',
            paddingRight: 32, // Space for arrow
            selectors: {
                '&:invalid': {
                    color: vars.color.gray600
                }
            },
        }
    ],
    variants: {
        size: {
            default: {
                height: 40,
                paddingLeft: 12,
                fontSize: vars.fontSize.md
            },
            dense: {
                height: 32,
                paddingLeft: 8,
                fontSize: vars.fontSize.sm
            },
            compact: {
                height: 28,
                paddingLeft: 8,
                fontSize: vars.fontSize.xs
            },
        }
    },
    defaultVariants: {
        size: 'default'
    }
});

export const chevron = style({
    position: 'absolute',
    right: 12,
    pointerEvents: 'none',
    color: vars.color.gray600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});
