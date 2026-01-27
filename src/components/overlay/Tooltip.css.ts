
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const container = style({
    position: 'relative',
    display: 'inline-flex',
});

export const tooltip = style({
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: vars.spacing[8],
    padding: `${vars.spacing[4]} ${vars.spacing[8]}`,
    backgroundColor: vars.color.gray800, // Tooltips usually inverted
    color: vars.color.white,
    fontSize: '12px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    zIndex: vars.zIndices.popover, // Ensure it's above mostly everything
    pointerEvents: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    opacity: 0,

    selectors: {
        [`${container}:hover &`]: {
            opacity: 1,
        }
    }
});

export const arrow = style({
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: '4px',
    borderStyle: 'solid',
    borderColor: `${vars.color.gray800} transparent transparent transparent`,
});
