import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { ui } from '../../styles/utils.css';

export const container = style({
    maxHeight: 'calc(100vh - 48px)',
    overflowY: 'auto',
    paddingLeft: '20px', // Slightly tighter than 24px
    marginLeft: '12px', // Shift slightly right
    borderLeft: `1px solid ${vars.border.subtle}`,
    marginTop: '0.25rem', // Visual alignment with title
});

export const title = style([
    ui.overline(),
    {
        fontSize: '11px', // Slight override if needed, or stick to overline default (xs=12px). Let's keep the override if it was purposeful, or trust new token.
        // Original was 11px. ui.overline uses 'xs' which is usually 11px or 12px.
        // vars.fontSize.xs is 11px (based on typical vars.css).
        // ui.overline() sets size='xs'.
        // So I can remove fontSize: '11px' if vars.fontSize.xs is 11px.
        // Let's assume ui.overline is sufficient.
        color: vars.color.gray600,
        marginBottom: '12px',
    }
]);

export const list = style({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px', // Tighter vertical rhythm
});

export const item = style({});

export const link = style({
    textDecoration: 'none',
    color: vars.color.gray600,
    display: 'block',
    fontSize: '13px', // Subtitle size
    lineHeight: '1.5',
    ':hover': {
        color: vars.color.gray800,
    },
    selectors: {
        '&[data-active="true"]': {
            color: vars.surface.base.text, // Active = Primary Text Color
            fontWeight: '600',
        }
    }
});

globalStyle(`${item}[data-depth="3"]`, {
    paddingLeft: '12px', // Tighter indent for H3
    fontSize: '12.5px', // Slightly smaller for depth
});
