import { Copy, Lock, Unlock } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Icon } from "@/ui/primitives/Icon";
import {
  FontSize,
  IconSize,
  Space,
} from "@/legacy-design-system/token/token.const.1tier";
import { InspectorPanel } from "./components/InspectorPanel";
import { useInspectorHotkeys } from "./hooks/useInspectorHotkeys";
import { useInspectorTarget } from "./hooks/useInspectorTarget";
import { Radius2 } from "@/legacy-design-system/token/radius2";

export function InspectorOverlay() {
  const [isActive, setIsActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const {
    targetRect,
    targetName,
    targetElement,
    componentStack,
    targetProps,
    resetTarget,
    setTargetElement,
  } = useInspectorTarget(isActive, isLocked);

  useInspectorHotkeys(
    isActive,
    isLocked,
    setIsActive,
    () => setIsLocked(false),
    resetTarget,
    targetElement,
  );

  const triggerLock = (_el: HTMLElement) => {
    setIsLocked(true);

    // Copy only location
    const location = componentStack[0]
      ? `${componentStack[0].fileName}:${componentStack[0].lineNumber}`
      : "";

    if (location) {
      navigator.clipboard
        .writeText(location)
        .then(() => {
          setNotification("Location copied!");
          setTimeout(() => setNotification(null), 2000);
        })
        .catch(() => {
          setNotification("Copy failed");
          setTimeout(() => setNotification(null), 2000);
        });
    }
  };

  // Click to lock (if not locked)
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isLocked && targetElement) {
      triggerLock(targetElement);
    }
  };

  if (!isActive) return null;

  // Calculate panel position (Right of element, fallback to Left if not enough space)
  let initialX = 20;
  let initialY = 20;

  if (targetRect) {
    const PANEL_WIDTH = 220;
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
    initialX = Math.max(
      10,
      Math.min(initialX, window.innerWidth - PANEL_WIDTH - 10),
    );
  }

  return (
    <>
      {/* Overlay Layer - captures clicks */}
      <button
        type="button"
        id="inspector-overlay-layer"
        tabIndex={-1}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 10000,
          pointerEvents: isLocked ? "none" : "auto", // Allow clicking through when locked (except panel)
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "default"
        }}
        onClick={handleClick}
        onKeyDown={() => { }}
      >
        {/* Top Status Badge - Compact */}
        <div
          style={{
            position: "fixed",
            top: "2px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10002,
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: Space.n6,
            padding: `${Space.n2} ${Space.n8}`,
            backgroundColor: "var(--surface-primary)",
            color: "var(--primary-fg)",
            borderRadius: Radius2.full,
            boxShadow: "var(--elevation-n3)",
          }}
        >
          <Icon
            src={isLocked ? Lock : Unlock}
            size={IconSize.n10}
            style={{ color: "var(--primary-fg)" }}
          />
          <span
            style={{
              fontSize: FontSize.n9,
              fontWeight: "bold",
              color: "var(--primary-fg)"
            }}
          >
            {isLocked ? "LOCKED" : "INSPECT"}
          </span>
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
              border: isLocked
                ? "2px solid var(--link-color)"
                : "1px solid var(--link-color)",
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
            <div
              style={{
                position: "absolute",
                top: targetRect.top < 30 ? "0px" : "-25px",
                left: "-1px",
                zIndex: 1,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                gap: Space.n4,
                padding: `0 ${Space.n6}`,
                height: Size.n16,
                backgroundColor: "var(--link-color)",
                borderRadius: Radius2.sm,
                borderBottomLeftRadius: targetRect.top < 30 ? 0 : undefined,
                borderBottomRightRadius: targetRect.top < 30 ? "4px" : undefined,
                boxShadow: "var(--elevation-n1)",
              }}
            >
              <span
                style={{
                  fontSize: FontSize.n9,
                  fontWeight: "bold",
                  color: "white"
                }}
              >
                {targetName}
              </span>
              <span
                style={{
                  fontSize: FontSize.n9,
                  color: "white",
                  opacity: 0.8
                }}
              >
                {Math.round(targetRect.width)}×{Math.round(targetRect.height)}
              </span>
            </div>
          </div>
        )}
      </button>

      {/* Draggable Properties Panel (Only when locked) */}
      {isLocked && targetElement && (
        <InspectorPanel
          element={targetElement}
          name={targetName || "Element"}
          stack={componentStack}
          props={targetProps}
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
        <div
          style={{
            position: "fixed",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10005,
            display: "flex",
            alignItems: "center",
            gap: Space.n8,
            padding: `${Space.n4} ${Space.n12}`,
            backgroundColor: "var(--surface-primary)",
            borderRadius: Radius2.md,
            boxShadow: "var(--elevation-n3)",
          }}
        >
          <Icon
            src={Copy}
            size={IconSize.n12}
            style={{ color: "var(--primary-fg)" }}
          />
          <span
            style={{
              fontSize: FontSize.n9,
              fontWeight: "medium",
              color: "var(--primary-fg)"
            }}
          >
            {notification}
          </span>
        </div>
      )}
    </>
  );
}
