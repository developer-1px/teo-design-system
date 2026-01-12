/**
 * Adaptive Scale Calculator
 *
 * prominence × density × sectionType → adaptive value
 *
 * @see docs/1-project/adaptive-scale-system.md
 */

import type { Density, Prominence } from '@/components/dsl/Shared.types';
import { type SectionType, TYPE_SCALE_TOKENS, type TypeScaleTokens } from './type-scale-tokens';

// Re-export SectionType for external use
export type { SectionType } from './type-scale-tokens';

/**
 * Type Scale Factors (Stage = 1.0 기준)
 *
 * 각 Type의 Standard prominence 텍스트 크기 기준
 * - Stage/Layer: 16px (baseValue 16 × 1.0)
 * - Bar/Panel/Rail: 14px (baseValue 16 × 0.875)
 * - Float: 13px (baseValue 16 × 0.8125)
 */
const TYPE_SCALE_FACTORS: Record<SectionType, number> = {
  Bar: 0.875, // Standard 14px
  Rail: 0.875, // Standard 14px
  Panel: 0.875, // Standard 14px
  Stage: 1.0, // Standard 16px (기준)
  Layer: 1.0, // Standard 16px
  Float: 0.8125, // Standard 13px
};

/**
 * Prominence Scale Factors (Type별로 다름)
 *
 * Type 내에서 prominence 간 비율
 * - Stage: 큰 차이 (Hero가 3배 큼)
 * - Panel/Bar: 작은 차이 (Hero가 1.3배 정도)
 */
const PROMINENCE_SCALE_FACTORS: Record<SectionType, Record<Prominence, number>> = {
  Stage: {
    Hero: 1.5,
    Standard: 1.0,
    Strong: 0.875,
    Subtle: 0.875,
    Secondary: 0.875,
    Tertiary: 0.875,
    Elevated: 1.25,
    None: 1.0,
  },
  Panel: {
    Hero: 1.29,
    Standard: 1.0,
    Strong: 0.86,
    Subtle: 0.86,
    Secondary: 0.86,
    Tertiary: 0.86,
    Elevated: 1.15,
    None: 1.0,
  },
  Bar: {
    Hero: 1.43,
    Standard: 1.0,
    Strong: 0.86,
    Subtle: 0.86,
    Secondary: 0.86,
    Tertiary: 0.86,
    Elevated: 1.2,
    None: 1.0,
  },
  Rail: {
    Hero: 1.14,
    Standard: 1.0,
    Strong: 0.86,
    Subtle: 0.86,
    Secondary: 0.86,
    Tertiary: 0.86,
    Elevated: 1.1,
    None: 1.0,
  },
  Layer: {
    Hero: 1.5,
    Standard: 1.0,
    Strong: 0.875,
    Subtle: 0.875,
    Secondary: 0.875,
    Tertiary: 0.875,
    Elevated: 1.25,
    None: 1.0,
  },
  Float: {
    Hero: 1.08,
    Standard: 1.0,
    Strong: 0.92,
    Subtle: 0.92,
    Secondary: 0.92,
    Tertiary: 0.92,
    Elevated: 1.04,
    None: 1.0,
  },
};

/**
 * Density Factors
 */
const DENSITY_FACTORS: Record<Density, number> = {
  Comfortable: 1.5,
  Standard: 1.0,
  Compact: 0.75,
};

/**
 * Base Values (Stage × Standard × Standard 기준)
 */
const BASE_VALUES = {
  gap: 16,
  paddingX: 12,
  paddingY: 8,
  fontSize: 16,
};

/**
 * Allowed spacing values (design tokens)
 */
const ALLOWED_VALUES = [4, 8, 12, 16, 24, 32, 48, 64, 96];

/**
 * Snap to nearest allowed value
 */
