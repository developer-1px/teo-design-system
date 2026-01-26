import { style } from '@vanilla-extract/css';
import { vars } from '../styles/vars.css';

export const layout = style({
    display: 'flex',
    height: '100vh',
    width: '100vw',
    backgroundColor: vars.surface.subtle.bg, // Global app background
});

export const contentArea = style({
    flex: 1,
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
});
