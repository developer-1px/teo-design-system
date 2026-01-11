/**
 * Typography Role Configurations
 *
 * 가장 많이 사용되는 텍스트 role들:
 * - Title: 페이지/섹션 제목
 * - Heading: 섹션 헤딩 (h1-h6)
 * - Body: 본문 텍스트
 * - Label: 폼 라벨, 설명
 * - Caption: 보조 텍스트, 캡션
 */

import type { SimpleRoleConfig } from '../types';

/**
 * Title - 페이지/섹션 제목
 *
 * prominence에 따라 h1-h4로 렌더링:
 * - Hero: h1 (페이지 최상위 제목)
 * - Strong: h2 (메인 섹션)
 * - Standard: h3 (서브 섹션)
 * - Subtle: h4 (작은 섹션)
 */
export const Title: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'h1', // Default, prominence로 override
  baseStyles: 'font-semibold tracking-tight text-text scroll-m-20',
  prominence: {
    Hero: 'text-4xl lg:text-5xl font-extrabold',
    Strong: 'text-3xl font-semibold first:mt-0',
    Standard: 'text-2xl font-semibold',
    Subtle: 'text-xl font-semibold',
  },
  description: 'Page or section title with semantic hierarchy',
};

/**
 * Heading - 섹션 헤딩
 *
 * spec.level (1-6)로 h1-h6 선택 가능
 * prominence로 크기 조정
 */
export const Heading: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'h2', // Default level
  baseStyles: 'font-semibold tracking-tight text-text scroll-m-20',
  prominence: {
    Hero: 'text-3xl',
    Strong: 'text-2xl',
    Standard: 'text-xl',
    Subtle: 'text-lg',
  },
  description: 'Section heading with configurable level (h1-h6)',
};

/**
 * Body - 본문 텍스트
 *
 * 일반적인 문단 텍스트
 */
export const Body: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'p',
  baseStyles: 'leading-7 text-text',
  prominence: {
    Hero: 'text-xl text-text-muted', // Lead text
    Strong: 'text-lg font-medium',
    Standard: 'text-base',
    Subtle: 'text-sm text-subtle',
  },
  description: 'Paragraph or body text',
};

/**
 * Label - 폼 라벨, 설명 텍스트
 *
 * Form field와 연결되는 라벨이나 설명
 */
export const Label: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'label',
  baseStyles: 'text-sm font-medium leading-none text-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  prominence: {
    Hero: 'text-base font-semibold',
    Strong: 'text-sm font-semibold',
    Standard: 'text-sm font-medium',
    Subtle: 'text-xs font-medium text-subtle',
  },
  description: 'Form label or descriptor text',
};

/**
 * Caption - 보조 텍스트, 캡션
 *
 * 이미지 캡션, 헬퍼 텍스트 등
 */
export const Caption: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'span',
  baseStyles: 'text-sm text-subtle',
  prominence: {
    Hero: 'text-base text-muted',
    Strong: 'text-sm text-muted',
    Standard: 'text-sm text-subtle',
    Subtle: 'text-xs text-subtle',
  },
  description: 'Supporting caption or helper text',
};
