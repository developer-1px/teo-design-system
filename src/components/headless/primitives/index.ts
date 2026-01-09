/**
 * Headless Primitives - 재사용 가능한 기본 훅들
 *
 * 다른 컴포넌트 훅들의 빌딩 블록으로 사용됩니다.
 */

export { type UseClickOutsideOptions, useClickOutside } from './useClickOutside';
export {
  type UseDisclosureOptions,
  type UseDisclosureReturn,
  useDisclosure,
} from './useDisclosure';
export { type UseFocusTrapOptions, useFocusTrap } from './useFocusTrap';
export {
  type UseListNavigationOptions,
  type UseListNavigationReturn,
  useListNavigation,
} from './useListNavigation';
export {
  type Orientation,
  type UseRovingFocusOptions,
  type UseRovingFocusReturn,
  useRovingFocus,
} from './useRovingFocus';
