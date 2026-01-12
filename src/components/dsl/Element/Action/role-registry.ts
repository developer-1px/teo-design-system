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
import { ChipAction } from './renderers/ChipAction';
import { IconButtonAction } from './renderers/IconButtonAction';
import { LinkAction } from './renderers/LinkAction';
import { ListItemAction } from './renderers/ListItemAction';
import { MenuItemAction } from './renderers/MenuItemAction';
import { ResizeHandleAction } from './renderers/ResizeHandleAction';
import { SurfaceAction } from './renderers/SurfaceAction';
import { TabAction } from './renderers/TabAction';
import { Option } from './role/Option'; // ✨ New

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
   * Option - 선택 옵션 (v4.2)
   *
   * Dense UI를 위한 마이크로 버튼 (Toggle/Selectable)
   */
  Option: {
    htmlTag: 'button',
    ariaProps: { role: 'option' },
    baseStyles: '',
    renderer: Option,
    description: 'Dense option button with Micro text',
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
   */
  ResizeHandle: {
    htmlTag: 'div',
    ariaProps: { role: 'separator' },
    baseStyles: '',
    renderer: ResizeHandleAction,
    description: 'Grid-aware resize handle',
  },

  // ... (existing code)

  // ==================== Migrated from Block ====================
  Tab: {
    htmlTag: 'button',
    ariaProps: { role: 'tab' },
    baseStyles: '', // Renderer handles styles
    renderer: TabAction,
    description: 'Tab Item (Migrated)',
  },
  MenuItem: {
    htmlTag: 'button',
    ariaProps: { role: 'menuitem' },
    baseStyles: '', // Renderer handles styles
    renderer: MenuItemAction,
    description: 'Menu Item (Migrated)',
  },
  ListItem: {
    htmlTag: 'div',
    ariaProps: { role: 'listitem' },
    baseStyles: '', // Renderer handles styles
    renderer: ListItemAction,
    description: 'List Item (Migrated)',
  },
  Chip: {
    htmlTag: 'button',
    baseStyles: '', // Renderer handles styles
    renderer: ChipAction,
    description: 'Chip/Tag (Interactive)',
  },
  BreadcrumbItem: {
    htmlTag: 'a', // or button
    baseStyles: 'hover:text-text-primary hover:underline',
    renderer: LinkAction,
    description: 'Breadcrumb Item',
  },
  StepItem: {
    htmlTag: 'button',
    baseStyles: 'flex items-center gap-2',
    renderer: ButtonAction,
    description: 'Stepper Item',
  },
  PageButton: {
    htmlTag: 'button',
    baseStyles: 'w-8 h-8 flex items-center justify-center rounded hover:bg-surface-hover',
    renderer: ButtonAction,
    description: 'Pagination Item',
  },
  Notification: {
    htmlTag: 'div',
    baseStyles: 'p-4 border-b border-border-default hover:bg-surface-hover cursor-pointer',
    renderer: ButtonAction, // Placeholder
    description: 'Notification Item',
  },
  DropdownTrigger: {
    htmlTag: 'button',
    baseStyles: '',
    renderer: ButtonAction,
    description: 'Dropdown Trigger',
  },
  AccordionTrigger: {
    htmlTag: 'button',
    baseStyles: 'flex items-center justify-between w-full py-2 font-medium',
    renderer: ButtonAction,
    description: 'Accordion Trigger',
  },
  TooltipTrigger: {
    htmlTag: 'span',
    baseStyles: 'cursor-help',
    renderer: ButtonAction,
    description: 'Tooltip Trigger',
  },
  TreeItem: {
    htmlTag: 'div',
    baseStyles: 'flex items-center gap-1 py-0.5 px-2 hover:bg-surface-hover cursor-pointer',
    renderer: ButtonAction,
    description: 'Tree Node',
  },
  Card: {
    htmlTag: 'div',
    baseStyles: 'bg-surface border border-border-default rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 flex flex-col gap-4',
    renderer: SurfaceAction,
    description: 'Interactive Card',
  },
  Row: {
    htmlTag: 'div',
    baseStyles: 'flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-surface-hover transition-colors w-full',
    renderer: SurfaceAction,
    description: 'Interactive Row',
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
    console.warn(
      `[Action] Unknown role "${role}". Using Button fallback. Available roles:`,
      Object.keys(ROLE_REGISTRY)
    );

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
