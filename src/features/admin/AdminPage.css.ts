import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const container = style({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: vars.surface.base.bg,
    color: vars.surface.base.text,
    fontFamily: vars.font.body,
});

export const header = style({
    padding: `${vars.spacing[12]} ${vars.spacing[24]}`,
    borderBottom: `1px solid ${vars.border.subtle}`,
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[16],
    height: '56px', // Standard app header height
});

export const title = style({
    fontSize: '14px',
    fontWeight: '600',
    color: vars.color.gray800,
});

export const main = style({
    flex: 1,
    overflow: 'hidden', // Table handles scrolling
    display: 'flex',
    flexDirection: 'column',
});
