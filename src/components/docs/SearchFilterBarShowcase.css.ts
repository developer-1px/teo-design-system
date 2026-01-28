import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const wrapper = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[24],
    padding: vars.spacing[24],
    backgroundColor: vars.surface.base.bg,
    borderRadius: '12px',
    border: `1px solid ${vars.border.subtle}`,
    marginTop: vars.spacing[24],
});

export const showcaseItem = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[12],
});

export const label = style({
    fontSize: '12px',
    fontWeight: '600',
    color: vars.color.gray500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
});

export const container = style({
    width: '100%',
    maxWidth: '600px',
});

export const eventLog = style({
    marginTop: vars.spacing[12],
    padding: vars.spacing[12],
    backgroundColor: vars.surface.subtle.bg,
    borderRadius: '6px',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: vars.color.gray600,
    maxHeight: '100px',
    overflowY: 'auto',
    border: `1px solid ${vars.border.subtle}`,
});
