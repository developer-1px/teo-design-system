import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils';

export const editorLayout = style({
    display: 'grid',
    gridTemplateColumns: '250px 1fr 400px',
    height: '100%',
    width: '100%',
    backgroundColor: vars.surface.base.bg,
});

export const fileTree = style([
    surface('subtle'),
    {
        gridColumn: '1',
        borderRight: `1px solid ${vars.border.default}`,
        padding: vars.spacing[8],
    }
]);

export const mainArea = style({
    gridColumn: '2',
    display: 'grid',
    gridTemplateRows: '1fr 300px',
    height: '100%',
});

export const codeSurface = style([
    surface('base'),
    {
        gridRow: '1',
        borderBottom: `1px solid ${vars.border.default}`,
        padding: vars.spacing[16],
        fontFamily: vars.font.code,
    }
]);

export const terminal = style([
    surface('card'),
    {
        gridRow: '2',
        backgroundColor: vars.color.gray800,
        color: vars.color.gray100,
        padding: vars.spacing[12],
        fontFamily: vars.font.code,
        fontSize: vars.fontSize.xs,
        border: 'none',
        borderRadius: 0,
    }
]);

export const chatPanel = style([
    surface('subtle'),
    {
        gridColumn: '3',
        borderLeft: `1px solid ${vars.border.default}`,
        display: 'flex',
        flexDirection: 'column',
    }
]);

export const resizer = style({
    gridColumn: '1',
    gridRow: '1',
    justifySelf: 'end', // Position at the right edge of column 1
    width: '4px', // Hit area
    height: '100%',
    cursor: 'col-resize',
    zIndex: vars.zIndices.elevated,
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s',
    ':hover': {
        backgroundColor: vars.border.interactive,
    },
    // Make it overlay the border
    marginRight: '-2px',
});
