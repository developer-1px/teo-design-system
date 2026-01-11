/**
 * Selectable - 선택 관리 타입 정의
 *
 * IDDL Behavior Primitives의 Selectable 구현
 * @see docs/2-areas/spec/interaction/interaction.spec.draft.md
 */

import type React from 'react';

/**
 * Selection Mode
 */
export type SelectionMode = 'none' | 'single' | 'multiple' | 'extended';

/**
 * Selectable Props
 */
export interface SelectableProps {
  /**
   * 선택 모드
   * - 'none': 선택 불가 (탐색만)
   * - 'single': 하나만 선택
   * - 'multiple': Ctrl+클릭으로 토글
   * - 'extended': 범위 선택 (Shift), 전체 선택 (Ctrl+A)
   */
  mode: SelectionMode;

  /**
   * 탐색 시 자동 선택
   * - true: 포커스 이동하면 바로 선택 (Tabs, Menu)
   * - false: 포커스와 선택 분리 (File Explorer)
   * @default false
   */
  followFocus?: boolean;

  /**
   * 선택 필수 (최소 1개)
   * @default false
   */
  required?: boolean;

  /**
   * 초기 선택 항목
   */
  defaultSelected?: string[];

  /**
   * 제어 모드용 선택 상태
   */
  selected?: string[];

  /**
   * 선택 변경 콜백
   */
  onSelectionChange?: (selectedIds: string[]) => void;

  /**
   * 자식 요소들
   */
  children: React.ReactNode;
}

/**
 * Selectable Item 정의
 */
export interface SelectableItem {
  /** 고유 ID */
  id: string;

  /** 비활성화 여부 */
  disabled: boolean;
}

/**
 * Selectable State
 */
export interface SelectableState {
  /** 선택된 항목 ID들 */
  selectedIds: Set<string>;

  /** 범위 선택의 시작점 (anchor) */
  anchorId: string | null;

  /** 가장 최근 선택/해제된 항목 */
  lastActionId: string | null;

  /** 등록된 항목 목록 */
  items: Map<string, SelectableItem>;
}

/**
 * Selectable Context 값
 */
export interface SelectableContext {
  // === Config ===
  mode: SelectionMode;
  followFocus: boolean;

  // === State ===
  selectedIds: Set<string>;
  anchorId: string | null;

  // === Queries ===
  isSelected: (id: string) => boolean;
  getSelectedCount: () => number;
  getSelectedIds: () => string[];

  // === Actions ===
  select: (id: string) => void;           // 단일 선택 (나머지 해제)
  toggle: (id: string) => void;           // 토글
  selectRange: (toId: string) => void;    // anchor → toId 범위
  selectAll: () => void;                  // 전체 선택
  clearSelection: () => void;             // 전체 해제
  setAnchor: (id: string) => void;        // anchor 설정

  // === Registration ===
  registerItem: (item: SelectableItem) => void;
  unregisterItem: (id: string) => void;

  // === Props Getter ===
  getItemProps: (id: string) => {
    'aria-selected': boolean;
    'data-selected': boolean;
    onClick: (e: React.MouseEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
}
