import { useEffect } from "react";

/**
 * Hook to override browser default shortcuts (e.g., Cmd+F, Cmd+G).
 * 
 * @param shortcuts Map of key combinations to handlers (e.g. { "cmd+f": onFind })
 */
export function useBrowserShortcut(shortcuts: Record<string, () => void>) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
            const cmdPressed = isMac ? e.metaKey : e.ctrlKey;

            // Normalize key for comparison
            const key = e.key.toLowerCase();
            const shift = e.shiftKey;

            for (const [combo, handler] of Object.entries(shortcuts)) {
                const parts = combo.toLowerCase().split("+");
                const targetKey = parts[parts.length - 1];
                const needsCmd = parts.includes("cmd") || parts.includes("command");
                const needsShift = parts.includes("shift");

                const cmdMatch = needsCmd ? cmdPressed : !cmdPressed;
                const shiftMatch = needsShift ? shift : !shift;
                const keyMatch = key === targetKey;

                // Special case for Cmd+F/G which we definitely want to block
                if (cmdMatch && shiftMatch && keyMatch) {
                    // Prevent browser default
                    e.preventDefault();
                    e.stopPropagation();
                    handler();
                    return;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown, { capture: true });
        return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
    }, [shortcuts]);
}
