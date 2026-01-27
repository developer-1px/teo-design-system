import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const clearButton = style({
    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.color.gray600,
    borderRadius: '50%',
    padding: 2,
    marginTop: 'auto',
    marginBottom: 'auto',
    pointerEvents: 'auto', // Re-enable pointer events since it's in the rightIcon slot
    ':hover': {
        backgroundColor: vars.color.gray200,
        color: vars.color.gray800,
    }
});
