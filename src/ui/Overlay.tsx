import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface OverlayProps {
    x: number;
    y: number;
    onDismiss: () => void;
    clickOutsideToDismiss?: boolean;
    portalTarget?: HTMLElement;
    zIndex?: number | string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export function Overlay({
    x, y, onDismiss, clickOutsideToDismiss, portalTarget = document.body, zIndex = 1100, style, children
}: OverlayProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (clickOutsideToDismiss) {
            const handleClick = (e: MouseEvent) => {
                if (ref.current && !ref.current.contains(e.target as Node)) {
                    onDismiss();
                }
            };
            window.addEventListener("mousedown", handleClick);
            return () => window.removeEventListener("mousedown", handleClick);
        }
    }, [clickOutsideToDismiss, onDismiss]);

    const content = (
        <div
            ref={ref}
            style={{
                position: "fixed",
                top: y,
                left: x,
                zIndex: zIndex,
                backgroundColor: "white",
                ...style
            }}
        >
            {children}
        </div>
    );

    return createPortal(content, portalTarget);
}
