/**
 * Spacing Token System (IDDL v3.1)
 *
 * prominence × density → gap/padding 자동 계산
 *
 * 목적:
 * - gap-1, px-2, py-1.5 등 수동 spacing 결정 제거
 * - prominence와 density 조합으로 일관된 spacing 보장
 * - 디자인 토큰 기반 자동 계산
 *
 * 공식:
 * - prominence: Hero > Primary > Secondary > Tertiary
 * - density: Comfortable > Standard > Compact
 * - spacing = baseSpacing × prominenceFactor × densityFactor
 *
 * 예시:
 * Primary + Standard → gap-4, px-3, py-2
 * Secondary + Compact → gap-2, px-2, py-1
 * Hero + Comfortable → gap-6, px-6, py-4
 */

import { cva } from 'class-variance-authority';
import type { Density, Prominence } from '@/components/dsl/Shared.types';

/**
 * Spacing Config - Block/Action에 전달할 spacing 설정
 */
export interface SpacingConfig {
  /** prominence 값 (상속 가능) */
  prominence?: Prominence;
  /** density 값 (상속 가능) */
  density?: Density;
  /** spacing 오버라이드 (특수 케이스용) */
  override?: {
    gap?: number;
    padding?: { x?: number; y?: number };
  };
}

/**
 * Spacing Calculation Result
 */
export interface SpacingResult {
  /** gap 값 (children 사이 간격) */
  gap: number;
  /** padding-x 값 (좌우 여백) */
  paddingX: number;
  /** padding-y 값 (상하 여백) */
  paddingY: number;
  /** Tailwind class 문자열 */
  className: string;
}

/**
 * Prominence Factor (기본 크기 배율)
 *
 * Hero: 1.5배 (가장 넓은 spacing)
 * Standard: 1.0배 (표준)
 * Strong: 0.75배
 * Subtle: 0.5배 (가장 좁은 spacing)
 */
const prominenceFactors: Record<Prominence, number> = {
  Hero: 1.5,
  Standard: 1.0,
  Strong: 0.75,
  Subtle: 0.5,
  Secondary: 0.75,
  Tertiary: 0.5,
  Elevated: 1.2,
  None: 0,
};

/**
 * Density Factor (밀도 배율)
 *
 * Comfortable: 1.5배 (여유로운 spacing)
 * Standard: 1.0배 (표준)
 * Compact: 0.75배 (좁은 spacing)
 */
const densityFactors: Record<Density, number> = {
  Comfortable: 1.5,
  Standard: 1.0,
  Compact: 0.75,
};

/**
 * Base Spacing 값 (px)
 *
 * 허용된 spacing 값: 4, 8, 12, 16, 24, 32, 48, 64, 96
 * Base 값: gap 16px, padding-x 12px, padding-y 8px (Standard)
 */
const BASE_GAP = 16;
const BASE_PADDING_X = 12;
const BASE_PADDING_Y = 8;

/**
 * Spacing 값을 허용된 값으로 스냅
 *
 * 계산된 값을 가장 가까운 허용 값으로 반올림
 * 예: 14 → 16, 20 → 24
 */
