import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/design-system/theme.css";

export const shell = style({
    display: 'grid',
    gridTemplateColumns: '260px 1fr 240px', // Sidebar | Content | TOC
    gridTemplateRows: '60px 1fr', // Header | Body
    height: '100vh',
    backgroundColor: vars.color.surface.base,
    color: vars.color.text.primary,
    // fontFamily: vars.font.family.body, // Removed as it doesn't exist in theme yet
});

// Header
export const header = style({
    gridColumn: '1 / -1',
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${vars.space.n24}`,
    borderBottom: `1px solid ${vars.color.border.subtle}`,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    zIndex: 10,
    position: 'sticky',
    top: 0,
});

export const logo = style({
    fontWeight: 700,
    fontSize: vars.font.size.n18,
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.n8,
    textDecoration: 'none',
    color: vars.color.text.primary,
});

// Sidebar
export const sidebar = style({
    gridRow: '2 / -1',
    gridColumn: '1',
    overflowY: 'auto',
    borderRight: `1px solid ${vars.color.border.subtle}`,
    padding: `${vars.space.n32} ${vars.space.n12} ${vars.space.n32} ${vars.space.n24}`,
});

export const navGroup = style({
    marginBottom: vars.space.n32,
});

export const navGroupTitle = style({
    fontSize: vars.font.size.n11,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: vars.color.text.tertiary,
    fontWeight: 600,
    marginBottom: vars.space.n12,
    paddingLeft: vars.space.n12,
});

export const navLink = style({
    display: 'block',
    padding: `${vars.space.n8} ${vars.space.n12}`,
    fontSize: vars.font.size.n14,
    color: vars.color.text.secondary,
    textDecoration: 'none',
    borderRadius: vars.radius.n6,
    transition: 'all 0.2s ease',
    marginBottom: '2px',
    ':hover': {
        color: vars.color.text.primary,
        backgroundColor: vars.color.surface.raised,
    }
});

export const navLinkActive = style({
    color: vars.color.text.primary,
    backgroundColor: vars.color.surface.raised, // Mapped to raised
    fontWeight: 500,
});

globalStyle(`${navLinkActive}:hover`, {
    backgroundColor: vars.color.surface.raised, // Mapped to raised
});

// Main Content
export const main = style({
    gridRow: '2 / -1',
    gridColumn: '2',
    overflowY: 'auto',
    padding: `${vars.space.n48} ${vars.space.n64}`,
    position: 'relative',
});

export const contentContainer = style({
    maxWidth: '768px', // Optimal reading width
    margin: '0 auto',
});

// TOC
export const toc = style({
    gridRow: '2 / -1',
    gridColumn: '3',
    overflowY: 'auto',
    padding: `${vars.space.n48} ${vars.space.n24}`,
    display: 'none',
    '@media': {
        'screen and (min-width: 1200px)': {
            display: 'block',
        }
    }
});

export const tocTitle = style({
    fontSize: vars.font.size.n12,
    fontWeight: 600,
    color: vars.color.text.primary,
    marginBottom: vars.space.n16,
});

export const tocLink = style({
    display: 'block',
    fontSize: vars.font.size.n12,
    color: vars.color.text.secondary,
    textDecoration: 'none',
    marginBottom: vars.space.n8,
    transition: 'color 0.2s',
    ':hover': {
        color: vars.color.text.primary,
    }
});
