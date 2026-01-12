import type { Prominence, Role } from '../types';

export type SeparationTier = 'Level0' | 'Level1' | 'Level2' | 'Level3';

/**
 * getSeparationTier - Determines the visual separation strategy
 * based on the Progressive Separation Theory (Spacing -> Bg -> Border -> Shadow)
 */
export function getSeparationTier(
  role: Role,
  prominence: Prominence = 'Standard',
  isInput: boolean = false
): SeparationTier {
  // 0. Inputs are a special case (Hybrid: Surface + Subtle Border)
  // We treat them as Level 2 (Outlined) but with specific overrides in generators
  if (isInput) return 'Level2';

  // 2. Roles that effectively have "No Container" by default
  // e.g. Lists, Tables (unless they are card-like wrappers)
  // For now, we treat standard Table/List rows as "Level 0" wrappers but with "Divider" borders logic in geometry
  const isDataStructure =
    role === 'List' ||
    role === 'ListItem' ||
    role === 'Table' ||
    role === 'TableRow' ||
    role === 'Grid' ||
    role === 'GridItem' ||
    role === 'TreeItem';
  if (isDataStructure) return 'Level0';

  // 2. Map Prominence to Tier for Containers & Actions
  switch (prominence) {
    case 'Hidden':
    case 'None':
    case 'Subtle':
      return 'Level0'; // Ghost / Transparent

    case 'Standard':
      return 'Level1'; // Surface / Filled

    case 'Strong':
      return 'Level2'; // Outlined / Bordered

    case 'Elevated':
    case 'Hero':
      return 'Level3'; // Elevated / Shadowed

    default:
      return 'Level1';
  }
}
