import type { RoleConfig } from '../../types';

export const Footer: RoleConfig = {
  gridArea: 'footer',
  overflow: 'hidden',
  htmlTag: 'footer',
  baseStyles: 'flex flex-row items-center h-8', // Added h-8 for standard footer height
};
