import { useRef, useCallback } from "react";

/**
 * A hook to manage a ref to a focusable element and provide a stable focus method.
 * Useful for restoring focus to containers after interactions.
 */
export function useFocusRef<T extends HTMLElement = HTMLElement>() {
    const ref = useRef<T>(null);

    const focus = useCallback((options?: FocusOptions) => {
        if (ref.current) {
            // Using requestAnimationFrame can help in some React concurrency cases or after layout shifts,
            // but strict focus() is often better for a11y chains. 
            // We'll stick to direct focus unless framed.
            ref.current.focus(options);
        }
    }, []);

    const focusAsync = useCallback((options?: FocusOptions) => {
        requestAnimationFrame(() => {
            ref.current?.focus(options);
        });
    }, []);

    return { ref, focus, focusAsync };
}
