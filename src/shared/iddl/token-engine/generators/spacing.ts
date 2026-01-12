import { BASE_GAP_MAP, BASE_PADDING_MAP } from '../constants/maps';
import type { Prominence, SpaceCategory, SpacingTokens, TokenInput } from '../types';

// Space-Based Gap Multipliers
const SPACE_GAP_MULTIPLIER: Record<SpaceCategory, number> = {
  canvas: 1.5, // Very loose
  surface: 1.0, // Standard
  bar: 0.5, // Tight (Toolbar)
  rail: 0.75, // Compact (Sidebar)
  float: 0.75, // Compact (Menu)
  well: 0.5, // Tight (Input grouping)
};

const PROMINENCE_MULTIPLIER: Record<Prominence, number> = {
  Hero: 1.25,
  Strong: 1.125,
  Elevated: 1.125,
  Standard: 1.0,
  Subtle: 0.875,
  None: 0,
  Hidden: 0,
};

export function generateSpacing(input: TokenInput): SpacingTokens {
  const { role, density = 'Standard', prominence = 'Standard', context } = input;

  // 1. Context Resolution
  const space = context?.ancestry?.space || 'surface';
  const spaceMult = SPACE_GAP_MULTIPLIER[space];

  // 2. Multipliers
  const densityMult = { Compact: 0.75, Standard: 1.0, Comfortable: 1.5 }[density];
  const prominenceMult = PROMINENCE_MULTIPLIER[prominence];

  // 3. Gap Calculation
  // Base gap is usually 1rem (16px) for standard flow
  const baseGap = 1.0;
  const gapVal = baseGap * spaceMult * densityMult * prominenceMult;

  // 4. Padding Calculation
  const basePadding = BASE_PADDING_MAP[role] || BASE_PADDING_MAP['Default'];

  let paddingX = basePadding.x;
  let paddingY = basePadding.y;

  // Space-based adjustments
  if (space === 'bar' || space === 'rail') {
    paddingX *= 0.75;
    paddingY *= 0.75;
  } else if (space === 'canvas') {
    paddingX *= 1.25;
    paddingY *= 1.25;
  }

  // Final density application
  paddingX *= densityMult;
  paddingY *= densityMult;

  return {
    gap: `${gapVal.toFixed(3)}rem`,
    padding: `${paddingY.toFixed(3)}rem ${paddingX.toFixed(3)}rem`,
  };
}
