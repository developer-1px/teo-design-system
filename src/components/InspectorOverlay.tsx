import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Frame } from "../design-system/Frame";
import { Text } from "../design-system/Text";

export function InspectorOverlay() {
    const [isActive, setIsActive] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [targetName, setTargetName] = useState<string | null>(null);
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    // Toggle Inspector with Cmd+d
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "d") {
                e.preventDefault();
                setIsActive((prev) => !prev);
                // Reset state when closing
                if (isActive) {
                    setTargetRect(null);
                    setTargetName(null);
                    setTargetElement(null);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isActive]);

    // Mouse move handler to find target
    useEffect(() => {
        if (!isActive) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Hide the overlay temporarily to check what's underneath
            const overlayElement = document.getElementById("inspector-overlay-layer");
            if (overlayElement) overlayElement.style.pointerEvents = "none";

            const element = document.elementFromPoint(e.clientX, e.clientY);

            if (overlayElement) overlayElement.style.pointerEvents = "auto";

            if (!element) return;

            // Find nearest parent with data-react-inspector
            // The plugin injects data-react-inspector="file:line:col"
            const target = element.closest("[data-react-inspector]") as HTMLElement;

            if (target) {
                const rect = target.getBoundingClientRect();
                setTargetRect(rect);
                setTargetElement(target);

                const inspectorData = target.getAttribute("data-react-inspector");
                if (inspectorData) {
                    // Parse standard format: absolute/path/to/file.tsx:line:col
                    // We want to show just the component name or file name
                    const parts = inspectorData.split(":");
                    const filePath = parts[0];
                    const fileName = filePath.split("/").pop();
                    setTargetName(fileName || inspectorData);
                }
            } else {
                setTargetRect(null);
                setTargetName(null);
                setTargetElement(null);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isActive]);

    // Click to copy
    const handleClick = (e: React.MouseEvent) => {
        if (!targetElement) return;

        e.stopPropagation();
        e.preventDefault();

        // Clone and strip children
        const clone = targetElement.cloneNode(true) as HTMLElement;
        clone.innerHTML = "";

        // Get the outerHTML
        const html = clone.outerHTML;

        navigator.clipboard.writeText(html).then(() => {
            setNotification("Component shell copied!");
            setTimeout(() => {
                setNotification(null);
            }, 2000);
        });

        setIsActive(false);
    };

    if (!isActive) return null;

    return (
        <>
            {/* Overlay Layer - captures clicks */}
            <div
                id="inspector-overlay-layer"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 10000,
                    cursor: "crosshair",
                }}
                onClick={handleClick}
            >
                {/* Top Badge */}
                <div
                    style={{
                        position: "fixed",
                        top: "12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#ef4444", // Red for debug/attention
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
                        pointerEvents: "none",
                        zIndex: 10002,
                        letterSpacing: "0.02em",
                    }}
                >
                    DEBUG MODE
                </div>

                {/* Highlight Box */}
                {targetRect && (
                    <div
                        style={{
                            position: "fixed",
                            top: targetRect.top,
                            left: targetRect.left,
                            width: targetRect.width,
                            height: targetRect.height,
                            border: "1px solid #3b82f6", // Thinner border
                            backgroundColor: "rgba(59, 130, 246, 0.15)", // Slightly more transparent
                            pointerEvents: "none",
                            transition: "all 0.05s cubic-bezier(0.2, 0, 0, 1)", // Much faster
                            boxSizing: "border-box",
                            borderRadius: "3px",
                        }}
                    >
                        {/* Label Tag - More compact */}
                        <div
                            style={{
                                position: "absolute",
                                top: "-22px", // Closer
                                left: "0",
                                backgroundColor: "#3b82f6",
                                color: "white",
                                padding: "2px 6px", // Reduced padding
                                borderRadius: "3px",
                                fontSize: "10px", // Smaller font
                                whiteSpace: "nowrap",
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                transformOrigin: "bottom left",
                                animation: "popIn 0.1s cubic-bezier(0.2, 0, 0, 1)",
                            }}
                        >
                            <Text variant={6} weight="bold" style={{ color: "white", fontSize: "10px" }}>
                                {targetName}
                            </Text>
                            <span style={{ opacity: 0.6, fontSize: "9px" }}>
                                {Math.round(targetRect.width)}×{Math.round(targetRect.height)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Notification Toast - Faster animation */}
            {notification && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#18181b",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        zIndex: 10001,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        animation: "fadeIn 0.15s cubic-bezier(0.2, 0, 0, 1)",
                    }}
                >
                    <Copy size={12} />
                    <Text variant={6} weight="medium" style={{ color: "white", fontSize: "12px" }}>{notification}</Text>
                </div>
            )}

            <style>{`
				@keyframes popIn {
					from { opacity: 0; transform: scale(0.9) translateY(2px); }
					to { opacity: 1; transform: scale(1) translateY(0); }
				}
				@keyframes fadeIn {
					from { opacity: 0; transform: translate(-50%, 8px); }
					to { opacity: 1; transform: translate(-50%, 0); }
				}
			`}</style>
        </>
    );
}
