/**
 * Semantic Token Renderer
 *
 * Converts Semantic Tokens → Tailwind CSS Classes
 *
 * Responsibility: Map token names to actual CSS values
 * NOT responsible for: Deciding which tokens to use (that's resolver-logic)
 */

import type {
  BorderToken,
  ColorToken,
  RadiusToken,
  ResolvedIDDLStyles,
  ScaleToken,
  ShadowToken,
  SpaceToken,
  SurfaceToken,
  TokenOutput,
  WeightToken,
} from './types';

// ==========================================
// Semantic Token → Tailwind Mappings
// ==========================================

const SCALE_TO_FONT_SIZE: Record<ScaleToken, string> = {
  'scale.2xs': 'text-[10px]',
  'scale.xs': 'text-xs',
  'scale.sm': 'text-sm',
  'scale.md': 'text-base',
  'scale.lg': 'text-lg',
  'scale.xl': 'text-xl',
  'scale.2xl': 'text-2xl',
  'scale.3xl': 'text-3xl',
  'scale.4xl': 'text-4xl',
};

const SCALE_TO_PADDING: Record<ScaleToken, string> = {
  'scale.2xs': 'px-1 py-0.5',
  'scale.xs': 'px-2 py-1',
  'scale.sm': 'px-3 py-1.5',
  'scale.md': 'px-4 py-2',
  'scale.lg': 'px-5 py-2.5',
  'scale.xl': 'px-6 py-3',
  'scale.2xl': 'px-8 py-4',
  'scale.3xl': 'px-10 py-5',
  'scale.4xl': 'px-12 py-6',
};

const SPACE_TO_GAP: Record<SpaceToken, string> = {
  'space.none': 'gap-0',
  'space.2xs': 'gap-0.5',
  'space.xs': 'gap-1',
  'space.sm': 'gap-2',
  'space.md': 'gap-4',
  'space.lg': 'gap-6',
  'space.xl': 'gap-8',
  'space.2xl': 'gap-12',
};

const SURFACE_TO_BG: Record<SurfaceToken, string> = {
  'surface.base': 'bg-background',
  'surface.raised': 'bg-card',
  'surface.overlay': 'bg-popover',
  'surface.sunken': 'bg-muted/50',
  'surface.transparent': 'bg-transparent',

  'surface.hover': 'bg-accent/50',
  'surface.active': 'bg-accent',
  'surface.selected': 'bg-primary/10',
  'surface.disabled': 'bg-muted opacity-50',

  'intent.brand.default': 'bg-primary',
  'intent.brand.subtle': 'bg-primary/10',
  'intent.brand.hover': 'bg-primary/90',

  'intent.critical.default': 'bg-destructive',
  'intent.critical.subtle': 'bg-destructive/10',
  'intent.critical.hover': 'bg-destructive/90',

  'intent.positive.default': 'bg-green-600',
  'intent.positive.subtle': 'bg-green-500/10',
  'intent.positive.hover': 'bg-green-700',

  'intent.caution.default': 'bg-amber-500',
  'intent.caution.subtle': 'bg-amber-500/10',
  'intent.caution.hover': 'bg-amber-600',

  'intent.info.default': 'bg-blue-500',
  'intent.info.subtle': 'bg-blue-500/10',
  'intent.info.hover': 'bg-blue-600',
};

const BORDER_TO_STYLE: Record<BorderToken, string> = {
  'border.none': 'border-0',
  'border.subtle': 'border border-border/50',
  'border.default': 'border border-border',
  'border.strong': 'border-2 border-border',

  'border.focus': 'ring-2 ring-ring ring-offset-2',
  'border.invalid': 'ring-2 ring-destructive',

  'intent.brand.border': 'border border-primary',
  'intent.critical.border': 'border border-destructive',
  'intent.positive.border': 'border border-green-600',
  'intent.caution.border': 'border border-amber-500',
  'intent.info.border': 'border border-blue-500',
};

const SHADOW_TO_CLASSES: Record<ShadowToken, string> = {
  'shadow.none': 'shadow-none',
  'shadow.subtle': 'shadow-sm',
  'shadow.float': 'shadow-md',
  'shadow.modal': 'shadow-xl',
};

