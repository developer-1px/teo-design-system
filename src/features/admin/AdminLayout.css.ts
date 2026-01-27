import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const container = style({
    display: 'flex',
    height: '100vh',
    backgroundColor: vars.surface.base.bg,
});

export const sidebar = style({
    width: '240px',
    backgroundColor: vars.surface.subtle.bg,
    borderRight: `1px solid ${vars.border.subtle}`,
    display: 'flex',
    flexDirection: 'column',
});

export const header = style({
    padding: `${vars.spacing[16]} ${vars.spacing[24]}`,
    borderBottom: `1px solid ${vars.border.subtle}`,
    display: 'flex',
    alignItems: 'center',
    height: '48px', // Matching the compact header height
});

export const brand = style({
    fontSize: vars.fontSize.md,
    fontWeight: vars.weight.bold,
    color: vars.color.gray800,
});

export const nav = style({
    flex: 1,
    padding: vars.spacing[12],
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[4],
});

export const navItem = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[12],
    padding: `${vars.spacing[8]} ${vars.spacing[12]}`,
    borderRadius: vars.borderRadius.sm,
    fontSize: vars.fontSize.md,
    color: vars.color.gray600,
    textDecoration: 'none',
    transition: 'all 0.1s ease',

    ':hover': {
        backgroundColor: vars.color.gray100, // Or some subtle hover defined in vars
        color: vars.color.gray800,
    },
});

export const navItemActive = style({
    backgroundColor: vars.color.gray100,
    color: vars.color.gray800,
    fontWeight: vars.weight.medium,
});

export const userSection = style({
    padding: vars.spacing[16],
    borderTop: `1px solid ${vars.border.subtle}`,
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[12],
});

export const avatar = style({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: vars.color.gray200,
});

export const userInfo = style({
    display: 'flex',
    flexDirection: 'column',
});

export const userName = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.weight.medium,
    color: vars.color.gray800,
});

export const userRole = style({
    fontSize: vars.fontSize.xs,
    color: vars.color.gray600,
});

export const content = style({
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
});
