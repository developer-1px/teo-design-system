/**
 * IDDL (Intent-Driven Design Language) 1.0
 * Action & Block Type Definitions
 *
 * Status: Working Draft
 * Version: 0.2.0
 * Date: 2026-01-11
 */

// =============================================================================
// 1. COMMON TYPES
// =============================================================================

export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
export type Prominence = 'Hero' | 'Standard' | 'Subtle' | 'Hidden';
export type Density = 'Standard' | 'Comfortable' | 'Compact';

// =============================================================================
// 2. BEHAVIOR TYPES
// =============================================================================

export type ActionBehavior =
  | { type: 'submit' }
  | { type: 'navigate'; to: string; target?: '_blank' | '_self' }
  | { type: 'command'; id: string; params?: Record<string, unknown> }
  | { type: 'open'; target: string }
  | { type: 'close'; target?: string }
  | { type: 'toggle'; target?: string }
  | { type: 'copy'; value: string }
  | { type: 'download'; url: string; filename?: string };

export type SelectionMode = 'none' | 'single' | 'multiple' | 'extended';
export type Orientation = 'vertical' | 'horizontal' | 'both';

// =============================================================================
// 3. SLOT TYPES (for Composite Actions)
// =============================================================================

export type LeadingSlot =
  | { type: 'icon'; name: string; intent?: Intent }
  | { type: 'avatar'; src: string; alt?: string; fallback?: string }
  | { type: 'image'; src: string; alt?: string }
  | { type: 'thumbnail'; src: string; alt?: string; aspectRatio?: string }
  | { type: 'checkbox' }
  | { type: 'radio' }
  | { type: 'indicator'; color?: string };

export type TrailingSlot =
  | { type: 'icon'; name: string }
  | { type: 'text'; content: string }
  | { type: 'badge'; value: string | number; intent?: Intent }
  | { type: 'shortcut'; keys: string }
  | { type: 'action'; icon: string; label?: string; behavior?: ActionBehavior }
  | { type: 'chevron' }
  | { type: 'switch'; checked?: boolean }
  | { type: 'time'; value: string };

export interface CommonSlots {
  leading?: LeadingSlot;
  trailing?: TrailingSlot[];
  badge?: string | number;
  meta?: string | string[];
  description?: string;
}

// =============================================================================
// 4. ACTION ROLES & SPECS
// =============================================================================

export type ActionRole =
  // Basic
  | 'Button'
  | 'IconButton'
  | 'Link'
  | 'ToggleButton'
  // Selection
  | 'Tab'
  | 'MenuItem'
  | 'Option'
  | 'Chip'
  // Composite
  | 'ListItem'
  | 'NavItem'
  | 'TreeItem'
  | 'CardItem'
  | 'FileItem'
  | 'UserItem'
  | 'CommandItem'
  | 'TableRow'
  | 'ColumnHeader'
  | 'BreadcrumbItem'
  | 'StepItem'
  | 'NotificationItem'
  | 'SearchResultItem'
  | 'AccordionTrigger'
  | 'PageButton'
  | 'CalendarDay';

// --- Action Spec Types (role-dependent) ---

export type ButtonSpec = {};

export interface IconButtonSpec {
  tooltip?: { content: string; placement?: 'top' | 'bottom' | 'left' | 'right' };
}

export type LinkSpec = {};

export type ToggleButtonSpec = {};

export type TabSpec = {};

export interface MenuItemSpec {
  variant?: 'default' | 'checkbox' | 'radio';
  trailing?: TrailingSlot[];
}

export interface OptionSpec {
  leading?: LeadingSlot;
  description?: string;
}

export interface ChipSpec {
  removable?: boolean;
  avatar?: string;
  onRemove?: ActionBehavior;
}

export interface ListItemSpec extends CommonSlots {
  divider?: boolean;
}

export interface NavItemSpec {
  badge?: string | number;
  trailing?: TrailingSlot[];
  indent?: number;
}

export interface TreeItemSpec {
  level?: number;
  hasChildren?: boolean;
  trailing?: TrailingSlot[];
}

export interface CardItemSpec {
  thumbnail?: { src: string; alt?: string; aspectRatio?: string };
  description?: string;
  meta?: string[];
  avatar?: { src: string; label: string };
  badges?: Array<{ label: string; intent?: Intent }>;
  trailing?: TrailingSlot[];
}

export interface FileItemSpec {
  thumbnail?: string;
  size?: string;
  modified?: string;
  type?: string;
  meta?: string[];
  trailing?: TrailingSlot[];
}

