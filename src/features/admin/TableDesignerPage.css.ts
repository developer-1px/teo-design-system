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

// Sidebar
export const sidebar = style({
    width: '300px',
    borderRight: `1px solid ${zinc[200]}`,
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    padding: '24px',
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
    overflow: 'hidden',
});

// Native Grid Table
export const gridTable = style({
    display: 'grid',
    width: '100%',
    gridTemplateColumns: 'minmax(240px, 2fr) minmax(130px, 1fr) minmax(180px, 1.5fr) minmax(100px, 1fr) minmax(120px, 1fr)',
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
    marginLeft: 'auto',
    ':hover': {
        background: 'rgba(0,0,0,0.05)',
    },
    selectors: {
        [`${headerCell}:hover &`]: {
            opacity: 1,
        }
    }
});




export const bodyRow = style({
    display: 'contents', // Let grid handle it
});

export const cell = style({
    padding: '16px',
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

export const selectedCell = style({
    background: '#f8fafc !important',
    boxShadow: `inset 1px 0 0 #3b82f611, inset -1px 0 0 #3b82f611`,
});

export const selectedHeader = style({
    background: '#eff6ff !important',
    color: '#3b82f6 !important',
});

export const checkbox = style({
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: `1px solid ${zinc[300]}`,
    cursor: 'pointer',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.1s',
    selectors: {
        '&[data-state="checked"]': {
            background: '#3b82f6',
            borderColor: '#3b82f6',
            color: '#fff',
        }
    }
});



// Atomic Components within table
export const badge = style({
    padding: '2px 8px',
    borderRadius: 6,
    fontSize: '11px',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
});

export const avatar = style({
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: zinc[100],
    objectFit: 'cover',
    flexShrink: 0,
});

export const assetThumb = style({
    width: 56,
    height: 40,
    borderRadius: 6,
    overflow: 'hidden',
    background: zinc[100],
    border: `1px solid ${zinc[200]}`,
    display: 'flex',
    flexShrink: 0,
});

export const textStack = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflow: 'hidden',
});

export const primaryText = style({
    fontWeight: 600,
    color: zinc[900],
    fontSize: '13px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

export const secondaryText = style({
    fontSize: '11px',
    color: zinc[400],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

// Inspector UI
export const sectionLabel = style({
    fontSize: '11px',
    fontWeight: 700,
    color: zinc[500],
    marginBottom: '12px',
    marginTop: '24px',
    textTransform: 'uppercase',
});

export const controlGroup = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
});

export const selectField = style({
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: `1px solid ${zinc[200]}`,
    fontSize: '13px',
});

// Toolbar
export const toolbar = style({
    width: '100%',
    maxWidth: '1100px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
});

export const searchWrapper = style({
    position: 'relative',
    flex: 1,
    maxWidth: '300px',
    marginRight: '12px',
});

export const searchInput = style({
    width: '100%',
    padding: '8px 12px 8px 32px',
    borderRadius: '8px',
    border: `1px solid ${zinc[200]}`,
    fontSize: '13px',
    background: '#fff',
    outline: 'none',
    ':focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
    }
});

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

export const sidebarFooter = style({
    marginTop: 'auto',
    paddingTop: '20px',
    borderTop: `1px solid ${zinc[100]}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
});

export const paletteItem = style({
    padding: '10px',
    border: `1px solid ${zinc[200]}`,
    borderRadius: '8px',
    background: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12px',
    transition: 'all 0.1s',
    ':hover': {
        borderColor: '#3b82f6',
        background: '#3b82f605',
    }
});

export const pagination = style({
    width: '100%',
    padding: '12px 24px',
    borderTop: `1px solid ${zinc[100]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: zinc[500],
    background: '#fff',
});




