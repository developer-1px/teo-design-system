/**
* IDDL Behavior Primitives
* Core Type Definitions
*
* Status: Working Draft
* Version: 0.1.0
* Date: 2026-01-11
  */

import * as React from 'react';

// =============================================================================
// 1. NAVIGABLE
// =============================================================================

/**
* Navigable Wrapper Props
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
* 글자 입력으로 항목 점프
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
* 제어 모드용 포커스 상태
  */
  focusedId?: string;

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
* Navigable 내부 항목 정보
  */
  export interface NavigableItem {
  /** 고유 식별자 */
  id: string;

/** DOM 요소 참조 */
ref: HTMLElement;

/** 비활성화 여부 */
disabled: boolean;

/** Typeahead용 텍스트 값 */
textValue: string;

/** 항목 순서 (DOM 순서 기반) */
index: number;
}

/**
* Navigable Context
  */
  export interface NavigableContextValue {
  // === State ===
  /** 현재 포커스된 항목 ID */
  focusedId: string | null;

/** 설정된 orientation */
orientation: NavigableProps['orientation'];

// === Queries ===
/** 특정 ID가 포커스 상태인지 확인 */
isFocused: (id: string) => boolean;

/** 등록된 항목 수 */
getItemCount: () => number;

// === Actions ===
/** 다음 항목으로 포커스 이동 */
focusNext: () => void;

/** 이전 항목으로 포커스 이동 */
focusPrev: () => void;

/** 첫 번째 항목으로 포커스 이동 */
focusFirst: () => void;

/** 마지막 항목으로 포커스 이동 */
focusLast: () => void;

/** 특정 ID로 포커스 이동 */
focusById: (id: string) => void;

/** N개 앞으로 이동 (PageDown) */
focusNextPage: (pageSize?: number) => void;

/** N개 뒤로 이동 (PageUp) */
focusPrevPage: (pageSize?: number) => void;

// === Registration ===
/** 항목 등록 */
registerItem: (item: Omit<NavigableItem, 'index'>) => void;

/** 항목 등록 해제 */
unregisterItem: (id: string) => void;

/** 항목 정보 업데이트 */
updateItem: (id: string, updates: Partial<NavigableItem>) => void;

// === Props Getters ===
/** 컨테이너에 적용할 props */
getContainerProps: <E extends HTMLElement = HTMLElement>() => {
role?: string;
tabIndex: number;
'aria-activedescendant'?: string;
onKeyDown: (e: React.KeyboardEvent<E>) => void;
onFocus: (e: React.FocusEvent<E>) => void;
onBlur: (e: React.FocusEvent<E>) => void;
};

/** 각 항목에 적용할 props */
getItemProps: (id: string) => {
id: string;
tabIndex: -1;
'data-focused': boolean;
'data-navigable-item': true;
onMouseEnter: () => void;
onClick: () => void;
};
}

// =============================================================================
// 2. SELECTABLE
// =============================================================================

/**
* Selection 모드
  */
  export type SelectionMode = 'none' | 'single' | 'multiple' | 'extended';

/**
* Selectable Wrapper Props
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
* @default false
  */
  followFocus?: boolean;

/**
* 선택 필수 (최소 1개)
* @default false
  */
  required?: boolean;

/**
* 초기 선택 항목 (비제어 모드)
  */
  defaultSelected?: string[];

/**
* 선택된 항목들 (제어 모드)
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
* Selectable 내부 항목 정보
  */
  export interface SelectableItem {
  /** 고유 식별자 */
  id: string;

/** 비활성화 여부 */
disabled: boolean;
}

