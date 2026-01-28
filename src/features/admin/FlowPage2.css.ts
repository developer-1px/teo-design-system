import { style } from '@vanilla-extract/css';

// Re-exporting common styles from FlowPage to keep consistent theme
// In a real app, these would be in a shared `flow.css.ts`
import {
    container, topBar, methodBadge, urlText, playButton,
    flowContainer, sourceCol, logicCol, previewCol,
    colHeader, scrollArea, jsonNode, jsonKey, jsonVal,
    cardTitle, propertyRow, select,
    previewStage, previewCard, previewHeader, previewBody
} from './FlowPage.css';

// Export inherited styles
// specific exclusions to avoid conflicts with overrides
export {
    container, topBar, methodBadge, urlText, playButton,
    flowContainer, sourceCol, logicCol, previewCol,
    colHeader, scrollArea, jsonNode, jsonKey, jsonVal,
    cardTitle, propertyRow, select,
    previewStage, previewCard, previewHeader, previewBody
};

const zinc = {
    100: '#f4f4f5',
    200: '#e4e4e7',
    500: '#71717a',
    900: '#18181b',
};

// ... (Previous styles remain same until overrides)

// New Styles specific to Flow 2 (List/Table)

export const arrayBlock = style({
    margin: '12px 20px',
    border: `1px solid ${zinc[200]}`,
    borderRadius: '8px',
    overflow: 'hidden',
});

export const arrayHeader = style({
    padding: '8px 12px',
    background: zinc[100],
    fontSize: '11px',
    fontWeight: 600,
    color: zinc[500],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const paginationBar = style({
    marginTop: 'auto', // Push to bottom
    padding: '12px 16px',
    borderTop: `1px solid ${zinc[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
});

export const pageBtn = style({
    padding: '4px 8px',
    border: `1px solid ${zinc[200]}`,
    borderRadius: '4px',
    background: '#fff',
    fontSize: '11px',
    cursor: 'pointer',
    ':disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
    }
});

// Table specific overrides
// Global Scroll Layout Overrides
export const flowContainerScrollable = style({
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto', // Allow global horizontal scroll
    overflowY: 'hidden', // Scroll is on columns
    height: '100%',
    width: '100%',
    background: zinc[100], // zinc-100 or 50
});

export const sourceColFixed = style({
    width: '320px',
    minWidth: '320px',
    flexShrink: 0,
    borderRight: `1px solid ${zinc[200]}`,
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    height: '100%',
});

export const logicColFixed = style({
    width: '360px',
    minWidth: '360px',
    flexShrink: 0,
    borderRight: `1px solid ${zinc[200]}`,
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    height: '100%',
});

export const previewColFluid = style({
    flex: 1,
    minWidth: '1000px', // Force scroll if viewport is small
    display: 'flex',
    flexDirection: 'column',
    // borderRight: 'none',
    height: '100%',
});

// Compact Logic Row Style - Refined
export const logicCard = style({
    padding: '6px 12px',
    margin: '0 12px',
    background: 'transparent',
    borderBottom: `1px solid ${zinc[200]}`, // Divider style instead of card
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
        background: '#fff',
        // transform: 'translateX(2px)', // REMOVE: Breaks visual key/alignment
    },
    selectors: {
        '&:last-child': {
            borderBottom: 'none'
        }
    }
});

// Simplified select for compact row
export const compactSelect = style({
    fontSize: '11px',
    padding: '2px 0', // Minimal padding
    borderRadius: '4px',
    border: 'none',
    background: 'transparent',
    color: zinc[500],
    cursor: 'pointer',
    outline: 'none',
    maxWidth: '80px',
    textAlign: 'right', // Align text right next to icon
    ':hover': {
        color: zinc[900],
        background: zinc[100]
    }
});

// Bridge line not used in compact view
export const bridgeLine = style({
    display: 'none',
});

// Table Layout using CSS Grid (Subgrid approach)
export const tableContainer = style({
    width: '100%',
    display: 'grid',
    background: '#fff', // Ensure container has background
});

// The Row (Header or Body Row) acts as the Grid Row
export const tableRow = style({
    display: 'grid',
    // gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', // Fallback
    // Ideally passed via inline style for specific column count
    gridTemplateColumns: '80px 2fr 1fr 100px 120px', // Example static for now, will override in JSX
    alignItems: 'center',
    borderBottom: `1px solid ${zinc[100]}`,
    padding: '0 16px',
    height: '40px',
    background: '#fff', // FIX: Ensure row has background
});


export const cell = style({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '0 8px',
    fontSize: '12px',
    color: zinc[500],
    display: 'flex',
    alignItems: 'center',
});

// Rich Table Cell Styles

export const productCell = style({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
});

export const thumb = style({
    width: 32,
    height: 32,
    borderRadius: 6,
    border: `1px solid ${zinc[200]}`,
    objectFit: 'cover',
    backgroundColor: zinc[100],
});

export const textStack = style({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    lineHeight: 1.2
});

export const subtitle = style({
    fontSize: '11px',
    color: zinc[500],
});

export const stockBarBg = style({
    width: '100%',
    height: 4,
    backgroundColor: zinc[200],
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden'
});

export const stockBarFill = style({
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
});

