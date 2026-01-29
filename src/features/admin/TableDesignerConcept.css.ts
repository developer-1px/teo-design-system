import { style } from '@vanilla-extract/css';

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

export const container = style({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    fontFamily: 'Inter, system-ui, sans-serif',
});

export const topBar = style({
    height: '56px',
    borderBottom: `1px solid ${zinc[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    background: '#fff',
    zIndex: 10,
});

export const mainLayout = style({
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    background: zinc[50], // Canvas background
});

// Canvas Area (The Table Stage)
export const canvas = style({
    flex: 1,
    padding: '40px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

export const tableWrapper = style({
    width: '100%',
    maxWidth: '1100px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    border: `1px solid ${zinc[200]}`,
    position: 'relative',
    zIndex: 0,
});

// Native Grid Table
export const gridTable = style({
    display: 'grid',
    width: '100%',
    // Columns will be defined inline via style={{ gridTemplateColumns }}
});

export const headerCell = style({
    position: 'relative',
    padding: '12px 16px',
    background: '#fafafa',
    borderBottom: `1px solid ${zinc[200]}`,
    fontSize: '11px',
    fontWeight: 700,
    color: zinc[400],
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.2s',
    selectors: {
        [`&:hover`]: {
            background: zinc[100],
            color: zinc[900],
        }
    }
});

export const shyTrigger = style({
    opacity: 0,
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    ':hover': {
        background: 'rgba(0,0,0,0.05)',
    },
    selectors: {
        [`${headerCell}:hover &`]: {
            opacity: 1,
        }
    }
});

export const cell = style({
    padding: '12px 16px', // Reduced vertical padding for tighter table
    borderBottom: `1px solid ${zinc[100]}`,
    fontSize: '13px',
    color: zinc[700],
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    transition: 'all 0.1s',
    cursor: 'pointer',
    selectors: {
        '&:hover': {
            background: '#fafafa',
        }
    }
});

export const selectedHeader = style({
    background: '#eff6ff !important',
    color: '#3b82f6 !important',
});

// Atomic Components within table
export const badge = style({
    padding: '2px 8px',
    borderRadius: 6, // Slightly clearer shape than full pill
    fontSize: '11px',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
});

// Chip Button
export const chip = style({
    padding: '6px 12px',
    borderRadius: '8px',
    border: `1px solid ${zinc[200]}`,
    background: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    color: zinc[700],
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.1s',
    ':hover': {
        background: zinc[50],
        borderColor: zinc[300],
    }
});

// Context Menu
export const contextMenu = style({
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: '0',
    minWidth: '180px',
    background: '#fff',
    padding: '4px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    zIndex: 100,
    border: `1px solid ${zinc[200]}`,
    transformOrigin: 'top left',
});

export const menuItem = style({
    padding: '6px 8px',
    borderRadius: '6px',
    color: zinc[600],
    fontSize: '12px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.1s',
    ':hover': {
        background: zinc[100],
        color: zinc[900],
    },
    selectors: {
        '&[data-active="true"]': {
            background: '#eff6ff',
            color: '#3b82f6',
        },
        '&[data-danger="true"]:hover': {
            background: '#fee2e2',
            color: '#ef4444',
        }
    }
});

// Inline Edit Input
export const inlineInput = style({
    all: 'unset',
    width: '100%',
    fontSize: '11px',
    fontWeight: 700,
    color: zinc[900],
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: '#fff',
    padding: '0 4px',
    borderRadius: '4px',
    boxShadow: `0 0 0 2px #3b82f6`,
});

// Slash Command Overlay
export const slashOverlay = style({
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    width: '240px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: `1px solid ${zinc[200]}`,
    zIndex: 100,
    overflow: 'hidden',
    padding: '4px',
    animation: 'fadeIn 0.1s ease-out',
});

export const commandItem = style({
    padding: '8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: zinc[700],
    cursor: 'pointer',
    transition: 'all 0.1s',
    ':hover': {
        background: zinc[100],
        color: zinc[900],
    }
});
