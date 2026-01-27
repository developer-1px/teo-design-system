import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { typography } from '../../styles/prose.css';

export const container = style({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    backgroundColor: vars.color.gray50, // Ensure background fills scroll area
});

// Wrapper to center content with max-width
export const contentWrapper = style({
    width: '100%',
    maxWidth: '1000px', // Restrict width for readability
    margin: '0 auto',
    padding: vars.spacing[32],
    display: 'flex',
    flexDirection: 'column',
});

export const header = style({
    marginBottom: vars.spacing[48],
    // textAlign: 'center', // Left align
});

export const title = style([
    typography.h1,
    {
        marginBottom: vars.spacing[16],
        // textAlign: 'center', // Removed to align with Prose left-alignment
    }
]);

export const subtitle = style([
    typography.body,
    {
        fontSize: vars.fontSize.lg,
        color: vars.color.gray600,
        // textAlign: 'center', // Removed
    }
]);

export const sectionTitle = style([
    typography.h2,
    {
        borderBottom: `1px solid ${vars.border.default}`, // Keep existing solid border if desired
    }
]);

export const grid = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: vars.spacing[24],
});

export const card = style({
    background: vars.surface.card.bg,
    border: vars.surface.card.border,
    borderRadius: vars.borderRadius.lg,
    padding: vars.spacing[24],
    boxShadow: vars.surface.card.shadow,
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[16],
});

export const cardTitle = style({
    fontSize: vars.fontSize.lg,
    fontWeight: vars.weight.medium,
    color: vars.color.gray800,
    marginBottom: vars.spacing[8],
    borderBottom: `1px solid ${vars.border.subtle}`,
    paddingBottom: vars.spacing[8],
});

export const componentRow = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[16],
    flexWrap: 'wrap',
});

export const label = style({
    fontSize: vars.fontSize.sm,
    color: vars.color.gray600,
    minWidth: '80px',
});
