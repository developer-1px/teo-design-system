import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const header = style({
    gridColumn: '1 / -1',
    gridRow: '1',
    display: 'grid',
    gridTemplateColumns: 'subgrid',
    alignItems: 'center',
    paddingRight: vars.spacing[16],
    backgroundColor: vars.surface.base.bg,
});

export const logoSection = style({
    gridColumn: '1',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: vars.spacing[16],
    gap: vars.spacing[16],
});

export const searchSection = style({
    gridColumn: '2',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '720px',
    padding: `${vars.spacing[8]} 0`,
});

// ... imports
import { surface } from '../../styles/utils.css';

// ... other styles

export const searchBar = style([
    surface('input'),
    {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        height: '48px',
        borderRadius: '24px',
        padding: `0 ${vars.spacing[16]}`,
        gap: vars.spacing[16],
        transition: 'background-color 0.2s, box-shadow 0.2s',
        ':focus-within': {
            backgroundColor: vars.color.white,
            boxShadow: vars.shadow.depth1,
        }
    }
]);

// ... input style
export const input = style({
    border: 'none',
    background: 'transparent',
    flex: 1,
    height: '100%',
    fontSize: '16px',
    color: vars.color.gray800,
    outline: 'none',
    '::placeholder': {
        color: vars.color.gray600,
    }
});

export const actions = style({
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
});

export const iconBtn = style([
    surface('ghost'),
    {
        padding: vars.spacing[8],
        borderRadius: '50%',
        cursor: 'pointer',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
]);

export const logo = style({
    fontSize: '22px',
    color: vars.color.gray600, // Placeholder
    fontWeight: 500,
    letterSpacing: '-0.5px',
    display: 'flex',
    gap: '8px'
});
