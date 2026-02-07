import type { StyleRule } from '@vanilla-extract/css';

/**
 * Mixin for CSS subgrid
 * @param axis - The axis to apply subgrid to ('x', 'y', or 'both')
 * @param width - The grid-column property (default: '1 / -1' to span full width)
 */
export const subgrid = (axis: 'x' | 'y' | 'both' = 'both', width: string = '1 / -1'): StyleRule => ({
    display: 'grid',
    gridColumn: width,
    ...(axis === 'x' || axis === 'both' ? { gridTemplateColumns: 'subgrid' } : {}),
    ...(axis === 'y' || axis === 'both' ? { gridTemplateRows: 'subgrid' } : {})
});
