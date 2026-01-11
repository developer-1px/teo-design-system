/**
 * Text Configuration Types
 *
 * Simple vs Complex role 분리:
 * - Simple: HTML 태그 매핑만으로 충분 (Typography, Inline)
 * - Complex: Custom renderer 필요 (Rich, Data, Indicator)
 */

import type { ComponentType } from 'react';
import type { TextProps } from '../Text.types';

/**
 * Simple Role Configuration
 * HTML 태그 매핑과 CSS 클래스만으로 렌더링 가능한 role
 */
export interface SimpleRoleConfig {
  type: 'simple';

  /**
   * 렌더링할 HTML 태그
   */
  htmlTag: keyof React.JSX.IntrinsicElements;

  /**
   * ARIA role (optional override)
   */
  ariaRole?: string;

  /**
   * Base CSS classes (모든 prominence에 공통 적용)
   */
  baseStyles?: string;

  /**
   * Prominence별 추가 스타일
   * prominence prop에 따라 다른 스타일 적용
   */
  prominence?: {
    Hero?: string;
    Strong?: string;
    Standard?: string;
    Subtle?: string;
  };

  /**
   * 설명 (dev 모드 warning용)
   */
  description?: string;
}

/**
 * Complex Role Configuration
 * Custom renderer component가 필요한 role
 * (파싱, 포맷팅, 인터랙션 등)
 */
export interface ComplexRoleConfig {
  type: 'complex';

  /**
   * Custom renderer component
   */
  renderer: ComponentType<TextProps>;

  /**
   * Fallback configuration
   * Renderer가 실패하거나 지원되지 않을 때 사용
   */
  fallback?: SimpleRoleConfig;

  /**
   * 설명 (dev 모드 warning용)
   */
  description?: string;
}

/**
 * Role Configuration (Union type)
 */
export type RoleConfig = SimpleRoleConfig | ComplexRoleConfig;

/**
 * Helper: Check if config is complex
 */
export function isComplexConfig(config: RoleConfig): config is ComplexRoleConfig {
  return config.type === 'complex';
}

/**
 * Helper: Get HTML tag from config
 */
export function getHtmlTag(config: RoleConfig): keyof React.JSX.IntrinsicElements {
  if (config.type === 'simple') {
    return config.htmlTag;
  }
  // Complex config uses fallback or div
  return config.fallback?.htmlTag || 'div';
}