/**
* Selectable Context
  */
  export interface SelectableContextValue {
  // === Config ===
  /** 현재 선택 모드 */
  mode: SelectionMode;

/** followFocus 설정 */
followFocus: boolean;

// === State ===
/** 선택된 항목 ID Set */
selectedIds: ReadonlySet<string>;

/** 범위 선택의 시작점 (anchor) */
anchorId: string | null;

// === Queries ===
/** 특정 ID가 선택 상태인지 확인 */
isSelected: (id: string) => boolean;

/** 선택된 항목 수 */
getSelectedCount: () => number;

/** 선택된 ID 배열 반환 */
getSelectedIds: () => string[];

/** 모든 항목이 선택되었는지 확인 */
isAllSelected: () => boolean;

/** 일부 항목만 선택되었는지 확인 (indeterminate) */
isPartiallySelected: () => boolean;

// === Actions ===
/** 단일 선택 (나머지 해제) */
select: (id: string) => void;

/** 선택 토글 */
toggle: (id: string) => void;

/** anchor부터 toId까지 범위 선택 */
selectRange: (toId: string) => void;

/** 전체 선택 */
selectAll: () => void;

/** 전체 해제 */
clearSelection: () => void;

/** Anchor 설정 */
setAnchor: (id: string) => void;

/** 여러 항목 선택 (기존 유지 + 추가) */
selectMany: (ids: string[]) => void;

/** 여러 항목 해제 */
deselectMany: (ids: string[]) => void;

// === Registration ===
/** 항목 등록 */
registerItem: (item: SelectableItem) => void;

/** 항목 등록 해제 */
unregisterItem: (id: string) => void;

// === Props Getters ===
/** 컨테이너에 적용할 props */
getContainerProps: () => {
'aria-multiselectable'?: boolean;
onKeyDown: (e: React.KeyboardEvent) => void;
};

/** 각 항목에 적용할 props */
getItemProps: (id: string) => {
'aria-selected': boolean;
'data-selected': boolean;
'data-selectable-item': true;
onClick: (e: React.MouseEvent) => void;
onKeyDown: (e: React.KeyboardEvent) => void;
};
}

// =============================================================================
// 3. FOCUS SCOPE
// =============================================================================

/**
* AutoFocus 대상
  */
  export type AutoFocusTarget = 'first' | 'last' | 'none' | string;

/**
* FocusScope Wrapper Props
  */
  export interface FocusScopeProps {
  /**
    * 포커스 트랩 활성화
    * @default false
      */
      trap?: boolean;

/**
* 언마운트 시 이전 포커스 복원
* @default true
  */
  restoreFocus?: boolean;

/**
* 마운트 시 자동 포커스 대상
* @default 'first'
  */
  autoFocus?: AutoFocusTarget;

/**
* 포커스 가능 요소가 없을 때 컨테이너에 포커스
* @default true
  */
  focusContainerFallback?: boolean;

/**
* 스코프 비활성화 (조건부 trap 해제용)
* @default false
  */
  disabled?: boolean;

/**
* 자식 요소들
  */
  children: React.ReactNode;
  }

/**
* FocusScope Context
  */
  export interface FocusScopeContextValue {
  // === State ===
  /** 이 scope가 활성화(트랩) 상태인지 */
  isActive: boolean;

/** 컨테이너 ref */
containerRef: React.RefObject<HTMLElement>;

// === Queries ===
/** 포커스 가능한 요소들 반환 */
getFocusableElements: () => HTMLElement[];

/** 현재 포커스된 요소가 이 scope 내에 있는지 */
containsFocus: () => boolean;

/** 특정 요소가 이 scope 내에 있는지 */
contains: (element: Element | null) => boolean;

// === Actions ===
/** 첫 번째 포커스 가능 요소로 이동 */
focusFirst: () => boolean;

/** 마지막 포커스 가능 요소로 이동 */
focusLast: () => boolean;

/** 다음 포커스 가능 요소로 이동 */
focusNext: () => boolean;

/** 이전 포커스 가능 요소로 이동 */
focusPrev: () => boolean;

/** 컨테이너에 포커스 */
focusContainer: () => void;

/** 특정 요소에 포커스 (scope 내) */
focusElement: (element: HTMLElement) => boolean;

// === Props Getters ===
/** 컨테이너에 적용할 props */
getContainerProps: <E extends HTMLElement = HTMLDivElement>() => {
ref: React.RefCallback<E>;
tabIndex: -1;
'data-focus-scope': true;
'data-focus-trap'?: boolean;
onKeyDown: (e: React.KeyboardEvent<E>) => void;
};
}

// =============================================================================
// 4. HOOKS
// =============================================================================

/**
* Navigable Hook
  */
  export function useNavigable(props: NavigableProps): NavigableContextValue;

/**
* Navigable Context 소비용 Hook
  */
  export function useNavigableContext(): NavigableContextValue;

