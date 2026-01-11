import type { RoleConfig } from '../../types';

export const Master: RoleConfig = {
  gridArea: 'panel-a',
  overflow: 'auto',
  htmlTag: 'aside',
  ariaProps: { 'aria-label': 'Master List' },
  baseStyles: 'flex flex-col w-full flex-shrink-0 border-r border-border-default',
};
