import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { ui } from '../../styles/utils';

export const frame = style({
    position: 'relative',
    transition: 'all 0.1s ease-out',
});

// The overlay outline (separate from content to avoid layout shifts)
export const outline = style({
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none', // Allow clicks to pass through to content
    border: '1px solid transparent',
    transition: 'all 0.1s',
    zIndex: 10,
    selectors: {
        '&[data-variant="hover"]': {
            border: `1px dashed ${vars.border.interactive}`,
            backgroundColor: 'rgba(59, 130, 246, 0.02)'
        },
        '&[data-variant="selected"]': {
            border: `2px solid ${vars.border.interactive}`,
            zIndex: 11
        }
    }
});

export const label = style([
    ui.label('xs'),
    {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: vars.border.interactive,
        color: vars.color.white,
        padding: '2px 8px',
        borderBottomRightRadius: vars.borderRadius.sm,
        zIndex: 12,
        opacity: 0,
        transform: 'translateY(-2px)',
        transition: 'all 0.1s',
        selectors: {
            [`${outline}[data-variant="hover"] ~ &`]: {
                opacity: 1,
                transform: 'translateY(0)'
            },
            [`${outline}[data-variant="selected"] ~ &`]: {
                opacity: 1,
                transform: 'translateY(0)'
            }
        }
    }
]);
