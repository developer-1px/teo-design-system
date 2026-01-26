import { useState, useEffect, useCallback } from "react";
import { vars } from "@/design-system/theme.css.ts";

interface UseResizableProps {
    direction: "left" | "right";
    defaultSize: number;
    minSize: number;
    maxSize: number;
    storageKey?: string;
}

export function useResizable({
    direction,
    defaultSize,
    minSize,
    maxSize,
    storageKey,
}: UseResizableProps) {
    const [size, setSize] = useState(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            if (saved) return parseInt(saved, 10);
        }
        return defaultSize;
    });

    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, size.toString());
        }
    }, [size, storageKey]);

    // Better implementation:
    const startResizing = useCallback(() => setIsResizing(true), []);
    const stopResizing = useCallback(() => setIsResizing(false), []);

    useEffect(() => {
        const handleUp = () => stopResizing();
        window.addEventListener("mouseup", handleUp);
        return () => window.removeEventListener("mouseup", handleUp);
    }, [stopResizing]);

    useEffect(() => {
        if (!isResizing) return;
        const handleMove = (e: MouseEvent) => {
            // We need a way to track delta properly. 
            // For now, let's use movementX which is widely supported now.

            let delta = e.movementX;
            if (direction === "right") {
                // Drawer on right. Handle on left. Drag left (neg) -> increase size.
                delta = -delta;
            } else {
                // Sidebar on left. Handle on right. Drag right (pos) -> increase size.
                // But verify "direction" meaning. UseResiazble directions usually mean "where does it expand TO"?
                // Or "where is handle"?
            }

            setSize(prev => {
                const next = prev + delta;
                return Math.min(Math.max(next, minSize), maxSize);
            });
        };

        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, [isResizing, direction, minSize, maxSize]);

    return { size, resizeHandleProps: { onMouseDown: startResizing, isResizing } };
}

export function ResizeHandle({ direction, onMouseDown, isResizing }: any) {
    // direction used for placement

    return (
        <div
            onMouseDown={onMouseDown}
            style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "4px",
                cursor: "col-resize",
                zIndex: 10,
                backgroundColor: isResizing ? vars.color.border.focus : "transparent",
                transition: "background-color 0.2s",
                [direction === "right" ? "left" : "right"]: 0, // Handle placement
                // CRMSidebar (Left panel): Expand right. Handle is on Right.
                // If direction="left" passed, maybe it means "panel is on left"?
                // Let's assume passed direction maps to placement logic roughly or caller handles placement/styles?
                // CRMSidebar code doesn't style the handle placement explicitly in props, so ResizeHandle must style it.
                // If Sidebar is on Left, handle is on Right (right: 0).
                // If I pass direction="left", I assume "panel is left". Thus right: 0.
            }}
        />
    );
}
