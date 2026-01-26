import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils.css';

export const sidebar = style({
    gridColumn: '1',
    gridRow: '2',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: vars.spacing[8],
});

export const composeBtn = style([
    surface('highlight'),
    {
        height: '56px',
        minWidth: '56px',
        width: 'fit-content',
        padding: `0 ${vars.spacing[24]} 0 ${vars.spacing[16]}`, // Asymmetric padding

        display: 'flex',
        alignItems: 'center',
        gap: vars.spacing[12],
        borderRadius: '16px',
        border: 'none',
        boxShadow: vars.shadow.depth1,
        marginLeft: vars.spacing[8],
        marginBottom: vars.spacing[16],
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'box-shadow 0.2s',
        ':hover': {
            boxShadow: vars.shadow.depth2,
        }
    }
]);

export const navGroup = style({
    display: 'grid',
    gridTemplateColumns: '56px 1fr min-content',
});

export const navItemParent = style({
    gridColumn: '1 / -1', // Spans all 3 columns
    display: 'grid',
    gridTemplateColumns: 'subgrid', // Inherits the 56px 1fr min-content
    height: '32px',
    alignItems: 'center',
    paddingRight: vars.spacing[24],
    borderTopRightRadius: '16px',
    borderBottomRightRadius: '16px',
    cursor: 'pointer',
    color: vars.color.gray800,
    fontSize: '14px',
    fontWeight: 400,
    textDecoration: 'none',
    ':hover': {
        backgroundColor: vars.color.gray50, // Slight hover
    }
});

export const itemState = styleVariants({
    active: {
        ...surface('highlight'),
        fontWeight: 700,
        ':hover': { backgroundColor: vars.surface.highlight.bg }
    },
    inactive: {}
});
