import { TEXT_ROLE_MAP } from '../constants/maps';
import type { SpaceCategory, TokenInput, TypographyTokens } from '../types';

// ====================================================================================
// AXIOM V8.0: 4-TABLE TYPOGRAPHY SYSTEM
// Declarative Scale Mapping: Expressive | Editorial | Product | Dense
// ====================================================================================

// 1. EXPRESSIVE (Marketing / Canvas)
// Context: Landing Pages, Hero Sections, 'Main' region in Document Layout
// Traits: Massive display sizes, tight tracking, high contrast
// 1. EXPRESSIVE (Marketing / Canvas)
const TABLE_Expressive = {
  Title: {
    Hero: 'text-8xl tracking-tighter font-black text-text',
    Strong: 'text-6xl tracking-tight font-extrabold text-text',
    Standard: 'text-4xl tracking-tight font-bold text-text'
  },
  Heading: {
    Hero: 'text-4xl font-bold text-text',
    Strong: 'text-3xl font-bold text-text',
    Standard: 'text-2xl font-semibold text-text'
  },
  Body: {
    Hero: 'text-2xl leading-normal text-text-muted',
    Strong: 'text-xl leading-normal text-text-muted',
    Standard: 'text-lg leading-relaxed text-text-muted'
  },
  Label: {
    Hero: 'text-xl font-medium text-text',
    Strong: 'text-lg font-medium text-text',
    Standard: 'text-base font-medium text-text'
  },
};

// 2. EDITORIAL (Document / Reading)
const TABLE_Editorial = {
  Title: {
    Hero: 'text-5xl font-bold tracking-tight text-text',
    Strong: 'text-4xl font-bold tracking-tight text-text',
    Standard: 'text-3xl font-bold text-text'
  },
  Heading: {
    Hero: 'text-3xl font-semibold text-text',
    Strong: 'text-2xl font-semibold text-text',
    Standard: 'text-xl font-semibold text-text'
  },
  Body: {
    Hero: 'text-xl leading-relaxed text-text',
    Strong: 'text-lg leading-relaxed text-text',
    Standard: 'text-base leading-relaxed text-text' // Document body is primary text
  },
  Label: {
    Hero: 'text-base font-medium text-text-muted',
    Strong: 'text-sm font-medium text-text-muted',
    Standard: 'text-xs font-medium text-text-subtle'
  },
};

// 3. PRODUCT (Application / UI)
const TABLE_Product = {
  Title: {
    Hero: 'text-lg font-bold text-text',
    Strong: 'text-base font-bold text-text',
    Standard: 'text-sm font-semibold text-text'
  },
  Heading: {
    Hero: 'text-base font-semibold text-text',
    Strong: 'text-sm font-semibold text-text',
    Standard: 'text-xs font-semibold text-text-muted'
  },
  Body: {
    Hero: 'text-sm text-text',
    Strong: 'text-xs text-text',
    Standard: 'text-[11px] text-text-muted'
  },
  Label: {
    Hero: 'text-xs font-medium text-text-muted',
    Strong: 'text-[11px] font-medium text-text-subtle',
    Standard: 'text-[10px] font-medium text-text-subtle'
  },
};

// 4. DENSE (Code / Data)
const TABLE_Dense = {
  Title: {
    Hero: 'text-base font-mono font-bold text-text',
    Strong: 'text-sm font-mono font-bold text-text-muted',
    Standard: 'text-xs font-mono font-bold text-text-subtle'
  },
  Heading: {
    Hero: 'text-sm font-mono font-bold text-text',
    Strong: 'text-xs font-mono font-bold text-text-muted',
    Standard: 'text-[10px] font-mono font-bold text-text-subtle'
  },
  Body: {
    Hero: 'text-xs font-mono leading-tight text-text-muted',
    Strong: 'text-[11px] font-mono leading-tight text-text-muted',
    Standard: 'text-[10px] font-mono leading-none text-text-subtle'
  },
  Label: {
    Hero: 'text-[11px] font-mono text-text-muted',
    Strong: 'text-[10px] font-mono text-text-subtle',
    Standard: 'text-[9px] font-mono text-text-subtle'
  },
};

