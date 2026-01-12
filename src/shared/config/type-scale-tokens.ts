/**
 * Type Scale Tokens (Section Type별 Scale 정의)
 *
 * Section Type Spec 기반 Scale Token System
 * 각 Type은 물리적 제약에 따라 고유한 스케일을 가짐
 *
 * @see docs/2-areas/spec/2-section/section-type-spec.md
 * @see docs/1-project/adaptive-scale-system.md
 */

import type { SectionType, TypeScaleTokens } from '@/components/dsl/Section/Section.types';
export type { SectionType, TypeScaleTokens };

/**
 * Type Scale Tokens (Section Type Spec 기반)
 */
export const TYPE_SCALE_TOKENS: Record<SectionType, TypeScaleTokens> = {
  /**
   * Bar - 가로로 길고 세로가 짧은 선형 영역
   * 높이 제한, 수평 레이아웃, 아이콘 중심
   */
  Bar: {
    dimensions: {
      fixedHeight: 56, // 48-64px 범위
    },
    text: {
      Hero: 20, // Bar의 Hero는 Stage Standard보다 작음
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
      variant: 'icon', // 기본 아이콘만
    },
    defaultDensity: 'Compact',
  },

  /**
   * Rail - 세로로 길고 가로가 극히 좁은 선형 영역
   * 너비 제한, 수직 레이아웃, 아이콘 필수
   */
  Rail: {
    dimensions: {
      minWidth: 48,
      maxWidth: 200,
    },
    text: {
      Hero: 16,
      Standard: 14,
      Subtle: 12,
    },
    space: {
      base: 8,
      tight: 4,
      loose: 12,
    },
    action: {
      height: 40,
      variant: 'menuItem',
    },
    defaultDensity: 'Compact',
  },

  /**
   * Panel - 세로로 길고 가로가 적당히 넓은 면형 영역
   * 너비 제한, 폼/필드 수용 가능
   */
  Panel: {
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
  },

  /**
   * Stage - 양방향으로 자유로운 메인 영역
   * 제약 없음, 모든 크기 사용 가능
   */
  Stage: {
    dimensions: {
      // 제약 없음
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
  },

  /**
   * Layer - 콘텐츠 위에 떠있는 고립된 영역
   * 크기 제한, 포커스 트랩, Backdrop
   */
  Layer: {
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
  },

  /**
   * Float - 특정 요소에 앵커된 작은 점형 영역
   * 최소 크기, 일시적, Backdrop 없음
   */
  Float: {
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
  },
};

/**
 * Get Type Scale Token
 */
export function getTypeScaleToken(sectionType: SectionType): TypeScaleTokens {
  return TYPE_SCALE_TOKENS[sectionType];
}

/**
 * Type별 설명 (데모용)
 */
export const TYPE_DESCRIPTIONS: Record<SectionType, string> = {
  Bar: '가로로 길고 세로가 짧은 선형 영역 (Header, Footer)',
  Rail: '세로로 길고 가로가 극히 좁은 선형 영역 (Navigation)',
  Panel: '세로로 길고 가로가 적당히 넓은 면형 영역 (Sidebar)',
  Stage: '양방향으로 자유로운 메인 영역 (Main Content)',
  Layer: '콘텐츠 위에 떠있는 고립된 영역 (Modal, Dialog)',
  Float: '특정 요소에 앵커된 작은 점형 영역 (Tooltip, Popover)',
};
