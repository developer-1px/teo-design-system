/**
 * 키보드 & 포커스 관리 시스템 타입 정의
 */

/**
 * 키보드 컨텍스트 (VSCode when-clause 스타일)
 * 컨텍스트에 따라 단축키가 활성화/비활성화됨
 */
export enum KeyboardContext {
  // 전역 (항상 활성)
  GLOBAL = 'global',

  // 포커스 기반
  EDITOR_FOCUS = 'editorFocus',
  SIDEBAR_FOCUS = 'sidebarFocus',
  PANEL_FOCUS = 'panelFocus',
  FILE_TREE_FOCUS = 'fileTreeFocus',

  // 모달
  MODAL_OPEN = 'modalOpen',
  SEARCH_OPEN = 'searchOpen',
  COMMAND_PALETTE_OPEN = 'commandPaletteOpen',

  // 상태 기반
  TEXT_SELECTED = 'textSelected',
  DEBUG_MODE = 'debugMode',
}

/**
 * 단축키 정의
 */
export interface ShortcutDefinition {
  /** 단축키 조합 (예: 'cmd+k', 'ctrl+shift+p') */
  key: string;
  /** 핸들러 함수 */
  handler: (event: KeyboardEvent) => void;
  /** 활성 컨텍스트 */
  context?: KeyboardContext | KeyboardContext[];
  /** 우선순위 (높을수록 우선) */
  priority?: number;
  /** 설명 (디버그/문서용) */
  description?: string;
  /** 활성화 여부 */
  enabled?: boolean;
}

/**
 * 우선순위 상수
 */
export const PRIORITY = {
  /** 모달 레벨 (가장 높음) */
  MODAL: 100,
  /** 패널 레벨 */
  PANEL: 50,
  /** 컴포넌트 레벨 */
  COMPONENT: 30,
  /** 전역 레벨 (기본값) */
  GLOBAL: 0,
} as const;

/**
 * 네비게이션 타입
 */
export type NavigationType = 'list' | 'tree' | 'table' | 'grid';

/**
 * 네비게이션 방향
 */
export type NavigationOrientation = 'vertical' | 'horizontal' | 'both';

/**
 * 커서 위치 정보
 */
export interface CursorPosition {
  /** 현재 인덱스 */
  index: number;
  /** 행 (테이블/그리드) */
  row?: number;
  /** 열 (테이블/그리드) */
  col?: number;
}

/**
 * 네비게이션 옵션
 */
export interface NavigationOptions<T> {
  /** 네비게이션 타입 */
  type: NavigationType;
  /** 아이템 목록 */
  items: T[];
  /** 방향 */
  orientation?: NavigationOrientation;
  /** 순환 여부 (끝에서 처음으로) */
  loop?: boolean;
  /** 선택 핸들러 */
  onSelect?: (item: T, index: number) => void;
  /** 초기 인덱스 */
  initialIndex?: number;
  /** 활성화 여부 */
  enabled?: boolean;
}

/**
 * 포커스 스코프 옵션
 */
export interface FocusScopeOptions {
  /** 포커스 트랩 (모달 등) */
  contain?: boolean;
  /** 자동 포커스 */
  autoFocus?: boolean;
  /** 포커스 복원 */
  restoreFocus?: boolean;
}
