import type { ExtendedRoleConfig } from '../../shared/role.base';
import type { SectionProps } from '../Section.types';

export type OverflowBehavior = 'auto' | 'hidden' | 'scroll' | 'visible';

/**
 * Section Role Configuration
 *
 * Extends ExtendedRoleConfig which includes gridArea and overflow properties
 */
export interface SectionRoleConfig extends ExtendedRoleConfig<SectionProps> {
  // gridArea and overflow are inherited from ExtendedRoleConfig
}

export type RoleConfig = SectionRoleConfig;
