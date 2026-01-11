import type { RoleConfig } from '../../types';

export const Status: RoleConfig = {
    gridArea: 'stat',
    overflow: 'hidden',
    htmlTag: 'footer', // Core: Status -> footer
    baseStyles: 'flex items-center bg-accent text-white px-2 min-h-[24px] text-xs',
    description: 'Status Bar (Core: Status)',
};
