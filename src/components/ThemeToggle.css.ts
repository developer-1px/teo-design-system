import { style } from '@vanilla-extract/css';
import { vars } from '../styles/vars.css';

export const toggleBtn = style({
    padding: vars.spacing[12], // Match header icon padding
    borderRadius: '50%',
    cursor: 'pointer',
    color: vars.color.gray600,
    border: 'none',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
        backgroundColor: vars.color.gray100,
    }
});
