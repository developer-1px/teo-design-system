import { getSeparationTier } from '../constants/strategies';
import type { SurfaceTokens, TokenInput } from '../types';

// Strategy: Borderless & Gap-First
// - Default is transparent (separation via whitespace/gap).
// - Surface is applied only when containment is explicitly needed (Card, Panel) or for Inputs/Actions.

// Strategy: Borderless & Gap-First
// - Default is transparent (separation via whitespace/gap).
// - Surface is applied explicitly via Role Metadata (v7.0) or for Inputs/Actions.

export function generateSurface(input: TokenInput): SurfaceTokens {
  const {
    role,
    prominence = 'Standard',
    intent = 'Neutral',
    state = {},
    context,
    roleMeta, // v7.0 Meta
  } = input;

  // 1. Determine if this component *should* have a surface
  // Axiom v7.0: Use explicit metadata instead of hardcoded list
  const isSurfaceCreator = roleMeta?.separation === 'surface';
  const isInput =
    role === 'Input' || role === 'TextField' || role === 'Select' || role === 'TextArea';
  const isAction =
    role === 'Button' ||
    role === 'Action' ||
    role === 'IconButton' ||
    role === 'Tab' ||
    role === 'Chip';

  // 2. Base Background
  let background = 'bg-transparent';
  let opacity = 1.0;

  if (isSurfaceCreator) {
    // Surface Levels
    if (prominence === 'Subtle') background = 'bg-surface-sunken';
    else if (prominence === 'Hero' || prominence === 'Strong') background = 'bg-surface-elevated';
    else background = 'bg-surface'; // Standard
  } else if (roleMeta?.separation === 'border' && prominence === 'Strong') {
    background = 'bg-surface-elevated/40 backdrop-blur-md';
  } else if (isInput) {
    background = 'bg-surface-input';
  }

  // 3. Action Logic (Context-Aware)
  if (isAction) {
    // Hero Actions (Brand/Solid)
    if (prominence === 'Hero' || prominence === 'Strong') {
      if (intent === 'Brand') background = 'bg-primary text-text-inverse';
      else if (intent === 'Critical') background = 'bg-error text-text-inverse';
      else if (intent === 'Positive') background = 'bg-success text-text-inverse';
      else if (intent === 'Caution') background = 'bg-warning text-text-inverse';
      else if (intent === 'Info') background = 'bg-info text-text-inverse';
      else background = 'bg-primary-emphasis text-text-inverse';
    }
    // Standard/Subtle Actions (Ghost/Tinted)
    else if (prominence === 'Standard') {
      // Secondary action style
      background = 'bg-secondary/10 hover:bg-secondary/20 text-text';
    } else {
      // Subtle (Ghost)
      background = 'bg-transparent hover:bg-surface-hover text-text';
    }
  }

  // 4. State Overrides
  if (state.hover && !state.disabled) {
    // Note: For solid actions, the hover effect is often handled by CSS class modifiers (e.g. hover:bg-primary-dark).
    // Here we handle the *token* level.
    if (background === 'bg-transparent') {
      background = 'bg-surface-hover';
    }
  }

  if (state.selected) {
    background = 'bg-active text-text'; // Active/Selected state
  }

  if (state.disabled) {
    opacity = 0.5;
  }

  // 5. Contextual Overrides
  let blur = '';
  const sectionType = context?.ancestry?.space; // e.g. 'bar', 'float'

  // Float Space (Menu, Popover) -> Glassmorphism
  if (sectionType === 'float' || role === 'Modal' || role === 'Popover') {
    blur = 'backdrop-blur-md';
    if (background === 'bg-surface') background = 'bg-surface/90'; // Translucency
  }

  // Bar Space -> Sometimes bars themselves need a background
  // But usually the *Section* has the background, not the Block.
  // However, if this Block IS a Toolbar, does it have a background?
  // "Borderless" principle says: Toolbar should be transparent, separation via Gap.
  // Unless prominence is elevated.

  // Immersive Mode Override
  if (input.pageRole === 'Immersive') {
    if (role === 'Page') {
      background =
        'bg-[#02040a] relative overflow-hidden ' +
        'before:absolute before:top-[-10%] before:left-[-10%] before:w-[40%] before:h-[40%] before:bg-primary/10 before:blur-[120px] before:rounded-full before:pointer-events-none ' +
        'after:absolute after:bottom-[-10%] after:right-[-10%] after:w-[30%] after:h-[30%] after:bg-purple-500/5 after:blur-[100px] after:rounded-full after:pointer-events-none';
    }
  }

  return {
    background,
    opacity,
    blur,
  };
}
