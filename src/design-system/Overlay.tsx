import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface OverlayProps {
    children: React.ReactNode;

    // Positioning
    position?: "absolute" | "fixed";
    x?: number | string;
    y?: number | string;
    right?: number | string;
    bottom?: number | string;
    zIndex?: number;

    // Interaction
    onDismiss?: () => void;
    clickOutsideToDismiss?: boolean;
    blockInteraction?: boolean; // If true, renders a backdrop

    // Portal
    portalTarget?: HTMLElement;
    // Visual passthrough
    className?: string;
    style?: React.CSSProperties;
}

export function Overlay({
    children,
    position = "absolute",
    x,
    y,
    right,
    bottom,
    zIndex = 100, // Default high z-index
    onDismiss,
    clickOutsideToDismiss = true,
    blockInteraction = false,
    portalTarget,
    className,
    style: customStyle,
}: OverlayProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Handle Esc key
    useEffect(() => {
        if (!onDismiss) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onDismiss();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onDismiss]);

    // Handle Outside Click
    useEffect(() => {
        if (!onDismiss || !clickOutsideToDismiss) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
                onDismiss();
            }
        };

        // Use mousedown to capture the start of the click, preventing issues with drag-release outside
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onDismiss, clickOutsideToDismiss]);

    const style: React.CSSProperties = {
        position,
        zIndex,
        top: y,
        left: x,
        right: right,
        bottom: bottom,
        // If not blocking interaction, let clicks pass through the container (if we had a full screen container)
        // But here we are likely rendering just the box.
        // Wait, if we use "clickOutside", we imply the overlay is NOT full screen, just the element.
        ...customStyle,
    };

    const content = (
        <>
            {blockInteraction && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: zIndex - 1,
                        // Transparent backdrop by default, or could accept a color prop
                    }}
                />
            )}
            <div
                ref={overlayRef}
                style={style}
                className={className}
            >
                {children}
            </div>
        </>
    );

    if (portalTarget) {
        return createPortal(content, portalTarget);
    }

    return content;
}
