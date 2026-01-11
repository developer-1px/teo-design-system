/**
 * Interactive State Token System (IDDL v3.1)
 *
 * prominence × intent × state → className 자동 계산
 *
 * 목적:
 * - hover, active, selected, disabled 상태를 prominence + intent 조합으로 자동 생성
 * - 반복적인 className 패턴 (hover:bg-surface-hover 등) 제거
 * - 일관된 인터랙션 경험 보장
 *
 * 공식:
 * - prominence: Hero > Primary > Secondary > Tertiary
 * - intent: Neutral, Brand, Positive, Caution, Critical, Info
 * - state: idle, hover, active, selected, disabled
 *
 * 예시:
 * Primary + Neutral + hover → hover:bg-surface-hover
 * Primary + Brand + selected → bg-accent-subtle text-accent border-l-2
 * Secondary + Neutral + hover → hover:bg-surface-raised
 */

import { cva } from 'class-variance-authority';
import type { Intent, Prominence } from '@/components/types/Shared.types';

/**
 * Interactive State 타입 정의
 */
export type InteractiveState = 'idle' | 'hover' | 'active' | 'selected' | 'disabled';

/**
 * Interactive Config - Action/Block에 전달할 설정
 */
export interface InteractiveConfig {
  /** 현재 선택 상태 */
  selected?: boolean;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 포커스 가능 여부 */
  focusable?: boolean;
  /** 클릭 가능 여부 (기본: true) */
  clickable?: boolean;
}

/**
 * Interactive State Variants (CVA)
 *
 * prominence × intent 조합에 따른 idle/hover/active/selected/disabled 스타일
 */
