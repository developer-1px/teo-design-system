import type { RoleConfig } from '../../types';

export const Nav: RoleConfig = {
  gridArea: 'nav',
  overflow: 'auto',
  htmlTag: 'nav',
  baseStyles:
    'flex flex-col flex-shrink-0 w-[var(--iddl-sidebar-width)] border-r border-border-default',
};