/**
* Navigable Item 편의 Hook
  */
  export function useNavigableItem(id: string, options?: {
  disabled?: boolean;
  textValue?: string;
  }): {
  isFocused: boolean;
  itemProps: ReturnType<NavigableContextValue['getItemProps']>;
  itemRef: React.RefCallback<HTMLElement>;
  };

/**
* Selectable Hook
  */
  export function useSelectable(props: SelectableProps): SelectableContextValue;

/**
* Selectable Context 소비용 Hook
  */
  export function useSelectableContext(): SelectableContextValue;

/**
* Selectable Item 편의 Hook
  */
  export function useSelectableItem(id: string, options?: {
  disabled?: boolean;
  }): {
  isSelected: boolean;
  itemProps: ReturnType<SelectableContextValue['getItemProps']>;
  };

/**
* FocusScope Hook
  */
  export function useFocusScope(props: FocusScopeProps): FocusScopeContextValue;

/**
* FocusScope Context 소비용 Hook
  */
  export function useFocusScopeContext(): FocusScopeContextValue;

// =============================================================================
// 5. WRAPPER COMPONENTS
// =============================================================================

/**
* Navigable Wrapper Component
*
* @example
* ```tsx
* <Navigable orientation="vertical" loop>
*   <List>
*     <ListItem id="1">Item 1</ListItem>
*     <ListItem id="2">Item 2</ListItem>
*   </List>
* </Navigable>
* ```
*/
export const Navigable: React.FC<NavigableProps>;

/**
* Selectable Wrapper Component
*
* @example
* ```tsx
* <Selectable mode="extended" followFocus={false}>
*   <Navigable orientation="vertical">
*     <List>
*       <ListItem id="1">Item 1</ListItem>
*     </List>
*   </Navigable>
* </Selectable>
* ```
*/
export const Selectable: React.FC<SelectableProps>;

/**
* FocusScope Wrapper Component
*
* @example
* ```tsx
* <FocusScope trap restoreFocus autoFocus="first">
*   <Modal>
*     <ModalContent />
*   </Modal>
* </FocusScope>
* ```
*/
export const FocusScope: React.FC<FocusScopeProps>;

// =============================================================================
// 6. CONTEXT PROVIDERS (for advanced usage)
// =============================================================================

export const NavigableContext: React.Context<NavigableContextValue | null>;
export const SelectableContext: React.Context<SelectableContextValue | null>;
export const FocusScopeContext: React.Context<FocusScopeContextValue | null>;

// =============================================================================
// 7. UTILITY TYPES
// =============================================================================

/**
* Props getter 반환 타입 추출
  */
  export type NavigableContainerProps = ReturnType<NavigableContextValue['getContainerProps']>;
  export type NavigableItemProps = ReturnType<NavigableContextValue['getItemProps']>;
  export type SelectableContainerProps = ReturnType<SelectableContextValue['getContainerProps']>;
  export type SelectableItemProps = ReturnType<SelectableContextValue['getItemProps']>;
  export type FocusScopeContainerProps = ReturnType<FocusScopeContextValue['getContainerProps']>;

/**
* 병합된 Item Props (Navigable + Selectable)
  */
  export type CombinedItemProps = NavigableItemProps & SelectableItemProps;

/**
* Composition 편의 Hook 반환 타입
  */
  export interface UseListItemResult {
  isFocused: boolean;
  isSelected: boolean;
  itemProps: CombinedItemProps;
  itemRef: React.RefCallback<HTMLElement>;
  }

/**
* List Item 통합 Hook
  */
  export function useListItem(id: string, options?: {
  disabled?: boolean;
  textValue?: string;
  }): UseListItemResult;

// =============================================================================
// 8. RENDERER REGISTRATION
// =============================================================================

/**
* 렌더러 컴포넌트 타입
  */
  export type RendererComponent<P = any> = React.ComponentType<P>;

/**
* 렌더러 등록
  */
  export function registerRenderer(
  role: string,
  renderer: RendererComponent
  ): void;

/**
* 렌더러 조회
  */
  export function getRenderer(role: string): RendererComponent | undefined;

/**
* 테마 설정
  */
  export interface ThemeConfig {
  renderers?: Record<string, RendererComponent>;
  tokens?: Record<string, unknown>;
  }

/**
* 테마 등록
  */
  export function registerTheme(name: string, config: ThemeConfig): void;

/**
* 현재 테마 설정
  */
  export function setCurrentTheme(name: string): void;