/**
 * Block Role Configuration (v4.1)
 *
 * Block role → 모든 특성 자동 결정
 * - htmlTag: 시맨틱 HTML 태그
 * - ariaProps: 접근성 속성
 * - baseStyles: 기본 Tailwind 클래스 (CVA에서 이동)
 * - renderer: 전용 렌더러 컴포넌트 (optional)
 */

import type { ComponentType } from 'react';
import type {
  BlockProps,
  BlockRendererProps,
  BlockRole,
} from '@/components/types/Block/Block.types';
import type { BaseRoleConfig } from '../shared/role.base';
import { Accordion } from './role/Accordion'; // Existing
import * as Data from './role/DataDisplay';
import * as Feedback from './role/Feedback';
import * as Form from './role/Form';
import * as Interaction from './role/Interaction';
// Renderers
import * as Layout from './role/Layout';
import * as List from './role/List';
import * as Nav from './role/Navigation';
import * as Overlay from './role/Overlay';
import { SortableList } from './role/SortableList'; // Existing
import { Toolbar as LegacyToolbar } from './role/Toolbar'; // Existing
import { Tree } from './role/Tree';

/**
 * Role Configuration Interface
 *
 * Extends BaseRoleConfig for type consistency across all IDDL components
 */
export interface BlockRoleConfig extends BaseRoleConfig<BlockProps> {
  /**
   * Whether to apply automatic padding based on density
   * true: Container blocks that need internal spacing (Card, Form, Alert, etc.)
   * false: Layout blocks without visual padding (Stack, Grid, List, etc.)
   */
  autoPadding?: boolean;

  // Override BaseRoleConfig optional properties to be required for Block
  htmlTag: keyof React.JSX.IntrinsicElements;
  description: string;

  /**
   * Section-specific overrides (v5.2)
   * IDDL 5.2: "Section Context Awareness"
   * Block styles can adapt based on the container Section's role.
   * e.g. Card in Main vs Card in Panel
   */
  sectionOverrides?: Partial<
    Record<
      string,
      {
        // Using string for looser SectionRole coupling or import it
        baseStyles?: string;
      }
    >
  >;
}

/**
 * Block Role Configuration (전역 - 모든 layout에서 동일)
 */
