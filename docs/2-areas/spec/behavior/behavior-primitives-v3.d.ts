/**
 * IDDL Behavior Primitives v3
 * Flat Declaration Syntax
 *
 * Status: Working Draft
 * Version: 3.0.0
 * Date: 2026-01-11
 */

import * as React from 'react';

// =============================================================================
// COMMON TYPES
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

// =============================================================================
// BEHAVIOR CONTAINER
// =============================================================================

export type BehaviorDeclaration =
  | ({ type: 'Selectable' } & Omit<SelectableProps, 'children'>)
  | ({ type: 'Navigable' } & Omit<NavigableProps, 'children'>)
  | ({ type: 'History' } & Omit<HistoryProps, 'children'>)
  | ({ type: 'Clipboard' } & Omit<ClipboardProps, 'children'>)
  | ({ type: 'Draggable' } & Omit<DraggableProps, 'children'>)
  | ({ type: 'Expandable' } & Omit<ExpandableProps, 'children'>)
  | ({ type: 'Searchable' } & Omit<SearchableProps, 'children'>)
  | ({ type: 'Zoomable' } & Omit<ZoomableProps, 'children'>)
  | ({ type: 'Sortable' } & Omit<SortableProps, 'children'>)
  | ({ type: 'Groupable' } & Omit<GroupableProps, 'children'>)
  | ({ type: 'Shortcut' } & Omit<ShortcutProps, 'children'>)
  | ({ type: 'ContextMenu' } & Omit<ContextMenuProps, 'children'>)
  | ({ type: 'CommandPalette' } & Omit<CommandPaletteProps, 'children'>)
  | ({ type: 'Toast' } & Omit<ToastProps, 'children'>)
  | ({ type: 'Confirm' } & Omit<ConfirmProps, 'children'>)
  | ({ type: 'Progress' } & Omit<ProgressProps, 'children'>)
  | ({ type: 'FocusScope' } & Omit<FocusScopeProps, 'children'>)
  | ({ type: 'Dismissable' } & Omit<DismissableProps, 'children'>);

export interface BehaviorProps {
  /**
   * Behavior 선언 (prop 방식)
   * JSX 자식으로 선언하는 것과 동일
   */
  behaviors?: BehaviorDeclaration[];

  /**
   * 컨텍스트 공유 범위 ID
   */
  scope?: string;

  /**
   * 비활성화 (모든 Behavior 일시 중지)
   */
  disabled?: boolean;

  /**
   * 자식 요소 (Behavior 선언 + UI 컨텐츠)
   */
  children: React.ReactNode;
}

export declare const Behavior: React.FC<BehaviorProps>;

// =============================================================================
// EDIT BEHAVIORS
// =============================================================================

// -----------------------------------------------------------------------------
// Selectable
// -----------------------------------------------------------------------------

export type SelectionMode = 'none' | 'single' | 'multiple' | 'extended';

export interface SelectableProps {
  mode?: SelectionMode;
  followFocus?: boolean;
  required?: boolean;
  defaultSelected?: string[];
  selected?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  children?: React.ReactNode;
}

export interface SelectableContext {
  mode: SelectionMode;
  followFocus: boolean;
  selectedIds: ReadonlySet<string>;
  anchorId: string | null;

  isSelected: (id: string) => boolean;
  getSelectedCount: () => number;
  getSelectedIds: () => string[];
  isAllSelected: () => boolean;
  isPartiallySelected: () => boolean;

