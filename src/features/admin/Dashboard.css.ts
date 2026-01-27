import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const dashboardContainer = style({
    padding: vars.spacing[24],
    backgroundColor: '#F5F5F5', // Classic Admin Background
    minHeight: '100%',
});

export const dashboardHeader = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vars.spacing[24],
});

export const statsGrid = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // 4-column metrics
    gap: vars.spacing[16],
    marginBottom: vars.spacing[24],
});

export const statCard = style({
    backgroundColor: vars.surface.card.bg,
    borderRadius: vars.borderRadius.sm,
    padding: vars.spacing[16],
    border: `1px solid ${vars.border.subtle}`,
    boxShadow: vars.shadow.raised,
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[8],
});

export const statLabel = style({
    fontSize: '12px',
    color: vars.color.gray600,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
});

export const statValue = style({
    fontSize: '24px',
    fontWeight: 600,
    color: vars.color.gray800,
});

export const statTrend = style({
    fontSize: '11px',
    alignSelf: 'flex-start',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 500,
});

// Section for Charts/Tables
export const contentSection = style({
    backgroundColor: vars.surface.card.bg,
    borderRadius: vars.borderRadius.sm,
    border: `1px solid ${vars.border.subtle}`,
    boxShadow: vars.shadow.raised,
    padding: vars.spacing[24],
    marginBottom: vars.spacing[24],
});

export const sectionTitle = style({
    fontSize: '14px',
    fontWeight: 600,
    color: vars.color.gray800,
    marginBottom: vars.spacing[16],
});
