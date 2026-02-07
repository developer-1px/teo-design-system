import { style, globalStyle, createVar } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

// ============================================
// PINK THEME PALETTE
// ============================================
const pink = {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
};

// ============================================
// LAYOUT: Full-height container with sidebar + main
// ============================================

export const container = style({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: pink[50],
    fontFamily: vars.font.body,
});

export const layout = style({
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
});

// ============================================
// SIDEBAR: Pink-tinted navigation
// ============================================

export const sidebar = style({
    width: '220px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    background: pink[100],
    borderRight: `1px solid ${pink[200]}`,
    padding: vars.spacing[12],
    gap: vars.spacing[4],
});

export const sidebarSection = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[4],
});

export const sidebarLabel = style({
    fontSize: vars.fontSize.xs,
    fontWeight: vars.weight.medium,
    color: pink[600],
    textTransform: 'uppercase',
    letterSpacing: vars.letterSpacing.wide,
    padding: `${vars.spacing[8]} ${vars.spacing[8]}`,
    marginTop: vars.spacing[8],
});

export const navItem = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
    padding: `${vars.spacing[4]} ${vars.spacing[8]}`,
    borderRadius: vars.borderRadius.sm,
    color: pink[700],
    fontSize: vars.fontSize.sm,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    height: '28px',
    ':hover': {
        background: pink[200],
        color: pink[800],
    },
});

export const activeNavItem = style({
    background: pink[500],
    color: '#ffffff',
    fontWeight: vars.weight.medium,
    boxShadow: `0 2px 8px ${pink[300]}`,
    ':hover': {
        background: pink[600],
        color: '#ffffff',
    },
});

export const navItemCount = style({
    marginLeft: 'auto',
    fontSize: vars.fontSize.xs,
    color: 'inherit',
    opacity: 0.7,
});

// ============================================
// MAIN CONTENT AREA
// ============================================

export const main = style({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#ffffff',
});

export const header = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${vars.spacing[12]} ${vars.spacing[16]}`,
    borderBottom: `1px solid ${pink[200]}`,
    background: `linear-gradient(135deg, ${pink[50]} 0%, #ffffff 100%)`,
});

export const headerLeft = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[12],
});

export const title = style({
    fontSize: vars.fontSize.lg,
    fontWeight: vars.weight.medium,
    color: pink[800],
});

export const issueCount = style({
    fontSize: vars.fontSize.sm,
    color: pink[500],
    fontWeight: vars.weight.medium,
});

export const headerActions = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
});

// ============================================
// TOOLBAR: Search + Filters
// ============================================

export const toolbar = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${vars.spacing[8]} ${vars.spacing[16]}`,
    borderBottom: `1px solid ${pink[100]}`,
    background: '#ffffff',
});

export const searchContainer = style({
    position: 'relative',
    width: '240px',
});

export const filterGroup = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[4],
});

// ============================================
// ISSUE LIST: Compact, pink-accented rows
// ============================================

export const listContainer = style({
    flex: 1,
    overflowY: 'auto',
});

export const listHeader = style({
    display: 'grid',
    gridTemplateColumns: '80px 1fr 100px 80px 100px 40px',
    alignItems: 'center',
    padding: `${vars.spacing[8]} ${vars.spacing[16]}`,
    fontSize: vars.fontSize.xs,
    fontWeight: vars.weight.medium,
    color: pink[600],
    textTransform: 'uppercase',
    letterSpacing: vars.letterSpacing.wide,
    borderBottom: `1px solid ${pink[200]}`,
    background: pink[50],
});

export const issueRow = style({
    display: 'grid',
    gridTemplateColumns: '80px 1fr 100px 80px 100px 40px',
    alignItems: 'center',
    padding: `0 ${vars.spacing[16]}`,
    height: '36px',
    fontSize: vars.fontSize.sm,
    borderBottom: `1px solid ${pink[100]}`,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    ':hover': {
        background: pink[50],
        borderLeftColor: pink[400],
    },
});

export const issueId = style({
    fontSize: vars.fontSize.xs,
    color: pink[500],
    fontFamily: vars.font.code,
    fontWeight: vars.weight.medium,
});

export const issueTitle = style({
    fontWeight: vars.weight.regular,
    color: pink[900],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingRight: vars.spacing[16],
});

export const statusCell = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[4],
});

export const statusDot = style({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
});

export const statusLabel = style({
    fontSize: vars.fontSize.xs,
    color: pink[600],
    textTransform: 'capitalize',
});

export const priorityCell = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[4],
});

export const priorityBar = style({
    width: '3px',
    height: '12px',
    borderRadius: '1px',
});

export const dateCell = style({
    fontSize: vars.fontSize.xs,
    color: pink[400],
});

export const actionsCell = style({
    display: 'flex',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.1s ease',
});

globalStyle(`${issueRow}:hover ${actionsCell}`, {
    opacity: 1,
});

// ============================================
// KEYBOARD HINTS BAR (Footer)
// ============================================

export const footer = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.spacing[24],
    padding: `${vars.spacing[8]} ${vars.spacing[16]}`,
    borderTop: `1px solid ${pink[200]}`,
    background: `linear-gradient(135deg, ${pink[100]} 0%, ${pink[50]} 100%)`,
    fontSize: vars.fontSize.xs,
    color: pink[600],
});

export const keyboardHint = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[4],
});

export const kbd = style({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '18px',
    height: '18px',
    padding: `0 ${vars.spacing[4]}`,
    borderRadius: vars.borderRadius.sm,
    background: '#ffffff',
    border: `1px solid ${pink[300]}`,
    fontSize: vars.fontSize.xs,
    fontFamily: vars.font.code,
    fontWeight: vars.weight.medium,
    color: pink[600],
    boxShadow: `0 1px 2px ${pink[200]}`,
});