  select: (id: string) => void;
  toggle: (id: string) => void;
  selectRange: (toId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setAnchor: (id: string) => void;
  selectMany: (ids: string[]) => void;
  deselectMany: (ids: string[]) => void;
}

// -----------------------------------------------------------------------------
// Clipboard
// -----------------------------------------------------------------------------

export interface ClipboardData {
  types: Record<string, string>;
  iddl?: {
    type: string;
    items: unknown[];
  };
}

export interface ClipboardProps {
  onCopy?: (selectedIds: string[]) => ClipboardData;
  onCut?: (selectedIds: string[]) => ClipboardData;
  onPaste?: (data: ClipboardData, targetId?: string) => void;
  onDuplicate?: (selectedIds: string[]) => void;
  internal?: boolean;
  children?: React.ReactNode;
}

export interface ClipboardContext {
  hasData: boolean;
  clipboardData: ClipboardData | null;

  copy: () => Promise<void>;
  cut: () => Promise<void>;
  paste: (targetId?: string) => Promise<void>;
  duplicate: () => void;
  canPaste: () => boolean;
}

// -----------------------------------------------------------------------------
// History
// -----------------------------------------------------------------------------

export interface HistoryEntry {
  id: string;
  label?: string;
  timestamp: number;
  action: () => void;
  inverse: () => void;
}

export interface HistoryProps {
  maxSize?: number;
  batchTime?: number;
  onHistoryChange?: (state: { canUndo: boolean; canRedo: boolean }) => void;
  children?: React.ReactNode;
}

export interface HistoryContext {
  canUndo: boolean;
  canRedo: boolean;
  undoLabel?: string;
  redoLabel?: string;
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];

  undo: () => void;
  redo: () => void;
  record: (action: () => void, inverse: () => void, label?: string) => void;
  batch: (label: string, fn: () => void) => void;
  clear: () => void;
}

// -----------------------------------------------------------------------------
// Draggable
// -----------------------------------------------------------------------------

export interface DropTarget {
  id: string;
  position: 'before' | 'after' | 'inside';
  data?: unknown;
}

export interface DraggableProps {
  axis?: 'both' | 'x' | 'y';
  onDragStart?: (draggedIds: string[], e: React.DragEvent) => void;
  onDragMove?: (position: Point, e: React.DragEvent) => void;
  onDrop?: (draggedIds: string[], target: DropTarget) => void;
  onDragCancel?: () => void;
  renderPreview?: (draggedIds: string[]) => React.ReactNode;
  canDrop?: (draggedIds: string[], target: DropTarget) => boolean;
  children?: React.ReactNode;
}

export interface DraggableContext {
  isDragging: boolean;
  draggedIds: string[];
  dropTarget: DropTarget | null;

  canDrag: (id: string) => boolean;
  canDropAt: (target: DropTarget) => boolean;

  startDrag: (ids: string[]) => void;
  updateDropTarget: (target: DropTarget | null) => void;
  drop: () => void;
  cancel: () => void;
}

// =============================================================================
// NAVIGATION BEHAVIORS
// =============================================================================

// -----------------------------------------------------------------------------
// Navigable
// -----------------------------------------------------------------------------

export type NavigableOrientation = 'vertical' | 'horizontal' | 'both';

export interface NavigableProps {
  orientation?: NavigableOrientation;
  loop?: boolean;
  typeahead?: boolean;
  skipDisabled?: boolean;
  defaultFocusedId?: string;
  focusedId?: string;
  onFocusChange?: (focusedId: string | null) => void;
  children?: React.ReactNode;
}

export interface NavigableContext {
  focusedId: string | null;
  orientation: NavigableOrientation;

  isFocused: (id: string) => boolean;
  getItemCount: () => number;

  focusNext: () => void;
  focusPrev: () => void;
  focusFirst: () => void;
  focusLast: () => void;
  focusById: (id: string) => void;
  focusNextPage: (pageSize?: number) => void;
  focusPrevPage: (pageSize?: number) => void;
}

// -----------------------------------------------------------------------------
// Expandable
// -----------------------------------------------------------------------------

export interface ExpandableProps {
  multiple?: boolean;
  defaultExpanded?: string[];
  expanded?: string[];
  onExpandChange?: (expandedIds: string[]) => void;
  children?: React.ReactNode;
}