function snapToAllowedValue(value: number): number {
  const allowedValues = [4, 8, 12, 16, 24, 32, 48, 64, 96];
  return allowedValues.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

/**
 * Spacing px → Tailwind class 변환
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
  return map[value] || '4'; // fallback: 4 (16px)
}

/**
 * Spacing 계산 함수
 *
 * prominence × density → gap/padding 계산
 *
 * 사용 예시:
 * ```tsx
 * const spacing = calculateSpacing({
 *   prominence: 'Standard',
 *   density: 'Standard'
 * });
 * // → { gap: 16, paddingX: 12, paddingY: 8, className: 'gap-4 px-3 py-2' }
 * ```
 */
export function calculateSpacing(config: SpacingConfig = {}): SpacingResult {
  const { prominence = 'Standard', density = 'Standard', override } = config;

  // Override가 있으면 우선 사용
  if (override) {
    const gap = override.gap ?? BASE_GAP;
    const paddingX = override.padding?.x ?? BASE_PADDING_X;
    const paddingY = override.padding?.y ?? BASE_PADDING_Y;

    return {
      gap,
      paddingX,
      paddingY,
      className: `gap-${pxToTailwindClass(gap)} px-${pxToTailwindClass(paddingX)} py-${pxToTailwindClass(paddingY)}`,
    };
  }

  // 공식: baseValue × prominenceFactor × densityFactor
  const prominenceFactor = prominenceFactors[prominence];
  const densityFactor = densityFactors[density];

  const rawGap = BASE_GAP * prominenceFactor * densityFactor;
  const rawPaddingX = BASE_PADDING_X * prominenceFactor * densityFactor;
  const rawPaddingY = BASE_PADDING_Y * prominenceFactor * densityFactor;

  // 허용된 값으로 스냅
  const gap = snapToAllowedValue(rawGap);
  const paddingX = snapToAllowedValue(rawPaddingX);
  const paddingY = snapToAllowedValue(rawPaddingY);

  // Tailwind class 생성
  const className = `gap-${pxToTailwindClass(gap)} px-${pxToTailwindClass(paddingX)} py-${pxToTailwindClass(paddingY)}`;

  return {
    gap,
    paddingX,
    paddingY,
    className,
  };
}

/**
 * Spacing Variants (CVA) - prominence × density 조합
 *
 * Action/Block에서 바로 사용할 수 있는 CVA variants
 */
export const spacingVariants = cva('', {
  variants: {
    prominence: {
      Hero: '',
      Standard: '',
      Strong: '',
      Subtle: '',
      Secondary: '',
      Tertiary: '',
      Elevated: '',
      None: '',
    },
    density: {
      Comfortable: '',
      Standard: '',
      Compact: '',
    },
  },
  compoundVariants: [
    // ==================== Hero (가장 큰 spacing) ====================
    { prominence: 'Hero', density: 'Comfortable', class: 'gap-8 px-8 py-6' }, // 1.5 × 1.5 = 2.25
    { prominence: 'Hero', density: 'Standard', class: 'gap-6 px-6 py-4' }, // 1.5 × 1.0 = 1.5
    { prominence: 'Hero', density: 'Compact', class: 'gap-4 px-4 py-3' }, // 1.5 × 0.75 = 1.125

    // ==================== Standard (표준 spacing) ====================
    { prominence: 'Standard', density: 'Comfortable', class: 'gap-6 px-4 py-3' }, // 1.0 × 1.5 = 1.5
    { prominence: 'Standard', density: 'Standard', class: 'gap-4 px-3 py-2' }, // 1.0 × 1.0 = 1.0
    { prominence: 'Standard', density: 'Compact', class: 'gap-2 px-2 py-1' }, // 1.0 × 0.75 = 0.75

    // ==================== Strong (작은 spacing) ====================
    { prominence: 'Standard', density: 'Comfortable', class: 'gap-4 px-3 py-2' }, // 0.75 × 1.5 = 1.125
    { prominence: 'Standard', density: 'Standard', class: 'gap-3 px-2 py-1.5' }, // 0.75 × 1.0 = 0.75
    { prominence: 'Standard', density: 'Compact', class: 'gap-2 px-2 py-1' }, // 0.75 × 0.75 = 0.5625

    // ==================== Subtle (가장 작은 spacing) ====================
    { prominence: 'Subtle', density: 'Comfortable', class: 'gap-3 px-2 py-1.5' }, // 0.5 × 1.5 = 0.75
    { prominence: 'Subtle', density: 'Standard', class: 'gap-2 px-2 py-1' }, // 0.5 × 1.0 = 0.5
    { prominence: 'Subtle', density: 'Compact', class: 'gap-1 px-1 py-0.5' }, // 0.5 × 0.75 = 0.375
  ],
  defaultVariants: {
    prominence: 'Standard',
    density: 'Standard',
  },
});

/**
 * Gap-only Variants (children 간격만 필요한 경우)
 */
export const gapVariants = cva('', {
  variants: {
    prominence: {
      Hero: '',
      Standard: '',
      Strong: '',
      Subtle: '',
      Secondary: '',
      Tertiary: '',
      Elevated: '',
      None: '',
    },
    density: {
      Comfortable: '',
      Standard: '',
      Compact: '',
    },
  },
  compoundVariants: [
    // Hero
    { prominence: 'Hero', density: 'Comfortable', class: 'gap-8' },
    { prominence: 'Hero', density: 'Standard', class: 'gap-6' },
    { prominence: 'Hero', density: 'Compact', class: 'gap-4' },

    // Primary
    { prominence: 'Standard', density: 'Comfortable', class: 'gap-6' },
    { prominence: 'Standard', density: 'Standard', class: 'gap-4' },
    { prominence: 'Standard', density: 'Compact', class: 'gap-2' },

    // Secondary
    { prominence: 'Standard', density: 'Comfortable', class: 'gap-4' },
    { prominence: 'Standard', density: 'Standard', class: 'gap-3' },
    { prominence: 'Standard', density: 'Compact', class: 'gap-2' },

    // Tertiary
    { prominence: 'Subtle', density: 'Comfortable', class: 'gap-3' },
    { prominence: 'Subtle', density: 'Standard', class: 'gap-2' },
    { prominence: 'Subtle', density: 'Compact', class: 'gap-1' },
  ],
  defaultVariants: {
    prominence: 'Standard',
    density: 'Standard',
  },
});

/**
 * Padding-only Variants (내부 여백만 필요한 경우)
 */
export const paddingVariants = cva('', {
  variants: {
    prominence: {
      Hero: '',
      Standard: '',
      Strong: '',
      Subtle: '',
      Secondary: '',
      Tertiary: '',
      Elevated: '',
      None: '',
    },
    density: {
      Comfortable: '',
      Standard: '',
      Compact: '',
    },
  },
  compoundVariants: [
    // Hero
    { prominence: 'Hero', density: 'Comfortable', class: 'px-8 py-6' },
    { prominence: 'Hero', density: 'Standard', class: 'px-6 py-4' },
    { prominence: 'Hero', density: 'Compact', class: 'px-4 py-3' },

    // Primary
    { prominence: 'Standard', density: 'Comfortable', class: 'px-4 py-3' },
    { prominence: 'Standard', density: 'Standard', class: 'px-3 py-2' },
    { prominence: 'Standard', density: 'Compact', class: 'px-2 py-1' },

    // Secondary
    { prominence: 'Standard', density: 'Comfortable', class: 'px-3 py-2' },
    { prominence: 'Standard', density: 'Standard', class: 'px-2 py-1.5' },
    { prominence: 'Standard', density: 'Compact', class: 'px-2 py-1' },

    // Tertiary
    { prominence: 'Subtle', density: 'Comfortable', class: 'px-2 py-1.5' },
    { prominence: 'Subtle', density: 'Standard', class: 'px-2 py-1' },
    { prominence: 'Subtle', density: 'Compact', class: 'px-1 py-0.5' },
  ],
  defaultVariants: {
    prominence: 'Standard',
    density: 'Standard',
  },
});

/**
 * Spacing 디버깅 헬퍼
 */
export function debugSpacing(config: SpacingConfig) {
  const result = calculateSpacing(config);
  return result;
}

/**
 * 모든 prominence × density 조합 출력 (디버깅용)
 */
export function showSpacingMatrix() {
  const prominences: Prominence[] = ['Hero', 'Standard', 'Standard', 'Subtle'];
  const densities: Density[] = ['Comfortable', 'Standard', 'Compact'];

  console.table(
    prominences.flatMap((prominence) =>
      densities.map((density) => ({
        prominence,
        density,
        ...calculateSpacing({ prominence, density }),
      }))
    )
  );
}
