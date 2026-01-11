import type { RoleConfig } from '../../types';

export const ActivityBar: RoleConfig = {
    gridArea: 'act',
    overflow: 'hidden',
    htmlTag: 'nav',
    ariaProps: { role: 'navigation', 'aria-label': 'Activity Bar' },
    baseStyles: 'flex flex-col items-center bg-surface-elevated border-r border-border-default',
    description: 'Activity Bar (Core: Nav)',
};
