import type { RoleConfig } from '../../types';

export const Editor: RoleConfig = {
  gridArea: 'main',
  overflow: 'hidden', // Editor handles scroll internally
  htmlTag: 'main',
  baseStyles: 'flex flex-col min-w-0',
  description: 'Editor (Core: Main)',
};
