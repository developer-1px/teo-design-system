import { style } from '@vanilla-extract/css';

export const listContainer = style({
    display: 'grid',
    // Definitive Column Tracks used by all Rows via Subgrid
    gridTemplateColumns: '40px 40px 200px 1fr min-content',
    // We can add a sticky header for sorting if needed, but for now just the list
    overflowY: 'auto',
    alignContent: 'start', // Pack rows to top
});
