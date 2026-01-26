import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const mailLayout = style({
    display: 'grid',
    gridTemplateColumns: '256px 1fr',
    gridTemplateRows: '64px 1fr',
    height: '100%',
    width: '100%',
    // No background here, handled by RootLayout
});

export const mailContent = style({
    gridColumn: '2',
    gridRow: '2',
    backgroundColor: vars.surface.base.bg, // Mail list background
    overflowY: 'auto',
    borderTopLeftRadius: vars.spacing[16],
    marginRight: vars.spacing[8],
    marginBottom: vars.spacing[8],
    boxShadow: vars.shadow.raised,
});
