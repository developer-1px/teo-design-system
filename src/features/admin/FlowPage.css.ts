import { style, keyframes } from '@vanilla-extract/css';

const zinc = {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
};

// Layout
export const container = style({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: zinc[900],
});

export const topBar = style({
    height: '56px',
    borderBottom: `1px solid ${zinc[200]}`,
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: '16px',
    background: '#fff',
    zIndex: 10,
});

export const methodBadge = style({
    fontSize: '11px',
    fontWeight: 800,
    background: zinc[900],
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
});

export const urlText = style({
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '13px',
    color: zinc[600],
});

export const playButton = style({
    marginLeft: 'auto',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: 'full', // Capsule
    padding: '6px 20px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
    transition: 'all 0.2s',
    ':hover': {
        background: '#059669',
        transform: 'translateY(-1px)',
    }
});

// Main Flow Area
export const flowContainer = style({
    flex: 1,
    display: 'grid',
    // 3 Columns: Source (25%) -> Transform/Schema (30%) -> Preview (Rest)
    gridTemplateColumns: 'minmax(280px, 25%) 30% 1fr',
    overflow: 'hidden',
    background: zinc[50], // Subtle grey background for the "canvas" feel
});

// Column Styles
const columnBase = style({
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${zinc[200]}`,
    position: 'relative',
    transition: 'all 0.3s ease',
});

export const sourceCol = style([columnBase, { background: '#fff' }]);
export const logicCol = style([columnBase, { background: '#fff' }]);
export const previewCol = style([columnBase, { borderRight: 'none', background: zinc[50] }]);

// Column Headers
export const colHeader = style({
    padding: '16px 20px',
    fontSize: '11px',
    fontWeight: 700,
    color: zinc[400],
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: `1px solid ${zinc[100]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

// Scrollable Content
export const scrollArea = style({
    flex: 1,
    overflowY: 'auto',
    padding: '0',
});

// --- Node Items (The "Cards" in the flow) ---

// 1. Source JSON Nodes
export const jsonNode = style({
    padding: '12px 20px',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '12px',
    borderBottom: `1px solid ${zinc[100]}`,
    cursor: 'pointer',
    transition: 'background 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
        background: zinc[50],
    },
    selectors: {
        '&[data-active="true"]': {
            background: '#eff6ff', // blue-50
            borderLeft: '3px solid #3b82f6',
        }
    }
});

export const jsonKey = style({ color: zinc[800], fontWeight: 500 });
export const jsonVal = style({ color: zinc[400] });

// 2. Logic/Schema Cards
export const logicCard = style({
    margin: '12px 20px',
    padding: '16px',
    background: '#fff',
    border: `1px solid ${zinc[200]}`,
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    transition: 'all 0.2s',
    cursor: 'pointer',
    position: 'relative',
    ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        borderColor: zinc[300],
    },
    selectors: {
        '&[data-active="true"]': {
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
        }
    }
});

// Connecting Line (Pseudo)
export const bridgeLine = style({
    position: 'absolute',
    left: '-21px', // Bridge gap
    top: '50%',
    width: '20px',
    height: '2px',
    background: zinc[300],
    display: 'none', // Hidden by default
    selectors: {
        [`${logicCard}[data-active="true"] &`]: {
            display: 'block',
            background: '#3b82f6',
        }
    }
});

export const cardTitle = style({
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
});

export const propertyRow = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '11px',
    marginBottom: '8px',
    color: zinc[500],
    ':last-child': { marginBottom: 0 }
});

export const select = style({
    padding: '4px 8px',
    borderRadius: '4px',
    border: `1px solid ${zinc[200]}`,
    fontSize: '11px',
    outline: 'none',
    background: zinc[50],
    cursor: 'pointer',
    ':focus': {
        borderColor: zinc[400],
    }
});

// 3. Preview
export const previewStage = style({
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100%',
});

export const previewCard = style({
    width: '100%',
    maxWidth: '500px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Big shadow for "Float" effect
    overflow: 'hidden',
    border: `1px solid ${zinc[100]}`,
});

export const previewHeader = style({
    padding: '16px',
    borderBottom: `1px solid ${zinc[100]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fafafa',
});

export const previewBody = style({
    padding: '24px',
});

// Animated flow line
const flowAnim = keyframes({
    '0%': { backgroundPosition: '0% 50%' },
    '100%': { backgroundPosition: '100% 50%' }
});

export const flowStatus = style({
    fontSize: '11px',
    fontWeight: 600,
    color: '#10b981',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: '#ecfdf5',
    borderRadius: '20px',
});
