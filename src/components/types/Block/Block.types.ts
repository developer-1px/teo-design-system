/**
 * Block Type Definitions
 */

import type { ReactNode } from 'react';
import type { AsProp, Density, Intent, Prominence } from '../Shared.types';

/**
 * Selection Model Interface (v1.0.2)
 * Block이 선택 가능한 항목들을 관리할 때 사용하는 모델
 * v1.0.4: Focus management 추가 (registerItemRef)
 */
export interface SelectionModel {
  /** 현재 선택된 값들의 집합 */
  selectedValues: Set<string | number>;
  /** 특정 값이 선택되었는지 확인 */
  isSelected: (value: string | number) => boolean;
  /** 선택 조작 (optional) */
  select?: (value: string | number) => void;
  deselect?: (value: string | number) => void;
  toggle?: (value: string | number) => void;
  /** 아이템 클릭 핸들러 (modifier keys 자동 처리) */
  handleItemClick?: (value: string | number, event: React.MouseEvent) => void;
  /** 아이템 DOM 요소 등록 (focus management, v1.0.4) */
  registerItemRef?: (value: string | number, element: HTMLElement | null) => void;
}

/**
 * Block Role - 블록의 기능적 역할 (v4.0: 기능 중심 분류)
 * v1.0.1: 많은 role 추가
 * v4.0: 기능적 목적에 따른 분류, 시각적 요소 허용
 *
 * Block = 기능적 컴포넌트 (Functional Component)
 * - 시각적 요소를 가질 수 있음 (배경, 보더, 패딩, 그림자)
 * - Template 무관하게 독립적으로 동작
 * - 재사용 가능한 UI 조합
 */
export type BlockRole =
  // 1. Layout & Structure
  | 'Container'
  | 'Stack'
  | 'Grid'
  | 'Center'
  | 'Splitter'
  | 'AspectRatio'
  | 'ScrollArea'
  | 'Collapsible'
  | 'Header'
  | 'Footer'
  | 'Sidebar'
  | 'AppBar'

  // 2. Collections (List/Menu/Table)
  | 'List'
  | 'Menu'
  | 'SubMenu'
  | 'ContextMenu'
  | 'TreeView'
  | 'Table'
  | 'DataTable'
  | 'DataGrid'
  | 'VirtualList'
  | 'Accordion'
  | 'Carousel'
  | 'Timeline'
  | 'SortableList'
  | 'Tree'

  // 3. Navigation & Grouping
  | 'Tabs' // Container for Tab items
  | 'Breadcrumbs'
  | 'Pagination'
  | 'Stepper'
  | 'NavGroup'
  | 'ButtonGroup'
  | 'ChipGroup'
  | 'RadioGroup'
  | 'CheckboxGroup'
  | 'FieldGroup'
  | 'Form'
  | 'FormActions'

  // 4. Composites
  | 'Card'
  | 'SearchBar'
  | 'CommandPalette'
  | 'Calendar'
  | 'Dropdown'
  | 'Toolbar'
  | 'FloatingToolbar'

  // 5. Overlay & Feedback Containers
  | 'Dialog'
  | 'AlertDialog'
  | 'Drawer'
  | 'Sheet'
  | 'Popover'
  | 'Tooltip'
  | 'HoverCard'
  | 'Alert'
  | 'Toast'
  | 'Banner'
  | 'EmptyState'

  // 6. Legacy / Utilities
  | 'Group'
  | 'Split'
  | 'Row'
  | 'Inline'
  | 'Spacer'
  | 'Divider'
  | 'DividerVertical' // Restored
  | 'Mock'
  | 'DeviceFrame'
  | 'Navigator'
  | 'navigation'
  | 'Board'
  | 'Column'
  | 'Field'
  | 'Media'
  | 'Info'
  | 'ListItem'
  | 'Empty'
  | 'Fieldset';

/**
 * Layout - 레이아웃 방향
 * v1.0.1 추가
 *
 * * **Section vs Block**:
 * - Section: 시각적 영역 (배경, 보더, 패딩 있음) - Figma Section과 동일
 * - Block: 투명 레이아웃 컨테이너 (시각적 요소 없음) - Figma Block과 동일
 */
