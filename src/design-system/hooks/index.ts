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
} from "./components/useAccordion";
// Core Hooks
export { useAccordion } from "./components/useAccordion";
export type {
  ItemProps,
  LabelProps,
  MenuProps,
  ToggleButtonProps,
  UseDropdownOptions,
  UseDropdownReturn,
} from "./components/useDropdown";
export { useDropdown } from "./components/useDropdown";
// Advanced Hooks (Phase 3)
export type {
  FuzzyMatch,
  UseFuzzySearchOptions,
} from "./search/useFuzzySearch";
export {
  fuzzyMatch,
  getHighlightedParts,
  useFuzzySearch,
} from "./search/useFuzzySearch";
export type { HotKeyHandler, HotKeyMap, UseHotKeysOptions } from "./interaction/useHotKeys";
export { formatKeyCombo, getModifierLabel, useHotKeys } from "./interaction/useHotKeys";
export type {
  BackdropProps,
  CloseButtonProps,
  DescriptionProps,
  DialogProps,
  TitleProps,
  UseModalOptions,
  UseModalReturn,
} from "./components/useModal";
export { useModal } from "./components/useModal";
export type {
  UseNavigationOptions,
  UseNavigationReturn,
} from "./interaction/useNavigation";
export { useNavigation } from "./interaction/useNavigation";
export type {
  TabListProps,
  TabPanelProps,
  TabProps,
  UseTabsOptions,
  UseTabsReturn,
} from "./components/useTabs";
export { useTabs } from "./components/useTabs";
export type {
  TooltipPlacement,
  TooltipProps,
  TriggerProps,
  UseTooltipOptions,
  UseTooltipReturn,
} from "./components/useTooltip";
export { useTooltip } from "./components/useTooltip";
export type {
  UseVirtualScrollOptions,
  UseVirtualScrollReturn,
  VirtualScrollRange,
} from "./data/useVirtualScroll";
export {
  getVirtualItemStyle,
  isItemVisible,
  useVirtualScroll,
} from "./data/useVirtualScroll";
// Utility Hooks
export { useClipboard } from "./search/useClipboard";
export type { UseClipboardReturn } from "./search/useClipboard";
export { useHistory } from "./state/useHistory";
export type { UseHistoryReturn } from "./state/useHistory";
export { useSelection } from "./state/useSelection";
export type { UseSelectionReturn } from "./state/useSelection";
export { useHeadlessTable } from "./data/useHeadlessTable";
export type { HeadlessTableReturn, TableOptions } from "./data/useHeadlessTable";
export { useClickOutside } from "./primitives/useClickOutside";
export { useControlledState } from "./primitives/useControlledState";
export type { UseFocusTrapOptions } from "./primitives/useFocusTrap";
export { useFocusTrap } from "./primitives/useFocusTrap";
export { useId } from "./primitives/useId";
export { useScrollLock } from "./primitives/useScrollLock";
