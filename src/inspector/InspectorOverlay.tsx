import {
  Copy,
  Lock,
  Unlock,
} from "lucide-react";
import React, { useState } from "react";


import { Text } from "../design-system/text/Text.tsx";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Overlay } from "../design-system/Overlay";
import { Icon } from "../design-system/Icon";
import { IconSize, FontSize, Space, Size } from "../design-system/token/token.const.1tier"
import { generateJSX } from "./lib/inspector-utils";
import { InspectorPanel } from "./components/InspectorPanel";
import { useInspectorTarget } from "./hooks/useInspectorTarget";
import { useInspectorHotkeys } from "./hooks/useInspectorHotkeys";




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

  const triggerLock = (el: HTMLElement) => {
    setIsLocked(true);

    // Create shell: outerHTML without innerHTML
    const clone = el.cloneNode(true) as HTMLElement;
    clone.innerHTML = "";
    const shell = clone.outerHTML;
    const jsx = generateJSX(targetName || "Component", targetProps);
    const text = `${jsx}\n\n// HTML:\n// ${shell}`;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setNotification("Shell copied!");
        setTimeout(() => setNotification(null), 2000);
      })
      .catch(() => {
        setNotification("Copy failed");
        setTimeout(() => setNotification(null), 2000);
      });
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
    initialX = Math.max(
      10,
      Math.min(initialX, window.innerWidth - PANEL_WIDTH - 10),
    );
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
        <Overlay
          position="fixed"
          y="2px"
          x="50%"
          zIndex={10002}
          style={{ transform: "translateX(-50%)", pointerEvents: "auto" }}
          clickOutsideToDismiss={false}
        >
          <Frame
            override={{ rounded: "full", py: Space.n2, px: Space.n8, gap: Space.n6, shadow: "lg" }}
            surface="primary"
            layout={Layout.Row.Meta.Default}
          >
            {isLocked ? (
              <Icon src={Lock} size={IconSize.n10} style={{ color: "var(--primary-fg)" }} />
            ) : (
              <Icon src={Unlock} size={IconSize.n10} style={{ color: "var(--primary-fg)" }} />
            )}
            <Text
              size={FontSize.n9}
              weight="bold"
              style={{ color: "var(--primary-fg)" }}
            >
              {isLocked ? "LOCKED" : "INSPECT"}
            </Text>
          </Frame>
        </Overlay>

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
            <Overlay
              position="absolute"
              y={targetRect.top < 30 ? "0px" : "-25px"} // Flip inside if no space above
              x="-1px"
              zIndex={1}
              style={{
                pointerEvents: "none",
              }}
            >
              <Frame
                override={{
                  style: {
                    backgroundColor: "var(--link-color)",
                    borderBottomLeftRadius: targetRect.top < 30 ? 0 : undefined,
                    borderBottomRightRadius:
                      targetRect.top < 30 ? "4px" : undefined,
                  },
                  py: Space.n0,
                  px: Space.n6,
                  rounded: "sm",
                  h: Size.n16,
                  gap: Space.n4,
                  shadow: "sm",
                }}
                // 24px
                layout={Layout.Row.Meta.Default}
              >
                <Text size={FontSize.n9} weight="bold" style={{ color: "white" }}>
                  {targetName}
                </Text>
                <Text size={FontSize.n9} style={{ color: "white", opacity: 0.8 }}>
                  {Math.round(targetRect.width)}×{Math.round(targetRect.height)}
                </Text>
              </Frame>
            </Overlay>
          </div>
        )}
      </div>

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
        <Overlay
          position="fixed"
          bottom={4}
          x="50%"
          zIndex={10005}
          style={{ transform: "translateX(-50%)" }}
          clickOutsideToDismiss={false}
        >
          <Frame
            override={{ rounded: "md", py: Space.n4, px: Space.n12, gap: Space.n8, shadow: "lg" }}
            surface="primary"
            layout={Layout.Row.Meta.Default}
          >
            <Icon src={Copy} size={IconSize.n12} style={{ color: "var(--primary-fg)" }} />
            <Text
              size={FontSize.n9}
              weight="medium"
              style={{ color: "var(--primary-fg)" }}
            >
              {notification}
            </Text>
          </Frame>
        </Overlay>
      )}
    </>
  );
}
