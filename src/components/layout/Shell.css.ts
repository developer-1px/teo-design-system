import { style, createVar } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const sidebarWidthVar = createVar();
export const auxPanelWidthVar = createVar();
export const headerHeightVar = createVar();
export const activityBarWidthVar = createVar();
export const statusBarHeightVar = createVar();
export const bottomPanelHeightVar = createVar();

export const shellContainer = style({
    display: 'grid',
    height: '100vh',
    width: 'calc(100vw - 48px)', // Subtract GlobalNav width
    overflow: 'hidden',

    // Default variables (can be overridden via style prop)
    vars: {
        [headerHeightVar]: vars.sizing.header.height, // 48px
        [activityBarWidthVar]: '48px',
        [sidebarWidthVar]: vars.sizing.sidebar.width, // 240px
        [auxPanelWidthVar]: '280px',
        [statusBarHeightVar]: '24px',
        [bottomPanelHeightVar]: '200px',
    },

    gridTemplateAreas: `
        "navbar navbar navbar navbar navbar"
        "activity sidebar main aux right"
        "activity sidebar bottom aux right"
        "status status status status status"
    `,

    // Columns: Activity | Sidebar | Main (Auto) | Aux | Right
    gridTemplateColumns: `
        auto 
        auto 
        1fr 
        auto 
        auto
    `,

    // Rows: Header | Main | Bottom | Status
    gridTemplateRows: `
        ${headerHeightVar} 
        1fr 
        auto 
        ${statusBarHeightVar}
    `,

    backgroundColor: vars.surface.base.bg,
    color: vars.color.gray900,
});

export const areaNavbar = style({ gridArea: 'navbar', zIndex: vars.zIndices.elevated });
export const areaActivity = style({ gridArea: 'activity', width: activityBarWidthVar, display: 'none', selectors: { '&:not(:empty)': { display: 'flex' } } });
export const areaSidebar = style({ gridArea: 'sidebar', width: sidebarWidthVar, display: 'none', selectors: { '&:not(:empty)': { display: 'flex' } } });
export const areaMain = style({ gridArea: 'main', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' });
export const areaBottom = style({ gridArea: 'bottom', height: bottomPanelHeightVar, display: 'none', selectors: { '&:not(:empty)': { display: 'flex' } } });
export const areaAux = style({ gridArea: 'aux', width: auxPanelWidthVar, display: 'none', selectors: { '&:not(:empty)': { display: 'flex' } } });
export const areaStatus = style({ gridArea: 'status', display: 'none', selectors: { '&:not(:empty)': { display: 'flex' } } });

// Main scroll area wrapper to ensure content scrolls correctly within the grid area
export const mainContentScroll = style({
    flex: 1,
    overflow: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
});
