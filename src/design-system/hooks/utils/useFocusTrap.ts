import {useEffect, useRef} from "react"

/**
 * Options for focus trap
 */
export interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  active: boolean;
  /** Initial element to focus (optional) */
  initialFocus?: React.RefObject<HTMLElement>;
  /** Whether to restore focus when trap is deactivated */
  restoreFocus?: boolean;
}

/**
 * Hook to trap focus within a container element
 * Following Headless UI Dialog pattern
 *
 * @param containerRef - Ref to the container element
 * @param options - Focus trap options
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * useFocusTrap(containerRef, { active: isOpen });
 * ```
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  options: UseFocusTrapOptions,
): void {
  const { active, initialFocus, restoreFocus = true } = options;
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Store currently focused element to restore later
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Focus initial element or first focusable element
    const focusableElements = getFocusableElements(containerRef.current);

    if (initialFocus?.current) {
      initialFocus.current.focus();
    } else if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    /**
     * Handle Tab key to cycle focus within container
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !containerRef.current) return;

      const focusables = getFocusableElements(containerRef.current);
      if (focusables.length === 0) return;

      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: if on first element, move to last
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab: if on last element, move to first
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup: restore focus
    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (restoreFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [active, containerRef, initialFocus, restoreFocus]);
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}
