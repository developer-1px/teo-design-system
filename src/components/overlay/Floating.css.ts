import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const wrapper = style({
    position: 'relative',
    display: 'inline-block',
});

export const popover = style({
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-8px)',
    backgroundColor: vars.surface.card.bg,
    border: vars.surface.card.border,
    boxShadow: vars.shadow.popover,
    padding: `${vars.spacing[8]} ${vars.spacing[12]}`,
    borderRadius: '4px',
    zIndex: vars.zIndices.popover, // Should technically be popover or floating based on type
    whiteSpace: 'nowrap',
    color: vars.surface.card.text,
    fontSize: vars.fontSize.sm,
});
