import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const listContainer = style({
    display: 'grid',
    // Definitive Column Tracks used by all Rows via Subgrid
    gridTemplateColumns: '40px 40px 200px 1fr min-content',
    overflowY: 'auto',
    alignContent: 'start', // Pack rows to top
});

export const headerRow = style([
    {
        display: 'grid',
        gridColumn: '1 / -1',
        gridTemplateColumns: 'subgrid',
        alignItems: 'center',
        height: '32px',
        borderBottom: `1px solid ${vars.color.gray200}`,
        color: vars.color.gray600,
        fontSize: vars.fontSize.xs,
        fontWeight: vars.weight.medium,
        paddingRight: vars.spacing[16],
        // ✨ Fix: Sticky header to keep context while scrolling
        position: 'sticky',
        top: 0,
        backgroundColor: vars.color.white,
        zIndex: 1,
    }
]);

export const headerCell = style({
    // paddingLeft: vars.spacing[8], // ❌ Removed: this was causing misalignment with data rows
    display: 'flex',
    alignItems: 'center',
});

export const dateHeaderCell = style([
    headerCell,
    { justifyContent: 'flex-end' }
]);
