/**
 * Page Role Registry
 *
 * Page 컴포넌트의 role configuration 중앙 관리
 *
 * @see docs/architecture/registry-pattern.md
 */

import type { BaseRoleConfig } from '../shared/role.base';
import type { PageProps } from './Page.types';

/**
 * Page Role Configuration
 *
 * Extends BaseRoleConfig with page-specific properties
 */
export interface PageRoleConfig extends BaseRoleConfig<PageProps> {
  /**
   * Physics - 페이지의 물리적 동작 방식
   */
  physics: {
    /** 화면 높이 제약 */
    heightConstraint: 'viewport' | 'content' | 'scroll-snap';
    /** 스크롤 동작 */
    scrollBehavior: 'window' | 'container' | 'snap' | 'none';
    /** 오버플로우 처리 */
    overflow: 'auto' | 'hidden' | 'scroll' | 'visible';
    /** 위치 지정 */
    position: 'relative' | 'fixed' | 'absolute';
  };

  /**
   * Whether this role supports maxWidth constraint
   */
  supportsMaxWidth?: boolean;

  /**
   * Whether this role supports centered layout
   */
  supportsCentered?: boolean;

  /**
   * Whether this role uses CSS Grid layout (Application)
   */
  usesGrid?: boolean;

  /**
   * Default prominence for this role
   */
  defaultProminence?: PageProps['prominence'];
}

/**
 * Page Role Registry
 *
 * Each role defines its physics, constraints, and rendering behavior
 */
