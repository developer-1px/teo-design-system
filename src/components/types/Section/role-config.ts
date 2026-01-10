import type { PageLayout } from '@/components/types/Page/Page.types';
import type { SectionRole } from './Section.types';

/**
 * Layout별 유효한 Section Role 매핑 (v5.0)
 * Page layout에 따라 사용 가능한 Section role이 결정됨
 */
export const LAYOUT_SECTION_ROLES: Record<PageLayout, SectionRole[]> = {
  // Single: Header + Main + Footer (1단 기본형)
  Single: ['Header', 'Main', 'Footer'],

  // Sidebar: Header + Nav + Main + Footer (2단 좌측 메뉴형)
  Sidebar: ['Header', 'Nav', 'Main', 'Footer'],

  // Aside: Header + Main + Aside + Footer (2단 우측 정보형)
  Aside: ['Header', 'Main', 'Aside', 'Footer'],

  // HolyGrail: Header + Nav + Main + Aside + Footer (3단 완전체)
  HolyGrail: ['Header', 'Nav', 'Main', 'Aside', 'Footer'],

  // Split: Header + Master + Detail + Footer (5:5 분할형)
  Split: ['Header', 'Master', 'Detail', 'Footer', 'Toolbar'],

  // Studio: IDE 전용 (모든 영역 노출)
  Studio: [
    'Header',
    'Toolbar',
    'ActivityBar',
    'PrimarySidebar',
    'Editor',
    'SecondarySidebar',
    'UtilityBar',
    'Status',
    'Panel',
    'Footer',
  ],

  // Mobile: Header + Main + Footer + Dock (App)
  Mobile: ['Header', 'Main', 'Footer', 'Dock'],
};

/**
 * Role Configuration Helper (v5.0)
 *
 * Page layout + Section role → 모든 특성 자동 결정
 * - gridArea: CSS Grid 배치
 * - overflow: 스크롤 동작
 * - htmlTag: 시맨틱 HTML 태그
 * - ariaProps: 접근성 속성
 * - baseStyles: 기본 Tailwind 클래스
 *
 * **책임 분리**:
 * - Page: layout 선택 (어떤 레이아웃?)
 * - role-config: layout + role → 모든 설정 자동 계산
 * - Section: 설정을 받아서 렌더링만
 */

export type OverflowBehavior = 'auto' | 'hidden' | 'scroll' | 'visible';

export interface RoleConfig {
  gridArea: string;
  overflow: OverflowBehavior;
  htmlTag: string;
  ariaProps?: Record<string, string>;
  baseStyles: string;
  description?: string;
}

/**
 * Layout별 Role Configuration 정의
 *
 * **스크롤 원칙**:
 * - Toolbar/Header/Footer: overflow-hidden (고정 영역)
 * - Sidebar/Navigator/Aside: overflow-auto (리스트 스크롤)
 * - Editor/Main: context에 따라 (일반적으로 hidden, 내부 컴포넌트가 스크롤)
 * - Panel: overflow-auto (터미널 출력 등)
 */