export interface ExpandableContext {
  expandedIds: ReadonlySet<string>;

  isExpanded: (id: string) => boolean;
  hasChildren: (id: string) => boolean;

  expand: (id: string) => void;
  collapse: (id: string) => void;
  toggle: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

// -----------------------------------------------------------------------------
// Searchable
// -----------------------------------------------------------------------------

export type MatchStrategy = 'includes' | 'startsWith' | 'fuzzy';

export interface SearchableProps {
  searchKeys?: string[];
  matchStrategy?: MatchStrategy;
  caseSensitive?: boolean;
  debounce?: number;
  onQueryChange?: (query: string) => void;
  onFilterChange?: (filteredIds: string[]) => void;
  children?: React.ReactNode;
}

export interface SearchableContext {
  query: string;
  filteredIds: string[];
  matchCount: number;
  currentMatchIndex: number;

  isFiltered: (id: string) => boolean;
  isCurrentMatch: (id: string) => boolean;
  getMatchRanges: (id: string) => Array<[start: number, end: number]>;

  setQuery: (query: string) => void;
  clearQuery: () => void;
  goToNextMatch: () => void;
  goToPrevMatch: () => void;
}

// =============================================================================
// VIEW BEHAVIORS
// =============================================================================

// -----------------------------------------------------------------------------
// Zoomable
// -----------------------------------------------------------------------------

export type ZoomOrigin = 'cursor' | 'center';

export interface ZoomableProps {
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  zoomStep?: number;
  zoomOrigin?: ZoomOrigin;
  pannable?: boolean;
  onZoomChange?: (zoom: number, center: Point) => void;
  children?: React.ReactNode;
}

export interface ZoomableContext {
  zoom: number;
  center: Point;
  isPanning: boolean;

  canZoomIn: () => boolean;
  canZoomOut: () => boolean;

  zoomIn: (origin?: Point) => void;
  zoomOut: (origin?: Point) => void;
  zoomTo: (level: number, origin?: Point) => void;
  resetZoom: () => void;
  fitToView: () => void;
  panTo: (point: Point) => void;
  panBy: (delta: Point) => void;
}

// -----------------------------------------------------------------------------
// Sortable
// -----------------------------------------------------------------------------

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: string;
  direction: SortDirection;
}

export interface SortableProps {
  sortableFields?: string[];
  defaultSort?: SortState;
  sort?: SortState;
  multiSort?: boolean;
  onSortChange?: (sort: SortState | SortState[] | null) => void;
  children?: React.ReactNode;
}

export interface SortableContext {
  sort: SortState | SortState[] | null;

  isSorted: (field: string) => boolean;
  getSortDirection: (field: string) => SortDirection | null;
  getSortIndex: (field: string) => number;

  sortBy: (field: string) => void;
  toggleSort: (field: string) => void;
  addSort: (field: string) => void;
  clearSort: () => void;
}

// -----------------------------------------------------------------------------
// Groupable
// -----------------------------------------------------------------------------

export interface Group {
  key: string;
  label: string;
  itemIds: string[];
}

export interface GroupableProps {
  groupBy?: string;
  groupSort?: 'asc' | 'desc' | ((a: string, b: string) => number);
  formatGroupLabel?: (groupKey: string) => string;
  navigateLabels?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: string[];
  children?: React.ReactNode;
}

export interface GroupableContext {
  groupBy: string | null;
  groups: Group[];
  collapsedGroups: ReadonlySet<string>;

  getGroup: (itemId: string) => string | null;
  isGroupCollapsed: (groupKey: string) => boolean;
  getGroupItems: (groupKey: string) => string[];

  setGroupBy: (field: string | null) => void;
  toggleGroupCollapse: (groupKey: string) => void;
  collapseAllGroups: () => void;
  expandAllGroups: () => void;
}

// =============================================================================
// COMMAND BEHAVIORS
// =============================================================================

