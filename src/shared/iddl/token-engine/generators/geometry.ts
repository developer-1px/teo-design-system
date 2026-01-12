import { BASE_PADDING_MAP, RADIUS_RATIO } from '../constants/maps';
import { getSeparationTier } from '../constants/strategies';
import type { GeometryTokens, TokenInput } from '../types';

function snapToRadius(pxValue: number): string {
  if (pxValue >= 9999) return 'rounded-full';
  if (pxValue === 0) return 'rounded-none';
  const allowedValues = [0, 2, 4, 6, 8, 12, 16, 24];
  const snapped = allowedValues.reduce((prev, curr) =>
    Math.abs(curr - pxValue) < Math.abs(prev - pxValue) ? curr : prev
  );
  const radiusMap: Record<number, string> = {
    0: 'rounded-none',
    2: 'rounded-sm',
    4: 'rounded',
    6: 'rounded-md',
    8: 'rounded-lg',
    12: 'rounded-xl',
    16: 'rounded-2xl',
    24: 'rounded-3xl',
  };
  return radiusMap[snapped] || 'rounded-md';
}

function calculateRadius(role: string): string {
  const ratio = RADIUS_RATIO[role] || RADIUS_RATIO['Default'];
  if (ratio === 0) return 'rounded-none';
  if (ratio >= 999) return 'rounded-full';
  const basePadding = BASE_PADDING_MAP[role] || BASE_PADDING_MAP['Default'];
  const radiusPx = basePadding.x * 16 * ratio;
  return snapToRadius(radiusPx);
}

// Strategy: Borderless via Explicit Metadata
// - Border is applied only when roleMeta.separation === 'border' (or explicit input/action states).
// - Radius implies containment (separation !== 'none' or 'gap').

export function generateGeometry(input: TokenInput): GeometryTokens {
  const {
    role,
    prominence = 'Standard',
    intent = 'Neutral',
    state = {},
    context,
    roleMeta, // v7.0 Meta
  } = input;

  const isInput =
    role === 'Input' || role === 'TextField' || role === 'Select' || role === 'TextArea';

  // Axiom v7.0: Separation Strategy
  const separation = roleMeta?.separation || 'gap'; // Default to gap (transparent)
  const hasContainment =
    separation === 'surface' || separation === 'border' || isInput || state.hover;

  const tier = getSeparationTier(role, prominence, isInput);

  // 1. Border Logic
  let widthNum = 0;
  let color = 'border-transparent';

  if (separation === 'border' || isInput) {
    widthNum = 1;
    color = 'border-border-default/80';
    if (isInput) color = 'border-border-muted/20';
  }

  // Intent Overrides
  if (widthNum > 0 && intent !== 'Neutral') {
    const opacity = isInput ? '30' : '40';
    const i = intent.toLowerCase();
    color = `border-${i === 'brand' ? 'primary' : i === 'critical' ? 'error' : i}/${opacity}`;
  }

  // 2. Radius Logic
  // Rule: "Padding implies Radius" -> Containment implies Radius
  let radius = 'rounded-none';

  if (hasContainment) {
    radius = calculateRadius(role);
  }

  // 3. State Overrides
  let outline = 'outline-none';
  let outlineOffset = 'outline-offset-0';

  if (state.selected) {
    outline = 'outline outline-1 outline-primary/40';
    outlineOffset = 'outline-offset-[-1px]';
  }
  if (state.focus) {
    outline = 'outline outline-2 outline-primary/60';
    outlineOffset = 'outline-offset-2';
  }

  // 4. Page/Section Specialty Logic
  let customBorders = '';
  if (separation === 'border') {
    if (role === 'Header' || role === 'Bar') customBorders = 'border-b';
    else if (role === 'Footer') customBorders = 'border-t';
    else if (role === 'PrimarySidebar') customBorders = 'border-r';
    else if (role === 'SecondarySidebar' || role === 'Aside') customBorders = 'border-l';
    else if (role === 'Panel') customBorders = 'border-t';
  }

  if (input.pageRole === 'Immersive') {
    const isContainer = role === 'Card' || role === 'Panel' || role === 'Modal';
    if (isContainer && (tier === 'Level2' || tier === 'Level3' || separation === 'surface')) {
      widthNum = 1;
      color = 'border-white/10';
    }
  }

  // 5. Overflow
  let overflow = 'overflow-visible';
  const needsClipping = ['ImageCard', 'Avatar', 'MediaContainer', 'Canvas'];
  if (needsClipping.includes(role)) {
    overflow = 'overflow-hidden';
  }

  const width =
    customBorders ||
    (widthNum === 0 ? 'border-0' : widthNum === 1 ? 'border' : `border-${widthNum}`);

  return {
    width,
    color,
    radius,
    outline,
    outlineOffset,
    overflow,
  };
}
