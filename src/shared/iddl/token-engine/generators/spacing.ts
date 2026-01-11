import { TokenInput, SpacingTokens } from '../types';
import { BASE_GAP_MAP, BASE_PADDING_MAP, DENSITY_MULTIPLIER } from '../constants/maps';

export function generateSpacing(input: TokenInput): SpacingTokens {
    const {
        role,
        sectionType,
        density = 'Standard',
        prominence = 'Standard'
    } = input;

    // 1. Resolve Multipliers
    const densityMult = DENSITY_MULTIPLIER[density];
    const prominenceMult = prominence === 'Hero' ? 1.5 : 1.0;

    // 2. Gap Calculation
    // Priority: sectionType -> Default
    const baseGap = BASE_GAP_MAP[sectionType || 'Default'] || BASE_GAP_MAP['Default'];
    const gapVal = baseGap * densityMult;

    // 3. Padding Calculation
    // Priority: Role Base -> Fallback to Default
    const basePadding = BASE_PADDING_MAP[role] || BASE_PADDING_MAP['Default'];

    // Apply Multipliers
    const paddingX = basePadding.x * densityMult * prominenceMult;
    const paddingY = basePadding.y * densityMult * prominenceMult;

    // 4. Return as rem strings (or px if converted, but rem is safer for scaling)
    // IDDL favors rem.
    return {
        gap: `${gapVal}rem`,
        padding: `${paddingY}rem ${paddingX}rem`
    };
}
