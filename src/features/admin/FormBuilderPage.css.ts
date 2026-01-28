import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

// Layout
export const container = style({
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: vars.surface.base.bg,
    color: vars.surface.base.text,
    fontFamily: vars.font.body,
    overflow: 'hidden',
});

export const header = style({
    height: '48px',
    borderBottom: `1px solid ${vars.border.subtle}`,
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${vars.spacing[16]}`,
    justifyContent: 'space-between',
    backgroundColor: vars.surface.base.bg,
    flexShrink: 0,
});

export const workspace = style({
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
});

// Panels
export const leftPanel = style({
    width: '240px',
    borderRight: `1px solid ${vars.border.subtle}`,
    backgroundColor: vars.surface.subtle.bg,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
});

export const centerPanel = style({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: '#F3F4F6', // Slightly gray canvas background
});

export const rightPanel = style({
    width: '300px',
    borderLeft: `1px solid ${vars.border.subtle}`,
    backgroundColor: vars.surface.base.bg,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
});

export const canvas = style({
    flex: 1,
    overflow: 'auto',
    padding: vars.spacing[32],
    backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

export const formContainer = style({
    width: '100%',
    maxWidth: '600px',
    backgroundColor: vars.surface.base.bg,
    borderRadius: vars.borderRadius.md,
    boxShadow: vars.shadow.raised,
    minHeight: '400px',
    padding: vars.spacing[24],
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[16],
    border: `1px solid ${vars.border.subtle}`,
});

// Components
export const panelHeader = style({
    height: '36px',
    borderBottom: `1px solid ${vars.border.subtle}`,
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${vars.spacing[12]}`,
    fontSize: '12px',
    fontWeight: 600,
    color: vars.color.gray600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    justifyContent: 'space-between',
    backgroundColor: vars.surface.base.bg,
});

export const panelContent = style({
    flex: 1,
    overflowY: 'auto',
    padding: vars.spacing[12],
});

export const componentItem = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
    padding: `${vars.spacing[8]} ${vars.spacing[12]}`,
    borderRadius: vars.borderRadius.sm,
    cursor: 'pointer',
    fontSize: '13px',
    color: vars.surface.base.text,
    border: `1px solid transparent`,
    marginBottom: '2px',
    ':hover': {
        backgroundColor: vars.surface.base.hoverBg,
        borderColor: vars.border.subtle,
    }
});

// Canvas Field
export const canvasField = style({
    padding: vars.spacing[16],
    border: `1px solid transparent`,
    borderRadius: vars.borderRadius.sm,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    position: 'relative',
    selectors: {
        '&:hover': {
            backgroundColor: vars.surface.subtle.bg,
            border: `1px dashed ${vars.border.default}`,
        },
        '&[data-selected="true"]': {
            backgroundColor: '#EFF6FF', // Light blue
            border: `1px solid #3B82F6`, // Blue
        }
    }
});

export const fieldLabel = style({
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: vars.spacing[4],
    color: vars.color.gray700,
});

export const fieldInput = style({
    width: '100%',
    padding: '8px 12px',
    borderRadius: vars.borderRadius.sm,
    border: `1px solid ${vars.border.default}`,
    fontSize: '14px',
    backgroundColor: vars.surface.base.bg,
    color: vars.surface.base.text,
    pointerEvents: 'none', // Disable interaction in builder
});

export const fieldHelper = style({
    marginTop: vars.spacing[4],
    fontSize: '11px',
    color: vars.color.gray500,
});

export const requiredBadge = style({
    color: '#EF4444',
    marginLeft: '2px',
});

// Properties
export const propertyRow = style({
    display: 'grid',
    gridTemplateColumns: '100px 1fr',
    gap: vars.spacing[8],
    marginBottom: vars.spacing[12],
    alignItems: 'center',
    fontSize: '12px',
});

export const propertyLabel = style({
    color: vars.color.gray600,
});

export const propertyInput = style({
    width: '100%',
    padding: '4px 8px',
    borderRadius: '4px',
    border: `1px solid ${vars.border.subtle}`,
    fontSize: '12px',
    backgroundColor: vars.surface.input.bg,
    color: vars.surface.input.text,
    outline: 'none',
    ':focus': {
        borderColor: '#3B82F6',
    }
});
