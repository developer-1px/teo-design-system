import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils.css';

export const navContainer = style([
    surface('base'),
    {
        width: '64px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: vars.spacing[16],
        gap: vars.spacing[16],
        borderRight: `1px solid ${vars.color.gray200}`,
        zIndex: 100,
    }
]);

export const navItem = style([
    surface('ghost'),
    {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: vars.color.gray600,
        textDecoration: 'none',
        flexDirection: 'column',
        gap: '4px',
        fontSize: '10px',
        fontWeight: 500,
    }
]);

export const activeNavItem = style([
    surface('highlight'),
    {
        color: vars.color.blue500,
        fontWeight: 700,
    }
]);
