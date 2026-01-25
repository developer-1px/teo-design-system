import { type RefObject, useEffect, useRef } from "react";

/**
 * Click outside hook
 *
 * Detects clicks outside of a specified element.
 * Useful for closing modals, dropdowns, etc.
 *
 * @param ref - Reference to the element
 * @param handler - Callback function when clicked outside
 * @param enabled - Enable/disable listener (default: true)
 */
export function useClickOutside(
    ref: RefObject<HTMLElement | null>,
    handler: (event: MouseEvent | TouchEvent) => void,
    enabled: boolean = true
): void {
    const handlerRef = useRef(handler);

    // Update handler ref to avoid re-binding effect
    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        if (!enabled) return;

        const listener = (event: MouseEvent | TouchEvent) => {
            const el = ref.current;

            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return;
            }

            handlerRef.current(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, enabled]);
}
