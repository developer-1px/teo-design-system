/**
 * Role Registry (Minimal)
 *
 * Provides basic role metadata for backwards compatibility
 */

import type { SpaceCategory } from '../types';
import { getSpaceCategory } from './maps';

export interface RoleDefinition {
  role: string;
  definesSpace?: SpaceCategory;
}

/**
 * Get role definition
 * Returns minimal metadata for a given role
 */
export function getRoleDefinition(role: string): RoleDefinition {
  return {
    role,
    definesSpace: getSpaceCategory(role),
  };
}
