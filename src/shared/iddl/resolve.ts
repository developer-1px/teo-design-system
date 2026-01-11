import { cn } from '@/shared/lib/utils';
import { INTENT_COLOR_MAP } from './tokens';
import type {
  ButtonSpec,
  Density,
  IDDLProps,
  InputSpec,
  Intent,
  Prominence,
  TextSpec,
} from './types';

// Default values to ensure safety
const DEFAULT_INTENT: Intent = 'Neutral';
const DEFAULT_PROMINENCE: Prominence = 'Standard';
const DEFAULT_DENSITY: Density = 'Standard';

// --- Role-Specific Resolvers ---

function resolveButtonClasses(
  intent: Intent = DEFAULT_INTENT,
  prominence: Prominence = DEFAULT_PROMINENCE,
  density: Density = DEFAULT_DENSITY,
  spec?: ButtonSpec
): string {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white';

  let colorClasses = '';
  const colors = INTENT_COLOR_MAP[intent][prominence];

  if (spec?.variant === 'outline') {
    // For outline, we use the text color for border and text
    // Note: This logic assumes 'text' property in map is 'text-colorname'
    const textColor =
      colors.text === 'text-white' ? colors.bg.replace('bg-', 'text-') : colors.text;
    const borderColor = colors.bg.replace('bg-', 'border-');

    colorClasses = `border ${borderColor} bg-transparent ${textColor} hover:bg-surface-sunken`;
  } else if (spec?.variant === 'ghost') {
    const textColor =
      colors.text === 'text-white' ? colors.bg.replace('bg-', 'text-') : colors.text;
    colorClasses = `bg-transparent ${textColor} hover:bg-surface-sunken`;
  } else {
    // Solid (Default)
    colorClasses = cn(colors.bg, colors.text, colors.hover);
    if (colors.border) colorClasses = cn(colorClasses, 'border', colors.border);
  }

  // Focus ring color
  const focusRing =
    intent === 'Neutral' ? 'focus-visible:ring-gray-400' : 'focus-visible:ring-primary';

  // Sizing
  let sizeClasses = '';
  if (prominence === 'Hero') {
    sizeClasses =
      density === 'Compact' ? 'h-10 px-4 text-base rounded-md' : 'h-12 px-6 text-lg rounded-lg';
  } else if (prominence === 'Subtle') {
    sizeClasses =
      density === 'Compact' ? 'h-7 px-2 text-xs rounded' : 'h-8 px-3 text-sm rounded-md';
  } else {
    // Standard
    sizeClasses =
      density === 'Compact' ? 'h-9 px-3 text-sm rounded-md' : 'h-10 px-4 text-base rounded-md';
  }

  return cn(baseClasses, colorClasses, focusRing, sizeClasses);
}

function resolveTextClasses(
  intent: Intent = DEFAULT_INTENT,
  prominence: Prominence = DEFAULT_PROMINENCE,
  spec?: TextSpec
): string {
  // Role-based presets
  if (spec?.role) {
    switch (spec.role) {
      case 'Title':
        return 'text-xl font-medium tracking-tight';
      case 'Heading':
        return 'text-lg font-medium tracking-tight';
      case 'Body':
        return 'text-base font-normal leading-relaxed';
      case 'Label':
        return 'text-sm font-medium leading-none';
      case 'Caption':
        return 'text-xs text-muted';
    }
  }

  // Generic Intent coloring
  let classes = '';

  if (intent === 'Brand') classes += ' text-primary';
  else if (intent === 'Critical') classes += ' text-error';
  else if (intent === 'Positive') classes += ' text-success';
  else if (intent === 'Caution') classes += ' text-warning';
  else if (intent === 'Info') classes += ' text-info';
  else if (prominence === 'Subtle') classes += ' text-subtle';
  else classes += ' text-text';

  // Sizing
  if (prominence === 'Hero') classes += ' text-lg font-bold';
  else if (prominence === 'Subtle') classes += ' text-sm';
  else classes += ' text-base';

  return classes.trim();
}

