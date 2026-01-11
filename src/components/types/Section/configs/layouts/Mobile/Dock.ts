import type { RoleConfig } from '../../types';

export const Dock: RoleConfig = {
  gridArea: 'dock',
  overflow: 'hidden',
  htmlTag: 'nav',
  baseStyles:
    'bg-surface-elevated border-t h-16 flex items-center justify-around sticky bottom-0 z-20',
};
