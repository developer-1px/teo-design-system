import type { RoleConfig } from '../../types';

export const Toolbar: RoleConfig = {
    gridArea: 'header', // Default toolbar to header area
    overflow: 'hidden',
    htmlTag: 'div',
    baseStyles: 'flex items-center px-4 h-12 border-b bg-surface',
};
