import type { RoleConfig } from '../../types';

export const UtilityBar: RoleConfig = {
  gridArea: 'utility',
  overflow: 'hidden',
  htmlTag: 'nav', // Core: Nav
  baseStyles: 'flex flex-col items-center bg-surface-elevated border-l border-border-default',
  description: 'Utility Bar (Core: Nav)',
};
