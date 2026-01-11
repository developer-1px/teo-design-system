import type { RoleConfig } from '../../types';

export const SecondarySidebar: RoleConfig = {
    gridArea: 'aux',
    overflow: 'auto',
    htmlTag: 'aside', // Core: Aside
    baseStyles: 'flex flex-col bg-surface border-l border-border-default h-full',
    description: 'Secondary Sidebar (Core: Aside)',
};
