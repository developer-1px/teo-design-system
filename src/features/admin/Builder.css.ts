import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

// Retool-like IDE Layout
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
    overflow: 'hidden', // Panels scroll individually
});

export const leftPanel = style({
    width: '240px',
    borderRight: `1px solid ${vars.border.subtle}`,
    backgroundColor: vars.surface.subtle.bg, // Slightly distinct
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
});

export const centerPanel = style({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: '#F7F7F7', // Canvas background often slightly gray in builders
});

export const canvas = style({
    flex: 1,
    overflow: 'auto',
    padding: vars.spacing[32],
    backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)', // Dot grid
    backgroundSize: '20px 20px',
});

export const bottomPanel = style({
    height: '300px',
    borderTop: `1px solid ${vars.border.subtle}`,
    backgroundColor: vars.surface.base.bg,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
});

export const rightPanel = style({
    width: '300px',
    borderLeft: `1px solid ${vars.border.subtle}`,
    backgroundColor: vars.surface.base.bg,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
});

// Utilities for panel sections
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
    cursor: 'grab',
    fontSize: '13px',
    color: vars.surface.base.text,
    border: `1px solid transparent`,
    ':hover': {
        backgroundColor: vars.surface.base.hoverBg,
        borderColor: vars.border.subtle,
        boxShadow: vars.shadow.raised,
    }
});

// Property Row
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
});

// Mock Canvas Item
export const canvasWidget = style({
    backgroundColor: vars.surface.card.bg,
    border: `1px solid ${vars.border.default}`,
    borderRadius: vars.borderRadius.sm,
    padding: vars.spacing[16],
    position: 'relative',
    marginBottom: vars.spacing[16],
    boxShadow: vars.shadow.raised,
    cursor: 'pointer',
    borderWidth: '1px', // ensure default width
    selectors: {
        '&[data-selected="true"]': {
            outline: `2px solid #22c55e`, // Retool green
            zIndex: 10,
        },
        ':hover': {
            outline: `1px solid #22c55e`, // Hover hint
        }
    }
});

export const widgetHeader = style({
    fontSize: '11px',
    color: vars.color.gray600,
    marginBottom: vars.spacing[8],
    display: 'flex',
    justifyContent: 'space-between',
    pointerEvents: 'none', // Allow click through to widget container
});

export const resizeHandle = style({
    position: 'absolute',
    width: '8px',
    height: '8px',
    backgroundColor: '#fff',
    border: `1px solid #22c55e`,
    borderRadius: '50%',
    zIndex: 20,
});
