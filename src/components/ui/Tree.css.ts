import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const treeRoot = style({
    width: '100%',
    userSelect: 'none',
});

export const nodeWrapper = style({
    display: 'flex',
    flexDirection: 'column',
});

export const nodeItem = style({
    display: 'flex',
    alignItems: 'center',
    height: vars.sizing.item.compact,
    cursor: 'pointer',
    fontSize: vars.fontSize.sm,
    color: vars.color.gray700,
    transition: 'background-color 0.1s ease',
    ':hover': {
        backgroundColor: vars.surface.ghost.hoverBg,
    },
});

export const chevronWrapper = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: '100%',
    color: vars.color.gray400,
    ':hover': {
        color: vars.color.gray600,
    }
});

export const iconWrapper = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
});

export const label = style({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

export const childrenWrapper = style({
    display: 'flex',
    flexDirection: 'column',
});