function snapToAllowedValue(value: number): number {
  return ALLOWED_VALUES.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

/**
 * Adaptive Scale Result
 */
export interface AdaptiveScaleResult {
  /** 계산된 값 (snap 전) */
  rawValue: number;
  /** Snap된 최종 값 */
  finalValue: number;
  /** 계산 과정 (디버깅용) */
  breakdown: {
    baseValue: number;
    typeFactor: number;
    prominenceFactor: number;
    densityFactor: number;
  };
}

/**
 * Calculate adaptive scale value
 *
 * Formula: baseValue × typeScaleFactor × prominenceScaleFactor × densityFactor
 *
 * @param sectionType - Section Type (Bar, Rail, Panel, Stage, Layer, Float)
 * @param prominence - Prominence (Hero, Standard, Strong, Subtle)
 * @param density - Density (Comfortable, Standard, Compact)
 * @param property - Property to calculate (gap, paddingX, paddingY, fontSize)
 * @returns AdaptiveScaleResult
 */
export function calculateAdaptiveScale(
  sectionType: SectionType,
  prominence: Prominence,
  density: Density,
  property: 'gap' | 'paddingX' | 'paddingY' | 'fontSize'
): AdaptiveScaleResult {
  // 1. Base value
  const baseValue = BASE_VALUES[property];

  // 2. Type scale factor
  const typeFactor = TYPE_SCALE_FACTORS[sectionType];

  // 3. Prominence scale factor (Type별로 다름)
  const prominenceFactor = PROMINENCE_SCALE_FACTORS[sectionType][prominence];

  // 4. Density factor
  const densityFactor = DENSITY_FACTORS[density];

  // 5. Calculate raw value
  const rawValue = baseValue * typeFactor * prominenceFactor * densityFactor;

  // 6. Snap to allowed values
  const finalValue = snapToAllowedValue(rawValue);

  return {
    rawValue,
    finalValue,
    breakdown: {
      baseValue,
      typeFactor,
      prominenceFactor,
      densityFactor,
    },
  };
}

/**
 * Adaptive Spacing Result
 */
export interface AdaptiveSpacingResult {
  gap: number;
  paddingX: number;
  paddingY: number;
  className: string;
  /** 계산 과정 (디버깅용) */
  breakdown: {
    gap: AdaptiveScaleResult;
    paddingX: AdaptiveScaleResult;
    paddingY: AdaptiveScaleResult;
  };
}

/**
 * Calculate adaptive spacing (gap + padding)
 *
 * @param sectionType - Section Type
 * @param prominence - Prominence (default: Standard)
 * @param density - Density (default: Standard)
 * @returns AdaptiveSpacingResult
 */
export function calculateAdaptiveSpacing(
  sectionType: SectionType,
  prominence: Prominence = 'Standard',
  density: Density = 'Standard'
): AdaptiveSpacingResult {
  const gapResult = calculateAdaptiveScale(sectionType, prominence, density, 'gap');
  const paddingXResult = calculateAdaptiveScale(sectionType, prominence, density, 'paddingX');
  const paddingYResult = calculateAdaptiveScale(sectionType, prominence, density, 'paddingY');

  const gap = gapResult.finalValue;
  const paddingX = paddingXResult.finalValue;
  const paddingY = paddingYResult.finalValue;

  // Convert to Tailwind classes
  const gapClass = `gap-${pxToTailwindClass(gap)}`;
  const pxClass = `px-${pxToTailwindClass(paddingX)}`;
  const pyClass = `py-${pxToTailwindClass(paddingY)}`;

  return {
    gap,
    paddingX,
    paddingY,
    className: `${gapClass} ${pxClass} ${pyClass}`,
    breakdown: {
      gap: gapResult,
      paddingX: paddingXResult,
      paddingY: paddingYResult,
    },
  };
}

/**
 * Convert px to Tailwind class suffix
 */
function pxToTailwindClass(value: number): string {
  const map: Record<number, string> = {
    4: '1',
    8: '2',
    12: '3',
    16: '4',
    24: '6',
    32: '8',
    48: '12',
    64: '16',
    96: '24',
  };
  return map[value] || '4';
}

/**
 * Get Type Scale Token
 */
export function getTypeScaleToken(sectionType: SectionType): TypeScaleTokens {
  return TYPE_SCALE_TOKENS[sectionType];
}

/**
 * Calculate adaptive font size
 *
 * @param sectionType - Section Type
 * @param prominence - Prominence
 * @returns Font size in px
 */
export function calculateAdaptiveFontSize(
  sectionType: SectionType,
  prominence: Prominence
): number {
  const result = calculateAdaptiveScale(sectionType, prominence, 'Standard', 'fontSize');
  return result.finalValue;
}

/**
 * Get all combinations for demo/testing
 */
export function getAllCombinations() {
  const sectionTypes: SectionType[] = ['Bar', 'Rail', 'Panel', 'Stage', 'Layer', 'Float'];
  const prominences: Prominence[] = ['Hero', 'Standard', 'Strong', 'Subtle'];
  const densities: Density[] = ['Comfortable', 'Standard', 'Compact'];

  const combinations = [];

  for (const sectionType of sectionTypes) {
    for (const prominence of prominences) {
      for (const density of densities) {
        const spacing = calculateAdaptiveSpacing(sectionType, prominence, density);
        combinations.push({
          sectionType,
          prominence,
          density,
          spacing,
        });
      }
    }
  }

  return combinations;
}