const COLOR_TO_TEXT: Record<ColorToken, string> = {
  'content.default': 'text-foreground',
  'content.muted': 'text-muted-foreground',
  'content.subtle': 'text-muted-foreground/70',
  'content.disabled': 'text-muted-foreground/50',

  'content.brand': 'text-primary',
  'content.critical': 'text-destructive',
  'content.positive': 'text-green-600',
  'content.caution': 'text-amber-600',
  'content.info': 'text-blue-600',

  'content.on-brand': 'text-primary-foreground',
  'content.on-critical': 'text-destructive-foreground',
  'content.on-positive': 'text-white',
  'content.on-caution': 'text-white',
  'content.on-info': 'text-white',
};

const RADIUS_TO_CLASSES: Record<RadiusToken, string> = {
  'radius.none': 'rounded-none',
  'radius.sm': 'rounded-sm',
  'radius.md': 'rounded-md',
  'radius.lg': 'rounded-lg',
  'radius.full': 'rounded-full',
};

const WEIGHT_TO_CLASSES: Record<WeightToken, string> = {
  'weight.normal': 'font-normal',
  'weight.medium': 'font-medium',
  'weight.bold': 'font-bold',
};

// ==========================================
// Renderer Class
// ==========================================

export class SemanticTokenRenderer {
  /**
   * Main render function
   * Converts ResolvedIDDLStyles → TokenOutput (CSS classes)
   */
  render(resolved: ResolvedIDDLStyles): TokenOutput {
    // Typography
    const fontSize = SCALE_TO_FONT_SIZE[resolved.scale];
    const fontWeight = WEIGHT_TO_CLASSES[resolved.weight];
    const lineHeight = 'leading-normal';

    // Spacing
    const padding = SCALE_TO_PADDING[resolved.scale];
    const gap = SPACE_TO_GAP[resolved.gap];

    // Surface
    const background = SURFACE_TO_BG[resolved.surface];
    const color = COLOR_TO_TEXT[resolved.color];

    // Geometry
    const borderWidth = this.resolveBorderWidth(resolved.border);
    const borderColor = this.resolveBorderColor(resolved.border);
    const borderRadius = RADIUS_TO_CLASSES[resolved.radius];

    // Shadow
    const boxShadow = SHADOW_TO_CLASSES[resolved.shadow];

    // Extra classes (transitions, etc.)
    const extraClasses = 'transition-all duration-200 ease-out';

    return {
      fontSize,
      fontWeight,
      lineHeight,

      padding,
      gap,

      background,
      color,

      borderWidth,
      borderColor,
      borderRadius,

      boxShadow,

      extraClasses,
    };
  }

  /**
   * Resolve border width with position
   */
  private resolveBorderWidth(border: ResolvedIDDLStyles['border']): string {
    if (border.style === 'border.none') return 'border-0';

    const baseWidth = border.style === 'border.strong' ? 'border-2' : 'border';

    if (border.position === 'all' || border.position === 'none') {
      return baseWidth;
    }

    // Directional borders
    const positionMap: Record<string, string> = {
      top: 'border-t',
      bottom: 'border-b',
      left: 'border-l',
      right: 'border-r',
    };

    return positionMap[border.position] || baseWidth;
  }

  /**
   * Resolve border color
   */
  private resolveBorderColor(border: ResolvedIDDLStyles['border']): string {
    if (border.style === 'border.none') return '';

    // Extract color from border style token
    if (border.style === 'border.subtle') return 'border-border/50';
    if (border.style === 'border.default') return 'border-border';
    if (border.style === 'border.strong') return 'border-border';
    if (border.style === 'border.focus') return ''; // Handled by ring
    if (border.style === 'border.invalid') return ''; // Handled by ring

    // Intent borders
    if (border.style.startsWith('intent.')) {
      return BORDER_TO_STYLE[border.style].split(' ').slice(1).join(' ');
    }

    return 'border-border';
  }
}

// Export singleton instance
export const renderer = new SemanticTokenRenderer();
