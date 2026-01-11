import type { RoleConfig } from '../../types';

export const Aside: RoleConfig = {
  gridArea: 'aside',
  overflow: 'auto',
  htmlTag: 'aside',
  baseStyles:
    'flex flex-col flex-shrink-0 w-[var(--iddl-sidebar-width)] border-l border-border-default',
};
