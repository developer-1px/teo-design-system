import type { SectionType, TypeScaleTokens } from '../Section.types';

/**
 * Default Type Scale Tokens
 */

export const BarScale: TypeScaleTokens = {
  dimensions: {
    fixedHeight: 56, // 48-64px 범위
  },
  text: {
    Hero: 20, // Bar의 Hero는 Stage의 Standard보다 작음
    Standard: 14,
    Subtle: 12,
  },
  space: {
    base: 12,
    tight: 8,
    loose: 16,
  },
  action: {
    height: 36,
    iconOnly: true, // 기본적으로 아이콘만
    variant: 'icon',
  },
  defaultDensity: 'Compact',
};

export const RailScale: TypeScaleTokens = {
  dimensions: {
    fixedWidth: 64, // Standard Activity Bar width
    minWidth: 48,
    maxWidth: 80,
  },
  text: {
    Hero: 16,
    Standard: 14,
    Subtle: 12,
  },
  space: {
    base: 12,
    tight: 8,
    loose: 16,
  },
  action: {
    height: 48, // Larger target for rail
    iconOnly: true,
    variant: 'menuItem',
  },
  defaultDensity: 'Compact',
};

export const PanelScale: TypeScaleTokens = {
  dimensions: {
    minWidth: 240,
    maxWidth: 400,
  },
  text: {
    Hero: 18,
    Standard: 14,
    Subtle: 12,
  },
  space: {
    base: 12,
    tight: 8,
    loose: 16,
  },
  action: {
    height: 36,
    variant: 'button',
  },
  field: {
    height: 32,
    labelPosition: 'top',
  },
  defaultDensity: 'Compact',
};

export const StageScale: TypeScaleTokens = {
  dimensions: {
    // 제한 없음
  },
  text: {
    Hero: 48,
    Standard: 16,
    Subtle: 14,
  },
  space: {
    base: 24,
    tight: 16,
    loose: 32,
  },
  action: {
    height: 44,
    variant: 'default',
  },
  field: {
    height: 40,
    labelPosition: 'top',
  },
  defaultDensity: 'Standard',
};

export const LayerScale: TypeScaleTokens = {
  dimensions: {
    maxWidth: 560,
    maxHeight: '90vh',
  },
  text: {
    Hero: 24,
    Standard: 16,
    Subtle: 14,
  },
  space: {
    base: 20,
    tight: 12,
    loose: 24,
  },
  action: {
    height: 44,
    variant: 'default',
  },
  field: {
    height: 40,
    labelPosition: 'top',
  },
  defaultDensity: 'Standard',
};

export const FloatScale: TypeScaleTokens = {
  dimensions: {
    maxWidth: 320,
  },
  text: {
    Hero: 14,
    Standard: 13,
    Subtle: 12,
  },
  space: {
    base: 8,
    tight: 4,
    loose: 12,
  },
  action: {
    height: 28,
    variant: 'menuItem',
  },
  defaultDensity: 'Compact',
};

export const TYPE_SCALES: Record<SectionType, TypeScaleTokens> = {
  Bar: BarScale,
  Rail: RailScale,
  Panel: PanelScale,
  Stage: StageScale,
  Layer: LayerScale,
  Float: FloatScale,
};
