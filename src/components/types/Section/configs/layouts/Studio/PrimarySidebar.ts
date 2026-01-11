import type { RoleConfig } from '../../types';

export const PrimarySidebar: RoleConfig = {
  gridArea: 'side',
  overflow: 'auto',
  htmlTag: 'nav',
  ariaProps: { 'aria-label': 'Primary Sidebar' },
  baseStyles: 'flex flex-col bg-surface border-r border-border-default h-full',
  description: 'Primary Sidebar (Core: Nav)',
};
