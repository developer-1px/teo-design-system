/**
 * Headless UI Hooks
 *
 * Industry-standard headless hooks for building accessible components
 * References: Downshift, React Aria, Headless UI
 */

export type {
  AccordionItemProps,
  AccordionPanelProps,
  UseAccordionOptions,
  UseAccordionReturn,
} from "./useAccordion";
// Core Hooks
export { useAccordion } from "./useAccordion";
export type {
  ItemProps,
  LabelProps,
  MenuProps,
  ToggleButtonProps,
  UseDropdownOptions,
  UseDropdownReturn,
} from "./useDropdown";
export { useDropdown } from "./useDropdown";
// Advanced Hooks (Phase 3)
export type {
  FuzzyMatch,
  UseFuzzySearchOptions,
} from "./useFuzzySearch";
export {
  fuzzyMatch,
  getHighlightedParts,
  useFuzzySearch,
} from "./useFuzzySearch";
export type { HotKeyHandler, HotKeyMap, UseHotKeysOptions } from "./useHotKeys";
export { formatKeyCombo, getModifierLabel, useHotKeys } from "./useHotKeys";
export type {
  BackdropProps,
  CloseButtonProps,
  DescriptionProps,
  DialogProps,
  TitleProps,
  UseModalOptions,
  UseModalReturn,
} from "./useModal";
export { useModal } from "./useModal";
export type {
  UseNavigationOptions,
  UseNavigationReturn,
} from "./useNavigation";
export { useNavigation } from "./useNavigation";
export type {
  TabListProps,
  TabPanelProps,
  TabProps,
  UseTabsOptions,
  UseTabsReturn,
} from "./useTabs";
export { useTabs } from "./useTabs";
export type {
  TooltipPlacement,
  TooltipProps,
  TriggerProps,
  UseTooltipOptions,
  UseTooltipReturn,
} from "./useTooltip";
export { useTooltip } from "./useTooltip";
export type {
  UseVirtualScrollOptions,
  UseVirtualScrollReturn,
  VirtualScrollRange,
} from "./useVirtualScroll";
export {
  getVirtualItemStyle,
  isItemVisible,
  useVirtualScroll,
} from "./useVirtualScroll";
// Utility Hooks
export { useClipboard } from "./useClipboard";
export type { UseClipboardReturn } from "./useClipboard";
export { useHistory } from "./useHistory";
export type { UseHistoryReturn } from "./useHistory";
export { useSelection } from "./useSelection";
export type { UseSelectionReturn } from "./useSelection";
export { useHeadlessTable } from "./useHeadlessTable";
export type { HeadlessTableReturn, TableOptions } from "./useHeadlessTable";
export { useClickOutside } from "./utils/useClickOutside";
export { useControlledState } from "./utils/useControlledState";
export type { UseFocusTrapOptions } from "./utils/useFocusTrap";
export { useFocusTrap } from "./utils/useFocusTrap";
export { useId } from "./utils/useId";
export { useScrollLock } from "./utils/useScrollLock";
