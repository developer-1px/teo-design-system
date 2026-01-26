import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const overlay = style({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: vars.zIndices.modal,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export const backdrop = style({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 0, // Base layer of the overlay
    backdropFilter: 'blur(2px)', // Optional: nice glass effect
});

export const container = styleVariants({
    modal: {
        zIndex: 1, // On top of backdrop
        position: 'relative',
    },
    drawer: {
        zIndex: 1, // On top of backdrop
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
    },
    unmounted: {
        display: 'none',
    }
});
