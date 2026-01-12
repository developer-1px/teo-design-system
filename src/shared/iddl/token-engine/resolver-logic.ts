/**
 * IDDL Resolution System v2.0
 *
 * Stage 1: Form (형태) — 크기, 간격
 * Stage 2: Tone (명암) — 면, 그림자, 선
 * Stage 3: Color (색채) — 의미 색상, 상태
 */

import type {
  BorderToken,
  ColorToken,
  Density,
  IDDLContext,
  Prominence,
  RadiusToken,
  Relationship,
  ResolvedIDDLStyles,
  ScaleToken,
  ShadowToken,
  SpaceCategory,
  SpaceToken,
  SurfaceToken,
  TokenInput,
  WeightToken,
} from './types';

// ==========================================
// Stage 1: Form Constants
// ==========================================

const SCALE_STEPS: ScaleToken[] = [
  'scale.2xs',
  'scale.xs',
  'scale.sm',
  'scale.md',
  'scale.lg',
  'scale.xl',
  'scale.2xl',
  'scale.3xl',
  'scale.4xl',
];

const SPACE_STEPS: SpaceToken[] = [
  'space.none',
  'space.2xs',
  'space.xs',
  'space.sm',
  'space.md',
  'space.lg',
  'space.xl',
  'space.2xl',
];

// Space → Ceiling
const SPACE_CEILING: Record<SpaceCategory, ScaleToken> = {
  float: 'scale.sm',
  bar: 'scale.md',
  rail: 'scale.md',
  well: 'scale.sm',
  surface: 'scale.xl',
  canvas: 'scale.4xl',
};

// Space → Base Scale (Standard prominence)
const SPACE_BASE_SCALE: Record<SpaceCategory, ScaleToken> = {
  float: 'scale.xs',
  bar: 'scale.sm',
  rail: 'scale.sm',
  well: 'scale.xs',
  surface: 'scale.md',
  canvas: 'scale.lg',
};

// Prominence → Scale Offset
const PROMINENCE_SCALE_OFFSET: Record<Prominence, number> = {
  Hidden: -99,
  Subtle: -1,
  Standard: 0,
  Hero: +1,
  Display: +2,
};

// Depth → Attenuation (penalty)
const DEPTH_ATTENUATION: Record<number, number> = {
  0: 0, // Page
  1: 0, // Section
  2: 0, // Block
  3: -1, // Element
  4: -2, // Deep nesting
  5: -2,
};

// Relationship → Base Gap
const RELATIONSHIP_BASE_GAP: Record<Relationship, SpaceToken> = {
  atomic: 'space.2xs',
  related: 'space.xs',
  grouped: 'space.sm',
  separated: 'space.md',
  distinct: 'space.lg',
};

// Density → Multiplier
const DENSITY_MULTIPLIER: Record<Density, number> = {
  Compact: 0.66,
  Standard: 1.0,
  Comfortable: 1.5,
};

// Space → Gap Multiplier
const SPACE_GAP_MULTIPLIER: Record<SpaceCategory, number> = {
  float: 0.66,
  bar: 0.66,
  well: 0.75,
  rail: 0.85,
  surface: 1.0,
  canvas: 1.25,
};

function stepToNum(step: string, steps: string[]): number {
  return steps.indexOf(step);
}

function numToStep<T>(num: number, steps: T[]): T {
  const clamped = Math.max(0, Math.min(num, steps.length - 1));
  return steps[clamped];
}

/**
 * Stage 1: Form
 * Output: scale, gap
 */
