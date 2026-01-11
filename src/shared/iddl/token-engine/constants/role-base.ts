import { Role } from '../types';

interface RoleBaseDefinition {
    basePaddingX: number; // in px, standard
    basePaddingY: number; // in px, standard
    baseGap: number;      // in px, standard
    baseRadius: number;   // in px
}

export const ROLE_BASE_DEFAULTS: RoleBaseDefinition = {
    basePaddingX: 16,
    basePaddingY: 8,
    baseGap: 8,
    baseRadius: 4,
};

export const ROLE_BASE_MAP: Record<Role, Partial<RoleBaseDefinition>> = {
    // Elements
    Button: { basePaddingX: 16, basePaddingY: 8, baseRadius: 6 },
    IconButton: { basePaddingX: 8, basePaddingY: 8, baseRadius: 6 },
    Input: { basePaddingX: 12, basePaddingY: 8, baseRadius: 6 },
    Tag: { basePaddingX: 8, basePaddingY: 4, baseRadius: 4 },

    // Blocks
    Card: { basePaddingX: 24, basePaddingY: 24, baseGap: 16, baseRadius: 12 },
    List: { basePaddingX: 0, basePaddingY: 0, baseGap: 0, baseRadius: 0 },

    // Sections (Container)
    Section: { basePaddingX: 16, basePaddingY: 16, baseGap: 16 },
};

export function getRoleBase(role: Role): RoleBaseDefinition {
    return { ...ROLE_BASE_DEFAULTS, ...ROLE_BASE_MAP[role] };
}
