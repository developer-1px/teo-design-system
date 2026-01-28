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
    950: '#09090b',
};

// Layout
export const container = style({
    display: 'grid',
    gridTemplateColumns: '240px 1fr 320px',
    gridTemplateRows: '48px 1fr',
    height: '100%',
    backgroundColor: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: zinc[900],
    overflow: 'hidden',
});

// Header
export const header = style({
    gridColumn: '1 / -1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    borderBottom: `1px solid ${zinc[200]}`,
    background: '#fff',
    zIndex: 10,
});

export const logo = style({
    fontWeight: 600,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
});

// Panels
export const sidebar = style({
    borderRight: `1px solid ${zinc[200]}`,
    background: zinc[50],
    display: 'flex',
    flexDirection: 'column',
});

export const main = style({
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    overflow: 'hidden',
});

export const rightPanel = style({
    borderLeft: `1px solid ${zinc[200]}`,
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
});

// Sidebar Items
export const sidebarHeader = style({
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: zinc[500],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const navItem = style({
    padding: '6px 16px',
    fontSize: '13px',
    color: zinc[700],
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
        background: zinc[100],
    },
});

export const navItemActive = style({
    background: zinc[200],
    color: zinc[900],
    fontWeight: 500,
});

export const methodBadge = style({
    fontSize: '9px',
    fontWeight: 700,
    padding: '2px 4px',
    borderRadius: '3px',
    minWidth: '32px',
    textAlign: 'center',
});

// Main Stage Components
export const urlBar = style({
    padding: '12px 16px',
    borderBottom: `1px solid ${zinc[200]}`,
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    background: '#fff',
});

export const inputGroup = style({
    display: 'flex',
    flex: 1,
    border: `1px solid ${zinc[300]}`,
    borderRadius: '6px',
    overflow: 'hidden',
    alignItems: 'center',
    background: zinc[50], // Input bg
    transition: 'border-color 0.15s',
    selectors: {
        '&:focus-within': {
            borderColor: zinc[500],
            outline: 'none',
        }
    }
});

export const methodSelect = style({
    border: 'none',
    background: 'transparent',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 600,
    color: zinc[700],
    cursor: 'pointer',
    borderRight: `1px solid ${zinc[200]}`,
    height: '100%',
    outline: 'none',
});

export const urlInput = style({
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: '8px 12px',
    fontSize: '13px',
    color: zinc[900],
    outline: 'none',
    width: '100%',
});

export const sendButton = style({
    background: zinc[900],
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0 20px',
    height: '36px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s',
    ':hover': {
        background: zinc[800],
    }
});

// Tabs
export const tabs = style({
    display: 'flex',
    padding: '0 16px',
    borderBottom: `1px solid ${zinc[200]}`,
    gap: '24px',
});

export const tab = style({
    padding: '12px 0',
    fontSize: '13px',
    color: zinc[500],
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'color 0.15s',
    ':hover': {
        color: zinc[900],
    }
});

export const activeTab = style({
    color: zinc[900],
    fontWeight: 500,
    borderBottom: `2px solid ${zinc[900]}`,
});

// Content Area
export const contentArea = style({
    flex: 1,
    padding: '0',
    overflowY: 'auto',
    background: zinc[50],
});

export const sectionHeader = style({
    padding: '12px 16px',
    borderBottom: `1px solid ${zinc[200]}`,
    fontSize: '12px',
    fontWeight: 600,
    color: zinc[500],
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const codeBlock = style({
    padding: '16px',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: '12px',
    lineHeight: '1.5',
    color: zinc[800],
});

// Right Panel
export const previewHeader = style({
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 600,
    borderBottom: `1px solid ${zinc[200]}`,
});

export const previewBody = style({
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    background: zinc[50],
});

// Schema Visualizer styles
export const schemaRow = style({
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderBottom: `1px solid ${zinc[200]}`,
    background: '#fff',
    gap: '12px',
    fontSize: '13px',
});

export const keyName = style({
    fontFamily: 'monospace',
    color: zinc[700],
    minWidth: '120px',
});

export const typeBadge = style({
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    background: zinc[100],
    color: zinc[500],
    border: `1px solid ${zinc[200]}`,
    textTransform: 'uppercase',
});

export const arrowRight = style({
    color: zinc[400],
});

export const uiComponentSelect = style({
    padding: '4px 8px',
    borderRadius: '4px',
    border: `1px solid ${zinc[300]}`,
    fontSize: '12px',
    color: zinc[800],
    background: '#fff',
});