function resolveContainerClasses(
  intent: Intent = DEFAULT_INTENT,
  prominence: Prominence = DEFAULT_PROMINENCE
): string {
  const colors = INTENT_COLOR_MAP[intent][prominence];
  let classes = cn(colors.bg, colors.border && `border ${colors.border}`);
  classes = cn(classes, 'rounded-lg');
  return classes;
}

function resolveLabelClasses(
  _intent: Intent = DEFAULT_INTENT,
  prominence: Prominence = DEFAULT_PROMINENCE,
  spec?: TextSpec
): string {
  // Base functionality similar to Text but specifically for form labels
  const base = 'font-medium text-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  let size = 'text-sm';

  if (prominence === 'Hero') size = 'text-base font-semibold';
  else if (prominence === 'Strong')
    size = 'text-sm font-semibold'; // Support 'Strong' alias via IDDL extension if needed, otherwise fallback
  else if (prominence === 'Subtle') size = 'text-xs text-muted';

  let required = '';
  if (spec?.required) {
    required = 'after:content-["*"] after:ml-0.5 after:text-error';
  }

  return cn(base, size, required);
}

function resolveInputClasses(
  intent: Intent = DEFAULT_INTENT,
  prominence: Prominence = DEFAULT_PROMINENCE,
  density: Density = DEFAULT_DENSITY,
  spec?: InputSpec
): string {
  const base =
    'flex w-full rounded-md border border-input shadow-sm transition-colors bg-surface file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-subtle text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50';

  // Sizing (Height & Font)
  let size = '';
  if (prominence === 'Hero') size = 'text-lg h-12';
  else if (prominence === 'Subtle') size = 'text-xs h-8';
  else size = 'text-sm h-9'; // Standard

  // Padding (Density)
  let padding = '';
  if (density === 'Comfortable') padding = 'px-3 py-2';
  else if (density === 'Compact') padding = 'px-2 py-1';
  else padding = 'px-3 py-1'; // Standard

  // Intent (Border Color mainly)
  let borderColor = 'border-default';
  if (spec?.error) {
    borderColor = 'border-error focus-visible:ring-error';
  } else {
    if (intent === 'Brand') borderColor = 'border-primary';
    else if (intent === 'Critical') borderColor = 'border-error';
    else if (intent === 'Positive') borderColor = 'border-success';
    else if (intent === 'Caution') borderColor = 'border-warning';
    else if (intent === 'Info') borderColor = 'border-info';
  }

  // Spec: Multiline
  if (spec?.multiline) {
    size = prominence === 'Hero' ? 'text-lg min-h-32' : 'text-sm min-h-[80px]'; // Reset fixed height for textarea
    // Add specific textarea styles like resize
    return cn(
      base.replace('h-9', '').replace('flex', 'flex'),
      'resize-y',
      size,
      padding,
      borderColor
    );
  }

  // Spec: DataType specifics
  let typeClasses = '';
  if (spec?.type === 'url' || spec?.type === 'code') typeClasses = 'font-mono text-xs';
  else if (spec?.type === 'color') typeClasses = 'w-20 h-9 p-1 cursor-pointer';

  return cn(base, size, padding, borderColor, typeClasses);
}

// --- Main Resolver ---

export function iddl(props: IDDLProps & { spec?: any }): string {
  const { role = 'Action', intent, prominence, density, className, spec } = props;

  let generated = '';

  switch (role) {
    case 'Action':
    case 'Button':
      generated = resolveButtonClasses(intent, prominence, density, spec as ButtonSpec);
      break;
    case 'Text':
      generated = resolveTextClasses(intent, prominence, spec as TextSpec);
      break;
    case 'Container':
      generated = resolveContainerClasses(intent, prominence);
      break;
    case 'Input':
      generated = resolveInputClasses(intent, prominence, density, spec as InputSpec);
      break;
    case 'Label':
      generated = resolveLabelClasses(intent, prominence, spec as TextSpec);
      break;
    default:
      generated = resolveButtonClasses(intent, prominence, density);
  }

  return cn(generated, className);
}