export interface UserItemSpec {
  avatar?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
  role?: string;
  email?: string;
  meta?: string[];
  trailing?: TrailingSlot[];
}

export interface CommandItemSpec {
  shortcut?: string;
  description?: string;
  category?: string;
  keywords?: string[];
}

export interface TableCell {
  value: string | number;
  align?: 'left' | 'center' | 'right';
  intent?: Intent;
  link?: ActionBehavior;
}

export interface TableRowSpec {
  cells: TableCell[];
  expandable?: boolean;
  expanded?: boolean;
}

export interface ColumnHeaderSpec {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | 'none';
  resizable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface BreadcrumbItemSpec {
  icon?: string;
  collapsed?: boolean;
}

export interface StepItemSpec {
  status?: 'pending' | 'current' | 'completed' | 'error';
  description?: string;
  optional?: boolean;
  icon?: string;
}

export interface NotificationItemSpec {
  leading?: LeadingSlot;
  description?: string;
  time?: string;
  unread?: boolean;
  intent?: Intent;
  trailing?: TrailingSlot[];
}

export interface SearchResultItemSpec {
  snippet?: string;
  url?: string;
  thumbnail?: string;
  meta?: string[];
  badges?: Array<{ label: string }>;
}

export interface AccordionTriggerSpec {
  icon?: string;
  description?: string;
  trailing?: TrailingSlot[];
}

export interface PageButtonSpec {
  type?: 'page' | 'prev' | 'next' | 'first' | 'last' | 'ellipsis';
}

export interface CalendarDaySpec {
  today?: boolean;
  outsideMonth?: boolean;
  rangeStart?: boolean;
  rangeEnd?: boolean;
  inRange?: boolean;
  events?: Array<{ color?: string }>;
}

// --- Action Spec Union ---
export type ActionSpec =
  | ({ role: 'Button' } & ButtonSpec)
  | ({ role: 'IconButton' } & IconButtonSpec)
  | ({ role: 'Link' } & LinkSpec)
  | ({ role: 'ToggleButton' } & ToggleButtonSpec)
  | ({ role: 'Tab' } & TabSpec)
  | ({ role: 'MenuItem' } & MenuItemSpec)
  | ({ role: 'Option' } & OptionSpec)
  | ({ role: 'Chip' } & ChipSpec)
  | ({ role: 'ListItem' } & ListItemSpec)
  | ({ role: 'NavItem' } & NavItemSpec)
  | ({ role: 'TreeItem' } & TreeItemSpec)
  | ({ role: 'CardItem' } & CardItemSpec)
  | ({ role: 'FileItem' } & FileItemSpec)
  | ({ role: 'UserItem' } & UserItemSpec)
  | ({ role: 'CommandItem' } & CommandItemSpec)
  | ({ role: 'TableRow' } & TableRowSpec)
  | ({ role: 'ColumnHeader' } & ColumnHeaderSpec)
  | ({ role: 'BreadcrumbItem' } & BreadcrumbItemSpec)
  | ({ role: 'StepItem' } & StepItemSpec)
  | ({ role: 'NotificationItem' } & NotificationItemSpec)
  | ({ role: 'SearchResultItem' } & SearchResultItemSpec)
  | ({ role: 'AccordionTrigger' } & AccordionTriggerSpec)
  | ({ role: 'PageButton' } & PageButtonSpec)
  | ({ role: 'CalendarDay' } & CalendarDaySpec);

// --- Base Action Props ---
export interface BaseActionProps {
  role: ActionRole;
  label: string;
  id?: string;
  icon?: string;
  behavior?: ActionBehavior;
  disabled?: boolean;
  loading?: boolean;

  // State (managed by parent Block)
  selected?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  current?: boolean;

  // Axes
  intent?: Intent;
  prominence?: Prominence;
  density?: Density;