export type Layout =
  | 'stack'
  | 'inline'
  | 'grid'
  | 'table'
  | 'split'
  | 'tabs'
  | 'steps'
  | 'flex'
  | 'scroll';

/**
 * Load State - 데이터 로딩 상태
 * v1.0.1 추가
 */
export type LoadState = 'idle' | 'loading' | 'error' | 'empty';

/**
 * Block Props
 * v1.0.1: role 타입 변경, layout, state, emptyContent, errorContent 추가
 * v4.0: Accordion props 추가 (mode, defaultValue, value, onValueChange)
 * v1.0.2: value, selectionModel 추가 (Selection 통합)
 */
export interface BlockProps extends AsProp {
  role?: BlockRole;
  aspectRatio?: string | number;
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  layout?: Layout;
  gap?: number | string;
  mode?: string; // v1.2: Control mode (e.g. "edit" | "view" for child fields)
  as?: any; // Allow polymorphic component
  Element?: any; // Legacy compatibility
  id?: string; // For scroll anchors
  children?: ReactNode;
  /**
   * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
   * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  className?: string;
  /**
   * EXCEPTION: style은 동적 레이아웃(grid-area 등)을 위한 인라인 스타일에만 허용
   * 예: CSS Grid 배치, 동적 너비/높이
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  style?: React.CSSProperties;
  /**
   * Role-specific parameters (v1.0 Core)
   * e.g. Grid: { columns: 3 }, Stack: { align: 'center' }
   */
  spec?: Record<string, unknown>;
  state?: LoadState; // v1.0.1
  emptyContent?: ReactNode; // v1.0.1
  errorContent?: ReactNode; // v1.0.1
  onClick?: (e: React.MouseEvent) => void;
  selected?: boolean; // v3.1: 선택 상태 (리스트 아이템 등)
  clickable?: boolean; // v3.1: 클릭 가능 여부 (Interactive State Token System)
  condition?: string; // v1.0.1: 조건부 렌더링

  /**
   * v1.0.2: 선택 가능한 아이템의 고유 식별자
   * value가 있으면 Block은 Selectable Item이 됩니다.
   * 멘탈 모델: HTML의 <option value="1">과 동일
   */
  value?: string | number;

  /**
   * v1.0.2: Selection 관리 모델
   * value를 가진 자식 Block들의 선택 상태를 관리합니다.
   */
  selectionModel?: SelectionModel;

  // ===================================================================
  // ⚠️ DEPRECATED: Role-specific Props (IDDL Spec Violation)
  // These props should be moved to `spec` object for type safety and clarity.
  // ===================================================================
  sticky?: boolean;
  border?: 'top' | 'bottom' | 'both' | 'none';
  defaultValue?: string | string[] | any;
  accordionValue?: string | string[];
  onValueChange?: (value: string | string[] | any) => void;
  items?: any[];
  onReorder?: (items: any[]) => void;
  renderItem?: (item: any, index: number) => ReactNode;

  // ===================================================================
  // ⚠️ DEPRECATED: Layout & Tree Helpers
  // ===================================================================
  padding?: string;
  margin?: string; // Restored
  justify?: string;
  align?: string;
  flex?: string | number;
  divider?: string;
  width?: string | number;
  height?: string | number;
  orientation?: 'horizontal' | 'vertical' | string;
  data?: any[];
  icons?: Record<string, any>;
  onNodeClick?: (node: any) => void;
  expandable?: boolean;
  selectable?: boolean;
  defaultExpandedIds?: string[];
  direction?: 'horizontal' | 'vertical' | string;
  template?: string;
  gridCols?: number;
  interactive?: boolean;
  rounded?: string;
  position?: string;
}

// Re-export shared types for convenience
export * from '../Element/Action/Action.types';
export * from '../Element/Field/Field.types';
export * from '../Element/Text/Text.types';
export * from '../Section/Section.types';
export * from '../Shared.types';

/**
 * Block Renderer Props
 * 모든 Block renderer가 공통으로 받는 props
 */
export interface BlockRendererProps extends Omit<BlockProps, 'role'> {
  role: BlockRole;
  computedDensity: 'Compact' | 'Standard' | 'Comfortable';
  computedProminence: BlockProps['prominence'];
  computedIntent: BlockProps['intent'];
  Element: any; // HTML 태그 또는 커스텀 컴포넌트
}
