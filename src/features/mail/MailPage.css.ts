import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

// Main App Shell uses the Subtle background (Gray)
export const mailLayout = style({
    display: 'grid',
    gridTemplateColumns: '256px 1fr',
    gridTemplateRows: '64px 1fr',
    height: '100%',
    width: '100%',
    backgroundColor: vars.surface.subtle.bg,
});

// The Content Area is a "Page" on top of the shell
export const mailContent = style({
    gridColumn: '2',
    gridRow: '2',
    backgroundColor: vars.surface.base.bg, // White Card
    borderTopLeftRadius: vars.spacing[16],
    // Remove margin rigth/bottom if we want it flush, or keep for floating effect
    // User said "looks bumpy", so a single clean card is better.
    // Let's keep the float but make it a solid white block.
    marginRight: vars.spacing[8],
    marginBottom: vars.spacing[8],
    boxShadow: vars.shadow.raised,
    overflow: 'hidden', // Contain children
    position: 'relative',
});
