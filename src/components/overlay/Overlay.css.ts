import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

// Base style for the floating content
// We don't enforce visual styles (bg color, shadow) here, only structural.
// Visuals should be passed via className from the Composition (Dropdown, etc).
export const content = style({
    position: 'absolute',
    zIndex: vars.zIndices.popover,
    // We assume the user builds their own inner container style (card, menu surface etc).
    // But setting a sensible default constraints is good.
    maxWidth: '100vw',
    maxHeight: '100vh',
    // Prevent focus outline on container usually
    outline: 'none',
});
