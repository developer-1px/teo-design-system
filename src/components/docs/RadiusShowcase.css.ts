import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[24],
    marginTop: vars.spacing[24],
});

export const row = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[24],
    borderBottom: `1px dashed ${vars.border.subtle}`,
    paddingBottom: vars.spacing[16],
    ':last-child': {
        borderBottom: 'none',
    }
});

export const label = style({
    width: '100px',
    fontSize: vars.fontSize.sm,
    fontWeight: vars.weight.medium,
    color: vars.color.gray600,
    fontFamily: vars.font.code,
});

export const demoBox = style({
    width: '120px',
    height: '64px',
    backgroundColor: vars.color.green500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.color.white,
    fontSize: vars.fontSize.xs,
    boxShadow: vars.shadow.raised,
});

export const valueLabel = style({
    marginLeft: 'auto',
    fontSize: vars.fontSize.xs,
    color: vars.color.gray600,
    fontFamily: vars.font.code,
});
