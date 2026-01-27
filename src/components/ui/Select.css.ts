import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';

export const container = style({
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
});

export const select = recipe({
    base: {
        appearance: 'none',
        width: '100%',
        fontFamily: vars.font.body,
        outline: 'none',
        border: `1px solid ${vars.color.gray300}`,
        borderRadius: vars.borderRadius.sm,
        backgroundColor: 'white',
        color: vars.surface.input.text,
        cursor: 'pointer',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        paddingRight: 32, // Space for arrow
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
            '&:invalid': {
                color: vars.color.gray600 // Placeholder styling for native select required
            }
        },
    },
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
