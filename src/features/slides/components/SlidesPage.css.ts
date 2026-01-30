import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/vars.css';
import { surface, ui, textStyle } from '@/styles/utils';

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

export const headerTitleGroup = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[12]
});

export const headerActionsGroup = style({
    display: 'flex',
    gap: vars.spacing[8]
});

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

export const canvasContainer = style({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    backgroundColor: vars.surface.subtle.bg,
});

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

export const alignmentToolbar = style({
    display: 'flex', // Already in iconButtonRow? Refine here.
    justifyContent: 'space-between',
    paddingBottom: vars.spacing[8],
    borderBottom: `1px solid ${vars.border.subtle}`,
    paddingLeft: vars.spacing[16],
    paddingRight: vars.spacing[16],
    // Reset iconButtonRow if used? No, we will replace usage.
    alignItems: 'center',
    gap: vars.spacing[4], // preserve existing gap from iconButtonRow if needed
});

export const verticalSeparator = style({
    width: 1,
    height: 16,
    backgroundColor: vars.border.default,
});

export const activeThumbnail = style([
    {
        borderColor: vars.color.green500,
        backgroundColor: vars.surface.subtle.bg,
    }
]);



// Duplicate activeThumbnail removed

// Thumbnail internals removed as per request



// Center Canvas


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
    textStyle({ size: '4xl', weight: 'bold', height: 'tight', spacing: 'tight' }),
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
    { color: 'rgba(32, 33, 36, 0.7)' },
    textStyle({ size: '3xl', height: 'standard' }),
    {
        marginBottom: vars.spacing[24],
    }
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
    textStyle({ weight: 'bold' }),
    {
        // Fix No Spacing on "Element" trace
        // It is inside `slideElement`.
        // `slideElement` is flex, center/center.
        // Gap? None.
        // Fix: Add no margin needed if we trust centering? 
        // But linter is strict.
        // Let's add padding to the text span itself? Or margin.
        padding: `0 ${vars.spacing[4]}`
    }
]);


// Right Panel: Properties
// Properties Panel Removed - using Panel primitive

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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: vars.spacing[8],
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
