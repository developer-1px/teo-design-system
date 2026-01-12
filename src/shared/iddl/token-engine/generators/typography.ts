import { TEXT_ROLE_MAP } from '../constants/maps';
import type { SpaceCategory, TokenInput, TypographyTokens } from '../types';

// Strategy: Context-Aware Scaling
// We define 3 distinct scale sets: Expressive (Canvas), Standard (Surface), Compact (Bar/Rail/Input)

const TYPE_SCALE_Expressive = {
  Title: { Hero: 'text-6xl md:text-8xl', Strong: 'text-5xl', Standard: 'text-4xl' },
  Heading: { Hero: 'text-3xl', Strong: 'text-2xl', Standard: 'text-xl' },
  Body: { Hero: 'text-xl', Strong: 'text-lg', Standard: 'text-base' },
  Label: { Hero: 'text-lg', Strong: 'text-base', Standard: 'text-sm' },
};

const TYPE_SCALE_Standard = {
  Title: { Hero: 'text-4xl', Strong: 'text-3xl', Standard: 'text-2xl' },
  Heading: { Hero: 'text-2xl', Strong: 'text-xl', Standard: 'text-lg' },
  Body: { Hero: 'text-lg', Strong: 'text-base', Standard: 'text-sm' },
  Label: { Hero: 'text-base', Strong: 'text-sm', Standard: 'text-xs' },
};

const TYPE_SCALE_TOOL = {
  Title: { Hero: 'text-lg', Strong: 'text-base', Standard: 'text-sm' },
  Heading: { Hero: 'text-base', Strong: 'text-sm', Standard: 'text-xs' },
  Body: { Hero: 'text-sm', Strong: 'text-xs', Standard: 'text-2xs' },
  Label: { Hero: 'text-xs', Strong: 'text-2xs', Standard: 'text-3xs' }, // 3xs is hypothetical
};

export function generateTypography(input: TokenInput): TypographyTokens {
  const { role, prominence = 'Standard', intent = 'Neutral', state = {}, context } = input;

  // 1. Determine Space Context
  const space: SpaceCategory = context?.ancestry?.space || 'surface';

  // 2. Select Scale Set
  let scaleSet = TYPE_SCALE_Standard;
  if (space === 'canvas') scaleSet = TYPE_SCALE_Expressive;
  else if (space === 'bar' || space === 'rail' || space === 'well' || space === 'float')
    scaleSet = TYPE_SCALE_TOOL;

  // 3. Resolve Size
  // Map simplified roles: Title | Heading | Body | Label
  let typeCategory: 'Title' | 'Heading' | 'Body' | 'Label' = 'Body';
  if (role === 'Title') typeCategory = 'Title';
  else if (role === 'Heading' || role === 'SectionHeader') typeCategory = 'Heading';
  else if (role === 'Label' || role === 'Caption' || role === 'Overline') typeCategory = 'Label';

  // Resolve Prominence (clamp to keys)
  const promKey =
    prominence === 'Hero' || prominence === 'Display'
      ? 'Hero'
      : prominence === 'Strong'
        ? 'Strong'
        : 'Standard';

  const size = scaleSet[typeCategory][promKey] || scaleSet[typeCategory]['Standard'];

  // 4. Resolve Weight
  let weight = 'font-normal';
  if (prominence === 'Hero' || prominence === 'Display' || prominence === 'Strong') {
    weight = 'font-semibold';
    if (role === 'Title' && space === 'canvas') weight = 'font-bold';
  }
  if (role === 'Button' || role === 'Action') weight = 'font-medium';

  // 5. Color Logic
  let color = 'text-text';
  const isImmersive = input.pageRole === 'Immersive';

  if (isImmersive) {
    color = 'text-white';
    if (prominence === 'Subtle') color = 'text-white/60';
  } else {
    if (prominence === 'Subtle') color = 'text-text-subtle';
    else if (prominence === 'Strong' || prominence === 'Hero') color = 'text-text';

    // Intent Overrides
    if (intent !== 'Neutral') {
      // If it's a Solid Action (Hero/Strong), text is inverse (handled in component usually, but here we specify)
      const isSolidAction =
        (role === 'Button' || role === 'Action' || role === 'IconButton') &&
        (prominence === 'Hero' || prominence === 'Strong');

      if (isSolidAction) {
        color = 'text-white'; // Assuming default inverse
      } else {
        switch (intent) {
          case 'Brand':
            color = 'text-primary';
            break;
          case 'Positive':
            color = 'text-success';
            break;
          case 'Caution':
            color = 'text-warning';
            break;
          case 'Critical':
            color = 'text-error';
            break;
          case 'Info':
            color = 'text-info';
            break;
        }
      }
    }
  }

  if (state.disabled) {
    color = 'text-text-disabled'; // Define this or use opacity
  }

  // 6. Font Family
  let fontFamily = 'font-sans';
  if ((role === 'Title' || role === 'Heading') && space === 'canvas') {
    fontFamily = 'font-display';
  }

  return {
    size,
    weight,
    lineHeight: role === 'Title' && space === 'canvas' ? 'leading-tight' : 'leading-normal',
    color,
    fontFamily,
  };
}
