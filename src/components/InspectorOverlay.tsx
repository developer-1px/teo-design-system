import { Copy, Lock, Unlock, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame";
import { Text } from "../design-system/Text";

export function InspectorOverlay() {
    const [isActive, setIsActive] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [targetName, setTargetName] = useState<string | null>(null);
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    // Toggle Inspector with Cmd+d
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "d") {
                e.preventDefault();

                if (isLocked) {
                    // If locked, close everything
                    setIsLocked(false);
                    setIsActive(false);
                    setTargetRect(null);
                    setTargetName(null);
                    setTargetElement(null);
                } else if (isActive) {
                    // If active (hovering), try to lock
                    if (targetElement) {
                        setIsLocked(true);
                    } else {
                        // If nothing under cursor, close
                        setIsActive(false);
                    }
                } else {
                    // If closed, open
                    setIsActive(true);
                }
            }

            // Esc to cancel/unlock
            if (e.key === "Escape") {
                if (isLocked) {
                    setIsLocked(false);
                } else {
                    setIsActive(false);
                    setTargetRect(null);
                    setTargetElement(null);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isActive, isLocked, targetElement]);

    // Sync Target Rect on Scroll/Resize via RAF
    useEffect(() => {
        if (!targetElement) return;

        let animationFrameId: number;

        const updateRect = () => {
            if (targetElement) {
                const newRect = targetElement.getBoundingClientRect();
                // Only update if changes to avoid thrashing
                setTargetRect((prev) => {
                    if (
                        !prev ||
                        prev.top !== newRect.top ||
                        prev.left !== newRect.left ||
                        prev.width !== newRect.width ||
                        prev.height !== newRect.height
                    ) {
                        return newRect;
                    }
                    return prev;
                });
            }
            animationFrameId = requestAnimationFrame(updateRect);
        };

        updateRect();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [targetElement]);

    // Mouse move handler to find target (Only if not locked)
    useEffect(() => {
        if (!isActive || isLocked) return;

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
                // Initial set
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
    }, [isActive, isLocked]);

    // Click to lock (if not locked)
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!isLocked && targetElement) {
            setIsLocked(true);
        }
    };

    if (!isActive) return null;

    // Calculate panel position (Right of element, fallback to Left if not enough space)
    let initialX = 20;
    let initialY = 20;

    if (targetRect) {
        const PANEL_WIDTH = 260; // size-65
        const GAP = 8;
        const spaceRight = window.innerWidth - targetRect.right;

        if (spaceRight > PANEL_WIDTH + GAP) {
            initialX = targetRect.right + GAP;
        } else {
            initialX = targetRect.left - PANEL_WIDTH - GAP;
        }

        // Ensure Y is within bounds
        initialY = Math.max(10, Math.min(targetRect.top, window.innerHeight - 300));

        // Safety check for X
        initialX = Math.max(10, Math.min(initialX, window.innerWidth - PANEL_WIDTH - 10));
    }

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
                    pointerEvents: isLocked ? "none" : "auto", // Allow clicking through when locked (except panel)
                }}
                onClick={handleClick}
            >
                {/* Top Status Badge - Compact */}
                <Frame
                    position="fixed"
                    top={2}
                    left="50%"
                    zIndex={10002}
                    surface="primary"
                    rounded="full"
                    p="0.5 2"
                    row
                    align="center"
                    gap={1.5}
                    shadow="lg"
                    style={{
                        transform: "translateX(-50%)",
                        pointerEvents: "auto",
                    }}
                >
                    {isLocked ? <Lock size={10} color="var(--primary-fg)" /> : <Unlock size={10} color="var(--primary-fg)" />}
                    <Text variant={6} weight="bold" style={{ color: "var(--primary-fg)" }}>
                        {isLocked ? "LOCKED" : "INSPECT"}
                    </Text>
                </Frame>

                {/* Highlight Box */}
                {targetRect && (
                    <div
                        style={{
                            position: "fixed",
                            top: targetRect.top,
                            left: targetRect.left,
                            width: targetRect.width,
                            height: targetRect.height,
                            border: isLocked ? "2px solid var(--link-color)" : "1px solid var(--link-color)",
                            backgroundColor: isLocked
                                ? "transparent"
                                : "rgba(59, 130, 246, 0.1)",
                            pointerEvents: "none",
                            boxSizing: "border-box",
                            borderRadius: "3px",
                            zIndex: 10001,
                            transition: "all 0.1s ease-out",
                        }}
                    >
                        {/* Label Tag - Compact */}
                        <Frame
                            position="absolute"
                            top={-24} // Adjusted for label height
                            left={0}
                            style={{ backgroundColor: "var(--link-color)" }}
                            p="0 1.5"
                            rounded="sm"
                            h={5} // 24px
                            row
                            align="center"
                            gap={1}
                            shadow="sm"
                        >
                            <Text
                                size={6}
                                weight="bold"
                                style={{ color: "white" }}
                            >
                                {targetName}
                            </Text>
                            <Text size={6} style={{ color: "white", opacity: 0.8 }}>
                                {Math.round(targetRect.width)}×{Math.round(targetRect.height)}
                            </Text>
                        </Frame>
                    </div>
                )}
            </div>

            {/* Draggable Properties Panel (Only when locked) */}
            {isLocked && targetElement && (
                <InspectorPanel
                    element={targetElement}
                    name={targetName || "Element"}
                    initialX={initialX}
                    initialY={initialY}
                    onClose={() => {
                        setIsLocked(false);
                        setTargetElement(null);
                    }}
                    onCopy={(text) => {
                        setIsLocked(false);
                        setNotification(text);
                        setTimeout(() => setNotification(null), 2000);
                    }}
                />
            )}

            {/* Notification Toast - Compact */}
            {notification && (
                <Frame
                    position="fixed"
                    bottom={4}
                    left="50%"
                    zIndex={10005}
                    surface="primary"
                    rounded="md"
                    p="1 3"
                    row
                    align="center"
                    gap={2}
                    shadow="lg"
                    style={{ transform: "translateX(-50%)" }}
                >
                    <Copy size={12} color="var(--primary-fg)" />
                    <Text
                        variant={6}
                        weight="medium"
                        style={{ color: "var(--primary-fg)" }}
                    >
                        {notification}
                    </Text>
                </Frame>
            )}
        </>
    );
}

