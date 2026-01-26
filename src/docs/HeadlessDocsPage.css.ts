
import { style } from "@vanilla-extract/css";
import { vars } from "@/design-system/theme.css";

// Layout
export const pageContainer = style({
    display: 'grid',
    gridTemplateColumns: '280px 1fr', // Sidebar | Main
    gridTemplateRows: '100vh',
    backgroundColor: vars.color.surface.base,
    isolation: 'isolate', // Create stacking context
});

export const mainContent = style({
    overflow: 'hidden',
    // Use subgrid if we want deeper alignment, but here just filling the cell is fine.
    // Actually, for future proofing, if we wanted global lines, we'd use subgrid.
});

export const centerMessage = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: vars.color.text.tertiary,
});

// Sidebar
export const sidebar = style({
    // Removed absolute width since it's controlled by grid track
    borderRight: `1px solid ${vars.color.border.subtle}`,
    height: '100%',
    overflowY: 'auto',
    padding: vars.space.n16,
});

export const sidebarHeader = style({
    fontSize: vars.font.size.n14,
    fontWeight: vars.font.weight.bold,
    color: vars.color.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: vars.space.n24,
    letterSpacing: '0.05em',
});

export const categoryGroup = style({
    marginBottom: vars.space.n24,
});

export const categoryTitle = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.n8,
    marginBottom: vars.space.n8,
    color: vars.color.text.secondary,
    fontWeight: vars.font.weight.medium,
});

export const categoryList = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.n4,
    paddingLeft: vars.space.n24,
});

export const navLink = style({
    textDecoration: 'none',
    color: vars.color.text.tertiary,
    fontSize: vars.font.size.n14,
    padding: `${vars.space.n6} ${vars.space.n8}`,
    borderRadius: vars.radius.n6,
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.n8,
    transition: 'background 0.2s',
    ':hover': {
        backgroundColor: vars.color.surface.raised,
        color: vars.color.text.primary,
    }
});

// Hook Detail
export const detailContainer = style({
    padding: vars.space.n32,
    height: '100%',
    overflowY: 'auto',
});

export const header = style({
    marginBottom: vars.space.n32,
});

export const title = style({
    fontSize: vars.font.size.n32,
    fontWeight: vars.font.weight.bold,
    color: vars.color.text.primary,
    marginBottom: vars.space.n8,
});

export const subtitle = style({
    color: vars.color.text.tertiary,
    fontSize: vars.font.size.n14,
    fontFamily: 'monospace',
});

export const section = style({
    marginBottom: vars.space.n40,
});

export const description = style({
    fontSize: vars.font.size.n16,
    lineHeight: 1.6,
    color: vars.color.text.secondary,
});

export const sectionTitle = style({
    fontSize: vars.font.size.n20,
    fontWeight: vars.font.weight.bold,
    marginBottom: vars.space.n16,
});

export const paramGrid = style({
    display: 'grid',
    gap: vars.space.n12,
    gridTemplateColumns: 'max-content max-content 1fr', // Name | Separator | Desc
    alignItems: 'baseline',
});

// We render parameters as flat list items in React to use this grid effectively,
// OR we use subgrid on the card if we stick to card structure.
// Let's use subgrid on the card to align internals across all cards.
export const paramCard = style({
    display: 'grid',
    gridTemplateColumns: 'subgrid',
    gridColumn: '1 / -1',
    padding: vars.space.n16,
    backgroundColor: vars.color.surface.sunken,
    borderRadius: vars.radius.n8,
    border: `1px solid ${vars.color.border.subtle}`,
    alignItems: 'baseline',
});

export const codeLabel = style({
    fontWeight: 'bold',
    color: vars.color.text.primary,
});

export const codeSeparator = style({
    margin: `0 ${vars.space.n8}`,
    color: vars.color.text.tertiary,
});

export const paramDesc = style({
    color: vars.color.text.secondary,
});

export const codeBlockContainer = style({
    borderRadius: vars.radius.n12,
    overflow: 'hidden',
    border: `1px solid ${vars.color.border.subtle}`,
});

export const viewSourceSummary = style({
    padding: vars.space.n12,
    cursor: 'pointer',
    backgroundColor: vars.color.surface.raised,
});
