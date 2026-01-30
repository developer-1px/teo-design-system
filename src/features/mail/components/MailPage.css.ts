import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

// The Content Area is a "Page" on top of the shell
export const mailContent = style({
    width: '100%',
    height: '100%',
    backgroundColor: vars.surface.base.bg, // White Card
    borderTopLeftRadius: vars.spacing[16],
    // Let's keep the float but make it a solid white block.
    marginRight: vars.spacing[8],
    marginBottom: vars.spacing[8],
    boxShadow: vars.shadow.raised,
    overflow: 'hidden', // Contain children
    position: 'relative',
});
