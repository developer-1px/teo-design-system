import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils';

export const navContainer = style([
    surface('base'),
    {
        width: '48px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${vars.spacing[8]} 0`,
        borderRight: `1px solid ${vars.border.subtle}`,
        zIndex: vars.zIndices.floating,
    }
]);

export const navGroup = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[4],
    alignItems: 'center',
    width: '100%',
});

export const divider = style({
    width: '20px',
    height: '1px',
    background: vars.border.subtle,
    margin: `${vars.spacing[4]} 0`,
});

export const navItem = style([
    surface('ghost'),
    {
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        textDecoration: 'none',
        flexDirection: 'column',
        transition: 'all 0.1s',
    }
]);

export const activeNavItem = style([
    surface('highlight'),
    {
        color: vars.color.primary,
        backgroundColor: vars.color.gray100,
    }
]);

export const bottomSpacer = style({
    marginTop: 'auto',
    marginBottom: vars.spacing[16],
});
