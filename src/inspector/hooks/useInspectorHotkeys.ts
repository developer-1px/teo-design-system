import { useEffect } from "react";

export function useInspectorHotkeys(
    isActive: boolean,
    isLocked: boolean,
    onToggleActive: (active: boolean) => void,
    onUnlock: () => void,
    onReset: () => void,
    targetElement: HTMLElement | null,
) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "d") {
                e.preventDefault();

                if (isActive || isLocked) {
                    onToggleActive(false);
                    onUnlock(); // Also implies unlock if we are closing
                    onReset();
                } else {
                    onToggleActive(true);
                }
            }

            // Esc to cancel/unlock
            if (e.key === "Escape") {
                if (isLocked) {
                    onUnlock();
                } else {
                    onToggleActive(false);
                    onReset();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isActive, isLocked, targetElement, onToggleActive, onUnlock, onReset]);
}
