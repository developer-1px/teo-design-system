/**
 * Navigable - 키보드 네비게이션 타입 정의
 *
 * IDDL Behavior Primitives의 Navigable 구현
 * @see docs/2-areas/spec/interaction/interaction.spec.draft.md
 */

import type React from 'react';

/**
 * Navigable Props
 */
export interface NavigableProps {
  /**
   * 탐색 방향
   * - 'vertical': ↑↓ 키로 탐색 (List, Menu)
   * - 'horizontal': ←→ 키로 탐색 (Tabs, Toolbar)
   * - 'both': ↑↓←→ 모두 사용 (Grid, Calendar)
   */
  orientation: 'vertical' | 'horizontal' | 'both';

  /**
   * 끝에서 처음으로 순환
   * @default false
   */
  loop?: boolean;

  /**
   * 글자 입력으로 항목 점프 (typeahead/autocomplete)
   * @default true
   */
  typeahead?: boolean;

  /**
   * 비활성화된 항목 건너뛰기
   * @default true
   */
  skipDisabled?: boolean;

  /**
   * 초기 포커스 항목 ID
   */
  defaultFocusedId?: string;

  /**
   * 포커스 변경 콜백
   */
  onFocusChange?: (focusedId: string | null) => void;

  /**
   * 자식 요소들
   */
  children: React.ReactNode;
}

/**
 * Navigable Item 정의
 */
export interface NavigableItem {
  /** 고유 ID */
  id: string;

  /** DOM element ref */
  ref: HTMLElement;

  /** 비활성화 여부 */
  disabled: boolean;

  /** typeahead용 텍스트 값 */
  textValue: string;
}

/**
 * Navigable State
 */
export interface NavigableState {
  /** 현재 포커스된 항목 ID */
  focusedId: string | null;

  /** 등록된 항목 목록 (순서 보장) */
  items: Map<string, NavigableItem>;

  /** typeahead 버퍼 */
  typeaheadBuffer: string;

  /** typeahead 타이머 */
  typeaheadTimeout: NodeJS.Timeout | null;
}

/**
 * Navigable Context 값
 */
export interface NavigableContext {
  // === State ===
  focusedId: string | null;

  // === Queries ===
  isFocused: (id: string) => boolean;

  // === Actions ===
  focusNext: () => void;
  focusPrev: () => void;
  focusFirst: () => void;
  focusLast: () => void;
  focusById: (id: string) => void;

  // === Registration ===
  registerItem: (item: NavigableItem) => void;
  unregisterItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<NavigableItem>) => void;

  // === Props Getters ===
  getContainerProps: () => {
    role: string;
    'aria-activedescendant': string | undefined;
    onKeyDown: (e: React.KeyboardEvent) => void;
    tabIndex: number;
  };

  getItemProps: (id: string) => {
    id: string;
    tabIndex: 0 | -1;
    'data-focused': boolean;
    onFocus: () => void;
    onMouseEnter: () => void;
  };
}