export const interactiveVariants = cva('transition-colors duration-150', {
  variants: {
    prominence: {
      Hero: '',
      Strong: '',
      Standard: '',
      Subtle: '',
      Secondary: '',
      Tertiary: '',
      Elevated: '',
      None: '',
    },
    intent: {
      Neutral: '',
      Brand: '',
      Positive: '',
      Caution: '',
      Critical: '',
      Info: '',
      Accent: '',
    },
    state: {
      idle: '',
      hover: '',
      active: '',
      selected: '',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
  compoundVariants: [
    // ==================== Neutral Intent ====================
    // Primary + Neutral (가장 일반적인 버튼/리스트 아이템)
    {
      prominence: 'Standard',
      intent: 'Neutral',
      state: 'idle',
      class: 'bg-surface text-text-primary',
    },
    {
      prominence: 'Standard',
      intent: 'Neutral',
      state: 'hover',
      class: 'hover:bg-surface-hover',
    },
    {
      prominence: 'Standard',
      intent: 'Neutral',
      state: 'active',
      class: 'active:bg-surface-pressed',
    },
    {
      prominence: 'Standard',
      intent: 'Neutral',
      state: 'selected',
      class: 'bg-accent-subtle text-accent border-l-2 border-accent',
    },

    // Secondary + Neutral (덜 강조된 버튼)
    {
      prominence: 'Standard',
      intent: 'Neutral',
      state: 'idle',
      class: 'bg-transparent text-text-secondary',
    },
    {
      prominence: 'Standard',
      intent: 'Neutral',
      state: 'hover',
      class: 'hover:bg-surface-raised',
    },
    {
      prominence: 'Standard',
      intent: 'Neutral',
      state: 'active',
      class: 'active:bg-surface-hover',
    },
    {
      prominence: 'Standard',
      intent: 'Neutral',
      state: 'selected',
      class: 'bg-surface-raised text-text-primary font-medium',
    },

    // Tertiary + Neutral (가장 약한 인터랙션)
    {
      prominence: 'Subtle',
      intent: 'Neutral',
      state: 'idle',
      class: 'bg-transparent text-text-tertiary',
    },
    {
      prominence: 'Subtle',
      intent: 'Neutral',
      state: 'hover',
      class: 'hover:text-text-secondary',
    },
    {
      prominence: 'Subtle',
      intent: 'Neutral',
      state: 'active',
      class: 'active:text-text-primary',
    },
    {
      prominence: 'Subtle',
      intent: 'Neutral',
      state: 'selected',
      class: 'text-text-primary font-medium',
    },

    // ==================== Brand Intent ====================
    // Primary + Brand (Primary CTA)
    {
      prominence: 'Standard',
      intent: 'Brand',
      state: 'idle',
      class: 'bg-accent text-white',
    },
    {
      prominence: 'Standard',
      intent: 'Brand',
      state: 'hover',
      class: 'hover:bg-accent-hover',
    },
    {
      prominence: 'Standard',
      intent: 'Brand',
      state: 'active',
      class: 'active:bg-accent-pressed',
    },
    {
      prominence: 'Standard',
      intent: 'Brand',
      state: 'selected',
      class: 'bg-accent-pressed text-white ring-2 ring-accent ring-offset-2',
    },

    // Secondary + Brand
    {
      prominence: 'Standard',
      intent: 'Brand',
      state: 'idle',
      class: 'bg-transparent text-accent',
    },
    {
      prominence: 'Standard',
      intent: 'Brand',
      state: 'hover',
      class: 'hover:bg-accent-subtle',
    },
    {
      prominence: 'Standard',
      intent: 'Brand',
      state: 'active',
      class: 'active:bg-accent-subtle-hover',
    },
    {
      prominence: 'Standard',
      intent: 'Brand',
      state: 'selected',
      class: 'bg-accent-subtle text-accent font-medium',
    },

    // ==================== Positive Intent ====================
    // Primary + Positive (Success 상태)
    {
      prominence: 'Standard',
      intent: 'Positive',
      state: 'idle',
      class: 'bg-positive text-white',
    },
    {
      prominence: 'Standard',
      intent: 'Positive',
      state: 'hover',
      class: 'hover:bg-positive-hover',
    },
    {
      prominence: 'Standard',
      intent: 'Positive',
      state: 'active',
      class: 'active:bg-positive-pressed',
    },

    // Secondary + Positive
    {
      prominence: 'Standard',
      intent: 'Positive',
      state: 'idle',
      class: 'bg-transparent text-positive',
    },
    {
      prominence: 'Standard',
      intent: 'Positive',
      state: 'hover',
      class: 'hover:bg-positive-subtle',
    },

    // ==================== Caution Intent ====================
    // Primary + Caution (Warning 버튼)
    {
      prominence: 'Standard',
      intent: 'Caution',
      state: 'idle',
      class: 'bg-caution text-white',
    },
    {
      prominence: 'Standard',
      intent: 'Caution',
      state: 'hover',
      class: 'hover:bg-caution-hover',
    },
    {
      prominence: 'Standard',
      intent: 'Caution',
      state: 'active',
      class: 'active:bg-caution-pressed',
    },

    // Secondary + Caution
    {
      prominence: 'Standard',
      intent: 'Caution',
      state: 'idle',
      class: 'bg-transparent text-caution',
    },
    {
      prominence: 'Standard',
      intent: 'Caution',
      state: 'hover',
      class: 'hover:bg-caution-subtle',
    },

    // ==================== Critical Intent ====================
    // Primary + Critical (Delete 등 위험한 동작)
    {
      prominence: 'Standard',
      intent: 'Critical',
      state: 'idle',
      class: 'bg-critical text-white',
    },
    {
      prominence: 'Standard',
      intent: 'Critical',
      state: 'hover',
      class: 'hover:bg-critical-hover',
    },
    {
      prominence: 'Standard',
      intent: 'Critical',
      state: 'active',
      class: 'active:bg-critical-pressed',
    },

    // Secondary + Critical
    {
      prominence: 'Standard',
      intent: 'Critical',
      state: 'idle',
      class: 'bg-transparent text-critical',
    },
    {
      prominence: 'Standard',
      intent: 'Critical',
      state: 'hover',
      class: 'hover:bg-critical-subtle',
    },

    // ==================== Info Intent ====================
    // Primary + Info
    {
      prominence: 'Standard',
      intent: 'Info',
      state: 'idle',
      class: 'bg-info text-white',
    },
    {
      prominence: 'Standard',
      intent: 'Info',
      state: 'hover',
      class: 'hover:bg-info-hover',
    },

    // Secondary + Info
    {
      prominence: 'Standard',
      intent: 'Info',
      state: 'idle',
      class: 'bg-transparent text-info',
    },
    {
      prominence: 'Standard',
      intent: 'Info',
      state: 'hover',
      class: 'hover:bg-info-subtle',
    },
  ],
  defaultVariants: {
    prominence: 'Standard',
    intent: 'Neutral',
    state: 'idle',
  },
});

/**
 * Focus State Variants (CVA) - 키보드 포커스 시각화
 */
export const focusVariants = cva('outline-none', {
  variants: {
    intent: {
      Neutral: 'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      Brand: 'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      Positive: 'focus-visible:ring-2 focus-visible:ring-positive focus-visible:ring-offset-2',
      Caution: 'focus-visible:ring-2 focus-visible:ring-caution focus-visible:ring-offset-2',
      Critical: 'focus-visible:ring-2 focus-visible:ring-critical focus-visible:ring-offset-2',
      Info: 'focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2',
      Accent: 'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
    },
  },
  defaultVariants: {
    intent: 'Neutral',
  },
});

/**
 * Interactive State 적용 헬퍼 함수
 *
 * 사용 예시:
 * ```tsx
 * <button className={getInteractiveClasses({
 *   prominence: 'Standard',
 *   intent: 'Neutral',
 *   config: { selected: true }
 * })}>
 *   List Item
 * </button>
 * ```
 */
export function getInteractiveClasses({
  prominence = 'Standard',
  intent = 'Neutral',
  config = {},
  className,
  skipIdle = false,
}: {
  prominence?: Prominence;
  intent?: Intent;
  config?: InteractiveConfig;
  className?: string;
  skipIdle?: boolean;
}): string {
  const { selected = false, disabled = false, focusable = true } = config;

  // State 결정 (우선순위: disabled > selected > idle)
  let state: InteractiveState = 'idle';
  if (disabled) {
    state = 'disabled';
  } else if (selected) {
    state = 'selected';
  }

  // Interactive variants 적용
  const interactiveClass = (skipIdle && state === 'idle')
    ? ''
    : interactiveVariants({
      prominence,
      intent,
      state,
    });

  // Focus variants 적용 (disabled가 아니고 focusable일 때만)
  const focusClass = !disabled && focusable ? focusVariants({ intent }) : '';

  return `${interactiveClass} ${focusClass} ${className || ''}`.trim();
}

/**
 * Interactive State 디버깅 헬퍼
 */
export function debugInteractiveState({
  prominence,
  intent,
  config,
}: {
  prominence: Prominence;
  intent: Intent;
  config: InteractiveConfig;
}) {
  // Debug function removed
}