export const ROLE_CONFIGS: Record<BlockRole, BlockRoleConfig> = {
  // ==================== 1. Layout Containers ====================
  Card: {
    htmlTag: 'article',
    ariaProps: { role: 'article' },
    baseStyles: 'bg-surface border border-border-default rounded-lg shadow-sm', // Default style
    renderer: Layout.Card,
    autoPadding: true,
    description: '콘텐츠 그룹 컨테이너',
    sectionOverrides: {
      Panel: { baseStyles: 'bg-transparent border-0 shadow-none rounded-none p-0' }, // Flat container in Panel
      Sidebar: { baseStyles: 'bg-transparent border-0 shadow-none rounded-none p-0 gap-1' }, // Nav container
      Header: {
        baseStyles:
          'bg-surface-elevated border-b border-border-default rounded-none shadow-none px-4',
      }, // Header wrapper
    },
  },
  SearchBar: { htmlTag: 'div', baseStyles: 'relative', description: '검색 바' },
  Stack: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Layout.Stack,
    autoPadding: false,
    description: '수직 스택',
    sectionOverrides: {
      Toolbar: { baseStyles: 'flex-row items-center gap-1' }, // Dense horizontal in Toolbar
      Header: { baseStyles: 'flex-row items-center gap-4' }, // Spaced horizontal in Header
      Footer: { baseStyles: 'flex-row items-center gap-4 justify-between' }, // Spread in Footer
    },
  },
  Grid: {
    htmlTag: 'div',
    ariaProps: { role: 'grid' },
    baseStyles: '',
    renderer: Layout.Grid,
    autoPadding: false,
    description: '그리드 레이아웃',
  },
  Center: {
    htmlTag: 'div',
    baseStyles: 'flex items-center justify-center h-full',
    autoPadding: false,
    description: '중앙 정렬 컨테이너',
  },
  ScrollArea: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Layout.ScrollArea,
    autoPadding: false,
    description: '스크롤 영역',
  },
  Collapsible: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Layout.Collapsible,
    autoPadding: false,
    description: '접을 수 있는 영역',
  },
  Splitter: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Layout.Splitter,
    autoPadding: false,
    description: '크기 조절 패널',
  },
  AspectRatio: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Layout.AspectRatio,
    autoPadding: false,
    description: '비율 유지 컨테이너',
  },
  Tree: {
    htmlTag: 'div',
    ariaProps: { role: 'tree' },
    baseStyles: '',
    renderer: Tree,
    autoPadding: false,
    description: '계층형 트리 탐색 (v4.1)',
  },

  // Legacy Aliases
  Container: { htmlTag: 'div', baseStyles: '', description: '일반 컨테이너' },
  Group: { htmlTag: 'div', baseStyles: 'flex flex-col gap-2', description: 'Group (Legacy Stack)' },
  Row: {
    htmlTag: 'div',
    baseStyles: 'flex flex-row items-center gap-2',
    description: 'Row (Legacy)',
  },
  Split: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Layout.Splitter,
    description: 'Split (Legacy Splitter)',
  },
  Inline: { htmlTag: 'div', baseStyles: 'flex items-center gap-2', description: 'Inline (Legacy)' },
  Spacer: { htmlTag: 'div', baseStyles: 'flex-1', description: '여백' },
  Divider: {
    htmlTag: 'hr',
    baseStyles: 'border-t border-border-default w-full my-4',
    description: '구분선',
  },
  DividerVertical: {
    htmlTag: 'div',
    baseStyles: 'border-l border-border-default h-full mx-4',
    description: '수직 구분선',
  },

  // ==================== 2. List / Collections ====================
  List: {
    htmlTag: 'ul',
    ariaProps: { role: 'list' },
    baseStyles: 'flex flex-col gap-2',
    renderer: List.List,
    description: '단순 목록',
    sectionOverrides: {
      Sidebar: { baseStyles: 'gap-0.5' }, // Tight nav list
      Panel: { baseStyles: 'gap-1' }, // Compact panel list
    },
  },
  Menu: {
    htmlTag: 'div',
    ariaProps: { role: 'menu' },
    baseStyles: '',
    renderer: List.Menu,
    description: '메뉴 목록',
  },
  SubMenu: {
    htmlTag: 'div',
    ariaProps: { role: 'menu' },
    baseStyles: 'pl-4',
    renderer: List.Menu,
    description: '서브 메뉴',
  },
  ContextMenu: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: List.Menu,
    description: '우클릭 메뉴 (Mock)',
  },
  CommandPalette: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: List.CommandPalette,
    description: '검색 가능 명령 목록',
  },
  Combobox: {
    htmlTag: 'div',
    ariaProps: { role: 'combobox' },
    baseStyles: '',
    renderer: List.Combobox,
    description: '검색 드롭다운',
  },
  TreeView: {
    htmlTag: 'div',
    ariaProps: { role: 'tree' },
    baseStyles: '',
    renderer: Tree,
    description: '계층 목록',
  },
  Table: {
    htmlTag: 'table',
    ariaProps: { role: 'table' },
    baseStyles: 'w-full',
    description: '테이블',
  },
  DataTable: {
    htmlTag: 'table',
    ariaProps: { role: 'grid' },
    baseStyles: 'w-full',
    description: '데이터 테이블',
  }, // Use List.DataTable if implemented or leave as base
  DataGrid: {
    htmlTag: 'div',
    ariaProps: { role: 'grid' },
    baseStyles: '',
    description: '데이터 그리드',
  },
  VirtualList: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: List.List,
    description: '대용량 목록 (Mock)',
  },
  Carousel: {
    htmlTag: 'div',
    baseStyles: 'flex overflow-x-auto gap-4 p-4',
    description: '슬라이드 목록',
  },
  Timeline: { htmlTag: 'div', baseStyles: '', renderer: List.Timeline, description: '시간순 목록' },

  // Legacy/Items
  // ListItem moved to Action
  SortableList: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: SortableList as any,
    description: '정렬 가능한 리스트',
  },
  // MenuItem moved to Action
  MenuSection: {
    htmlTag: 'div',
    baseStyles: 'py-1 font-bold text-xs text-text-subtle px-3',
    description: '메뉴 섹션',
  },
  // MenuTrigger moved to Action
  Dropdown: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: List.Menu,
    description: '드롭다운 (Legacy)',
  },

  // ==================== 3. Navigation ====================
  Tabs: {
    htmlTag: 'div',
    ariaProps: { role: 'tablist' },
    baseStyles: 'flex gap-4 border-b border-border-default', // Default Line Tabs
    renderer: Nav.NavigationMenu, // TODO: Use actual Tabs renderer if available or switch description to NavigationMenu
    description: '탭 전환',
    sectionOverrides: {
      Header: { baseStyles: 'h-full border-b-0 gap-1' }, // Integrated tabs
      Panel: { baseStyles: 'p-1 bg-surface-muted rounded-md gap-0.5' }, // Segmented style
    },
  },
  TabPanel: {
    htmlTag: 'div',
    ariaProps: { role: 'tabpanel' },
    baseStyles: 'p-4',
    description: '탭 콘텐츠',
  },
  Toolbar: {
    htmlTag: 'div',
    ariaProps: { role: 'toolbar' },
    baseStyles:
      'flex items-center gap-2 p-1 border border-border-default rounded-md bg-surface shadow-sm', // Detached default
    renderer: LegacyToolbar as any,
    description: '도구 모음',
    sectionOverrides: {
      Header: { baseStyles: 'border-0 shadow-none bg-transparent p-0' }, // Flat in bars
      Footer: { baseStyles: 'border-0 shadow-none bg-transparent p-0' },
      Extension: { baseStyles: 'border-0 shadow-none bg-transparent p-0' }, // General extension
    },
  },
  Breadcrumbs: {
    htmlTag: 'nav',
    ariaProps: { 'aria-label': 'Breadcrumb' },
    baseStyles: '',
    renderer: Nav.Breadcrumbs,
    description: '경로 표시',
  },
  Pagination: {
    htmlTag: 'nav',
    ariaProps: { 'aria-label': 'Pagination' },
    baseStyles: '',
    renderer: Nav.Pagination,
    description: '페이지 전환',
  },
  Stepper: { htmlTag: 'div', baseStyles: '', renderer: Nav.Stepper, description: '단계 표시' },
  NavigationMenu: {
    htmlTag: 'nav',
    baseStyles: '',
    renderer: Nav.NavigationMenu,
    description: '내비게이션 메뉴',
  },
  Sidebar: {
    htmlTag: 'aside',
    baseStyles: '',
    renderer: Nav.Sidebar,
    description: '사이드 내비게이션',
  },
  AppBar: { htmlTag: 'header', baseStyles: '', renderer: Nav.AppBar, description: '상단 앱 바' },

  Steps: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Nav.Stepper,
    description: 'Steps (Legacy Stepper)',
  },
  ScrollMenu: { htmlTag: 'nav', baseStyles: '', description: '스크롤 메뉴' },
  Navigator: { htmlTag: 'nav', baseStyles: '', description: '내비게이션바' },
  FloatingToolbar: {
    htmlTag: 'div',
    baseStyles:
      'absolute bottom-4 left-1/2 -translate-x-1/2 shadow-xl rounded-full bg-surface-overlay border border-border-default px-4 py-2 flex items-center gap-2',
    description: '플로팅 툴바',
  },
  ToolbarDivider: {
    htmlTag: 'div',
    baseStyles: 'w-px h-4 bg-border-default mx-1',
    description: '툴바 구분선',
  },
  NavGroup: { htmlTag: 'nav', baseStyles: 'flex flex-col gap-1', description: '내비게이션 그룹' },
  ButtonGroup: { htmlTag: 'div', baseStyles: 'flex items-center gap-1', description: '버튼 그룹' },
  ChipGroup: { htmlTag: 'div', baseStyles: 'flex flex-wrap gap-2', description: '칩 그룹' },

  // ==================== 4. Forms ====================
  Form: {
    htmlTag: 'form',
    ariaProps: { role: 'form' },
    baseStyles: '',
    renderer: Form.Form,
    autoPadding: true,
    description: '폼 컨테이너',
  },
  FieldGroup: {
    htmlTag: 'fieldset',
    baseStyles: '',
    renderer: Form.FieldGroup,
    autoPadding: true,
    description: '필드 그룹',
  },
  RadioGroup: {
    htmlTag: 'div',
    ariaProps: { role: 'radiogroup' },
    baseStyles: '',
    renderer: Form.RadioGroup,
    autoPadding: false,
    description: '라디오 그룹',
  },
  CheckboxGroup: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Form.CheckboxGroup,
    autoPadding: false,
    description: '체크박스 그룹',
  },
  ToggleGroup: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Form.ToggleGroup,
    autoPadding: false,
    description: '토글 버튼 그룹',
  },
  InputGroup: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Form.InputGroup,
    autoPadding: false,
    description: '입력 + 애드온',
  },
  FormActions: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Form.FormActions,
    autoPadding: false,
    description: '폼 버튼 그룹',
  },
  Fieldset: {
    htmlTag: 'fieldset',
    baseStyles: '',
    renderer: Form.FieldGroup,
    autoPadding: true,
    description: 'Fieldset (Legacy)',
  },

  // ==================== 5. Overlay ====================
  Dialog: {
    htmlTag: 'div',
    ariaProps: { role: 'dialog' },
    baseStyles: '',
    renderer: Overlay.Dialog,
    autoPadding: true,
    description: '모달 대화상자',
  },
  AlertDialog: {
    htmlTag: 'div',
    ariaProps: { role: 'alertdialog' },
    baseStyles: '',
    renderer: Overlay.AlertDialog,
    autoPadding: true,
    description: '확인 대화상자',
  },
  Sheet: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Overlay.Sheet,
    autoPadding: true,
    description: '시트',
  },
  Drawer: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Overlay.Sheet,
    autoPadding: true,
    description: '서랍 (Drawer)',
  },
  Popover: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Overlay.Popover,
    autoPadding: true,
    description: '팝오버',
  },
  Tooltip: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Overlay.Tooltip,
    autoPadding: true,
    description: '툴팁',
  },
  HoverCard: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Overlay.Popover,
    autoPadding: true,
    description: '호버 카드',
  },
  DropdownMenu: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: List.Menu,
    autoPadding: false,
    description: '드롭다운 메뉴',
  },
  Toast: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Overlay.Toast,
    autoPadding: true,
    description: '토스트 알림',
  },
  Notification: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Overlay.Toast,
    autoPadding: true,
    description: '알림',
  },

  // ==================== 6. Data Display ====================
  Accordion: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Accordion as any,
    autoPadding: false,
    description: '아코디언',
  },
  DescriptionList: {
    htmlTag: 'dl',
    baseStyles: '',
    renderer: Data.DescriptionList,
    autoPadding: false,
    description: '키-값 목록',
  },
  Stats: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Data.Stats,
    autoPadding: true,
    description: '통계 카드',
  },
  // Avatar moved to Text/Action
  // AvatarGroup moved to ? (Maybe Block but I removed it. Let's assume removed for now or use Group)
  // Badge moved to Text
  // Tag moved to Text/Action
  EmptyState: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Data.EmptyState,
    autoPadding: true,
    description: '빈 상태',
  },
  // Skeleton moved to Text
  Calendar: {
    htmlTag: 'div',
    baseStyles: 'p-4 bg-surface border rounded',
    autoPadding: false,
    description: '캘린더 (Mock)',
  },
  Chart: {
    htmlTag: 'div',
    baseStyles: 'w-full h-40 bg-surface-raised flex items-end justify-around pb-2 px-2',
    autoPadding: false,
    description: '차트 (Mock)',
  },
  ColorIndicator: {
    htmlTag: 'div',
    baseStyles: 'w-4 h-4 rounded-full border border-border-default',
    autoPadding: false,
    description: '색상 표시',
  },
  PreviewContainer: {
    htmlTag: 'div',
    baseStyles: 'bg-surface-sunken p-4 rounded-lg',
    autoPadding: false,
    description: '미리보기 컨테이너',
  },
  PreviewCard: {
    htmlTag: 'div',
    baseStyles: 'bg-surface p-4 rounded shadow-sm',
    autoPadding: false,
    description: '미리보기 카드',
  },
  SectionHighlight: {
    htmlTag: 'div',
    baseStyles: 'border-2 border-primary border-dashed rounded',
    autoPadding: false,
    description: '영역 하이라이트',
  },

  // ==================== 7. Feedback ====================
  Alert: {
    htmlTag: 'div',
    ariaProps: { role: 'alert' },
    baseStyles: '',
    renderer: Feedback.Alert,
    autoPadding: true,
    description: '인라인 알림',
  },
  // Progress moved to Text
  // Spinner moved to Text
  Banner: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Feedback.Banner,
    autoPadding: true,
    description: '배너 알림',
  },
  Callout: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Feedback.Callout,
    autoPadding: true,
    description: '강조 블록',
  },

  // ==================== 8. Interaction ====================
  DragDropZone: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Interaction.DragDropZone,
    description: '드래그 앤 드롭 영역',
  },
  Sortable: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Interaction.Sortable,
    description: '정렬 가능 목록 (Simple)',
  },
  Resizable: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Interaction.Resizable,
    description: '크기 조절 영역',
  },
  SelectionArea: {
    htmlTag: 'div',
    baseStyles: '',
    renderer: Interaction.SelectionArea,
    description: '범위 선택 영역',
  },

  // ==================== Testing ====================
  Mock: { htmlTag: 'div', baseStyles: 'bg-black/5 p-2 dashed border', description: 'Mock' },
  DeviceFrame: {
    htmlTag: 'div',
    baseStyles:
      'border-8 border-gray-800 rounded-3xl overflow-hidden shadow-2xl bg-white aspect-[9/16] max-w-sm mx-auto',
    description: '기기 프레임',
  },
};

/**
 * Get role configuration
 */
export function getRoleConfig(role: BlockRole | undefined): BlockRoleConfig | undefined {
  return role ? ROLE_CONFIGS[role] : undefined;
}

/**
 * Check if role has a dedicated renderer
 */
export function hasRenderer(role: BlockRole | undefined): boolean {
  return role ? ROLE_CONFIGS[role]?.renderer !== undefined : false;
}
