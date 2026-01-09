/**
 * Headless Components - IDDL 컴포넌트별 헤드리스 훅들
 *
 * 각 IDDL 컴포넌트의 로직과 접근성을 제공합니다.
 */

export { useTabs, type UseTabsOptions, type UseTabsReturn } from './useTabs';
export { useMenu, type UseMenuOptions, type UseMenuReturn } from './useMenu';
export { useAccordion, type UseAccordionOptions, type UseAccordionReturn } from './useAccordion';
export { useTree, type UseTreeOptions, type UseTreeReturn, type TreeNode } from './useTree';
export { useCombobox, type UseComboboxOptions, type UseComboboxReturn } from './useCombobox';
export { useModal, type UseModalOptions, type UseModalReturn } from './useModal';
export { usePopover, type UsePopoverOptions, type UsePopoverReturn, type PopoverPlacement } from './usePopover';
