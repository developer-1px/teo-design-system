import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const accordionRoot = style({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderBottom: `1px solid ${vars.color.border}`,
});

export const item = style({
    borderTop: `1px solid ${vars.color.border}`,
});

export const trigger = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: `${vars.spacing[12]} ${vars.spacing[16]}`,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.2s ease',
    ':hover': {
        backgroundColor: vars.surface.ghost.hoverBg,
    },
    ':disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
    },
});

export const title = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.weight.medium,
    color: vars.color.gray800,
});

export const icon = style({
    color: vars.color.gray400,
    transition: 'transform 0.3s cubic-bezier(0.87, 0, 0.13, 1)',
    selectors: {
        [`${item}[data-state='open'] &`]: {
            transform: 'rotate(180deg)',
        },
    },
});

export const contentWrapper = style({
    overflow: 'hidden',
    transition: 'height 0.3s cubic-bezier(0.87, 0, 0.13, 1)',
});

export const content = style({
    padding: `0 ${vars.spacing[16]} ${vars.spacing[16]}`,
    fontSize: vars.fontSize.sm,
    color: vars.color.gray600,
    lineHeight: vars.lineHeight.standard,
});
