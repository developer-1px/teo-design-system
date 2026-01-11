/**
 * Overlay Role Registry
 *
 * Overlay 컴포넌트의 role configuration 중앙 관리
 *
 * @see docs/architecture/registry-pattern.md
 */

import type { BaseRoleConfig } from '../../shared/role.base';
import type { OverlayProps } from './Overlay.types';

/**
 * Overlay Role Configuration
 *
 * Extends BaseRoleConfig with overlay-specific properties
 */
export interface OverlayRoleConfig extends BaseRoleConfig<OverlayProps> {
  /**
   * Whether this overlay role requires a backdrop (dimmed background)
   */
  hasBackdrop?: boolean;

  /**
   * Whether this overlay role supports dismissing on backdrop click
   */
  supportsDismiss?: boolean;

  /**
   * Default z-index level for this overlay role
   */
  zIndex?: number;

  /**
   * Default placement for this overlay role
   */
  defaultPlacement?: OverlayProps['placement'];
}

/**
 * Overlay Role Registry
 *
 * Each role defines its ARIA properties, base styles, and overlay-specific config
 */
export const ROLE_REGISTRY: Record<string, OverlayRoleConfig> = {
  /**
   * Dialog - 모달 다이얼로그
   *
   * 중앙에 표시되는 모달 창
   * 배경 dimming, ESC/클릭으로 닫기 지원
   */
  Dialog: {
    htmlTag: 'div',
    ariaProps: { role: 'dialog', 'aria-modal': 'true' },
    baseStyles:
      'bg-surface-overlay rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto',
    hasBackdrop: true,
    supportsDismiss: true,
    zIndex: 50,
    defaultPlacement: 'center',
    description: 'Modal dialog with backdrop and dismiss support',
  },

  /**
   * Drawer - 슬라이드 패널
   *
   * 좌/우 측면에서 슬라이드되는 패널
   * 배경 dimming, ESC/클릭으로 닫기 지원
   */
  Drawer: {
    htmlTag: 'div',
    ariaProps: { role: 'dialog', 'aria-modal': 'true' },
    baseStyles: 'fixed inset-y-0 bg-surface-overlay shadow-xl overflow-auto',
    hasBackdrop: true,
    supportsDismiss: true,
    zIndex: 50,
    defaultPlacement: 'right',
    description: 'Side panel drawer with backdrop',
  },

  /**
   * Sheet - 하단/상단 시트
   *
   * 상/하단에서 올라오는 전체 너비 패널
   * 배경 dimming, ESC/클릭으로 닫기 지원
   */
  Sheet: {
    htmlTag: 'div',
    ariaProps: { role: 'dialog', 'aria-modal': 'true' },
    baseStyles: 'fixed bg-surface-overlay shadow-xl w-full max-h-[80vh] overflow-auto',
    hasBackdrop: true,
    supportsDismiss: true,
    zIndex: 50,
    defaultPlacement: 'bottom',
    description: 'Bottom/top sheet with full width',
  },

  /**
   * Popover - 팝오버
   *
   * 특정 요소 근처에 표시되는 작은 오버레이
   * 배경 dimming 없음, 가벼운 상호작용
   */
  Popover: {
    htmlTag: 'div',
    ariaProps: { role: 'dialog' },
    baseStyles:
      'absolute z-40 bg-surface-floating rounded-md shadow-lg border border-default',
    hasBackdrop: false,
    supportsDismiss: true,
    zIndex: 40,
    defaultPlacement: 'center',
    description: 'Lightweight popover without backdrop',
  },

  /**
   * Toast - 토스트 알림
   *
   * 일시적인 알림 메시지
   * 배경 dimming 없음, 자동 닫기 또는 수동 닫기
   */
  Toast: {
    htmlTag: 'div',
    ariaProps: { role: 'alert' },
    baseStyles:
      'fixed z-50 bg-surface-overlay rounded-lg shadow-xl border border-default min-w-[300px] max-w-md',
    hasBackdrop: false,
    supportsDismiss: true,
    zIndex: 50,
    defaultPlacement: 'top-right',
    description: 'Toast notification message',
  },

  /**
   * Tooltip - 툴팁
   *
   * 요소에 마우스 호버 시 표시되는 작은 힌트
   * 배경 dimming 없음, 인터랙션 없음
   */
  Tooltip: {
    htmlTag: 'div',
    ariaProps: { role: 'tooltip' },
    baseStyles:
      'absolute z-50 bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none',
    hasBackdrop: false,
    supportsDismiss: false,
    zIndex: 50,
    defaultPlacement: 'top',
    description: 'Simple tooltip hint',
  },

  /**
   * Lightbox - 라이트박스
   *
   * 이미지/미디어를 전체 화면으로 보여주는 오버레이
   * 강한 배경 dimming (90%), 큰 닫기 버튼
   */
  Lightbox: {
    htmlTag: 'div',
    ariaProps: { role: 'dialog' },
    baseStyles: 'max-w-7xl max-h-[90vh] overflow-auto',
    hasBackdrop: true,
    supportsDismiss: true,
    zIndex: 50,
    defaultPlacement: 'center',
    description: 'Full-screen media lightbox',
  },

  /**
   * Floating - 플로팅 UI
   *
   * 지속적으로 표시되는 플로팅 UI (예: FloatingBar)
   * 배경 dimming 없음, dismissable 지원 안 함 (persistent)
   */
  Floating: {
    htmlTag: 'div',
    ariaProps: {},
    baseStyles: 'fixed z-50',
    hasBackdrop: false,
    supportsDismiss: false,
    zIndex: 50,
    defaultPlacement: 'bottom',
    description: 'Persistent floating UI element',
  },
};

/**
 * Get role configuration
 *
 * @param role - Overlay role name
 * @returns Role configuration or fallback
 */
export function getRoleConfig(role: string): OverlayRoleConfig {
  const config = ROLE_REGISTRY[role];

  if (!config) {
    console.warn(
      `[Overlay] Unknown role "${role}". Using Dialog fallback. Available roles:`,
      Object.keys(ROLE_REGISTRY)
    );

    // Fallback to Dialog
    return ROLE_REGISTRY.Dialog;
  }

  return config;
}

/**
 * Check if role has custom renderer
 *
 * @param role - Overlay role name
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
export function registerRole(role: string, config: OverlayRoleConfig): void {
  if (ROLE_REGISTRY[role]) {
    console.warn(`[Overlay] Overwriting existing role "${role}"`);
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
