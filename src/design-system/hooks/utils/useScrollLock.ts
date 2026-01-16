import { useEffect } from "react";

/**
 * Hook to lock body scroll when active
 * Prevents scroll behind modals/drawers
 *
 * @param locked - Whether scroll should be locked
 *
 * @example
 * ```tsx
 * useScrollLock(isModalOpen);
 * ```
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    // Store original styles
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup: restore scroll
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [locked]);
}
