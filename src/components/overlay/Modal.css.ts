import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils.css';

export const modal = style([
    surface('card'),
    {
        borderRadius: '12px',
        boxShadow: vars.shadow.modal,
        minWidth: '400px',
        maxWidth: '90vw',
        padding: vars.spacing[24],
        display: 'flex',
        flexDirection: 'column',
        gap: vars.spacing[16],
    }
]);

export const header = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const title = style({
    margin: 0,
    fontSize: vars.fontSize.lg,
    fontWeight: vars.weight.bold,
});

export const closeButton = style({
    background: 'transparent',
    border: 'none',
    fontSize: vars.fontSize.xl,
    cursor: 'pointer',
    color: vars.color.gray600,
    padding: vars.spacing[8],
    borderRadius: '4px',
    lineHeight: 1,
    ':hover': {
        backgroundColor: vars.surface.ghost.hoverBg,
    }
});

export const content = style({
    fontSize: vars.fontSize.md,
    lineHeight: vars.lineHeight.standard,
});