export function generateTypography(input: TokenInput): TypographyTokens {
  const { role, prominence = 'Standard', intent = 'Neutral', state = {}, context } = input;
  const space: SpaceCategory = context?.ancestry?.space || 'surface';
  const roleType = (input.roleMeta?.separation === 'gap') ? 'Product' : 'Editorial'; // Fallback heuristic

  // 1. Determine Table Logic
  let Table = TABLE_Product; // Default to Product (Safest)

  const isApplication = input.pageRole === 'Application';
  const isDenseContext = space === 'well' || role === 'Terminal' || role === 'Code';

  if (isApplication) {
    // Application Mode: STRICTLY Product or Dense
    if (isDenseContext) {
      Table = TABLE_Dense;
    } else {
      Table = TABLE_Product;
    }
  } else {
    // Document / Website Mode: Context-Aware
    if (space === 'canvas') {
      // Canvas -> Expressive (if Hero) or Editorial (if Standard)
      Table = (prominence === 'Hero' || role === 'Title') ? TABLE_Expressive : TABLE_Editorial;
    } else if (space === 'rail' || space === 'bar' || roleType === 'Product') {
      Table = TABLE_Product;
    } else if (isDenseContext) {
      Table = TABLE_Dense;
    }
  }

  // 2. Map Role to Category
  let typeCategory: 'Title' | 'Heading' | 'Body' | 'Label' = 'Body';
  if (role === 'Title') typeCategory = 'Title';
  else if (role === 'Heading' || role === 'SectionHeader') typeCategory = 'Heading';
  else if (role === 'Label' || role === 'Caption' || role === 'Overline' || role === 'Button' || role === 'Action') typeCategory = 'Label';

  // 3. Resolve Prominence
  const promKey = (prominence === 'Hero' || prominence === 'Display') ? 'Hero'
    : (prominence === 'Strong') ? 'Strong'
      : 'Standard';

  // 4. Lookup Composite Token (Size + Weight + Leading + Tracking)
  // We split this string for the Token Engine to consume separate properties if needed,
  // but for now, we can just return the composite class for 'size' and set defaults for others.
  // HOWEVER, the Token Engine expects separate atomic properties.
  // Let's PARSE the composite string. It's a bit hacky but keeps the config clean.
  const composite = Table[typeCategory][promKey] || Table[typeCategory]['Standard'];

  // 5. Atomic Extraction
  // Extract known atomic classes. Anything else goes into size or extra classes.
  // This is a simplified parser.
  const classes = composite.split(' ');
  const sizeClass = classes.find(c => c.startsWith('text-') && !c.startsWith('text-text')) || 'text-base';
  const weightClass = classes.find(c => c.startsWith('font-') && !c.includes('mono')) || 'font-normal';
  const leadingClass = classes.find(c => c.startsWith('leading-')) || 'leading-normal';
  const trackingClass = classes.find(c => c.startsWith('tracking-')) || 'tracking-normal';
  const familyClass = classes.find(c => c.includes('mono')) ? 'font-mono' :
    (space === 'canvas' && (role === 'Title' || role === 'Heading')) ? 'font-display' : 'font-sans';


  // Extract Base Color from Table
  const tableColorClass = classes.find(c => c.startsWith('text-text'));

  // 6. Color Logic
  let color = tableColorClass || 'text-text'; // Use table default or fallback


  if (intent !== 'Neutral') {
    const isSolidAction = (role === 'Button' || role === 'Action' || role === 'IconButton') && (prominence === 'Hero' || prominence === 'Strong');
    if (isSolidAction) color = 'text-white';
    else {
      if (intent === 'Brand') color = 'text-primary';
      else if (intent === 'Positive') color = 'text-success';
      else if (intent === 'Caution') color = 'text-warning';
      else if (intent === 'Critical') color = 'text-error';
      else if (intent === 'Info') color = 'text-info';
    }
  }
  if (state.disabled) color = 'text-text-disabled';

  return {
    size: sizeClass,
    weight: weightClass,
    lineHeight: leadingClass,
    tracking: trackingClass,
    color,
    fontFamily: familyClass,
  };
}
