/**
 * Base Role Configuration Types
 *
 * 모든 IDDL 컴포넌트가 공유하는 role configuration 인터페이스
 *
 * @see docs/architecture/registry-pattern.md
 */

import type { ComponentType } from 'react';

/**
 * Base Role Configuration
 *
 * 모든 role이 가져야 하는 최소 속성 집합
 */
export interface BaseRoleConfig<Props = any> {
  /**
   * Semantic HTML tag
   * 렌더링할 HTML 요소 (div, section, article, button, etc.)
   */
  htmlTag: keyof React.JSX.IntrinsicElements;

  /**
   * ARIA properties for accessibility
   * 접근성을 위한 ARIA 속성
   */
  ariaProps?: Record<string, string | boolean | number>;

  /**
   * Base Tailwind CSS classes
   * 기본 스타일 클래스
   */
  baseStyles?: string;

  /**
   * Custom renderer component (optional)
   * 커스텀 렌더러 컴포넌트 (복잡한 로직이 필요한 경우)
   */
  renderer?: ComponentType<Props>;

  /**
   * Developer documentation
   * 개발자를 위한 role 설명
   */
  description?: string;
}

/**
 * Extended Role Configuration
 *
 * Layout-aware components (Section, Page)를 위한 확장 속성
 */
export interface ExtendedRoleConfig<Props = any> extends BaseRoleConfig<Props> {
  /**
   * CSS Grid area name
   * CSS Grid layout에서 사용할 영역 이름
   */
  gridArea?: string;

  /**
   * Overflow behavior
   * 콘텐츠 오버플로 처리 방식
   */
  overflow?: 'auto' | 'hidden' | 'scroll' | 'visible';

  /**
   * Default size constraints
   * 기본 크기 제약 조건
   */
  defaultSize?: {
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
  };

  /**
   * Physics (Page-specific)
   * Page 컴포넌트의 물리적 제약 (viewport, scroll 등)
   */
  physics?: string;
}

/**
 * Role Registry Interface
 *
 * Registry 패턴을 구현하는 컴포넌트가 제공해야 하는 인터페이스
 */
export interface RoleRegistryAPI<Role extends string, Config> {
  /**
   * Get role configuration
   * @param role - Role name
   * @returns Role configuration or fallback
   */
  getRoleConfig(role: Role): Config;

  /**
   * Check if role has custom renderer
   * @param role - Role name
   * @returns true if role uses custom renderer
   */
  hasRenderer(role: Role): boolean;

  /**
   * Register custom role (for extensibility)
   * @param role - Role name
   * @param config - Role configuration
   */
  registerRole(role: Role | string, config: Config): void;

  /**
   * Get all registered roles
   * @returns Array of registered role names
   */
  getRegisteredRoles(): Role[] | string[];
}

/**
 * Simple Role Configuration
 *
 * 단순한 role (HTML + CSS만 사용, custom renderer 없음)
 */
export interface SimpleRoleConfig<Props = any> extends BaseRoleConfig<Props> {
  type: 'simple';
  renderer?: never; // Simple role은 renderer를 가질 수 없음
}

/**
 * Complex Role Configuration
 *
 * 복잡한 role (custom renderer 필요)
 */
export interface ComplexRoleConfig<Props = any> extends BaseRoleConfig<Props> {
  type: 'complex';
  renderer: ComponentType<Props>; // Complex role은 renderer가 필수
  fallback?: SimpleRoleConfig<Props>; // Renderer 실패 시 fallback
}

/**
 * Discriminated Union of Role Configs
 */
export type RoleConfig<Props = any> = SimpleRoleConfig<Props> | ComplexRoleConfig<Props>;

/**
 * Type guard: Check if config is simple role
 */
export function isSimpleConfig<Props>(config: RoleConfig<Props>): config is SimpleRoleConfig<Props> {
  return config.type === 'simple';
}

/**
 * Type guard: Check if config is complex role
 */
export function isComplexConfig<Props>(config: RoleConfig<Props>): config is ComplexRoleConfig<Props> {
  return config.type === 'complex';
}

/**
 * Fallback Role Configuration
 *
 * Unknown role에 대한 기본 설정
 */
export const FALLBACK_ROLE_CONFIG: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'div',
  baseStyles: '',
  description: 'Fallback role for unknown role types',
};
