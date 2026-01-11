import type { PageLayout } from '@/components/types/Page/Page.types';
import type { RoleConfig, OverflowBehavior } from './types';

// Import Universal Roles
import * as UniversalHeader from './universal/Header';
import * as UniversalFooter from './universal/Footer';
import * as UniversalNav from './universal/Nav';
import * as UniversalAside from './universal/Aside';
import * as UniversalMain from './universal/Main';
import * as UniversalNavigator from './universal/Navigator';
import * as UniversalContainer from './universal/Container';

// Import Sidebar Layout Roles
import * as SidebarHeader from './layouts/Sidebar/Header';
import * as SidebarNav from './layouts/Sidebar/Nav';
import * as SidebarMain from './layouts/Sidebar/Main';
import * as SidebarFooter from './layouts/Sidebar/Footer';
import * as SidebarPrimarySidebar from './layouts/Sidebar/PrimarySidebar';
import * as SidebarNavigator from './layouts/Sidebar/Navigator';
import * as SidebarContainer from './layouts/Sidebar/Container';

// Import Aside Layout Roles
import * as AsideHeader from './layouts/Aside/Header';
import * as AsideMain from './layouts/Aside/Main';
import * as AsideAside from './layouts/Aside/Aside';
import * as AsideFooter from './layouts/Aside/Footer';

// Import HolyGrail Layout Roles
import * as HolyGrailHeader from './layouts/HolyGrail/Header';
import * as HolyGrailNav from './layouts/HolyGrail/Nav';
import * as HolyGrailMain from './layouts/HolyGrail/Main';
import * as HolyGrailAside from './layouts/HolyGrail/Aside';
import * as HolyGrailFooter from './layouts/HolyGrail/Footer';
import * as HolyGrailNavigator from './layouts/HolyGrail/Navigator';

// Import Studio Layout Roles
import * as StudioActivityBar from './layouts/Studio/ActivityBar';
import * as StudioPrimarySidebar from './layouts/Studio/PrimarySidebar';
import * as StudioEditor from './layouts/Studio/Editor';
import * as StudioPanel from './layouts/Studio/Panel';
import * as StudioSecondarySidebar from './layouts/Studio/SecondarySidebar';
import * as StudioUtilityBar from './layouts/Studio/UtilityBar';
import * as StudioStatus from './layouts/Studio/Status';
import * as StudioHeader from './layouts/Studio/Header';
import * as StudioFooter from './layouts/Studio/Footer';
import * as StudioToolbar from './layouts/Studio/Toolbar';

// Import Single Layout Roles
import * as SingleHeader from './layouts/Single/Header';
import * as SingleMain from './layouts/Single/Main';
import * as SingleFooter from './layouts/Single/Footer';

// Import Mobile Layout Roles
import * as MobileHeader from './layouts/Mobile/Header';
import * as MobileMain from './layouts/Mobile/Main';
import * as MobileFooter from './layouts/Mobile/Footer';
import * as MobileDock from './layouts/Mobile/Dock';

// Import Split Layout Roles
import * as SplitMaster from './layouts/Split/Master';
import * as SplitDetail from './layouts/Split/Detail';
import * as SplitPanel from './layouts/Split/Panel';

// Import Blank Layout Roles
import * as BlankContainer from './layouts/Blank/Container';
import * as BlankMain from './layouts/Blank/Main';

/**
 * Registry mapping for all roles and layouts
 */
export const ROLE_REGISTRY: Record<string, Record<string, RoleConfig>> = {
    universal: {
        Header: UniversalHeader.Header,
        Footer: UniversalFooter.Footer,
        Nav: UniversalNav.Nav,
        Aside: UniversalAside.Aside,
        Main: UniversalMain.Main,
        Navigator: UniversalNavigator.Navigator,
        Container: UniversalContainer.Container,
    },
    Sidebar: {
        Header: SidebarHeader.Header,
        Nav: SidebarNav.Nav,
        Main: SidebarMain.Main,
        Footer: SidebarFooter.Footer,
        PrimarySidebar: SidebarPrimarySidebar.PrimarySidebar,
        Navigator: SidebarNavigator.Navigator,
        Container: SidebarContainer.Container,
    },
    Aside: {
        Header: AsideHeader.Header,
        Main: AsideMain.Main,
        Aside: AsideAside.Aside,
        Footer: AsideFooter.Footer,
    },
    HolyGrail: {
        Header: HolyGrailHeader.Header,
        Nav: HolyGrailNav.Nav,
        Main: HolyGrailMain.Main,
        Aside: HolyGrailAside.Aside,
        Footer: HolyGrailFooter.Footer,
        Navigator: HolyGrailNavigator.Navigator,
    },
    Studio: {
        ActivityBar: StudioActivityBar.ActivityBar,
        PrimarySidebar: StudioPrimarySidebar.PrimarySidebar,
        Editor: StudioEditor.Editor,
        Panel: StudioPanel.Panel,
        SecondarySidebar: StudioSecondarySidebar.SecondarySidebar,
        UtilityBar: StudioUtilityBar.UtilityBar,
        Status: StudioStatus.Status,
        Header: StudioHeader.Header,
        Footer: StudioFooter.Footer,
        Toolbar: StudioToolbar.Toolbar,
    },
    Single: {
        Header: SingleHeader.Header,
        Main: SingleMain.Main,
        Footer: SingleFooter.Footer,
    },
    Mobile: {
        Header: MobileHeader.Header,
        Main: MobileMain.Main,
        Footer: MobileFooter.Footer,
        Dock: MobileDock.Dock,
    },
    Split: {
        Master: SplitMaster.Master,
        Detail: SplitDetail.Detail,
        Panel: SplitPanel.Panel,
    },
    Blank: {
        Container: BlankContainer.Container,
        Main: BlankMain.Main,
    },
};

/**
 * getRoleConfig - Resolve configuration for a role in a given layout
 */
export function getRoleConfig(role: string, layout?: PageLayout): RoleConfig {
    // 1. Layout specific override
    if (layout && ROLE_REGISTRY[layout]?.[role]) {
        return ROLE_REGISTRY[layout][role];
    }

    // 2. Universal fallback
    if (ROLE_REGISTRY.universal[role]) {
        return ROLE_REGISTRY.universal[role];
    }

    // 3. Absolute fallback
    return {
        gridArea: role.toLowerCase(),
        overflow: 'auto',
        htmlTag: 'section',
        baseStyles: 'flex-1',
        description: `Unknown role "${role}" (fallback)`,
    };
}

/**
 * getOverflowClass - Convert overflow behavior to Tailwind class
 */
export function getOverflowClass(overflow: OverflowBehavior): string {
    const overflowMap: Record<OverflowBehavior, string> = {
        auto: 'overflow-y-auto',
        hidden: 'overflow-hidden',
        scroll: 'overflow-y-scroll',
        visible: 'overflow-visible',
    };
    return overflowMap[overflow];
}

/**
 * getAllLayouts - Get all registered layout names
 */
export function getAllLayouts(): string[] {
    return Object.keys(ROLE_REGISTRY).filter((t) => t !== 'universal');
}

/**
 * getRolesForLayout - Get valid roles for a given layout
 */
export function getRolesForLayout(layout: string): string[] {
    return Object.keys(ROLE_REGISTRY[layout] || {});
}

/**
 * isValidRoleForLayout - Check if a role is valid for a layout
 */
export function isValidRoleForLayout(role: string, layout?: string): boolean {
    if (!layout) return true;
    return !!(ROLE_REGISTRY[layout]?.[role] || ROLE_REGISTRY.universal[role]);
}

