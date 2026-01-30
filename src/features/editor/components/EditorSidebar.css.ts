import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/vars.css';
import { surface } from '@/styles/utils';

export const sidebar = style([
    surface('subtle'),
    {
        gridColumn: '1',
        gridRow: '1',
        borderRight: `1px solid ${vars.border.default}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto'
    }
]);

export const header = style({
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${vars.spacing[16]}`,
    fontSize: vars.fontSize.xs,
    fontWeight: vars.weight.bold,
    color: vars.color.gray600,
    letterSpacing: vars.letterSpacing.wide,
});

export const fileItem = style([
    surface('ghost'),
    {
        display: 'flex',
        alignItems: 'center',
        height: '28px',
        padding: `0 ${vars.spacing[8]}`,
        fontSize: vars.fontSize.sm,
        cursor: 'pointer',
        color: vars.surface.base.text,
        textDecoration: 'none',
        borderLeft: '2px solid transparent',
        width: '100%',
    }
]);

export const activeFile = style([
    surface('highlight'),
    {
        borderLeft: `2px solid ${vars.border.interactive}`,
    }
]);

export const folderHeader = style([
    surface('ghost'),
    {
        display: 'flex',
        alignItems: 'center',
        height: '28px',
        padding: `0 ${vars.spacing[8]}`,
        cursor: 'pointer',
        color: vars.surface.base.text,
        fontWeight: vars.weight.medium,
        fontSize: vars.fontSize.sm,
    }
]);

export const folderContent = style({
    marginLeft: vars.spacing[12],
    borderLeft: `1px solid ${vars.border.subtle}`,
    paddingLeft: vars.spacing[4],
});