export const ROLE_CONFIGS: Record<string, Record<string, RoleConfig>> = {
  // ==================== Studio Layout (IDE) ====================
  Studio: {
    ActivityBar: {
      gridArea: 'act',
      overflow: 'hidden',
      htmlTag: 'nav',
      ariaProps: { role: 'navigation', 'aria-label': 'Activity Bar' },
      baseStyles:
        'flex flex-col items-center py-2 w-12 flex-shrink-0 bg-surface-elevated border-r border-border-default',
      description: 'Activity Bar (Core: Nav)',
    },
    PrimarySidebar: {
      gridArea: 'side',
      overflow: 'auto',
      htmlTag: 'nav', // Normalized from 'aside' -> 'nav' as per 'Sidebar' alias rule? Or keep aside for panel-like sidebars? Spec says 'Nav' is core. Let's use 'nav' or 'aside' that semantically fits. Primary Sidebar is usually navigation.
      ariaProps: { 'aria-label': 'Primary Sidebar' },
      baseStyles:
        'flex flex-col flex-shrink-0 bg-surface border-r border-border-default w-full h-full',
      description: 'Primary Sidebar (Core: Nav)',
    },
    Editor: {
      gridArea: 'main',
      overflow: 'hidden', // Editor handles scroll internally
      htmlTag: 'main',
      baseStyles: 'flex-1 flex flex-col min-w-0 bg-surface',
      description: 'Editor (Core: Main)',
    },
    Panel: {
      gridArea: 'panel',
      overflow: 'auto',
      htmlTag: 'section', // Core: Panel -> section
      ariaProps: { 'aria-label': 'Panel' },
      baseStyles:
        'flex flex-col flex-shrink-0 bg-surface-sunken border-t border-border-default w-full h-full',
      description: 'Panel (Core: Panel)',
    },
    SecondarySidebar: {
      gridArea: 'aux',
      overflow: 'auto',
      htmlTag: 'aside', // Core: Aside
      baseStyles:
        'flex flex-col flex-shrink-0 bg-surface border-l border-border-default w-full h-full',
      description: 'Secondary Sidebar (Core: Aside)',
    },
    UtilityBar: {
      gridArea: 'utility',
      overflow: 'hidden',
      htmlTag: 'nav', // Core: Nav
      baseStyles:
        'flex flex-col items-center py-2 w-12 flex-shrink-0 bg-surface-elevated border-l border-border-default',
      description: 'Utility Bar (Core: Nav)',
    },
    Status: {
      gridArea: 'stat',
      overflow: 'hidden',
      htmlTag: 'footer', // Core: Status -> footer
      baseStyles: 'flex items-center bg-accent text-white px-2 min-h-[24px] text-xs',
      description: 'Status Bar (Core: Status)',
    },
    // Explicit Aliases for Studio
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'bg-surface-elevated border-b py-2 px-4 shadow-sm',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'bg-surface-elevated border-t py-1 px-4 text-[10px]',
    },
    Toolbar: {
      gridArea: 'header', // Default toolbar to header area
      overflow: 'hidden',
      htmlTag: 'div',
      baseStyles: 'flex items-center px-4 h-12 border-b bg-surface',
    },
  },

  // ==================== Sidebar Layout ====================
  Sidebar: {
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'sticky top-0 z-10 bg-surface-elevated border-b border-border-muted py-2 px-4',
    },
    Nav: {
      gridArea: 'nav',
      overflow: 'auto',
      htmlTag: 'nav',
      ariaProps: { role: 'navigation' },
      baseStyles: 'flex flex-col w-72 flex-shrink-0 border-r border-border-default',
    },
    // Alias for Nav
    Navigator: {
      gridArea: 'nav',
      overflow: 'auto',
      htmlTag: 'nav',
      baseStyles: 'flex flex-col w-72 flex-shrink-0 border-r border-border-default',
    },
    Main: {
      gridArea: 'main', // Fixed: content -> main
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1',
    },
    // Alias for Main
    Container: {
      gridArea: 'main', // Fixed: content -> main
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'sticky bottom-0 z-10 bg-surface-elevated border-t border-border-muted py-2 px-4',
    },
  },

  // ==================== Aside Layout ====================
  Aside: {
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'sticky top-0 z-10 bg-surface-elevated border-b border-border-muted py-2 px-4',
    },
    Main: {
      gridArea: 'main', // Fixed: content -> main
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1',
    },
    Aside: {
      gridArea: 'aside',
      overflow: 'auto',
      htmlTag: 'aside',
      baseStyles: 'flex flex-col w-64 flex-shrink-0 border-l border-border-default',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'sticky bottom-0 z-10 bg-surface-elevated border-t border-border-muted py-2 px-4',
    },
  },

  // ==================== HolyGrail Layout ====================
  HolyGrail: {
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'bg-surface-elevated border-b border-border-default',
    },
    Nav: {
      gridArea: 'nav', // Fixed: left -> nav
      overflow: 'auto',
      htmlTag: 'nav',
      baseStyles: 'flex flex-col border-r border-border-default',
    },
    Navigator: {
      gridArea: 'nav',
      overflow: 'auto',
      htmlTag: 'nav',
      baseStyles: 'flex flex-col border-r border-border-default',
    }, // Alias
    Main: {
      gridArea: 'main', // Fixed: center -> main
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1 flex flex-col',
    },
    Aside: {
      gridArea: 'aside', // Fixed: right -> aside
      overflow: 'auto',
      htmlTag: 'aside',
      baseStyles: 'flex flex-col border-l border-border-default',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'bg-surface-elevated border-t border-border-default',
    },
  },

  // ==================== Single Layout ====================
  Single: {
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'bg-surface-elevated border-b py-4 px-6 shadow-sm',
    },
    Main: {
      gridArea: 'main',
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1 p-6',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'bg-surface-elevated border-t py-3 px-6 text-sm text-text-secondary',
    },
  },

  // ==================== Mobile Layout ====================
  Mobile: {
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'bg-surface border-b px-4 h-14 flex items-center justify-between sticky top-0 z-20',
    },
    Main: {
      gridArea: 'main',
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'bg-surface border-t px-4 py-2',
    },
    Dock: {
      gridArea: 'dock',
      overflow: 'hidden',
      htmlTag: 'nav',
      baseStyles: 'bg-surface-elevated border-t h-16 flex items-center justify-around sticky bottom-0 z-20',
    },
  },

  // ==================== Split Layout (Master-Detail) ====================
  Split: {
    Master: {
      gridArea: 'panel-a',
      overflow: 'auto',
      htmlTag: 'aside',
      ariaProps: { 'aria-label': 'Master List' },
      baseStyles: 'flex flex-col w-full flex-shrink-0 border-r border-border-default',
    },
    Detail: {
      gridArea: 'panel-b',
      overflow: 'auto',
      htmlTag: 'main',
      ariaProps: { 'aria-label': 'Detail View' },
      baseStyles: 'flex-1 flex flex-col',
    },
    // Aliases
    Panel: {
      gridArea: 'panel-a', // Default to left panel? Or require specificity?
      overflow: 'auto',
      htmlTag: 'section',
      baseStyles: 'flex-1',
    },
  },

  // ==================== Blank Layout ====================
  Blank: {
    Container: { gridArea: 'content', overflow: 'auto', htmlTag: 'main', baseStyles: 'flex-1' },
    Main: { gridArea: 'content', overflow: 'auto', htmlTag: 'main', baseStyles: 'flex-1' },
  },

  // ==================== Universal (Fallback) ====================
  universal: {
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'bg-surface-elevated border-b',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'bg-surface-elevated border-t',
    },
    Nav: { gridArea: 'nav', overflow: 'auto', htmlTag: 'nav', baseStyles: 'flex-col border-r' },
    Aside: {
      gridArea: 'aside',
      overflow: 'auto',
      htmlTag: 'aside',
      baseStyles: 'flex-col border-l',
    },
    Main: { gridArea: 'main', overflow: 'auto', htmlTag: 'main', baseStyles: 'flex-1' },

    // Aliases normalization
    Navigator: {
      gridArea: 'nav',
      overflow: 'auto',
      htmlTag: 'nav',
      baseStyles: 'flex-col border-r',
    },
    Container: { gridArea: 'main', overflow: 'auto', htmlTag: 'main', baseStyles: 'flex-1' },
  },
};

