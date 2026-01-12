/**
 * Block Type Definitions (IDDL v1.0 Spec Compliant)
 */

import type { ComponentType, ReactNode } from 'react';
import type { AsProp, Density, Intent, Prominence } from '../Shared.types';

/**
 * Block Role - 블록의 기능적 역할
 * v1.0: IDDL Part 1 Spec 기준으로 분류
 */
export type BlockRole =
  // 1. Layout & Structure
  | 'Container'
  | 'Stack'
  | 'Grid'
  | 'Center'
  | 'ScrollArea'
  | 'Collapsible'
  | 'Splitter'
  | 'AspectRatio'
  | 'Tree'
  | 'Divider'
  | 'DividerVertical'
  | 'Spacer'

  // 2. Collections (List/Menu/Table)
  | 'List'
  | 'Menu'
  | 'SubMenu'
  | 'ContextMenu'
  | 'TreeView'
  | 'Table'
  | 'DataTable'
  | 'DataGrid'
  | 'Accordion'
  | 'Carousel'
  | 'Timeline'
  | 'SortableList'

  // 3. Navigation & Grouping
  | 'Tabs'
  | 'TabPanel'
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
  | 'Header' // ✨ New (v4.3): Block-level header
  | 'ControlPanel' // ✨ New (v4.2): Dense control container
  | 'PropertyGrid' // ✨ New (v4.2): Key-Value control layout
  | 'SearchBar'
  | 'CommandPalette'
  | 'Calendar'
  | 'Dropdown'
  | 'Toolbar'
  | 'FloatingToolbar'

  // 5. Feedback Containers
  | 'Dialog'
  | 'AlertDialog'
  | 'Sheet'
  | 'Drawer'
  | 'Popover'
  | 'Tooltip'
  | 'HoverCard'
  | 'Alert'
  | 'Toast'
  | 'Banner'
  | 'EmptyState';

/**
 * Block Props (IDDL v1.0 Spec Strict)
 *
 * 5 Axes: Role, Intent, Prominence, Density, Spec
 * Plus React essentials: as, children, className
 */
export interface BlockProps extends AsProp, React.HTMLAttributes<HTMLElement> {
  role?: BlockRole;
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  /**
   * Role-specific parameters (v1.0 Core)
   * All functional properties must reside here.
   */
  spec?: Record<string, any>;
  children?: ReactNode;
  /**
   * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
   */
  className?: string;

  // Selection & Data Binding (v1.0.2)
  value?: any;
  selectionModel?: {
    selectedValues?: Set<any> | any[];
    isSelected?: (value: any) => boolean;
    handleItemClick?: (value: any, event: React.MouseEvent) => void;
    registerItemRef?: (value: any, element: HTMLElement | null) => void;
  };
}

/**
 * Block Renderer Props
 * 모든 Block renderer가 공통으로 받는 props
 */
export interface BlockRendererProps extends Omit<BlockProps, 'role'> {
  role: BlockRole;
  computedDensity: NonNullable<Density>;
  computedProminence: NonNullable<Prominence>;
  computedIntent: NonNullable<Intent>;
  Element: any; // HTML 태그 또는 커스텀 컴포넌트
}

// Re-export shared types
export * from '../Shared.types';