// -----------------------------------------------------------------------------
// Shortcut
// -----------------------------------------------------------------------------

export interface ShortcutDefinition {
  key: string;
  command: string | (() => void);
  when?: () => boolean;
  description?: string;
  category?: string;
}

export interface ShortcutProps {
  shortcuts?: ShortcutDefinition[];
  scope?: string;
  enableInInputs?: boolean;
  children?: React.ReactNode;
}

export interface ShortcutContext {
  activeScope: string;

  getShortcutFor: (command: string) => string | null;
  getAllShortcuts: () => ShortcutDefinition[];
  isShortcutActive: (key: string) => boolean;

  executeShortcut: (key: string) => void;
  pushScope: (scope: string) => void;
  popScope: () => void;
  registerShortcut: (shortcut: ShortcutDefinition) => () => void;
  unregisterShortcut: (key: string) => void;
}

// -----------------------------------------------------------------------------
// ContextMenu
// -----------------------------------------------------------------------------

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  children?: MenuItem[];
  separator?: boolean;
}

export interface MenuContext {
  targetId: string | null;
  selectedIds: string[];
  position: Point;
  data?: unknown;
}

export interface ContextMenuProps {
  buildMenu?: (context: MenuContext) => MenuItem[];
  onOpen?: (context: MenuContext) => void;
  onCommand?: (commandId: string, context: MenuContext) => void;
  children?: React.ReactNode;
}

export interface ContextMenuContext {
  isOpen: boolean;
  menuItems: MenuItem[];
  position: Point | null;

  open: (e: React.MouseEvent | React.KeyboardEvent) => void;
  close: () => void;
  executeCommand: (commandId: string) => void;
}

// -----------------------------------------------------------------------------
// CommandPalette
// -----------------------------------------------------------------------------

export interface Command {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  category?: string;
  keywords?: string[];
  disabled?: boolean;
  action: () => void;
}

export interface CommandPaletteProps {
  commands?: Command[] | (() => Command[]);
  trigger?: string;
  placeholder?: string;
  recentCount?: number;
  onCommand?: (command: Command) => void;
  children?: React.ReactNode;
}

export interface CommandPaletteContext {
  isOpen: boolean;
  query: string;
  filteredCommands: Command[];
  recentCommands: Command[];
  highlightedIndex: number;

  open: () => void;
  close: () => void;
  setQuery: (query: string) => void;
  executeHighlighted: () => void;
  executeCommand: (commandId: string) => void;
  registerCommand: (command: Command) => () => void;
}

// =============================================================================
// FEEDBACK BEHAVIORS
// =============================================================================

// -----------------------------------------------------------------------------
// Toast
// -----------------------------------------------------------------------------

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ToastIntent = 'neutral' | 'positive' | 'caution' | 'critical' | 'info';

export interface ToastOptions {
  title?: string;
  message: string;
  intent?: ToastIntent;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Toast extends ToastOptions {
  id: string;
  createdAt: number;
}

export interface ToastProps {
  position?: ToastPosition;
  duration?: number;
  max?: number;
  newestOnTop?: boolean;
  children?: React.ReactNode;
}

export interface ToastContext {
  toasts: Toast[];

