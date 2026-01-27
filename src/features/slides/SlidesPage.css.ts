import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface, ui, typography } from '../../styles/utils.css';

// Main Container
export const layout = style([
    surface('base'),
    {
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
    }
]);

// Top Navigation Bar
export const topBar = style([
    surface('base'),
    {
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${vars.spacing[16]}`,
        borderBottom: `1px solid ${vars.border.default}`,
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: vars.zIndices.elevated,
    }
]);

// Top Bar Elements
export const figmaLogo = style({
    width: 24,
    height: 24,
    background: '#F24E1E', // Brand color exception
    borderRadius: 4
});

export const displayTitle = style([
    ui.label('md')
]);

export const shareButton = style({
    backgroundColor: vars.color.green500,
    color: vars.color.white,
    border: 'none',
    borderRadius: '4px',
    padding: `0 ${vars.spacing[12]}`,
    height: '28px',
    cursor: 'pointer',
    ':hover': {
        opacity: 0.9
    }
});

export const profileAvatar = style({
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#ff00ff' // Placeholder
});


// Main Workspace Area
export const workspace = style({
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
});

// Left Panel: Slide Thumbnails
export const thumbnailPanel = style([
    surface('base'),
    {
        width: '240px',
        height: '100%',
        borderRight: `1px solid ${vars.border.default}`,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
    }
]);

export const thumbnailItem = style([
    surface('outlined'),
    {
        height: '140px',
        margin: `${vars.spacing[16]} ${vars.spacing[16]} 0`,
        borderRadius: vars.borderRadius.md,
        cursor: 'pointer',
        position: 'relative',
        ':hover': {
            // Overrides are handled by surface('outlined') or can be added here
            borderColor: vars.color.green500,
        }
    }
]);

export const activeThumbnail = style([
    {
        borderColor: vars.color.green500,
        backgroundColor: vars.surface.subtle.bg,
    }
]);

// Duplicate activeThumbnail removed

// Thumbnail internals removed as per request



// Center Canvas
export const canvasArea = style({
    flex: 1,
    backgroundColor: vars.border.subtle, // Example of using subtle border color as a very light bg, or better keep purely separate. 
    // Actually, user said solve coloring via surface. 
    // Let's use a surface token or keep using the semantic placeholder if defined.
    // vars.surface.subtle.bg is gray50 equivalent. vars.color.gray100 was used. 
    // Let's rely on surfaces. 
    // But canvas is usually darker than base. 
    // Let's use `vars.color.gray100` but rename it? 
    // Wait, the instruction is to use surface.
    // Let's use surface('subtle') background explicitly? 
    // Or just use `vars.border.subtle` which is f1f3f4 (close to gray100).
    // Let's stick to semantic token: vars.surface.subtle.bg
    // But surface subtle bg is #f6f8fc. Gray100 is #f3f6fc. Close enough.
    ...surface('subtle'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
});

// The Slide Paper itself
// The Slide Paper itself
export const slidePaper = style({
    width: '800px', // 16:9 aspect ratio roughly
    aspectRatio: '16/9',
    backgroundColor: vars.content.paper.bg, // Fixed white paper
    boxShadow: vars.shadow.raised,
    borderRadius: '4px',
    position: 'relative',
    color: vars.content.paper.text, // Fixed dark text
});

export const slideContent = style({
    padding: '40px'
});

export const slideTitle = style([
    // Removed text('gray800') to inherit from slidePaper or use explicit content text
    {
        color: vars.content.paper.text,
        marginBottom: '20px'
    },
    typography({ size: '4xl', weight: 'bold', height: 'tight', spacing: 'tight' }),
]);

export const slideBody = style([
    // text('gray600'), // Removing adaptive text
    { color: '#5f6368' }, // Hardcoded gray for content on white paper is actually okay/preferred here or define a content.paper.secondaryText?
    // Let's stick to using vars but maybe we need a fixed gray. 
    // vars.color.gray600 flips. 
    // Let's use vars.content.paper.text for now or just set transparency?
    // Or just re-use hex for Body text on paper.
    // 'color: vars.content.paper.text' is #202124 (gray800 equiv).
    // Let's make it slightly lighter.
    { color: 'rgba(32, 33, 36, 0.7)' }, // 70% opacity of dark text
    typography({ size: '3xl', height: 'standard' }),
]);

export const slideElement = style({
    marginTop: '60px',
    width: '200px',
    height: '120px',
    backgroundColor: vars.color.green50,
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

export const slideElementText = style([
    { color: vars.color.green500 },
    typography({ weight: 'bold' })
]);


// Right Panel: Properties
export const propertiesPanel = style([
    surface('base'),
    {
        width: '280px',
        height: '100%',
        borderLeft: `1px solid ${vars.border.default}`,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
        padding: vars.spacing[16],
    }
]);

export const sectionTitle = style([
    ui.overline(),
    {
        textTransform: 'uppercase',
        marginTop: vars.spacing[16],
        marginBottom: vars.spacing[8],
        ':first-child': {
            marginTop: 0,
        }
    }
]);

// Form Elements
export const propertyGrid = style({
    display: 'grid',
    gridTemplateColumns: 'min-content 1fr min-content 1fr',
    columnGap: vars.spacing[8],
    rowGap: vars.spacing[8],
    alignItems: 'center',
    marginBottom: vars.spacing[8],
});

export const propertyRow = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
    marginBottom: vars.spacing[8],
    justifyContent: 'space-between'
});

export const iconButtonRow = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[4],
    marginBottom: vars.spacing[8],
});

export const input = style([
    surface('input'),
    ui.caption(),
    {
        height: '28px',
        borderRadius: '4px',
        padding: `0 ${vars.spacing[8]}`,
        width: '100%',
        color: vars.color.gray800,
        outline: 'none',
        ':focus': {
            boxShadow: `0 0 0 2px ${vars.color.green500}`,
        }
    }
]);

export const label = style([
    ui.label('xs'),
    {
        color: vars.color.gray600,
        minWidth: '16px', // Small fixed width for X/Y labels
    }
]);

export const colorPreview = style({
    width: 24,
    height: 24,
    backgroundColor: vars.color.white,
    border: `1px solid ${vars.border.default}`,
    borderRadius: 4
});

export const effectPreview = style([
    surface('subtle'),
    ui.caption(),
    {
        flex: 1,
        padding: vars.spacing[8],
        borderRadius: '4px',
    }
]);


// Floating Toolbar (Island)
export const floatingToolbar = style([
    surface('card'),
    {
        position: 'absolute',
        bottom: vars.spacing[32],
        left: '50%',
        transform: 'translateX(-50%)',
        height: '48px',
        borderRadius: '24px', // Pill shape
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${vars.spacing[8]}`,
        gap: vars.spacing[4],
        boxShadow: vars.shadow.overlay,
        zIndex: vars.zIndices.floating,
    }
]);

export const toolButton = style([
    surface('ghost'),
    {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: vars.color.gray600,
        ':hover': {
            color: vars.color.gray800,
            backgroundColor: vars.color.gray100,
        }
    }
]);

export const activeTool = style({
    backgroundColor: vars.color.green50,
    color: vars.color.green500,
    ':hover': {
        backgroundColor: vars.color.green50,
    }
});

export const toolbarDivider = style({
    width: 1,
    height: 20,
    backgroundColor: vars.border.default,
    margin: `0 ${vars.spacing[4]}`
});
