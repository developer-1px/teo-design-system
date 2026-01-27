import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { subgrid, surface } from '../../styles/utils.css';

// 1. Parent Grid
export const container = style({
    display: 'grid',
    // 3 Columns
    gridTemplateColumns: 'repeat(3, 1fr)',
    // We define generic row tracks that the children will hook into
    gridTemplateRows: 'auto auto 1fr',
    gap: '24px',
    padding: '24px',
    border: `1px dashed ${vars.color.gray300}`,
    borderRadius: '8px',
});

// 2. Child Item (The Card)
export const card = style([
    surface('card'), // Using surface mixin
    {
        // Must span 3 rows to provide tracks for Header/Content/Footer
        gridRow: 'span 3',

        // Inherit the parent's row tracks
        ...subgrid('y') // Using our new mixin (spread works here but we should use array if strict, but let's test mixin inside style obj for spread)
        // Wait, rule says: style([ subgrid(), ... ])
        // Let's stick to the rule.
    }
]);

// Let's re-write `card` to follow the rule exactly.
export const cardStrict = style([
    subgrid('y'),
    surface('card'),
    {
        gridRow: 'span 3',
        padding: 0, // Reset padding as internal items will have padding
        overflow: 'hidden' // For rounded corners
    }
]);

// 3. Grandchildren (The actual content aligned to tracks)
// Since the 'card' is a subgrid, its children are placed into the rows it spans.

export const cardHeader = style({
    padding: '16px',
    borderBottom: `1px solid ${vars.color.gray100}`,
    fontWeight: 'bold',
    backgroundColor: vars.surface.subtle.bg
});

export const cardContent = style({
    padding: '16px',
    color: vars.color.gray600,
    fontSize: '14px',
});

export const cardFooter = style({
    padding: '16px',
    borderTop: `1px solid ${vars.color.gray100}`,
    fontSize: '12px',
    color: vars.color.gray600,
    // Footer should align to the bottom-most track of the span
});
