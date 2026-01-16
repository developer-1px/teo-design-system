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

// Utility Hooks
export { useControlledState } from "./utils/useControlledState";
export type { UseFocusTrapOptions } from "./utils/useFocusTrap";
export { useFocusTrap } from "./utils/useFocusTrap";
export { useId } from "./utils/useId";
export { useScrollLock } from "./utils/useScrollLock";
