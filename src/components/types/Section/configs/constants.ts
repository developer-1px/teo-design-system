import type { PageLayout } from '@/components/types/Page/Page.types';
import type { SectionRole } from '../Section.types';

/**
 * Valid Section Roles per Layout
 */
export const LAYOUT_SECTION_ROLES: Record<PageLayout, SectionRole[]> = {
    Single: ['Header', 'Main', 'Footer'],
    Sidebar: ['Header', 'Nav', 'Main', 'Footer'],
    Aside: ['Header', 'Main', 'Aside', 'Footer'],
    HolyGrail: ['Header', 'Nav', 'Main', 'Aside', 'Footer'],
    Split: ['Header', 'Master', 'Detail', 'Footer', 'Toolbar'],
    Studio: [
        'Header',
        'Toolbar',
        'ActivityBar',
        'PrimarySidebar',
        'Editor',
        'SecondarySidebar',
        'UtilityBar',
        'Status',
        'Panel',
        'Footer',
    ],
    Mobile: ['Header', 'Main', 'Footer', 'Dock'],
};
