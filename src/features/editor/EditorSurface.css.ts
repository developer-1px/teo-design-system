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
        borderBottom: `1px solid ${vars.color.gray200}`,
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
        backgroundColor: '#1e1e1e',
        color: '#cccccc',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
    }
]);

export const terminalHeader = style({
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${vars.spacing[16]}`,
    borderBottom: '1px solid #333',
    fontWeight: 700,
    fontSize: '11px',
    gap: vars.spacing[16],
    textTransform: 'uppercase',
    color: '#cccccc',
});

export const terminalBody = style({
    flex: 1,
    padding: vars.spacing[12],
    fontFamily: 'Menlo, Monaco, monospace',
    fontSize: '12px',
    overflowY: 'auto',
});
