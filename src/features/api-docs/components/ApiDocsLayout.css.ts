import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css.ts';

const rotate = keyframes({
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
});

export const container = style({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: vars.surface.base.bg,
    fontFamily: vars.font.body,
});

// --- Console (Left) ---
export const consoleContainer = style({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: vars.surface.subtle.bg,
    borderRight: `1px solid ${vars.border.default}`,
});

export const consoleHeader = style({
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: `1px solid ${vars.border.default}`,
    background: vars.surface.base.bg,
});

export const methodSelector = style({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    background: vars.surface.subtle.bg,
    borderRadius: vars.borderRadius.sm,
    fontSize: vars.fontSize.xs,
    fontWeight: 600,
    cursor: 'pointer',
    color: vars.surface.base.text,
});

export const methodBadge = style({
    selectors: {
        '&[data-method="POST"]': { color: vars.color.green600 },
        '&[data-method="GET"]': { color: vars.color.blue600 },
    }
});

export const urlInput = style({
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: vars.fontSize.sm,
    fontFamily: vars.font.code,
    outline: 'none',
    color: vars.surface.base.text,
});

export const sendButton = style({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: vars.color.gray900,
    color: vars.color.white,
    border: 'none',
    padding: '6px 12px',
    borderRadius: vars.borderRadius.md,
    fontSize: vars.fontSize.xs,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    ':hover': {
        opacity: 0.9,
    },
});

export const consoleTabs = style({
    display: 'flex',
    borderBottom: `1px solid ${vars.border.default}`,
    padding: '0 16px',
    background: vars.surface.base.bg,
});

export const tabItem = style({
    padding: '10px 12px',
    fontSize: vars.fontSize.xs,
    fontWeight: 500,
    color: vars.color.gray500,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
    selectors: {
        '&[data-active="true"]': {
            color: vars.surface.base.text,
            borderBottomColor: vars.surface.base.text,
        }
    }
});

export const consoleBody = style({
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
});

export const editorArea = style({
    border: `1px solid ${vars.border.default}`,
    borderRadius: vars.borderRadius.md,
    background: vars.surface.base.bg,
    padding: '12px',
    minHeight: '200px',
});

export const codeBlock = style({
    fontFamily: vars.font.code,
    fontSize: vars.fontSize.xs,
    margin: 0,
    color: vars.color.gray700,
    lineHeight: 1.5,
});

export const responseArea = style({
    height: '40%',
    borderTop: `1px solid ${vars.border.default}`,
    background: vars.surface.base.bg,
    display: 'flex',
    flexDirection: 'column',
});

export const responseHeader = style({
    padding: '8px 16px',
    borderBottom: `1px solid ${vars.border.subtle}`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: vars.fontSize.xs,
});

export const statusBadge = style({
    color: vars.color.green600,
    fontWeight: 600,
});

export const timeBadge = style({
    color: vars.color.gray400,
});

export const responseBody = style({
    padding: '16px',
    overflowY: 'auto',
    flex: 1,
});

export const loadingOverlay = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    background: vars.surface.base.bg,
});

export const spinner = style({
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: `${rotate} 0.6s linear infinite`,
});


// --- Context (Right) ---
export const contextContainer = style({
    width: '100%',
    height: '100%',
    padding: '32px 40px',
    overflowY: 'auto',
    background: vars.surface.base.bg,
});

export const docHeader = style({
    marginBottom: '32px',
});

export const docTitle = style({
    fontSize: vars.fontSize['3xl'], // Changed from 2xl key to 3xl because 2xl key does not exist? Wait, vars.css.ts has xxl. 3xl exists.
    fontWeight: 700,
    marginBottom: '8px',
    color: vars.surface.base.text,
});

export const docDescription = style({
    fontSize: vars.fontSize.sm,
    lineHeight: 1.6,
    color: vars.color.gray600,
});

export const docSection = style({
    marginBottom: '32px',
});

export const sectionTitle = style({
    fontSize: vars.fontSize.sm,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: vars.color.gray400,
    marginBottom: '16px',
});