  show: (options: ToastOptions) => string;
  success: (message: string, options?: Partial<ToastOptions>) => string;
  error: (message: string, options?: Partial<ToastOptions>) => string;
  warning: (message: string, options?: Partial<ToastOptions>) => string;
  info: (message: string, options?: Partial<ToastOptions>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// -----------------------------------------------------------------------------
// Confirm
// -----------------------------------------------------------------------------

export type ConfirmIntent = 'neutral' | 'critical';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  intent?: ConfirmIntent;
  requireInput?: string;
}

export interface ConfirmProps {
  children?: React.ReactNode;
}

export interface ConfirmContext {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  dismiss: () => void;
}

// -----------------------------------------------------------------------------
// Progress
// -----------------------------------------------------------------------------

export interface ProgressOptions {
  title: string;
  message?: string;
  cancellable?: boolean;
  progress?: number;
}

export interface ProgressController {
  update: (progress: number, message?: string) => void;
  complete: () => void;
  fail: (error: string) => void;
  isCancelled: () => boolean;
  onCancel: (callback: () => void) => void;
}

export interface ProgressProps {
  children?: React.ReactNode;
}

export interface ProgressContext {
  start: (options: ProgressOptions) => ProgressController;
}

// =============================================================================
// WINDOW BEHAVIORS
// =============================================================================

// -----------------------------------------------------------------------------
// FocusScope
// -----------------------------------------------------------------------------

export type AutoFocusTarget = 'first' | 'last' | 'none' | string;

export interface FocusScopeProps {
  trap?: boolean;
  restoreFocus?: boolean;
  autoFocus?: AutoFocusTarget;
  focusContainerFallback?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface FocusScopeContext {
  isActive: boolean;
  containerRef: React.RefObject<HTMLElement>;

  getFocusableElements: () => HTMLElement[];
  containsFocus: () => boolean;
  contains: (element: Element | null) => boolean;

  focusFirst: () => boolean;
  focusLast: () => boolean;
  focusNext: () => boolean;
  focusPrev: () => boolean;
  focusContainer: () => void;
  focusElement: (element: HTMLElement) => boolean;
}

// -----------------------------------------------------------------------------
// Dismissable
// -----------------------------------------------------------------------------

export type DismissAction = 'close' | 'prevent' | 'none' | (() => void);

export interface DismissableProps {
  onEscape?: DismissAction;
  onClickOutside?: DismissAction;
  onDismiss?: () => void;
  shouldDismiss?: () => boolean | Promise<boolean>;
  children?: React.ReactNode;
}

export interface DismissableContext {
  dismiss: () => void;
}

// =============================================================================
// BEHAVIOR DECLARATION COMPONENTS (for JSX)
// =============================================================================

export declare const Selectable: React.FC<SelectableProps>;
export declare const Navigable: React.FC<NavigableProps>;
export declare const History: React.FC<HistoryProps>;
export declare const Clipboard: React.FC<ClipboardProps>;
export declare const Draggable: React.FC<DraggableProps>;
export declare const Expandable: React.FC<ExpandableProps>;
export declare const Searchable: React.FC<SearchableProps>;
export declare const Zoomable: React.FC<ZoomableProps>;
export declare const Sortable: React.FC<SortableProps>;
export declare const Groupable: React.FC<GroupableProps>;
export declare const Shortcut: React.FC<ShortcutProps>;
export declare const ContextMenu: React.FC<ContextMenuProps>;
export declare const CommandPalette: React.FC<CommandPaletteProps>;
export declare const Toast: React.FC<ToastProps>;
export declare const Confirm: React.FC<ConfirmProps>;
export declare const Progress: React.FC<ProgressProps>;
export declare const FocusScope: React.FC<FocusScopeProps>;
export declare const Dismissable: React.FC<DismissableProps>;

// =============================================================================
// HOOKS
// =============================================================================

/**
 * 통합 Item Hook
 * 활성화된 모든 Behavior의 상태를 반환
 */
export declare function useBehaviorItem(
  id: string,
  options?: {
    disabled?: boolean;
    textValue?: string;
    hasChildren?: boolean;
  }
): UseBehaviorItemResult;

export interface UseBehaviorItemResult {
  // Navigable
  isFocused: boolean;

  // Selectable
  isSelected: boolean;

  // Expandable
  isExpanded: boolean;
  hasChildren: boolean;

  // Draggable
  isDragging: boolean;
  isDropTarget: boolean;
  dropPosition: 'before' | 'after' | 'inside' | null;

  // Searchable
  isFiltered: boolean;
  isCurrentMatch: boolean;

