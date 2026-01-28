import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const root = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[4],
    padding: vars.spacing[4],
    backgroundColor: vars.surface.subtle.bg,
    borderRadius: '8px',
    border: `1px solid ${vars.border.subtle}`,
    width: 'fit-content',
});

export const separator = style({
    width: '1px',
    height: '16px',
    backgroundColor: vars.border.subtle,
    margin: `0 ${vars.spacing[4]}`,
});
