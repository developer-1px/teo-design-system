import { style } from '@vanilla-extract/css';
import { vars } from '../styles/vars.css';

export const container = style({
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: vars.surface.base.bg,
    // Ensure it fills the screen
    position: 'relative'
});

export const content = style({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto', // Allow scrolling for the main content
});

export const contentInner = style({
    display: 'flex',
    flex: 1,
    maxWidth: '1200px', // Limit reading width
    margin: '0 auto',
    width: '100%',
    padding: vars.spacing[24], // large
    gap: vars.spacing[32] // xlarge
});

export const sidebar = style({
    width: '220px', // slightly more compact
    borderRight: `1px solid ${vars.color.border}`,
    padding: vars.spacing[16], // compact padding
    overflowY: 'auto',
    height: '100vh',
    position: 'sticky',
    top: 0,
    backgroundColor: vars.surface.subtle.bg,
    flexShrink: 0
});

export const sectionTitle = style({
    fontSize: vars.fontSize.xs, // 11px
    fontWeight: 600,
    textTransform: 'uppercase',
    color: vars.color.mutedForeground,
    marginBottom: vars.spacing[4], // 4px
    marginTop: vars.spacing[16], // 16px instead of 24px
    letterSpacing: '0.05em',
    ':first-child': {
        marginTop: 0
    }
});

export const navList = style({
    listStyle: 'none',
    padding: 0,
    margin: 0
});

export const navLink = style({
    display: 'block',
    padding: `${vars.spacing[4]} ${vars.spacing[8]}`, // even tighter padding
    color: vars.color.mutedForeground,
    textDecoration: 'none',
    borderRadius: vars.borderRadius.sm, // smaller radius for tighter items
    marginBottom: '1px',
    fontSize: vars.fontSize.sm, // 12px
    transition: 'all 0.1s ease',
    ':hover': {
        color: vars.color.primary,
        backgroundColor: vars.color.accent
    },
    selectors: {
        '&.active': {
            color: vars.color.primary,
            backgroundColor: vars.color.accent,
            fontWeight: 500
        }
    }
});

export const article = style({
    flex: 1,
    minWidth: 0, // Flex child fix
    paddingBottom: '100px'
});

export const tocWrapper = style({
    width: '240px',
    flexShrink: 0,
    '@media': {
        'screen and (max-width: 1024px)': {
            display: 'none'
        }
    }
});