/**
 * Role Configuration 가져오기
 *
 * 우선순위:
 * 1. Layout 특정 설정
 * 2. Universal fallback 설정
 * 3. 완전 fallback (정의되지 않은 role)
 */
export function getRoleConfig(role: string, layout?: PageLayout): RoleConfig {
  // 1. Layout 특정 설정 찾기
  if (layout && ROLE_CONFIGS[layout]?.[role]) {
    return ROLE_CONFIGS[layout][role];
  }

  // 2. Universal 설정 찾기
  if (ROLE_CONFIGS.universal[role]) {
    return ROLE_CONFIGS.universal[role];
  }

  // 3. Fallback (정의되지 않은 role)
  console.warn(`[getRoleConfig] Unknown role "${role}" for layout "${layout}". Using fallback.`);
  return {
    gridArea: role.toLowerCase(),
    overflow: 'auto',
    htmlTag: 'section',
    baseStyles: 'flex-1',
    description: `Unknown role "${role}" (fallback)`,
  };
}

/**
 * Overflow 값 → Tailwind 클래스 변환
 */
export function getOverflowClass(overflow: OverflowBehavior): string {
  const overflowMap: Record<OverflowBehavior, string> = {
    auto: 'overflow-y-auto',
    hidden: 'overflow-hidden',
    scroll: 'overflow-y-scroll',
    visible: 'overflow-visible',
  };
  return overflowMap[overflow];
}

/**
 * 모든 레이아웃 목록 조회
 */
export function getAllLayouts(): string[] {
  return Object.keys(ROLE_CONFIGS).filter((t) => t !== 'universal');
}

/**
 * 특정 레이아웃의 유효한 role 목록 조회
 */
export function getRolesForLayout(layout: string): string[] {
  return Object.keys(ROLE_CONFIGS[layout] || {});
}

/**
 * Role이 특정 layout에서 유효한지 검증
 */
export function isValidRoleForLayout(role: string, layout?: string): boolean {
  if (!layout) return true;

  // Layout 특정 role 또는 universal role이면 유효
  return !!(ROLE_CONFIGS[layout]?.[role] || ROLE_CONFIGS.universal[role]);
}
