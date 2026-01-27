import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface, ui } from '../../styles/utils';

export const container = style([
    surface('subtle'),
    {
        display: 'grid',
        gridTemplateColumns: `280px 1fr 320px`,
        gridTemplateRows: `${vars.sizing.header.height} 1fr`,
        height: '100vh',
        width: `calc(100vw - ${vars.sizing.sidebar.collapsedWidth})`,
        overflow: 'hidden',
    }
]);

// Header
export const header = style([
    surface('base'),
    {
        gridColumn: '1 / -1',
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${vars.spacing[20]}`,
        // Removing justifyContent: space-between to allow precise control
        borderBottom: `1px solid ${vars.border.subtle}`,
        zIndex: vars.zIndices.elevated,
        position: 'relative' // Needed for absolute centering of child
    }
]);

export const headerLogo = style([
    ui.label('md'),
    {
        display: 'flex',
        alignItems: 'center',
        gap: vars.spacing[8],
        color: vars.color.gray800
    }
]);

export const headerCenter = style({
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

export const logoBox = style({
    width: '24px',
    height: '24px',
    backgroundColor: vars.border.interactive,
    borderRadius: vars.borderRadius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: vars.weight.bold,
    color: vars.color.white,
    fontSize: '14px'
});

export const headerActions = style({
    display: 'flex',
    gap: vars.spacing[12],
    marginLeft: 'auto' // Pushes this to the right
});

// Sidebar
export const sidebar = style([
    surface('base'),
    {
        gridColumn: '1',
        borderRight: `1px solid ${vars.border.subtle}`,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
    }
]);

export const sidebarHeader = style([
    surface('base'),
    ui.label('sm'),
    {
        padding: vars.spacing[16],
        borderBottom: `1px solid ${vars.border.subtle}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: vars.color.gray800
    }
]);

export const sectionTitle = style([
    ui.overline(),
    {
        padding: `${vars.spacing[8]} ${vars.spacing[12]}`,
        color: vars.color.gray600
    }
]);

export const blockTree = style({
    padding: vars.spacing[8],
    flex: 1
});

export const blockTreeItem = style([
    ui.menu(),
    {
        padding: `${vars.spacing[8]} ${vars.spacing[12]}`,
        borderRadius: vars.borderRadius.sm,
        cursor: 'pointer',
        marginBottom: '2px',
        color: vars.color.gray600,
        display: 'flex',
        alignItems: 'center',
        gap: vars.spacing[8],
        transition: 'all 0.1s',
        ':hover': {
            backgroundColor: vars.color.gray100,
            color: vars.color.gray800
        },
        selectors: {
            '&[data-active="true"]': {
                backgroundColor: vars.surface.highlight.bg,
                color: vars.surface.highlight.text,
            },
            // Visual Sync Highlight
            '&[data-hovered="true"]': {
                backgroundColor: vars.color.gray100,
                color: vars.border.interactive, // Highlight text color on sync hover
                outline: `1px solid ${vars.border.interactive}`,
                outlineOffset: '-1px'
            }
        }
    }
]);

export const helperText = style([
    ui.caption(),
    {
        marginLeft: 'auto',
        color: vars.color.gray600
    }
]);

// Main Content
export const mainContent = style([
    surface('subtle'),
    {
        gridColumn: '2',
        padding: vars.spacing[32],
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    }
]);

export const previewFrame = style([
    surface('base'),
    {
        width: '100%',
        height: '100%',
        minHeight: '800px',
        boxShadow: vars.shadow.raised,
        borderRadius: vars.borderRadius.md,
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        selectors: {
            '&[data-viewport="mobile"]': {
                width: '375px',
                border: `1px solid ${vars.border.subtle}`
            },
            '&[data-viewport="tablet"]': {
                width: '768px',
                border: `1px solid ${vars.border.subtle}`
            },
            '&[data-viewport="desktop"]': {
                width: '100%',
                maxWidth: '1200px'
            }
        }
    }
]);

// ... (visualBlock visuals moved to VisualFrame primitive) ...

export const addBlockButton = style([
    ui.label('sm'),
    {
        width: '100%',
        padding: vars.spacing[16],
        border: `2px dashed ${vars.border.default}`,
        borderRadius: vars.borderRadius.md,
        marginTop: vars.spacing[16],
        background: 'transparent',
        color: vars.color.gray600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        ':hover': {
            borderColor: vars.border.interactive,
            color: vars.border.interactive,
            backgroundColor: vars.color.gray50
        }
    }
]);

// Config Panel
export const configPanel = style([
    surface('base'),
    {
        gridColumn: '3',
        borderLeft: `1px solid ${vars.border.subtle}`,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
    }
]);

export const configHeader = style([
    sidebarHeader
]);

export const configForm = style({
    padding: vars.spacing[16],
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[20]
});

export const fieldGroup = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[8]
});

export const fieldLabel = style([
    ui.overline(),
    {
        color: vars.color.gray600,
    }
]);

export const fieldInput = style([
    ui.code('sm'),
    surface('input'),
    {
        padding: `${vars.spacing[8]} ${vars.spacing[12]}`,
        borderRadius: vars.borderRadius.sm,
        outline: 'none',
        width: '100%',
        transition: 'border-color 0.2s',
        ':focus': {
            borderColor: vars.border.interactive
        }
    }
]);

export const fieldTextArea = style([
    fieldInput,
    {
        minHeight: '80px',
        resize: 'vertical',
        fontFamily: vars.font.body
    }
]);

export const ghostButton = style([
    ui.label('xs'),
    surface('ghost'),
    {
        padding: `${vars.spacing[4]} ${vars.spacing[12]}`,
        borderRadius: vars.borderRadius.sm,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: vars.spacing[4],
        transition: 'all 0.2s',
        ':hover': {
            backgroundColor: vars.color.gray100
        }
    }
]);

export const primaryButton = style([
    ghostButton,
    {
        backgroundColor: vars.border.interactive,
        color: vars.color.white,
        ':hover': {
            backgroundColor: vars.border.interactive,
            opacity: 0.9
        }
    }
]);
