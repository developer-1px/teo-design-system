import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const listContainer = style({
    display: 'grid',
    // Definitive Column Tracks used by all Rows via Subgrid
    gridTemplateColumns: '40px 40px 200px 1fr min-content',
    overflowY: 'auto',
    alignContent: 'start', // Pack rows to top
    // paddingBottom: vars.spacing[16], // Keep scroll padding if needed, or remove
});

export const headerRow = style([
    {
        display: 'grid',
        gridColumn: '1 / -1',
        gridTemplateColumns: 'subgrid',
        alignItems: 'center',
        height: '32px',
        borderBottom: `1px solid ${vars.color.gray200}`,
        // marginBottom: vars.spacing[4], // Removed for flush look
        color: vars.color.gray600,
        fontSize: vars.fontSize.xs,
        fontWeight: vars.weight.medium,
        paddingRight: vars.spacing[16],
    }
]);

export const headerCell = style({
    paddingLeft: vars.spacing[8],
});