  // Combined props for element
  itemProps: CombinedItemProps;
  itemRef: React.RefCallback<HTMLElement>;
}

export interface CombinedItemProps {
  id: string;
  tabIndex: -1;
  role?: string;

  // Data attributes
  'data-focused': boolean;
  'data-selected': boolean;
  'data-expanded'?: boolean;
  'data-dragging'?: boolean;
  'data-drop-target'?: boolean;
  'data-drop-position'?: 'before' | 'after' | 'inside';
  'data-filtered'?: boolean;
  'data-current-match'?: boolean;

  // ARIA
  'aria-selected'?: boolean;
  'aria-expanded'?: boolean;

  // Events
  onClick: (e: React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onMouseEnter: () => void;
  onFocus: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

// Individual context hooks (return null if behavior not declared)
export declare function useSelectableContext(): SelectableContext | null;
export declare function useNavigableContext(): NavigableContext | null;
export declare function useHistoryContext(): HistoryContext | null;
export declare function useClipboardContext(): ClipboardContext | null;
export declare function useDraggableContext(): DraggableContext | null;
export declare function useExpandableContext(): ExpandableContext | null;
export declare function useSearchableContext(): SearchableContext | null;
export declare function useZoomableContext(): ZoomableContext | null;
export declare function useSortableContext(): SortableContext | null;
export declare function useGroupableContext(): GroupableContext | null;
export declare function useShortcutContext(): ShortcutContext | null;
export declare function useContextMenuContext(): ContextMenuContext | null;
export declare function useCommandPaletteContext(): CommandPaletteContext | null;
export declare function useFocusScopeContext(): FocusScopeContext | null;
export declare function useDismissableContext(): DismissableContext | null;

// Feedback hooks (always available within Behavior)
export declare function useToast(): ToastContext;
export declare function useConfirm(): ConfirmContext;
export declare function useProgress(): ProgressContext;

// =============================================================================
// BEHAVIOR CONTEXT (for advanced usage)
// =============================================================================

export interface BehaviorContextValue {
  // Which behaviors are active
  hasBehavior: (type: BehaviorDeclaration['type']) => boolean;

  // Get specific context (type-safe)
  getContext<T extends BehaviorDeclaration['type']>(type: T): BehaviorContextMap[T] | null;

  // Scope
  scope?: string;

  // Disabled state
  disabled: boolean;
}

export interface BehaviorContextMap {
  Selectable: SelectableContext;
  Navigable: NavigableContext;
  History: HistoryContext;
  Clipboard: ClipboardContext;
  Draggable: DraggableContext;
  Expandable: ExpandableContext;
  Searchable: SearchableContext;
  Zoomable: ZoomableContext;
  Sortable: SortableContext;
  Groupable: GroupableContext;
  Shortcut: ShortcutContext;
  ContextMenu: ContextMenuContext;
  CommandPalette: CommandPaletteContext;
  Toast: ToastContext;
  Confirm: ConfirmContext;
  Progress: ProgressContext;
  FocusScope: FocusScopeContext;
  Dismissable: DismissableContext;
}

export declare const BehaviorContext: React.Context<BehaviorContextValue | null>;
export declare function useBehaviorContext(): BehaviorContextValue;

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Create behavior declarations programmatically
 */
export declare function createBehaviors(
  ...declarations: BehaviorDeclaration[]
): BehaviorDeclaration[];

/**
 * Merge multiple behavior declarations
 */
export declare function mergeBehaviors(
  base: BehaviorDeclaration[],
  override: BehaviorDeclaration[]
): BehaviorDeclaration[];

/**
 * Preset behavior combinations
 */
export declare const BehaviorPresets: {
  list: BehaviorDeclaration[];
  tree: BehaviorDeclaration[];
  table: BehaviorDeclaration[];
  modal: BehaviorDeclaration[];
  canvas: BehaviorDeclaration[];
  tabs: BehaviorDeclaration[];
};
