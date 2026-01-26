import { style } from '@vanilla-extract/css';

export const container = style({
    display: 'flex',
    height: '100%', // Changed from minHeight: 100vh since it's now nested
    width: '100%',
    backgroundColor: '#f9fafb',
    overflow: 'hidden', // Contain children
});

export const sidebar = style({
    width: '250px',
    borderRight: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    padding: '24px',
    flexShrink: 0,
    overflowY: 'auto', // Allow sidebar to scroll independently if needed
});

export const content = style({
    flex: 1,
    padding: '48px',
    overflowY: 'auto', // Enable scrolling for content area
    height: '100%', // Ensure it takes full height to trigger scroll
});

export const article = style({
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '48px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
});

export const navList = style({
    listStyle: 'none',
    padding: 0,
    margin: 0,
});

export const navLink = style({
    display: 'block',
    padding: '8px 12px',
    color: '#374151',
    textDecoration: 'none',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
    ':hover': {
        backgroundColor: '#f3f4f6',
    },
});

export const sectionTitle = style({
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#6b7280',
    marginTop: '24px',
    marginBottom: '8px',
    paddingLeft: '12px',
});
