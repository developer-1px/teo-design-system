import type { RoleConfig } from '../../types';

export const ActivityBar: RoleConfig = {
  gridArea: 'act',
  overflow: 'hidden',
  htmlTag: 'nav',
  ariaProps: { role: 'navigation', 'aria-label': 'Activity Bar' },
  baseStyles: 'flex flex-col items-center py-4 gap-4',
  description: 'Activity Bar (Core: Nav)',
  meta: {
    separation: 'surface',
  },
};
