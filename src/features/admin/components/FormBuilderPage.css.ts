import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';
import { recipe } from '@vanilla-extract/recipes';

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
    backgroundColor: vars.surface.base.bg, // Changed to base (White) for contrast
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
});

export const centerPanel = style({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: vars.surface.subtle.bg, // Changed to subtle (Gray)
});

export const rightPanel = style({
    width: '300px',
    borderLeft: `1px solid ${vars.border.subtle}`,
    backgroundColor: vars.surface.base.bg, // Ensure base (White)
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
});

export const canvas = style({
    flex: 1,
    overflow: 'auto',
    padding: vars.spacing[32],
    // Updated gradient to be more subtle on the gray background
    backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

// Grid Layout for Form Container
export const formContainer = style({
    width: '100%',
    maxWidth: '800px', // Wider to accommodate 4 columns
    backgroundColor: vars.surface.base.bg,
    borderRadius: vars.borderRadius.md,
    boxShadow: vars.shadow.raised,
    minHeight: '400px',
    padding: vars.spacing[24],
    display: 'grid', // Switch to Grid
    gridTemplateColumns: 'repeat(4, 1fr)', // 4-Column Grid
    gap: vars.spacing[16],
    border: `1px solid ${vars.border.subtle}`,
    alignContent: 'start', // Ensure items start from top
    position: 'relative', // For Grid Guide Layer
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
        backgroundColor: vars.surface.subtle.bg,
        borderColor: vars.border.subtle,
    }
});

// Canvas Field (Grid Item)
export const canvasField = recipe({
    base: {
        padding: vars.spacing[16],
        border: `1px solid transparent`,
        borderRadius: vars.borderRadius.sm,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        selectors: {
            '&:hover': {
                backgroundColor: vars.surface.subtle.bg,
                border: `1px dashed ${vars.border.default}`,
            },
            '&[data-selected="true"]': {
                backgroundColor: '#EFF6FF', // Light blue
                border: `1px solid #3B82F6`, // Blue
                zIndex: 1,
            }
        }
    },
    variants: {
        colSpan: {
            1: { gridColumn: 'span 1' },
            2: { gridColumn: 'span 2' },
            3: { gridColumn: 'span 3' },
            4: { gridColumn: 'span 4' },
        }
    },
    defaultVariants: {
        colSpan: 4 // Default to full width for backward compat behavior initially, or 1? 
        // User complained it's too linear, so maybe changing default to 4 keeps it linear until changed, 
        // but creates opportunity. Let's strictly follow the prop.
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

// Button for submit (full width in grid)
export const submitButtonWrapper = style({
    gridColumn: '1 / -1', // Span all columns
    marginTop: vars.spacing[16],
    paddingTop: vars.spacing[16],
    borderTop: `1px solid ${vars.border.subtle}`,
});

// Grid Guides
export const gridGuideLayer = style({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: vars.spacing[16],
    padding: vars.spacing[24], // Match formContainer padding
    pointerEvents: 'none',
    zIndex: 0,
});

export const gridTrack = style({
    height: '100%',
    borderLeft: `1px dashed ${vars.border.subtle}`,
    borderRight: `1px dashed ${vars.border.subtle}`,
    opacity: 0.5,
    backgroundColor: 'rgba(0,0,0,0.01)', // Very faint tint
});

// Floating Toolbar
export const floatingToolbar = style({
    position: 'absolute',
    top: '-42px',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[4],
    backgroundColor: '#1F2937', // Dark Gray (Zinc 800)
    color: 'white',
    padding: '4px',
    borderRadius: vars.borderRadius.md,
    boxShadow: vars.shadow.overlay,
    zIndex: 20,
    animation: 'fadeIn 0.2s ease', // We'd need a keyframe for this, keeping simple for now
});

export const toolbarButton = style({
    height: '28px',
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: vars.borderRadius.sm,
    color: '#D1D5DB', // Gray 300
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    border: 'none',
    backgroundColor: 'transparent',
    transition: 'all 0.1s',
    gap: '4px',
    ':hover': {
        backgroundColor: '#374151', // Gray 700
        color: 'white',
    }
});

export const toolbarDivider = style({
    width: '1px',
    height: '16px',
    backgroundColor: '#4B5563', // Gray 600
    margin: '0 2px',
});