  // Role-specific spec
  spec?: Omit<ActionSpec, 'role'>;
}

// =============================================================================
// 5. BLOCK ROLES & SPECS
// =============================================================================

export type BlockRole =
  // Layout
  | 'Stack'
  | 'Grid'
  | 'Card'
  | 'ScrollArea'
  // Collection
  | 'List'
  | 'TreeView'
  | 'DataTable'
  | 'TableHeader'
  | 'TableBody'
  | 'Menu'
  | 'MenuGroup'
  | 'Listbox'
  | 'OptionGroup'
  | 'CommandPalette'
  | 'CommandGroup'
  | 'Calendar'
  | 'Carousel'
  | 'CarouselSlide'
  // Navigation
  | 'Navigation'
  | 'NavGroup'
  | 'Tabs'
  | 'TabPanel'
  | 'Breadcrumbs'
  | 'Pagination'
  | 'Stepper'
  // Form
  | 'Form'
  | 'FieldGroup'
  | 'FilterBar'
  // Overlay
  | 'Popover'
  | 'Tooltip'
  | 'Toast'
  | 'ContextMenu'
  // Grouping
  | 'Group'
  | 'Toolbar'
  | 'ButtonGroup'
  | 'ChipGroup'
  | 'Accordion'
  | 'AccordionItem'
  | 'AccordionPanel';

// --- Block Spec Types (role-dependent) ---

export interface StackSpec {
  direction?: 'vertical' | 'horizontal';
  wrap?: boolean;
  reverse?: boolean;
}

export interface GridSpec {
  columns?: number | string;
  rows?: number | string;
  autoFit?: string;
  // rowGap and columnGap are calculated automatically from density
}

export interface CardSpec {
  variant?: 'elevated' | 'outlined' | 'filled';
  interactive?: boolean;
  mediaPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export interface ScrollAreaSpec {
  direction?: 'vertical' | 'horizontal' | 'both';
  scrollbar?: 'auto' | 'always' | 'hover' | 'never';
  maxHeight?: string;
  maxWidth?: string;
}

export interface ListSpec {
  selection?: SelectionMode;
  followFocus?: boolean;
  loop?: boolean;
  dividers?: boolean;
  virtualized?: boolean;
  emptyMessage?: string;
}

export interface TreeViewSpec {
  selection?: SelectionMode;
  multipleExpand?: boolean;
  defaultExpanded?: string[];
  expanded?: string[];
  indentSize?: 'sm' | 'md' | 'lg';
}

export interface DataTableSpec {
  selection?: SelectionMode;
  cellNavigation?: boolean;
  sortable?: boolean;
  sort?: { column: string; direction: 'asc' | 'desc' };
  resizable?: boolean;
  stickyHeader?: boolean;
  virtualized?: boolean;
  emptyMessage?: string;
}

export type TableHeaderSpec = {};
export type TableBodySpec = {};

export interface MenuSpec {
  variant?: 'default' | 'compact';
}

export interface MenuGroupSpec {
  label?: string;
}

export interface ListboxSpec {
  multiple?: boolean;
  virtualized?: boolean;
}

export interface OptionGroupSpec {
  label: string;
}

export interface CommandPaletteSpec {
  placeholder?: string;
  query?: string;
  emptyMessage?: string;
}

export interface CommandGroupSpec {
  label: string;
}

export interface CalendarSpec {
  selection?: 'single' | 'multiple' | 'range';
  month?: string;
  selected?: string | string[];
  range?: { start: string; end: string };
  min?: string;
  max?: string;
  disabled?: string[];
  firstDayOfWeek?: number;
  locale?: string;
}

export interface CarouselSpec {
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
  slidesToShow?: number;
  slidesToScroll?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
}

export type CarouselSlideSpec = {};

export interface NavigationSpec {
  collapsible?: boolean;
  collapsed?: boolean;
}

export interface NavGroupSpec {
  label?: string;
  collapsible?: boolean;
  collapsed?: boolean;
}

export interface TabsSpec {
  selected?: string;
  defaultSelected?: string;
  variant?: 'line' | 'enclosed' | 'pills';
  fitted?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export interface TabPanelSpec {
  tabId: string;
}

export interface BreadcrumbsSpec {
  separator?: string;
  maxItems?: number;
}

export interface PaginationSpec {
  page: number;
  totalPages: number;
  siblingCount?: number;
  showFirstLast?: boolean;
  variant?: 'default' | 'simple' | 'compact';
}

export interface StepperSpec {
  current: string | number;
  orientation?: 'horizontal' | 'vertical';
  clickable?: boolean;
  variant?: 'default' | 'simple' | 'dots';
}

export interface FormSpec {
  action?: string;
  method?: 'get' | 'post';
  layout?: 'vertical' | 'horizontal' | 'inline';
  labelWidth?: string;
  requiredIndicator?: 'asterisk' | 'label' | 'none';
}

export interface FieldGroupSpec {
  label?: string;
  description?: string;
  collapsible?: boolean;
  collapsed?: boolean;
}

export interface FilterBarSpec {
  layout?: 'inline' | 'stacked';
  actionsPosition?: 'end' | 'bottom';
}

export interface PopoverSpec {
  triggerId?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  align?: 'start' | 'center' | 'end';
  arrow?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
}

export interface TooltipSpec {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  arrow?: boolean;
}

export interface ToastSpec {
  message: string;
  title?: string;
  intent?: Intent;
  duration?: number;
  closable?: boolean;
  action?: { label: string; behavior: ActionBehavior };
}

export interface ContextMenuSpec {
  triggerId?: string;
  position?: 'cursor' | 'center';
}

export interface GroupSpec {
  label?: string;
}

export interface ToolbarSpec {
  orientation?: 'horizontal' | 'vertical';
  dividers?: boolean;
}

export interface ButtonGroupSpec {
  attached?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export interface ChipGroupSpec {
  selection?: 'none' | 'single' | 'multiple';
  wrap?: boolean;
}

export interface AccordionSpec {
  multiple?: boolean;
  collapsible?: boolean;
  expanded?: string[];
  defaultExpanded?: string[];
}

export interface AccordionItemSpec {
  expanded?: boolean;
  disabled?: boolean;
}

export type AccordionPanelSpec = {};

// --- Block Spec Union ---
export type BlockSpec =
  | ({ role: 'Stack' } & StackSpec)
  | ({ role: 'Grid' } & GridSpec)
  | ({ role: 'Card' } & CardSpec)
  | ({ role: 'ScrollArea' } & ScrollAreaSpec)
  | ({ role: 'List' } & ListSpec)
  | ({ role: 'TreeView' } & TreeViewSpec)
  | ({ role: 'DataTable' } & DataTableSpec)
  | ({ role: 'TableHeader' } & TableHeaderSpec)
  | ({ role: 'TableBody' } & TableBodySpec)
  | ({ role: 'Menu' } & MenuSpec)
  | ({ role: 'MenuGroup' } & MenuGroupSpec)
  | ({ role: 'Listbox' } & ListboxSpec)
  | ({ role: 'OptionGroup' } & OptionGroupSpec)
  | ({ role: 'CommandPalette' } & CommandPaletteSpec)
  | ({ role: 'CommandGroup' } & CommandGroupSpec)
  | ({ role: 'Calendar' } & CalendarSpec)
  | ({ role: 'Carousel' } & CarouselSpec)
  | ({ role: 'CarouselSlide' } & CarouselSlideSpec)
  | ({ role: 'Navigation' } & NavigationSpec)
  | ({ role: 'NavGroup' } & NavGroupSpec)
  | ({ role: 'Tabs' } & TabsSpec)
  | ({ role: 'TabPanel' } & TabPanelSpec)
  | ({ role: 'Breadcrumbs' } & BreadcrumbsSpec)
  | ({ role: 'Pagination' } & PaginationSpec)
  | ({ role: 'Stepper' } & StepperSpec)
  | ({ role: 'Form' } & FormSpec)
  | ({ role: 'FieldGroup' } & FieldGroupSpec)
  | ({ role: 'FilterBar' } & FilterBarSpec)
  | ({ role: 'Popover' } & PopoverSpec)
  | ({ role: 'Tooltip' } & TooltipSpec)
  | ({ role: 'Toast' } & ToastSpec)
  | ({ role: 'ContextMenu' } & ContextMenuSpec)
  | ({ role: 'Group' } & GroupSpec)
  | ({ role: 'Toolbar' } & ToolbarSpec)
  | ({ role: 'ButtonGroup' } & ButtonGroupSpec)
  | ({ role: 'ChipGroup' } & ChipGroupSpec)
  | ({ role: 'Accordion' } & AccordionSpec)
  | ({ role: 'AccordionItem' } & AccordionItemSpec)
  | ({ role: 'AccordionPanel' } & AccordionPanelSpec);

// --- Base Block Props ---
export interface BaseBlockProps {
  role?: BlockRole;
  id?: string;
  name?: string;
  description?: string;

