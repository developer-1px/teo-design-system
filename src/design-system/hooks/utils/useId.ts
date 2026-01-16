import { useId as useReactId } from "react";

/**
 * Generate unique IDs for accessibility attributes
 * Uses React 18's built-in useId hook
 *
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 *
 * @example
 * ```tsx
 * const id = useId("accordion");
 * // Returns something like "accordion-:r1:"
 * ```
 */
export function useId(prefix?: string): string {
  const id = useReactId();
  return prefix ? `${prefix}-${id}` : id;
}
