/**
 * Inline Semantic Role Configurations
 *
 * 본문 내에서 사용되는 인라인 시맨틱 텍스트:
 * - Strong: 강조 (굵게)
 * - Emphasis: 강세 (기울임)
 * - Mark: 하이라이트
 * - Link: 링크 (자주 사용됨)
 */

import type { SimpleRoleConfig } from '../types';

/**
 * Strong - 중요한 텍스트
 */
export const Strong: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'strong',
  baseStyles: 'font-semibold',
  description: 'Important text with strong emphasis',
};

/**
 * Emphasis - 강세 텍스트
 */
export const Emphasis: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'em',
  baseStyles: 'italic',
  description: 'Stressed emphasis text',
};

/**
 * Mark - 하이라이트된 텍스트
 */
export const Mark: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'mark',
  baseStyles: 'bg-yellow-200 text-yellow-900 px-1 rounded',
  description: 'Highlighted or marked text',
};

/**
 * Link - 하이퍼링크 (매우 자주 사용)
 */
export const Link: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'a',
  ariaRole: 'link',
  baseStyles: 'text-accent hover:underline cursor-pointer transition-colors',
  prominence: {
    Hero: 'text-lg font-medium',
    Strong: 'text-base font-medium',
    Standard: 'text-base',
    Subtle: 'text-sm',
  },
  description: 'Hyperlink or navigation element',
};

/**
 * Code - 인라인 코드 (자주 사용)
 */
export const Code: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'code',
  baseStyles:
    'relative rounded bg-surface-sunken px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-text',
  description: 'Inline code snippet',
};
