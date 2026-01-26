import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils.css';

export const sidebar = style([
    surface('subtle'),
    {
        gridColumn: '1',
        gridRow: '1',
        borderRight: `1px solid ${vars.color.gray200}`,
        display: 'flex',
        flexDirection: 'column',
    }
]);

export const header = style({
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${vars.spacing[16]}`,
    fontSize: '11px',
    fontWeight: 700,
    color: vars.color.gray600,
    letterSpacing: '0.5px',
});

export const fileItem = style([
    surface('ghost'),
    {
        display: 'flex',
        alignItems: 'center',
        height: '28px',
        padding: `0 ${vars.spacing[16]}`,
        gap: vars.spacing[8],
        fontSize: '13px',
        cursor: 'pointer',
        color: vars.color.gray800,
        textDecoration: 'none',
        borderLeft: '2px solid transparent',
    }
]);

export const activeFile = style([
    surface('highlight'),
    {
        borderLeft: `2px solid ${vars.color.blue500}`, // Active Application like indicator
    }
]);

export const folder = style({
    fontWeight: 700,
    color: vars.color.gray800,
    display: 'flex',
    alignItems: 'center',
    height: '28px',
    padding: `0 ${vars.spacing[8]}`,
    fontSize: '13px',
    gap: vars.spacing[4],
});