  // Axes
  intent?: Intent;
  prominence?: Prominence;
  density?: Density;

  // Layout helpers are calculated automatically from prominence × density
  // gap, padding, align, justify should NOT be direct props

  // Role-specific spec
  spec?: Omit<BlockSpec, 'role'>;
}

// =============================================================================
// 6. ELEMENT TYPES (Text, Image, Field, Separator)
// =============================================================================

export type TextRole = 'Title' | 'Heading' | 'Body' | 'Label' | 'Caption';

export interface TextProps {
  role: TextRole;
  content?: string;
  icon?: string;
  intent?: Intent;
  prominence?: Prominence;
  // align is determined by role, not a direct prop
}

export interface ImageProps {
  src: string;
  alt: string;
  // aspectRatio and fit should be in spec object
  // spec?: { aspectRatio?: 'auto' | '1:1' | '16:9' | '4:3'; fit?: 'cover' | 'contain' }
}

export interface SeparatorProps {
  type?: 'line' | 'space';
  orientation?: 'horizontal' | 'vertical';
  content?: string;
  // size is calculated automatically from density
}

// =============================================================================
// 7. FIELD TYPES (Reference to field-spec.md)
// =============================================================================

export type FieldRole =
  | 'TextInput'
  | 'TextArea'
  | 'NumberInput'
  | 'PasswordInput'
  | 'EmailInput'
  | 'SearchInput'
  | 'Select'
  | 'Combobox'
  | 'Checkbox'
  | 'Switch'
  | 'RadioGroup'
  | 'DateInput'
  | 'TimeInput'
  | 'DateTimeInput'
  | 'FileInput'
  | 'Slider'
  | 'OTPInput'
  | 'TagInput'
  | 'Rating';

export interface BaseFieldProps {
  role: FieldRole;
  label: string;
  model: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  intent?: Intent;
  prominence?: Prominence;
  density?: Density;
  spec?: Record<string, unknown>;
}

// =============================================================================
// 8. SECTION TYPES
// =============================================================================

export type SectionRole =
  | 'Header'
  | 'Footer'
  | 'Main'
  | 'Navigation'
  | 'Sidebar'
  | 'Search'
  | 'Region'
  | 'Modal'
  | 'Drawer';

export interface SectionProps {
  role: SectionRole;
  name?: string;
  description?: string;
  intent?: Intent;
  prominence?: Prominence;
  density?: Density;
}

// =============================================================================
// 9. PAGE TYPE
// =============================================================================

export type PageRole = 'Document' | 'AppShell' | 'Screen' | 'ModalScreen';

export interface PageProps {
  role?: PageRole;
  title?: string;
  description?: string;
  template?: string;
}

// =============================================================================
// 10. AST NODE TYPES
// =============================================================================

export type IDDLNode = PageNode | SectionNode | BlockNode | ElementNode;

export interface PageNode extends PageProps {
  type: 'Page';
  children: SectionNode[];
}

export interface SectionNode extends SectionProps {
  type: 'Section';
  children: BlockNode[];
}

export interface BlockNode extends BaseBlockProps {
  type: 'Block';
  children: (BlockNode | ElementNode)[];
}

export type ElementNode =
  | ({ type: 'Element'; elementType: 'Text' } & TextProps)
  | ({ type: 'Element'; elementType: 'Image' } & ImageProps)
  | ({ type: 'Element'; elementType: 'Field' } & BaseFieldProps)
  | ({ type: 'Element'; elementType: 'Action' } & BaseActionProps)
  | ({ type: 'Element'; elementType: 'Separator' } & SeparatorProps);

// =============================================================================
// 11. HELPER TYPES
// =============================================================================

/**
 * 특정 Action Role의 Props 추출
 */
export type ActionPropsFor<R extends ActionRole> = BaseActionProps & {
  role: R;
  spec?: R extends 'Button'
    ? ButtonSpec
    : R extends 'IconButton'
      ? IconButtonSpec
      : R extends 'Link'
        ? LinkSpec
        : R extends 'ToggleButton'
          ? ToggleButtonSpec
          : R extends 'Tab'
            ? TabSpec
            : R extends 'MenuItem'
              ? MenuItemSpec
              : R extends 'Option'
                ? OptionSpec
                : R extends 'Chip'
                  ? ChipSpec
                  : R extends 'ListItem'
                    ? ListItemSpec
                    : R extends 'NavItem'
                      ? NavItemSpec
                      : R extends 'TreeItem'
                        ? TreeItemSpec
                        : R extends 'CardItem'
                          ? CardItemSpec
                          : R extends 'FileItem'
                            ? FileItemSpec
                            : R extends 'UserItem'
                              ? UserItemSpec
                              : R extends 'CommandItem'
                                ? CommandItemSpec
                                : R extends 'TableRow'
                                  ? TableRowSpec
                                  : R extends 'ColumnHeader'
                                    ? ColumnHeaderSpec
                                    : R extends 'BreadcrumbItem'
                                      ? BreadcrumbItemSpec
                                      : R extends 'StepItem'
                                        ? StepItemSpec
                                        : R extends 'NotificationItem'
                                          ? NotificationItemSpec
                                          : R extends 'SearchResultItem'
                                            ? SearchResultItemSpec
                                            : R extends 'AccordionTrigger'
                                              ? AccordionTriggerSpec
                                              : R extends 'PageButton'
                                                ? PageButtonSpec
                                                : R extends 'CalendarDay'
                                                  ? CalendarDaySpec
                                                  : never;
};

/**
 * 특정 Block Role의 Props 추출
 */
export type BlockPropsFor<R extends BlockRole> = BaseBlockProps & {
  role: R;
  spec?: R extends 'Stack'
    ? StackSpec
    : R extends 'Grid'
      ? GridSpec
      : R extends 'Card'
        ? CardSpec
        : R extends 'ScrollArea'
          ? ScrollAreaSpec
          : R extends 'List'
            ? ListSpec
            : R extends 'TreeView'
              ? TreeViewSpec
              : R extends 'DataTable'
                ? DataTableSpec
                : R extends 'Menu'
                  ? MenuSpec
                  : R extends 'Tabs'
                    ? TabsSpec
                    : R extends 'Form'
                      ? FormSpec
                      : // ... 나머지 매핑
                        Record<string, unknown>;
};

// =============================================================================
// 12. VALIDATION HELPERS
// =============================================================================

/**
 * Block별 허용되는 자식 타입
 */
export const BLOCK_ALLOWED_CHILDREN: Record<BlockRole, string[]> = {
  // Layout
  Stack: ['*'],
  Grid: ['*'],
  Card: ['*'],
  ScrollArea: ['*'],

  // Collection
  List: ['ListItem', 'FileItem', 'UserItem', 'NotificationItem', 'SearchResultItem', 'Separator'],
  TreeView: ['TreeItem'],
  DataTable: ['TableHeader', 'TableBody'],
  TableHeader: ['ColumnHeader'],
  TableBody: ['TableRow'],
  Menu: ['MenuItem', 'MenuGroup', 'Separator'],
  MenuGroup: ['MenuItem', 'Separator'],
  Listbox: ['Option', 'OptionGroup'],
  OptionGroup: ['Option'],
  CommandPalette: ['CommandGroup', 'CommandItem', 'SearchInput'],
  CommandGroup: ['CommandItem'],
  Calendar: ['CalendarDay'],
  Carousel: ['CarouselSlide'],
  CarouselSlide: ['*'],

  // Navigation
  Navigation: ['NavItem', 'NavGroup', 'Separator'],
  NavGroup: ['NavItem'],
  Tabs: ['Tab'],
  TabPanel: ['*'],
  Breadcrumbs: ['BreadcrumbItem'],
  Pagination: ['PageButton'],
  Stepper: ['StepItem'],

  // Form
  Form: ['Field', 'FieldGroup', 'Action', 'Separator', '*'],
  FieldGroup: ['Field', 'FieldGroup'],
  FilterBar: ['Field', 'Action'],

  // Overlay
  Popover: ['*'],
  Tooltip: ['Text'],
  Toast: ['Text', 'Action'],
  ContextMenu: ['MenuItem', 'MenuGroup', 'Separator'],

  // Grouping
  Group: ['*'],
  Toolbar: ['Action', 'Separator', 'ButtonGroup'],
  ButtonGroup: ['Button', 'IconButton', 'ToggleButton'],
  ChipGroup: ['Chip'],
  Accordion: ['AccordionItem'],
  AccordionItem: ['AccordionTrigger', 'AccordionPanel'],
  AccordionPanel: ['*'],
};

/**
 * Selection 지원 Block
 */
export const SELECTABLE_BLOCKS: BlockRole[] = [
  'List',
  'TreeView',
  'DataTable',
  'Menu',
  'Listbox',
  'CommandPalette',
  'Calendar',
  'Tabs',
  'ChipGroup',
];

/**
 * Navigable 지원 Block
 */
export const NAVIGABLE_BLOCKS: BlockRole[] = [
  'List',
  'TreeView',
  'DataTable',
  'Menu',
  'Listbox',
  'CommandPalette',
  'Calendar',
  'Carousel',
  'Navigation',
  'Tabs',
  'Pagination',
  'Toolbar',
  'ChipGroup',
];

/**
 * FocusScope 필요 Block
 */
export const FOCUS_SCOPE_BLOCKS: BlockRole[] = ['Menu', 'CommandPalette', 'Popover', 'ContextMenu'];
