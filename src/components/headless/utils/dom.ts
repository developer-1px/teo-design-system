/**
 * DOM utility functions for headless components
 *
 * 포커스 관리 및 DOM 조작을 위한 유틸리티
 */

/**
 * 포커스 가능한 요소 셀렉터
 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#keyboard-navigation-inside-components
 */
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * 요소 내부의 모든 포커스 가능한 요소 찾기
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => {
      // 숨겨진 요소 제외
      if (element.offsetParent === null) return false;

      // aria-hidden 요소 제외
      if (element.getAttribute('aria-hidden') === 'true') return false;

      return true;
    }
  );
}

/**
 * 첫 번째 포커스 가능한 요소 찾기
 */
export function getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
  const elements = getFocusableElements(container);
  return elements[0] ?? null;
}

/**
 * 마지막 포커스 가능한 요소 찾기
 */
export function getLastFocusableElement(container: HTMLElement): HTMLElement | null {
  const elements = getFocusableElements(container);
  return elements[elements.length - 1] ?? null;
}

/**
 * 요소가 포커스 가능한지 확인
 */
export function isFocusable(element: HTMLElement): boolean {
  return (
    element.matches(FOCUSABLE_SELECTOR) &&
    element.offsetParent !== null &&
    element.getAttribute('aria-hidden') !== 'true'
  );
}

/**
 * 요소에 포커스 (옵션: preventScroll)
 */
export function focus(element: HTMLElement | null, options?: FocusOptions): void {
  if (!element) return;
  element.focus(options);
}

/**
 * 다음 프레임에 포커스 (React 렌더링 후)
 */
export function focusNextFrame(element: HTMLElement | null, options?: FocusOptions): void {
  requestAnimationFrame(() => {
    focus(element, options);
  });
}

/**
 * 특정 요소가 컨테이너 내부에 있는지 확인
 */
export function contains(container: HTMLElement | null, element: HTMLElement | null): boolean {
  if (!container || !element) return false;
  return container === element || container.contains(element);
}

/**
 * 요소의 부모 중 특정 셀렉터와 일치하는 요소 찾기
 */
export function closest<T extends HTMLElement>(
  element: HTMLElement | null,
  selector: string
): T | null {
  if (!element) return null;
  return element.closest<T>(selector);
}

/**
 * 요소의 위치 정보 가져오기 (viewport 기준)
 */
export function getRect(element: HTMLElement): DOMRect {
  return element.getBoundingClientRect();
}

/**
 * 두 요소 사이의 거리 계산
 */
export function getDistance(rect1: DOMRect, rect2: DOMRect): number {
  const dx = rect1.left - rect2.left;
  const dy = rect1.top - rect2.top;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 요소가 뷰포트 내에 있는지 확인
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = getRect(element);
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 요소를 뷰포트로 스크롤
 */
export function scrollIntoView(
  element: HTMLElement,
  options?: ScrollIntoViewOptions
): void {
  element.scrollIntoView({
    block: 'nearest',
    inline: 'nearest',
    ...options,
  });
}
