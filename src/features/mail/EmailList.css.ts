import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const listContainer = style({
    display: 'grid',
    // Definitive Column Tracks used by all Rows via Subgrid
    gridTemplateColumns: '40px 40px 200px 1fr min-content',
    overflowY: 'auto',
    alignContent: 'start', // Pack rows to top
    paddingBottom: vars.spacing[16], // List bottom padding
});
