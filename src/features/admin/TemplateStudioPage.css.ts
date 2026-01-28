import { style } from '@vanilla-extract/css';

const zinc = {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
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
    color: zinc[900],
    fontFamily: 'Inter, system-ui, sans-serif',
});

export const topBar = style({
    height: '48px',
    borderBottom: `1px solid ${zinc[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    flexShrink: 0,
});

export const mainLayout = style({
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
});

// Panels
export const sidebar = style({
    width: '280px',
    borderRight: `1px solid ${zinc[200]}`,
    display: 'flex',
    flexDirection: 'column',
    background: zinc[50],
});

export const canvas = style({
    flex: 1,
    background: zinc[100],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px',
    overflowY: 'auto',
});

export const inspector = style({
    width: '320px',
    borderLeft: `1px solid ${zinc[200]}`,
    background: '#fff',
    padding: '20px',
});

// UI Atoms List
export const sectionTitle = style({
    fontSize: '11px',
    fontWeight: 700,
    color: zinc[400],
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '20px 20px 10px',
});

export const atomItem = style({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 20px',
    fontSize: '13px',
    color: zinc[700],
    cursor: 'grab',
    transition: 'all 0.2s',
    ':hover': {
        background: zinc[100],
        color: zinc[900],
    },
});

// Canvas Preview Component
export const tablePreviewFrame = style({
    width: '100%',
    maxWidth: '800px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    border: `1px solid ${zinc[200]}`,
    overflow: 'hidden',
});

export const rowPreview = style({
    padding: '16px 24px',
    borderBottom: `1px solid ${zinc[100]}`,
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    ':last-child': {
        borderBottom: 'none',
    },
});

// Atomic UI Elements (The Atoms)
export const atomAvatar = style({
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: zinc[200],
    flexShrink: 0,
});

export const atomTextMain = style({
    fontSize: '14px',
    fontWeight: 600,
    color: zinc[900],
});

export const atomTextSub = style({
    fontSize: '12px',
    color: zinc[500],
});

export const atomBadge = style({
    fontSize: '11px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '9999px',
    background: zinc[100],
    color: zinc[700],
    border: `1px solid ${zinc[200]}`,
});

// Layout Molecules
export const vstack = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
});

export const hstack = style({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
});

// Inspector UI
export const propField = style({
    marginBottom: '16px',
});

export const label = style({
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: zinc[500],
    marginBottom: '6px',
});

export const input = style({
    width: '100%',
    padding: '8px 10px',
    fontSize: '13px',
    border: `1px solid ${zinc[200]}`,
    borderRadius: '6px',
    outline: 'none',
    ':focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
    },
});

export const chip = style({
    padding: '4px 8px',
    background: zinc[100],
    borderRadius: '4px',
    fontSize: '11px',
    color: zinc[500],
    border: 'none',
    cursor: 'pointer',
    marginRight: '4px',
    ':hover': {
        background: zinc[200],
    }
});