export function resolveFormStage(
  input: TokenInput,
  context: IDDLContext
): {
  scale: ScaleToken;
  gap: SpaceToken;
} {
  const space = context.ancestry.space;
  const depth = context.ancestry.depth;
  const prominence = input.prominence || 'Standard';
  const density = context.inheritance.effectiveDensity;
  const relationship = context.relationship.toPrevious || 'related';

  // 1. Scale = f(Space, Prominence, Depth)
  const baseNum = stepToNum(SPACE_BASE_SCALE[space], SCALE_STEPS);
  const offset = PROMINENCE_SCALE_OFFSET[prominence];
  const penalty = DEPTH_ATTENUATION[Math.min(depth, 5)] || 0;
  const ceilingNum = stepToNum(SPACE_CEILING[space], SCALE_STEPS);

  const rawScaleNum = baseNum + offset + penalty;
  const scale = numToStep(Math.min(rawScaleNum, ceilingNum), SCALE_STEPS);

  // 2. Gap = f(Relationship, Density, Space)
  const gapBaseToken = RELATIONSHIP_BASE_GAP[relationship];
  const gapBaseNum = stepToNum(gapBaseToken, SPACE_STEPS);

  const densityMult = DENSITY_MULTIPLIER[density];
  const spaceMult = SPACE_GAP_MULTIPLIER[space];

  const rawGapNum = Math.round(gapBaseNum * densityMult * spaceMult);
  const gap = numToStep(rawGapNum, SPACE_STEPS);

  return { scale, gap };
}

// ==========================================
// Stage 2: Tone Constants
// ==========================================

// Space → Surface Strategy
const SPACE_SURFACE_STRATEGY: Record<SpaceCategory, SurfaceToken> = {
  canvas: 'surface.base',
  bar: 'surface.base',
  rail: 'surface.base',
  well: 'surface.sunken',
  surface: 'surface.raised',
  float: 'surface.overlay',
};

// Space → Shadow
const SPACE_SHADOW: Record<SpaceCategory, ShadowToken> = {
  canvas: 'shadow.none',
  bar: 'shadow.none',
  rail: 'shadow.none',
  well: 'shadow.none',
  surface: 'shadow.subtle',
  float: 'shadow.float',
};

// Space → Border Style
const SPACE_BORDER_STYLE: Record<SpaceCategory, BorderToken> = {
  canvas: 'border.none',
  bar: 'border.subtle',
  rail: 'border.subtle',
  well: 'border.default',
  surface: 'border.subtle',
  float: 'border.none',
};

// Space → Border Position
const SPACE_BORDER_POSITION: Record<
  SpaceCategory,
  'all' | 'top' | 'bottom' | 'left' | 'right' | 'none'
> = {
  canvas: 'none',
  bar: 'bottom',
  rail: 'right',
  well: 'all',
  surface: 'all',
  float: 'none',
};

/**
 * Stage 2: Tone
 * Output: surface, shadow, border
 */
export function resolveToneStage(
  input: TokenInput,
  context: IDDLContext
): {
  surface: SurfaceToken;
  shadow: ShadowToken;
  border: {
    style: BorderToken;
    position: 'all' | 'top' | 'bottom' | 'left' | 'right' | 'none';
  };
} {
  const space = context.ancestry.space;
  const prominence = input.prominence || 'Standard';

  // 1. Surface
  let surface = SPACE_SURFACE_STRATEGY[space];

  // Prominence override
  if (prominence === 'Subtle') {
    surface = 'surface.transparent';
  } else if (prominence === 'Hidden') {
    surface = 'surface.transparent';
  }

  // 2. Shadow
  let shadow = SPACE_SHADOW[space];

  // Z-Level accumulation (부모 Z-Level 고려)
  const totalZLevel = context.ancestry.parentZLevel + (space === 'float' ? 1 : 0);
  if (totalZLevel >= 3) {
    shadow = 'shadow.modal';
  } else if (totalZLevel >= 2) {
    shadow = 'shadow.float';
  }

  // 3. Border
  const style = SPACE_BORDER_STYLE[space];
  const position = SPACE_BORDER_POSITION[space];

  return {
    surface,
    shadow,
    border: { style, position },
  };
}

// ==========================================
// Stage 3: Color Constants
// ==========================================

/**
 * Stage 3: Color
 * Output: color (text), surfaceToken (with intent)
 *
 * State Priority (스펙 Line 164-171):
 * 1. Selection (selected, indeterminate)
 * 2. Validity (invalid, pending)
 * 3. Interaction (hover, focus, active, disabled)
 *
 * 나중 것이 이전 것을 덮어쓴다.
 */
