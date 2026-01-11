import type { RoleConfig } from '../../types';

export const Panel: RoleConfig = {
    gridArea: 'panel',
    overflow: 'auto',
    htmlTag: 'section', // Core: Panel -> section
    ariaProps: { 'aria-label': 'Panel' },
    baseStyles: 'flex flex-col bg-surface-sunken border-t border-border-default h-full',
    description: 'Panel (Core: Panel)',
};
