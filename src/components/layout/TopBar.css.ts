import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const container = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    padding: '0 16px',
    backgroundColor: vars.surface.base.bg,
    borderBottom: `1px solid ${vars.color.border}`,
    gap: '16px',
});

export const left = style({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
});

export const center = style({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    justifyContent: 'center',
});

export const right = style({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
});
