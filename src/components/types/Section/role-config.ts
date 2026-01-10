import type { PageLayout } from '@/components/types/Atom/types.ts';

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
    Toolbar: {
      gridArea: 'toolbar',
      overflow: 'hidden',
      htmlTag: 'div',
      ariaProps: { role: 'toolbar' },
      baseStyles: 'flex-shrink-0 bg-surface-elevated border-b border-border-default',
      description: '상단 툴바 (고정)',
    },
    ActivityBar: {
      gridArea: 'activitybar',
      overflow: 'hidden',
      htmlTag: 'nav',
      ariaProps: { role: 'navigation', 'aria-label': 'Activity Bar' },
      baseStyles: 'flex flex-col items-center py-2 w-12 flex-shrink-0 bg-surface-elevated border-r border-border-default',
      description: '좌측 액티비티바 (아이콘 버튼들)',
    },
    PrimarySidebar: {
      gridArea: 'primarysidebar',
      overflow: 'auto',
      htmlTag: 'aside',
      ariaProps: { 'aria-label': 'Primary Sidebar' },
      baseStyles: 'flex flex-col flex-shrink-0 bg-surface border-r border-border-default w-full h-full',
      description: '메인 사이드바 (파일 트리 등) - 스크롤',
    },
    Editor: {
      gridArea: 'editor',
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1 flex flex-col min-w-0 bg-surface',
      description: '에디터 영역 - 스크롤',
    },
    Panel: {
      gridArea: 'panel',
      overflow: 'auto',
      htmlTag: 'section',
      ariaProps: { 'aria-label': 'Panel' },
      baseStyles: 'flex flex-col flex-shrink-0 bg-surface-sunken border-t border-border-default w-full h-full',
      description: '하단 패널 (터미널, 문제, 출력 등) - 스크롤',
    },
    SecondarySidebar: {
      gridArea: 'secondarysidebar',
      overflow: 'auto',
      htmlTag: 'aside',
      ariaProps: { 'aria-label': 'Secondary Sidebar' },
      baseStyles: 'flex flex-col flex-shrink-0 bg-surface border-l border-border-default w-full h-full',
      description: '우측 사이드바 - 스크롤',
    },
    UtilityBar: {
      gridArea: 'utilitybar',
      overflow: 'hidden',
      htmlTag: 'nav',
      ariaProps: { role: 'navigation', 'aria-label': 'Utility Bar' },
      baseStyles: 'flex flex-col items-center py-2 w-12 flex-shrink-0 bg-surface-elevated border-l border-border-default',
      description: '우측 보조 바 (아이콘 세로 바)',
    },
    Container: {
      gridArea: 'editor', // Fallback to editor area if direct child
      overflow: 'auto',
      htmlTag: 'section',
      baseStyles: 'flex-1 min-h-0',
      description: '내부 컨테이너',
    },
    Main: {
      gridArea: 'editor',
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1 min-h-0',
      description: '내부 메인 영역',
    },
    // Common fallback for Studio
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'flex items-center bg-surface-elevated border-b border-border-muted px-4 min-h-[36px]',
      description: '섹션 상단 헤더 (unified design)',
    },
    Toolbar: {
      gridArea: 'toolbar',
      overflow: 'hidden',
      htmlTag: 'div',
      ariaProps: { role: 'toolbar' },
      baseStyles: 'flex items-center bg-surface-elevated border-b border-border-default px-2 min-h-[36px]',
      description: '상단 툴바 (unified design)',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'flex items-center bg-surface-elevated border-t border-border-muted px-4 min-h-[28px]',
      description: '하단 푸터',
    }
  },

  // ==================== Sidebar Layout ====================
  Sidebar: {
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'sticky top-0 z-10 bg-surface-elevated border-b border-border-muted py-2 px-4',
      description: '상단 헤더 (고정)',
    },
    Navigator: {
      gridArea: 'nav',
      overflow: 'auto',
      htmlTag: 'nav',
      ariaProps: { role: 'navigation' },
      baseStyles: 'flex flex-col w-72 flex-shrink-0 border-r border-border-default',
      description: '네비게이션 사이드바 - 스크롤',
    },
    Container: {
      gridArea: 'content',
      overflow: 'auto',
      htmlTag: 'section',
      baseStyles: 'flex-1',
      description: '컨테이너 영역',
    },
    Main: {
      gridArea: 'content',
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1',
      description: '메인 콘텐츠 영역 - 스크롤',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'sticky bottom-0 z-10 bg-surface-elevated border-t border-border-muted py-2 px-4',
      description: '하단 푸터 (고정)',
    },
  },

  // ==================== Aside Layout ====================
  Aside: {
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'sticky top-0 z-10 bg-surface-elevated border-b border-border-muted py-2 px-4',
      description: '상단 헤더 (고정)',
    },
    Container: {
      gridArea: 'content',
      overflow: 'auto',
      htmlTag: 'section',
      baseStyles: 'flex-1',
      description: '컨테이너 영역',
    },
    Main: {
      gridArea: 'content',
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1',
      description: '메인 콘텐츠 영역 - 스크롤',
    },
    Aside: {
      gridArea: 'aside',
      overflow: 'auto',
      htmlTag: 'aside',
      baseStyles: 'flex flex-col w-64 flex-shrink-0 border-l border-border-default',
      description: '우측 사이드바 - 스크롤',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'sticky bottom-0 z-10 bg-surface-elevated border-t border-border-muted py-2 px-4',
      description: '하단 푸터 (고정)',
    },
  },

  // ==================== HolyGrail Layout ====================
  HolyGrail: {
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'bg-surface-elevated border-b border-border-default',
      description: '상단 헤더 (전체 너비)',
    },
    Navigator: {
      gridArea: 'left',
      overflow: 'auto',
      htmlTag: 'nav',
      ariaProps: { role: 'navigation' },
      baseStyles: 'flex flex-col border-r border-border-default',
      description: '좌측 네비게이션 - 스크롤',
    },
    Main: {
      gridArea: 'center',
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1 flex flex-col',
      description: '중앙 메인 영역 (캔버스/에디터) - 스크롤',
    },
    Container: {
      gridArea: 'center',
      overflow: 'auto',
      htmlTag: 'section',
      baseStyles: 'flex-1 flex flex-col',
      description: '중앙 컨테이너 - 스크롤',
    },
    Aside: {
      gridArea: 'right',
      overflow: 'auto',
      htmlTag: 'aside',
      baseStyles: 'flex flex-col border-l border-border-default',
      description: '우측 사이드바 - 스크롤',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'bg-surface-elevated border-t border-border-default',
      description: '하단 푸터',
    },
    Region: {
      gridArea: 'region',
      overflow: 'auto',
      htmlTag: 'section',
      baseStyles: 'flex-1',
      description: '임의 영역',
    }
  },

  // ==================== Split Layout (Master-Detail) ====================
  Split: {
    Master: {
      gridArea: 'master',
      overflow: 'auto',
      htmlTag: 'aside',
      ariaProps: { 'aria-label': 'Master List' },
      baseStyles: 'flex flex-col w-96 flex-shrink-0 border-r border-border-default',
      description: '마스터 리스트 - 스크롤',
    },
    Detail: {
      gridArea: 'detail',
      overflow: 'auto',
      htmlTag: 'main',
      ariaProps: { 'aria-label': 'Detail View' },
      baseStyles: 'flex-1 flex flex-col',
      description: '상세 뷰 - 스크롤',
    },
    Main: {
      gridArea: 'detail',
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1 flex flex-col',
    },
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'bg-surface-elevated border-b border-border-default',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'bg-surface-elevated border-t border-border-default',
    },
    Toolbar: {
      gridArea: 'toolbar',
      overflow: 'hidden',
      htmlTag: 'div',
      baseStyles: 'bg-surface-elevated border-b border-border-default',
    }
  },

  // ==================== Blank Layout (Dialog/Custom) ====================
  Blank: {
    DialogHeader: {
      gridArea: 'dialog-header',
      overflow: 'hidden',
      htmlTag: 'header',
      ariaProps: { 'aria-label': 'Dialog Header' },
      baseStyles: 'border-b border-border-default p-4',
      description: '다이얼로그 헤더',
    },
    DialogContent: {
      gridArea: 'dialog-content',
      overflow: 'auto',
      htmlTag: 'div',
      ariaProps: { 'aria-label': 'Dialog Content' },
      baseStyles: 'flex-1 p-4',
      description: '다이얼로그 콘텐츠 - 스크롤',
    },
    DialogFooter: {
      gridArea: 'dialog-footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      ariaProps: { 'aria-label': 'Dialog Footer' },
      baseStyles: 'border-t border-border-default p-4',
      description: '다이얼로그 푸터 (액션 버튼들)',
    },
    Container: {
      gridArea: 'content',
      overflow: 'auto',
      htmlTag: 'section',
      baseStyles: 'flex-1',
    },
    Main: {
      gridArea: 'content',
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1',
    }
  },

  // ==================== Single Layout ====================
  Single: {
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'bg-surface-elevated border-b border-border-default',
    },
    Main: {
      gridArea: 'content',
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1',
    },
    Container: {
      gridArea: 'content',
      overflow: 'auto',
      htmlTag: 'section',
      baseStyles: 'flex-1',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'bg-surface-elevated border-t border-border-default',
    }
  },

  // ==================== Universal (Fallback) ====================
  universal: {
    Container: {
      gridArea: 'container',
      overflow: 'auto',
      htmlTag: 'section',
      baseStyles: 'flex-1',
      description: '범용 컨테이너 - 스크롤',
    },
    Header: {
      gridArea: 'header',
      overflow: 'hidden',
      htmlTag: 'header',
      baseStyles: 'bg-surface-elevated border-b border-border-default',
      description: '범용 헤더 (고정)',
    },
    Footer: {
      gridArea: 'footer',
      overflow: 'hidden',
      htmlTag: 'footer',
      baseStyles: 'bg-surface-elevated border-t border-border-default',
      description: '범용 푸터 (고정)',
    },
    Main: {
      gridArea: 'main',
      overflow: 'auto',
      htmlTag: 'main',
      baseStyles: 'flex-1',
      description: '범용 메인 - 스크롤',
    },
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
  console.warn(
    `[getRoleConfig] Unknown role "${role}" for layout "${layout}". Using fallback.`
  );
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
  return !!(
    ROLE_CONFIGS[layout]?.[role] ||
    ROLE_CONFIGS.universal[role]
  );
}