export const ROLE_REGISTRY: Record<string, PageRoleConfig> = {
  /**
   * Document - 표준 웹 문서
   *
   * 반응형 문서. Window Scroll. (Blog, News, Documentation)
   * 가장 일반적인 페이지 유형
   */
  Document: {
    htmlTag: 'div',
    ariaProps: { role: 'main' },
    baseStyles: 'relative min-h-screen w-full overflow-y-auto flex flex-col',
    physics: {
      heightConstraint: 'content',
      scrollBehavior: 'window',
      overflow: 'auto',
      position: 'relative',
    },
    supportsMaxWidth: true,
    supportsCentered: true,
    usesGrid: false,
    defaultProminence: 'Standard',
    description: 'Standard web document with window scroll (Blog, News, Docs)',
  },

  /**
   * Application - 웹 애플리케이션
   *
   * 100vh 고정. Container Scroll. CSS Grid Layout. (Admin, Dashboard, IDE)
   * 전체 화면을 차지하는 앱 형태
   */
  Application: {
    htmlTag: 'div',
    ariaProps: { role: 'application' },
    baseStyles: 'relative h-screen w-screen overflow-hidden grid',
    physics: {
      heightConstraint: 'viewport',
      scrollBehavior: 'container',
      overflow: 'hidden',
      position: 'relative',
    },
    supportsMaxWidth: false,
    supportsCentered: false,
    usesGrid: true,
    defaultProminence: 'Standard',
    description: 'Full-screen web application with CSS Grid layout (IDE, Dashboard)',
  },

  /**
   * Focus - 단일 행동 집중
   *
   * Center 정렬. No Scroll/Nav. (Login, Payment, Wizard)
   * 사용자가 하나의 작업에만 집중하도록 유도
   */
  Focus: {
    htmlTag: 'div',
    ariaProps: { role: 'main' },
    baseStyles:
      'relative min-h-screen w-full overflow-y-auto flex flex-col items-center justify-center',
    physics: {
      heightConstraint: 'content',
      scrollBehavior: 'window',
      overflow: 'auto',
      position: 'relative',
    },
    supportsMaxWidth: true,
    supportsCentered: true,
    usesGrid: false,
    defaultProminence: 'Standard',
    description: 'Centered single-task focus page (Login, Payment, Wizard)',
  },

  /**
   * Fullscreen - 키오스크/프레젠테이션
   *
   * Fixed inset-0. 전체 화면 고정. (Kiosk, Presentation mode)
   * 화면 전체를 고정하여 사용 (ESC로 종료)
   */
  Fullscreen: {
    htmlTag: 'div',
    ariaProps: { role: 'application' },
    baseStyles: 'fixed inset-0 z-50 h-full w-full overflow-hidden',
    physics: {
      heightConstraint: 'viewport',
      scrollBehavior: 'none',
      overflow: 'hidden',
      position: 'fixed',
    },
    supportsMaxWidth: false,
    supportsCentered: false,
    usesGrid: false,
    defaultProminence: 'Standard',
    description: 'Fixed fullscreen mode (Kiosk, Presentation)',
  },

  /**
   * Immersive - 몰입형 경험
   *
   * Scroll Snap. Viewport 기준 섹션별 이동. (Landing, Presentation)
   * 각 섹션이 100vh로 꽉 차고 스크롤 시 스냅됨
   */
  Immersive: {
    htmlTag: 'div',
    ariaProps: { role: 'main' },
    baseStyles: 'relative h-screen w-full overflow-y-scroll snap-y snap-mandatory',
    physics: {
      heightConstraint: 'scroll-snap',
      scrollBehavior: 'snap',
      overflow: 'scroll',
      position: 'relative',
    },
    supportsMaxWidth: false,
    supportsCentered: false,
    usesGrid: false,
    defaultProminence: 'Standard',
    description: 'Immersive scroll-snap experience (Landing, Presentation)',
  },

  /**
   * Overlay - 모달형 페이지
   *
   * Dimmed Background. Quick View/Modal 형태. (Quick View, Lightbox)
   * 기존 페이지 위에 떠있는 형태의 페이지
   */
  Overlay: {
    htmlTag: 'div',
    ariaProps: { role: 'dialog', 'aria-modal': 'true' },
    baseStyles: 'fixed inset-0 z-50 h-full w-full overflow-y-auto bg-black/50',
    physics: {
      heightConstraint: 'viewport',
      scrollBehavior: 'container',
      overflow: 'auto',
      position: 'fixed',
    },
    supportsMaxWidth: false,
    supportsCentered: false,
    usesGrid: false,
    defaultProminence: 'Standard',
    description: 'Modal-style page with dimmed backdrop (Quick View, Lightbox)',
  },

  /**
   * Paper - 인쇄/고정 규격
   *
   * Fixed Aspect Ratio. (Invoice, Resume, PDF Preview)
   * A4 용지 크기 고정 (210mm × 297mm)
   */
  Paper: {
    htmlTag: 'div',
    ariaProps: { role: 'article' },
    baseStyles:
      'relative mx-auto w-[210mm] min-h-[297mm] overflow-visible shadow-lg bg-white text-black bg-surface',
    physics: {
      heightConstraint: 'content',
      scrollBehavior: 'window',
      overflow: 'visible',
      position: 'relative',
    },
    supportsMaxWidth: false,
    supportsCentered: true,
    usesGrid: false,
    defaultProminence: 'Standard',
    description: 'Fixed A4 paper layout for print (Invoice, Resume, PDF)',
  },
};

/**
 * Get role configuration
 *
 * @param role - Page role name
 * @returns Role configuration or fallback
 */
export function getRoleConfig(role: string): PageRoleConfig {
  const config = ROLE_REGISTRY[role];

  if (!config) {
    console.warn(
      `[Page] Unknown role "${role}". Using Document fallback. Available roles:`,
      Object.keys(ROLE_REGISTRY)
    );

    // Fallback to Document
    return ROLE_REGISTRY.Document;
  }

  return config;
}

/**
 * Check if role has custom renderer
 *
 * @param role - Page role name
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
export function registerRole(role: string, config: PageRoleConfig): void {
  if (ROLE_REGISTRY[role]) {
    console.warn(`[Page] Overwriting existing role "${role}"`);
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
