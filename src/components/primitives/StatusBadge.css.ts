import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const root = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
});

export const dot = style({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
});

export const dotColors = {
    neutral: style({ backgroundColor: vars.color.gray400 }),
    success: style({ backgroundColor: vars.color.green500 }),
    warning: style({ backgroundColor: vars.color.amber500 }),
    critical: style({ backgroundColor: vars.color.red500 }),
    info: style({ backgroundColor: vars.color.blue500 }),
};
