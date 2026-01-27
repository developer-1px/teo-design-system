import { style } from '@vanilla-extract/css';
import { vars } from '../styles/vars.css';
import { ui } from '../styles/utils';

export const container = style([
    {
        display: 'flex',
        height: '100%',
        width: '100%',
        backgroundColor: vars.surface.base.bg, // Cleaner white/dark background
        overflow: 'hidden',
    }
]);

// Keyline: 48px from top for all sections

export const sidebar = style({
    width: '240px', // Slightly wider for better breathing room
    borderRight: '1px solid rgba(0,0,0,0.04)', // Subtle separator
    backgroundColor: vars.surface.base.bg,
    padding: `${vars.spacing[48]} ${vars.spacing[16]} ${vars.spacing[16]}`, // Top padding 48px
    flexShrink: 0,
    overflowY: 'auto',
});

export const content = style({
    flex: 1,
    overflowY: 'auto',
    height: '100%',
    scrollBehavior: 'smooth',
});

// Main Content Layout using CSS Grid/Subgrid Pattern
// [ Sidebar (Fixed) ] [ . . . . . . Main Content Area . . . . . . ]
//                     [ Gap ] [ Content (Prose) ] [ Gap ] [ TOC ]

// Main Content Layout
export const contentInner = style({
    maxWidth: '1400px', // Wider to accommodate TOC and breakout content
    margin: '0 auto',
    padding: `${vars.spacing[48]} ${vars.spacing[32]}`,

    display: 'flex', // Back to Flex for sidebar/content separation
    gap: '64px', // More space between content and TOC
    alignItems: 'flex-start',
    justifyContent: 'center', // Center the whole block
});

export const article = style({
    flex: 1,
    minWidth: 0,
    // No conflicting display: grid here. Let Markdown.css.ts handle the prose grid.
});

export const tocWrapper = style({
    width: '240px',
    flexShrink: 0,
    position: 'sticky',
    top: vars.spacing[48],

    '@media': {
        'screen and (max-width: 1280px)': {
            display: 'none', // Hide TOC earlier if screen is too narrow
        }
    }
});

export const navList = style({
    listStyle: 'none',
    padding: 0,
    margin: 0,
});

export const navLink = style({
    display: 'block',
    padding: `${vars.spacing[4]} ${vars.spacing[8]}`, // Reduced from 8 12
    fontSize: vars.fontSize.sm, // Smaller font for compact look
    color: vars.surface.base.text,
    textDecoration: 'none',
    borderRadius: '4px', // Reduced radius
    // transition: 'all 0.2s', // Removed animation as requested
    ':hover': {
        backgroundColor: vars.surface.subtle.bg,
    },
    selectors: {
        '&.active': {
            backgroundColor: vars.color.gray100, // Monochrome Active BG
            color: vars.color.gray800, // Monochrome Active Text (Black/Zinc-900)
            fontWeight: vars.weight.medium,
        }
    }
});

export const sectionTitle = style([
    ui.overline(),
    {
        color: '#6b7280',
        marginTop: vars.spacing[40],
        marginBottom: vars.spacing[8],
        paddingLeft: vars.spacing[8],
        selectors: {
            '&:first-child': {
                marginTop: 0,
            }
        }
    }
]);