// --- Properties Panel Component ---

function InspectorPanel({
    element,
    name,
    initialX,
    initialY,
    onClose,
    onCopy,
}: {
    element: HTMLElement;
    name: string;
    initialX: number;
    initialY: number;
    onClose: () => void;
    onCopy: (msg: string) => void;
}) {
    // Initialize position only once on mount, so it doesn't jump around if parent rerenders
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const styles = window.getComputedStyle(element);
    const getProp = (key: string) => styles.getPropertyValue(key);

    const properties = [
        {
            section: "Layout", items: [
                { key: "Display", value: getProp("display") },
                { key: "Pos", value: getProp("position") },
                { key: "W", value: `${Math.round(element.offsetWidth)}` },
                { key: "H", value: `${Math.round(element.offsetHeight)}` },
                { key: "Pad", value: getProp("padding") },
                { key: "Marg", value: getProp("margin") },
            ]
        },
        {
            section: "Flex", items: [
                { key: "Dir", value: getProp("flex-direction") },
                { key: "Align", value: getProp("align-items") },
                { key: "Justify", value: getProp("justify-content") },
                { key: "Gap", value: getProp("gap") },
                { key: "Wrap", value: getProp("flex-wrap") },
            ]
        },
        {
            section: "Style", items: [
                { key: "Bg", value: getProp("background-color") },
                { key: "Color", value: getProp("color") },
                { key: "Radius", value: getProp("border-radius") },
                { key: "Font", value: `${getProp("font-size")} ${getProp("font-family").split(",")[0]}` },
            ],
        },
    ];

    // Filter
    const hasFlex = getProp("display").includes("flex") || getProp("display").includes("grid");

    const handleCopy = () => {
        const clone = element.cloneNode(true) as HTMLElement;
        clone.innerHTML = "";
        const html = clone.outerHTML;
        navigator.clipboard.writeText(html).then(() => {
            onCopy("Component shell copied!");
        });
    };

    // Drag Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y
            });
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <Frame
            position="fixed"
            style={{
                top: position.y,
                left: position.x,
                maxHeight: "80vh",
                pointerEvents: "auto",
            }}
            w={65} // size-65 (260px)
            surface="base"
            rounded="lg"
            shadow="2xl"
            border
            zIndex={10003}
        >
            {/* Draggable Header - Compact */}
            <Frame
                surface="sunken"
                p="0 2"
                row
                align="center"
                justify="between"
                border="bottom"
                h={6} // size-6 (32px)
                style={{
                    cursor: "grab",
                    userSelect: "none"
                }}
                onMouseDown={handleMouseDown}
            >
                <Frame row align="center" gap={1.5}>
                    <Lock size={10} className="text-primary" />
                    <Text weight="bold" size={5}>
                        {name}
                    </Text>
                </Frame>
                <Frame row gap={0.5}>
                    <Action
                        icon={Copy}
                        variant="ghost"
                        size={20}
                        iconSize={10}
                        tooltip="Copy HTML"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent drag start
                            handleCopy();
                        }}
                    />
                    <Action
                        icon={X}
                        variant="ghost"
                        size={20}
                        iconSize={10}
                        tooltip="Close Inspector"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent drag start
                            onClose();
                        }}
                    />
                </Frame>
            </Frame>

            {/* Content - Compact */}
            <Frame
                p="2 0"
                overflow="auto"
            >
                {properties.map((section) => {
                    if (section.section === "Flex" && !hasFlex) return null;
                    return (
                        <Frame key={section.section} gap={0.5} p="0 2 2 2">
                            <Text weight="bold" size={6} color="tertiary" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                {section.section}
                            </Text>
                            <Frame gap={0} border rounded="sm" overflow="hidden">
                                {section.items.map((item, i) => (
                                    <Frame
                                        key={item.key}
                                        row
                                        justify="between"
                                        align="center"
                                        p="0.5 1.5"
                                        surface={i % 2 === 0 ? "base" : "sunken"}
                                        style={{
                                            borderBottom: i < section.items.length - 1 ? "1px solid var(--border-color)" : undefined
                                        }}
                                    >
                                        <Text size={6} color="secondary">
                                            {item.key}
                                        </Text>
                                        <Text
                                            size={6}
                                            mono
                                            style={{
                                                maxWidth: "110px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                textAlign: "right",
                                            }}
                                            title={item.value}
                                        >
                                            {item.value}
                                        </Text>
                                    </Frame>
                                ))}
                            </Frame>
                        </Frame>
                    );
                })}
            </Frame>
        </Frame>
    );
}
