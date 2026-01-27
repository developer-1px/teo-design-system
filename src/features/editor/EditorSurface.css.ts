// ... imports
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface, typography } from '../../styles/utils.css';

export const container = style({
    gridColumn: '2',
    display: 'grid',
    gridTemplateRows: '1fr 300px',
    height: '100%',
    overflow: 'hidden',
});

export const codeArea = style([
    surface('base'),
    typography({ variant: 'code', size: 'md' }),
    {
        gridRow: '1',
        borderBottom: `1px solid ${vars.border.default}`,
        padding: vars.spacing[16],
        overflow: 'auto',
    }
]);

export const lineVal = style({
    color: vars.color.gray300,
    marginRight: vars.spacing[16],
    userSelect: 'none',
    textAlign: 'right',
    display: 'inline-block',
    width: '24px',
});

// Terminal
export const terminal = style([
    surface('card'),
    typography({ variant: 'code', size: 'sm' }), // Console size
    {
        gridRow: '2',
        backgroundColor: vars.color.gray800,
        color: vars.color.gray200,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        border: 'none',
    }
]);

export const terminalHeader = style({
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${vars.spacing[16]}`,
    borderBottom: `1px solid ${vars.border.strong}`,
    fontWeight: vars.weight.bold,
    fontSize: vars.fontSize.xs,
    gap: vars.spacing[16],
    textTransform: 'uppercase',
    color: vars.color.gray300,
});

export const terminalBody = style({
    flex: 1,
    padding: vars.spacing[12],
    fontFamily: vars.font.code,
    fontSize: vars.fontSize.sm,
    overflowY: 'auto',
});

export const activeTerminalTab = style({
    backgroundColor: vars.color.gray200,
    color: vars.color.gray800,
    borderRadius: vars.borderRadius.sm,
    padding: `${vars.spacing[4]} ${vars.spacing[8]}`,
});