export function resolveColorStage(
  input: TokenInput,
  context: IDDLContext,
  currentSurface: SurfaceToken
): {
  color: ColorToken;
  surface: SurfaceToken;
} {
  const intent = input.intent || 'Neutral';
  const prominence = input.prominence || 'Standard';
  const state = context.state;

  let color: ColorToken = 'content.default';
  let surface: SurfaceToken = currentSurface;

  // Base Intent Mapping
  if (intent !== 'Neutral') {
    const intentKey = intent.toLowerCase() as
      | 'brand'
      | 'critical'
      | 'positive'
      | 'caution'
      | 'info';

    if (prominence === 'Hero' || prominence === 'Display') {
      // Solid background with on-color text
      surface = `intent.${intentKey}.default` as SurfaceToken;
      color = `content.on-${intentKey}` as ColorToken;
    } else if (prominence === 'Standard') {
      // Subtle background with colored text
      surface = `intent.${intentKey}.subtle` as SurfaceToken;
      color = `content.${intentKey}` as ColorToken;
    } else {
      // Text-only coloring
      color = `content.${intentKey}` as ColorToken;
    }
  }

  // State Priority Application (스펙 순서대로)

  // Priority 1: Selection
  if (state.selection === 'selected') {
    surface = 'surface.selected';
    // color remains same (preserve intent color)
  } else if (state.selection === 'indeterminate') {
    surface = 'surface.selected';
    color = 'content.muted';
  }

  // Priority 2: Validity
  if (state.validity === 'invalid') {
    surface = 'intent.critical.subtle';
    color = 'content.critical';
  } else if (state.validity === 'pending') {
    surface = 'intent.caution.subtle';
    color = 'content.caution';
  }

  // Priority 3: Interaction
  if (state.interaction === 'hover' && state.selection !== 'selected') {
    // Hover on intent surfaces
    if (surface.startsWith('intent.')) {
      const intentKey = surface.split('.')[1];
      surface = `intent.${intentKey}.hover` as SurfaceToken;
    } else {
      surface = 'surface.hover';
    }
  } else if (state.interaction === 'active') {
    surface = 'surface.active';
  } else if (state.interaction === 'focus') {
    // Focus doesn't change surface, only adds outline (handled by border)
  } else if (state.interaction === 'disabled') {
    surface = 'surface.disabled';
    color = 'content.disabled';
  }

  return { color, surface };
}

// ==========================================
// Radius & Weight Resolution
// ==========================================

/**
 * Radius: Based on scale and siblings
 */
function resolveRadius(scale: ScaleToken, siblings: IDDLContext['siblings']): RadiusToken {
  // Base radius from scale
  const scaleNum = stepToNum(scale, SCALE_STEPS);

  let radius: RadiusToken;
  if (scaleNum <= 1) radius = 'radius.sm';
  else if (scaleNum <= 3) radius = 'radius.md';
  else radius = 'radius.lg';

  // Siblings context: only first/last gets full radius
  // Middle items get partial radius (not implemented yet - would need directional radius)

  return radius;
}

/**
 * Weight: Based on prominence
 */
function resolveWeight(prominence: Prominence): WeightToken {
  if (prominence === 'Display' || prominence === 'Hero') return 'weight.bold';
  if (prominence === 'Standard') return 'weight.medium';
  return 'weight.normal';
}

// ==========================================
// Full Orchestrator
// ==========================================

/**
 * Main Resolution Function
 * Orchestrates all 3 stages
 */
export function resolveIDDL(input: TokenInput, context: IDDLContext): ResolvedIDDLStyles {
  // Stage 1: Form
  const { scale, gap } = resolveFormStage(input, context);

  // Stage 2: Tone
  const { surface: toneSurface, shadow, border } = resolveToneStage(input, context);

  // Stage 3: Color (with state priority)
  const { color, surface: finalSurface } = resolveColorStage(input, context, toneSurface);

  // Additional: Radius & Weight
  const radius = resolveRadius(scale, context.siblings);
  const weight = resolveWeight(input.prominence || 'Standard');

  return {
    scale,
    gap,
    surface: finalSurface,
    shadow,
    border,
    color,
    radius,
    weight,
  };
}
