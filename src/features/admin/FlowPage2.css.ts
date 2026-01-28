import { style } from '@vanilla-extract/css';

// Re-exporting common styles from FlowPage to keep consistent theme
// In a real app, these would be in a shared `flow.css.ts`
import {
    container, topBar, methodBadge, urlText, playButton,
    flowContainer, sourceCol, logicCol, previewCol,
    colHeader, scrollArea, jsonNode, jsonKey, jsonVal,
    cardTitle, propertyRow, select,
    previewStage, previewCard, previewHeader, previewBody
} from './FlowPage.css';

// Export inherited styles
// specific exclusions to avoid conflicts with overrides
export {
    container, topBar, methodBadge, urlText, playButton,
    flowContainer, sourceCol, logicCol, previewCol,
    colHeader, scrollArea, jsonNode, jsonKey, jsonVal,
    cardTitle, propertyRow, select,
    previewStage, previewCard, previewHeader, previewBody
};

export const zinc = {
    100: '#f4f4f5',
    200: '#e4e4e7',
    500: '#71717a',
    900: '#18181b',
};

// ... (Previous styles remain same until overrides)

// New Styles specific to Flow 2 (List/Table)

export const arrayBlock = style({
    margin: '12px 20px',
    border: `1px solid ${zinc[200]}`,
    borderRadius: '8px',
    overflow: 'hidden',
});

export const arrayHeader = style({
    padding: '8px 12px',
    background: zinc[100],
    fontSize: '11px',
    fontWeight: 600,
    color: zinc[500],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const paginationBar = style({
    marginTop: 'auto', // Push to bottom
    padding: '12px 16px',
    borderTop: `1px solid ${zinc[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
});

export const pageBtn = style({
    padding: '4px 8px',
    border: `1px solid ${zinc[200]}`,
    borderRadius: '4px',
    background: '#fff',
    fontSize: '11px',
    cursor: 'pointer',
    ':disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
    }
});

// --- PIPELINE ARCHITECTURE (n8n inspired) ---

export const flowContainerScrollable = style({
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    background: '#09090b', // Deep dark backdrop
    color: '#e4e4e7',
});

// 1. INPUT STAGE (Left)
export const stageCol = style({
    flex: 1,
    borderRight: '1px solid #27272a',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

export const stageHeader = style({
    padding: '12px 16px',
    background: '#18181b',
    borderBottom: '1px solid #27272a',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '11px',
    fontWeight: 700,
    color: '#a1a1aa',
    textTransform: 'uppercase',
});

// 2. TRANSFORM ENGINE (Middle)
export const centerCol = style({
    flex: 1.5,
    borderRight: '1px solid #27272a',
    display: 'flex',
    flexDirection: 'column',
    background: '#09090b',
});

// 3. BINDING OUTPUT (Right)
export const rightCol = style({
    flex: 1.2,
    display: 'flex',
    flexDirection: 'column',
    background: '#0f172a', // Subtle deep navy for output stage
});

// --- TECHNICAL COMPONENTS ---

export const codeBlock = style({
    flex: 1,
    background: '#09090b',
    margin: 0,
    padding: '20px',
    fontFamily: '"Fira Code", monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#38bdf8',
    overflow: 'auto',
    ':focus': { outline: 'none' }
});

export const fieldList = style({
    padding: '12px',
    background: '#18181b',
    borderTop: '1px solid #27272a',
    maxHeight: '150px',
    overflowY: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
});

export const signalChip = style({
    padding: '4px 8px',
    background: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#e4e4e7',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    ':hover': {
        borderColor: '#3b82f6',
        background: '#1e293b',
    },
    selectors: {
        '&[data-active="true"]': {
            borderColor: '#3b82f6',
            background: '#1e3a8a',
            color: '#fff',
        }
    }
});


export const bindStatus = style({
    fontSize: '10px',
    fontWeight: 800,
    padding: '2px 6px',
    borderRadius: '4px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    selectors: {
        '&[data-bound="true"]': {
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.1)',
        },
        '&[data-bound="false"]': {
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            animation: 'pulse 2s infinite',
        }
    }
});

export const integrityBadge = style({
    padding: '4px 8px',
    borderRadius: '99px',
    fontSize: '11px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    selectors: {
        '&[data-perfect="true"]': {
            background: '#059669',
            color: '#fff',
        },
        '&[data-perfect="false"]': {
            background: '#27272a',
            color: '#a1a1aa',
            border: '1px solid #3f3f46',
        }
    }
});

export const schemaPanel = style({
    marginTop: 'auto',
    padding: '20px',
    background: '#020617',
    borderTop: '1px solid #1e293b',
});

export const deployButton = style({
    width: '100%',
    padding: '12px',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s ease',
    ':hover': {
        background: '#2563eb',
        transform: 'translateY(-1px)',
    },
    ':disabled': {
        background: '#27272a',
        color: '#71717a',
        cursor: 'not-allowed',
        transform: 'none',
    }
});

export const slotCard = style({
    margin: '12px',
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    selectors: {
        '&[data-error="true"]': {
            background: 'rgba(239, 68, 68, 0.02)',
            borderColor: 'rgba(239, 68, 68, 0.2)',
        },
        '&:hover': {
            background: 'rgba(255,255,255,0.04)',
            borderColor: 'rgba(255,255,255,0.1)',
        }
    }
});


// --- PREVIEW OVERLAY ---

export const previewOverlay = style({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(9, 9, 11, 0.8)',
    backdropFilter: 'blur(8px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    selectors: {
        '&[data-open="true"]': {
            opacity: 1,
            pointerEvents: 'auto',
        }
    }
});

export const simulationCard = style({
    width: '90%',
    maxWidth: '1000px',
    height: '80%',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transform: 'scale(0.95) translateY(20px)',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    selectors: {
        '[data-open="true"] &': {
            transform: 'scale(1) translateY(0)',
        }
    }
});

export const simulationHeader = style({
    padding: '20px 24px',
    borderBottom: `1px solid ${zinc[200]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fafafa',
});

export const runButton = style({
    width: '100%',
    padding: '12px',
    background: '#18181b', // Dark button for variety
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s ease',
    ':hover': {
        background: '#27272a',
        transform: 'translateY(-1px)',
    },
});

export const closeButton = style({
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: zinc[500],
    ':hover': {
        background: zinc[200],
        color: zinc[900],
    }
});

// Re-using table styles for the live preview
export const liveTable = style({
    flex: 1,
    overflow: 'auto',
    padding: '0',
});

// Added to resolve TS errors in FlowPage2.tsx
export const headerRow = style({
    display: 'flex',
    background: '#fafafa',
    borderBottom: `1px solid ${zinc[200]}`,
    padding: '12px 24px',
    fontSize: '11px',
    color: zinc[500],
});

export const cell = style({
    padding: '12px',
    fontSize: '13px',
    color: zinc[900],
    borderRight: `1px solid ${zinc[200]}`,
    alignItems: 'center',
    display: 'flex',
    ':last-child': {
        borderRight: 'none',
    }
});

export const avatarMock = style({
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    fontWeight: 700,
    color: '#666',
});
