import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils.css';

export const drawer = style([
    surface('card'),
    {
        height: '100%',
        width: '600px',
        maxWidth: '90vw',
        padding: vars.spacing[24],
        display: 'flex',
        flexDirection: 'column',
        gap: vars.spacing[16],
        boxShadow: vars.shadow.overlay,
    }
]);

export const header = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vars.spacing[16],
});

export const title = style({
    margin: 0,
    fontSize: vars.fontSize.xl,
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
    flex: 1,
    overflowY: 'auto',
    fontSize: vars.fontSize.md,
    lineHeight: vars.lineHeight.standard,
});