export const schemaTable = style({
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: vars.fontSize.sm,
    textAlign: 'left',
});

export const fieldKey = style({
    fontFamily: vars.font.code,
    fontWeight: 600,
    color: vars.surface.base.text,
});

export const fieldType = style({
    fontFamily: vars.font.code,
    color: vars.color.amber600,
    fontSize: vars.fontSize.xs,
});

export const responseSchema = style({
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
});

export const responseTab = style({
    padding: '4px 8px',
    borderRadius: vars.borderRadius.sm,
    fontSize: vars.fontSize.xs,
    fontWeight: 600,
    color: vars.color.gray500,
    backgroundColor: vars.surface.subtle.bg,
    cursor: 'pointer',
    selectors: {
        '&[data-active="true"]': {
            backgroundColor: vars.color.green100,
            color: vars.color.green800,
        }
    }
});

export const schemaExample = style({
    fontSize: vars.fontSize.sm,
    color: vars.color.gray500,
    lineHeight: 1.5,
});

// --- Navigation (Far Left) ---
export const navContainer = style({
    width: '100%',
    height: '100%',
    background: vars.surface.subtle.bg,
    borderRight: `1px solid ${vars.border.default}`,
    display: 'flex',
    flexDirection: 'column',
});

export const navHeader = style({
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderBottom: `1px solid ${vars.border.default}`,
    fontSize: vars.fontSize.sm,
    fontWeight: 600,
    color: vars.surface.base.text,
});

export const searchInputWrapper = style({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
});

export const searchIcon = style({
    position: 'absolute',
    left: '10px',
    color: vars.color.gray400,
    zIndex: 1,
});

export const searchInput = style({
    width: '100%',
    padding: '8px 12px 8px 32px',
    fontSize: vars.fontSize.xs,
    borderRadius: vars.borderRadius.sm,
    border: `1px solid ${vars.border.default}`,
    backgroundColor: vars.color.white,
    color: vars.color.gray800,
    outline: 'none',
    transition: 'all 0.2s',
    ':focus': {
        borderColor: vars.color.blue500,
        boxShadow: `0 0 0 2px ${vars.color.blue100}`,
    },
    '::placeholder': {
        color: vars.color.gray400,
    }
});

export const navTitle = style({
    fontWeight: 700,
});

export const searchFilterOverride = style({
    marginBottom: vars.spacing[16],
    width: '100%',
});

export const navGroup = style({
    padding: '16px 0 8px 0',
});

export const navGroupTitle = style({
    padding: '0 16px 8px 16px',
    fontSize: vars.fontSize.xs,
    fontWeight: 600,
    textTransform: 'uppercase',
    color: vars.color.gray400,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
});

export const navItem = style({
    padding: '8px 16px 8px 34px',
    fontSize: vars.fontSize.sm,
    fontFamily: vars.font.code,
    color: vars.color.gray600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
        background: vars.surface.base.hoverBg,
    },
    selectors: {
        '&[data-active="true"]': {
            background: vars.surface.base.bg,
            color: vars.surface.base.text,
            fontWeight: 500,
            borderRight: `2px solid ${vars.surface.base.text}`,
        }
    }
});

export const navMethodBadge = style({
    fontSize: '9px',
    fontWeight: 700,
    padding: '2px 4px',
    borderRadius: vars.borderRadius.sm,
    minWidth: '32px',
    textAlign: 'center',
    letterSpacing: '0.02em',
    selectors: {
        '&[data-method="POST"]': {
            backgroundColor: vars.color.green100,
            color: vars.color.green700
        },
        '&[data-method="GET"]': {
            backgroundColor: vars.color.blue100,
            color: vars.color.blue700
        },
        '&[data-method="DELETE"]': {
            backgroundColor: vars.color.red100,
            color: vars.color.red700
        },
        '&[data-method="PUT"]': {
            backgroundColor: vars.color.amber100,
            color: vars.color.amber700
        },
    }
});
