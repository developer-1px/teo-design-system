import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

const fadeIn = keyframes({
    from: { opacity: 0 },
    to: { opacity: 1 },
});

export const container = style({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: vars.color.white,
    fontFamily: vars.font.body,
});

export const canvas = style({
    flex: 1,
    padding: vars.spacing[40],
    overflowY: 'auto',
    background: vars.color.gray50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

export const tableWrapper = style({
    width: '100%',
    maxWidth: '1200px',
    background: vars.color.white,
    borderRadius: vars.borderRadius.lg,
    border: `1px solid ${vars.color.border}`,
    boxShadow: vars.shadow.raised,
    overflow: 'hidden',
    position: 'relative',
});

export const gridTable = style({
    display: 'grid',
    width: 'max-content',
    minWidth: '100%',
});

// --- Header ---
export const headerCell = style({
    padding: `${vars.spacing[12]} ${vars.spacing[16]}`,
    background: vars.color.gray50,
    borderBottom: `1px solid ${vars.color.border}`,
    fontSize: vars.fontSize.xs,
    fontWeight: vars.weight.bold,
    color: vars.color.gray500,
    textTransform: 'uppercase',
    letterSpacing: vars.letterSpacing.widest,
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s, color 0.2s',
    ':hover': {
        background: vars.color.gray100,
        color: vars.color.gray900,
    },
});

export const shyIcon = style({
    opacity: 0,
    transition: 'opacity 0.2s',
    selectors: {
        [`${headerCell}:hover &`]: {
            opacity: 1,
        }
    }
});

export const moreBtn = style({
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: vars.spacing[4],
    borderRadius: vars.borderRadius.sm,
    opacity: 0,
    transition: 'all 0.2s',
    ':hover': {
        background: vars.color.gray200,
    },
    selectors: {
        [`${headerCell}:hover &`]: {
            opacity: 1,
        }
    }
});

export const resizeHandle = style({
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    cursor: 'col-resize',
    background: 'transparent',
    transition: 'background-color 0.2s',
    ':hover': {
        background: vars.color.gray300,
    }
});

// --- Cells ---
export const cell = style({
    padding: `${vars.spacing[12]} ${vars.spacing[16]}`,
    borderBottom: `1px solid ${vars.color.gray100}`,
    fontSize: vars.fontSize.sm,
    color: vars.color.gray900,
    background: vars.color.white,
    display: 'flex',
    alignItems: 'center',
});

export const badge = style({
    padding: `2px ${vars.spacing[8]}`,
    borderRadius: vars.borderRadius.sm,
    fontSize: '11px',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.spacing[4],
});

// --- Actions ---
export const addBtn = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: vars.spacing[12],
    background: 'transparent',
    border: 'none',
    color: vars.color.gray300,
    cursor: 'pointer',
    transition: 'color 0.2s',
    ':hover': {
        color: vars.color.gray900,
    }
});

// --- DND Glass ---
export const ghost = style({
    opacity: 0.3,
    background: vars.color.blue50,
    pointerEvents: 'none',
});

// --- Undo Toast ---
export const undoToast = style({
    position: 'fixed',
    bottom: vars.spacing[32],
    left: '50%',
    transform: 'translateX(-50%)',
    background: vars.color.gray900,
    color: vars.color.white,
    padding: `${vars.spacing[12]} ${vars.spacing[20]}`,
    borderRadius: vars.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[16],
    zIndex: vars.zIndices.toast,
    animation: `${fadeIn} 0.2s ease-out`,
});

export const undoBtn = style({
    background: vars.color.blue500,
    border: 'none',
    color: vars.color.white,
    padding: `${vars.spacing[4]} ${vars.spacing[12]}`,
    borderRadius: vars.borderRadius.sm,
    fontSize: vars.fontSize.xs,
    fontWeight: 600,
    cursor: 'pointer',
    ':hover': {
        background: vars.color.blue600,
    }
});
