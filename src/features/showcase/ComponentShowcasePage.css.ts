import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { typography } from '../../styles/prose.css';

export const container = style({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    backgroundColor: vars.color.gray50,
});

export const contentWrapper = style({
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: vars.spacing[32],
    display: 'flex',
    flexDirection: 'column',
    // Removed global gap to allow specific spacing control
});

export const header = style({
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[16],
});

export const title = style([
    typography.h1,
    {
        marginBottom: 0,
    }
]);

export const subtitle = style([
    typography.body,
    {
        fontSize: vars.fontSize.lg,
        color: vars.color.gray600,
    }
]);

export const sectionTitle = style([
    typography.h2,
    {
        borderBottom: `1px solid ${vars.border.default}`,
        paddingBottom: vars.spacing[8],
        marginTop: vars.spacing[48],
        marginBottom: vars.spacing[24],
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

export const spanTwo = style({
    gridColumn: 'span 2',
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

export const controlGroup = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[8],
});

export const controlRow = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
});

export const inputStack = style({
    display: 'grid',
    gap: vars.spacing[16],
});

export const inputGrid = style({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: vars.spacing[16],
});

export const label = style({
    fontSize: vars.fontSize.sm,
    color: vars.color.gray600,
    minWidth: '80px',
});

export const labelWithMargin = style([
    label,
    {
        marginBottom: vars.spacing[8],
        display: 'block',
    }
]);

export const tabGroup = style({
    marginTop: vars.spacing[16],
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[8],
});

export const treeContainer = style({
    maxHeight: '320px',
    overflow: 'auto',
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.borderRadius.sm,
    backgroundColor: vars.color.white,
    padding: vars.spacing[8], // Add padding to avoid contact
});
