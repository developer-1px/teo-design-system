import { style } from '@vanilla-extract/css';

export const plistContainer = style({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    background: '#fff',
    borderTop: '1px solid #e4e4e7',
    borderBottom: '1px solid #e4e4e7',
    fontFamily: '"JetBrains Mono", monospace',
});

// Row Styles
export const plistRow = style({
    display: 'flex',
    borderBottom: '1px solid #f1f5f9',
    minHeight: '34px',
    transition: 'background 0.1s ease',
    cursor: 'default',
    ':last-child': {
        borderBottom: 'none',
    },
    ':hover': {
        background: '#f8fafc !important',
    },
    selectors: {
        '&[data-depth="0"]': { background: '#fff' },
        '&[data-depth="1"]': { background: '#fcfcfd' },
        '&[data-depth="2"]': { background: '#f9fafb' },
        '&[data-depth="3"]': { background: '#f3f4f6' },
    }
});

// Key Column
export const plistKey = style({
    flex: '0 0 160px',
    padding: '8px 16px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#475569',
    borderRight: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
});

// Type Column (Optional center column)
export const plistType = style({
    flex: '0 0 70px',
    padding: '8px 12px',
    fontSize: '9px',
    fontWeight: 800,
    color: '#94a3b8',
    borderRight: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fcfcfd',
    textTransform: 'uppercase',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
});

// Value Column
export const plistValue = style({
    flex: 1,
    padding: '8px 16px',
    fontSize: '11px',
    fontWeight: 500,
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
});

// Semantic Value Types (Optional, can be used by JsonViewer)
export const valueString = style({ color: '#1e293b' });
export const valueNumber = style({ color: '#0ea5e9', fontWeight: 700 });
export const valueBoolean = style({ color: '#f43f5e', fontWeight: 700 });
export const valueNull = style({ color: '#94a3b8', fontStyle: 'italic' });
export const typeBadge = style({
    fontSize: '9px',
    fontWeight: 700,
    background: '#f1f5f9',
    color: '#94a3b8',
    padding: '2px 4px',
    borderRadius: '3px',
});
