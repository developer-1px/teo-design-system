/**
 * Selection Management Types
 *
 * 상용 앱 수준의 선택 관리 시스템
 */

export interface UseSelectionOptions<T> {
  /** 전체 아이템 목록 */
  items: T[];

  /** 아이템의 고유 ID를 가져오는 함수 */
  getId: (item: T) => string | number;

  /** 멀티 선택 허용 여부 (기본: true) */
  multiSelect?: boolean;

  /** 복사 시 호출되는 콜백 */
  onCopy?: (items: T[]) => void;

  /** 잘라내기 시 호출되는 콜백 */
  onCut?: (items: T[]) => void;

  /** 붙여넣기 시 호출되는 콜백 */
  onPaste?: (clipboardData: any) => void;

  /** 삭제 시 호출되는 콜백 */
  onDelete?: (items: T[]) => void;

  /** 선택 변경 시 호출되는 콜백 */
  onSelectionChange?: (selectedItems: T[]) => void;

  /** 초기 선택된 ID 목록 */
  initialSelectedIds?: (string | number)[];

  /** 키보드 네비게이션 활성화 (기본: true) */
  keyboardNavigation?: boolean;

  /** 네비게이션 시 호출 (단일 선택으로 변경) */
  onNavigate?: (item: T) => void;
}

export interface UseSelectionReturn<T> {
  /** 선택된 ID 집합 */
  selectedIds: Set<string | number>;

  /** 선택된 아이템 목록 */
  selectedItems: T[];

  /** ID가 선택되어 있는지 확인 */
  isSelected: (id: string | number) => boolean;

  /** 단일 선택 (기존 선택 해제) */
  selectSingle: (id: string | number) => void;

  /** 선택 토글 (Cmd/Ctrl + 클릭) */
  toggleSelect: (id: string | number) => void;

  /** 범위 선택 (Shift + 클릭) */
  selectRange: (id: string | number) => void;

  /** 전체 선택 */
  selectAll: () => void;

  /** 선택 해제 */
  clearSelection: () => void;

  /** 아이템 클릭 핸들러 (modifier keys 자동 처리) */
  handleItemClick: (id: string | number, event: MouseEvent | React.MouseEvent) => void;

  /** 선택된 아이템 복사 */
  copy: () => void;

  /** 선택된 아이템 잘라내기 */
  cut: () => void;

  /** 클립보드 데이터 붙여넣기 */
  paste: () => void;

  /** 선택된 아이템 삭제 */
  deleteSelected: () => void;

  /** 아이템 DOM 요소 등록 (focus management) */
  registerItemRef: (id: string | number, element: HTMLElement | null) => void;

  /** 아이템에 프로그래매틱하게 포커스 */
  focusItem: (id: string | number) => void;

  /** 아이템에 적용할 props 반환 (접근성 포함) */
  getItemProps: (id: string | number) => {
    onClick: (e: React.MouseEvent) => void;
    'aria-selected': boolean;
    role: 'option';
    tabIndex: number;
  };

  /** 컨테이너에 적용할 props 반환 (키보드 단축키) */
  getContainerProps: () => {
    onKeyDown: (e: React.KeyboardEvent) => void;
    role: 'listbox';
    'aria-multiselectable': boolean;
  };
}
