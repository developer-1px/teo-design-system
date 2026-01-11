/**
 * Action Role Registry
 *
 * Action 컴포넌트의 role configuration 중앙 관리
 *
 * @see docs/architecture/registry-pattern.md
 */

import type { BaseRoleConfig } from '../../shared/role.base';
import type { ActionProps } from './Action.types';
import { ButtonAction } from './renderers/ButtonAction';
import { IconButtonAction } from './renderers/IconButtonAction';
import { LinkAction } from './renderers/LinkAction';
import { ResizeHandleAction } from './renderers/ResizeHandleAction';

/**
 * Action Role Configuration
 */
export type ActionRoleConfig = BaseRoleConfig<ActionProps>;

/**
 * Action Role Registry
 *
 * 각 role은 renderer를 통해 구현됨
 */
export const ROLE_REGISTRY: Record<string, ActionRoleConfig> = {
  /**
   * Button - 기본 버튼
   *
   * 클릭 이벤트를 처리하는 표준 버튼
   * prominence와 intent로 시각적 변형
   */
  Button: {
    htmlTag: 'button',
    ariaProps: { role: 'button' },
    baseStyles: '',
    renderer: ButtonAction,
    description: 'Standard button with prominence and intent variations',
  },

  /**
   * IconButton - 아이콘 전용 버튼
   *
   * 텍스트 없이 아이콘만 표시하는 버튼
   * title prop 필수 (accessibility)
   */
  IconButton: {
    htmlTag: 'button',
    ariaProps: { role: 'button' },
    baseStyles: '',
    renderer: IconButtonAction,
    description: 'Icon-only button (requires title for accessibility)',
  },

  /**
   * Link - 네비게이션 링크
   *
   * 페이지 이동을 위한 링크
   * behavior.action === 'navigate'일 때 <a> 태그 사용
   */
  Link: {
    htmlTag: 'a',
    ariaProps: { role: 'link' },
    baseStyles: '',
    renderer: LinkAction,
    description: 'Navigation link (uses <a> tag)',
  },

  /**
   * ResizeHandle - 리사이즈 핸들 (v4.1)
   *
   * 그리드 영역 사이에서 크기를 조절하는 핸들
   */
  ResizeHandle: {
    htmlTag: 'div',
    ariaProps: { role: 'separator' },
    baseStyles: '',
    renderer: ResizeHandleAction,
    description: 'Grid-aware resize handle',
  },
};

/**
 * Get role configuration
 *
 * @param role - Action role name
 * @returns Role configuration or fallback
 */
export function getRoleConfig(role: string): ActionRoleConfig {
  const config = ROLE_REGISTRY[role];

  if (!config) {
    console.warn(`[Action] Unknown role "${role}". Using Button fallback. Available roles:`, Object.keys(ROLE_REGISTRY));

    // Fallback to Button
    return ROLE_REGISTRY.Button;
  }

  return config;
}

/**
 * Check if role has custom renderer
 *
 * @param role - Action role name
 * @returns true if role uses custom renderer
 */
export function hasRenderer(role: string): boolean {
  const config = ROLE_REGISTRY[role];
  return config?.renderer !== undefined;
}

/**
 * Register custom role (for extensibility)
 *
 * @param role - Role name
 * @param config - Role configuration
 */
export function registerRole(role: string, config: ActionRoleConfig): void {
  if (ROLE_REGISTRY[role]) {
    console.warn(`[Action] Overwriting existing role "${role}"`);
  }
  ROLE_REGISTRY[role] = config;
}

/**
 * Get all registered roles
 *
 * @returns Array of registered role names
 */
export function getRegisteredRoles(): string[] {
  return Object.keys(ROLE_REGISTRY);
}
