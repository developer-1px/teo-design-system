import {
  Copy,
  Lock,
  Unlock,
  X,
  ChevronRight,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Action } from "../design-system/Action";
import { Text } from "../design-system/text/Text.tsx";
import { Frame } from "../design-system/Frame";
import { Overlay } from "../design-system/Overlay";
import { Icon } from "../design-system/Icon";
import { IconSize, FontSize } from "../design-system/token/token.const.1tier";

// --- React Fiber Helpers ---

// Internal React Fiber property key (depends on React version, usually starts with __reactFiber)
function getFiberFromElement(element: any): any {
  // Try standard key
  const key = Object.keys(element).find((k) => k.startsWith("__reactFiber$"));
  if (key) return element[key];

  // Fallback: Iterate all keys (including non-enumerable if possible via loop, though Object.keys assumes enumerable)
  // Some React versions use __reactInternalInstance$
  for (const k in element) {
    if (
      k.startsWith("__reactFiber$") ||
      k.startsWith("__reactInternalInstance$")
    ) {
      return element[k];
    }
  }
  return null;
}

interface ComponentStackItem {
  name: string;
  fileName?: string;
  lineNumber?: string;
  columnNumber?: string;
}

// function getComponentStack removed

function getStackFromFiber(startFiber: any): ComponentStackItem[] {
  const stack: ComponentStackItem[] = [];
  let fiber = startFiber;

  while (fiber) {
    const debugSource = fiber._debugSource;
    const type = fiber.type;

    let name = "";
    if (typeof type === "function") {
      name = type.displayName || type.name || "Anonymous";
    } else if (typeof type === "object" && type !== null) {
      // Memo, ForwardRef, etc.
      name =
        type.displayName ||
        (type.render ? type.render.name : "") ||
        "Component";
    } else if (typeof type === "string") {
      name = type; // 'div', 'span'
    }

    if (name && debugSource) {
      // Clean up filename
      let fileName = debugSource.fileName ? debugSource.fileName : "";
      if (fileName) {
        const parts = fileName.split("/");
        const base = parts.pop(); // index.tsx
        if (
          base &&
          (base === "index.tsx" ||
            base === "index.ts" ||
            base === "index.js" ||
            base === "index.jsx") &&
          parts.length > 0
        ) {
          fileName = `${parts.pop()}/${base}`;
        } else {
          fileName = base || "";
        }
      }

      stack.push({
        name,
        fileName,
        lineNumber: debugSource.lineNumber,
        columnNumber: debugSource.columnNumber,
      });
    }

    fiber = fiber.return;
  }

  return stack.filter(
    (item, index, self) =>
      index === 0 ||
      item.fileName !== self[index - 1].fileName ||
      item.lineNumber !== self[index - 1].lineNumber,
  );
}

function findNearestHostNode(fiber: any): HTMLElement | null {
  let current = fiber;
  while (current) {
    if (
      typeof current.type === "string" &&
      current.stateNode instanceof HTMLElement
    ) {
      return current.stateNode;
    }
    // We only need to go down to find the *first* host node.
    // If a component returns a Fragment or array, this might find just the first one.
    // This is generally acceptable for highlighting "the component".
    current = current.child;
  }
  return null;
}
export function InspectorOverlay() {
  const [isActive, setIsActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [targetName, setTargetName] = useState<string | null>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [componentStack, setComponentStack] = useState<ComponentStackItem[]>(
    [],
  );
  const [targetProps, setTargetProps] = useState<Record<string, any>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const triggerLock = (el: HTMLElement) => {
    setIsLocked(true);

    // Create shell: outerHTML without innerHTML
    const clone = el.cloneNode(true) as HTMLElement;
    clone.innerHTML = "";
    const shell = clone.outerHTML;
    const text = `${shell} fix this`;

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

  // Toggle Inspector with Cmd+d
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();

        if (isActive || isLocked) {
          setIsActive(false);
          setIsLocked(false);
          setTargetRect(null);
          setTargetName(null);
          setTargetElement(null);
          setTargetProps({});
        } else {
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
          setTargetProps({});
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

      // --- Snapping Logic ---

      // 1. Traverse to find the relevant Design System Component (Fiber)
      // We prioritize "Atomic" components (Action, Field) over their internals.

      const atoms = [
        "Action",
        "Field",
        "Input",
        "Switch",
        "Checkbox",
        "Radio",
        "Badge",
        "Avatar",
        "Prose",
        "ProseDocument",
        "ProseSection",
      ];

      const allDsComponents = [
        ...atoms,
        "Frame",
        "Text",
        "Separator",
        "Stack",
        "Grid",
        "Cell",
        "Section",
        "Sidebar",
        "Part",
        "Header",
        "Footer",
      ];

      let targetFiber = getFiberFromElement(element as HTMLElement);
      let hostNode = element as HTMLElement;

      let currentFiber = targetFiber;
      let depth = 0;
      let foundFiber = null;
      let firstDsFiber = null;

      // Search for DS Component Fiber
      while (currentFiber && depth < 15) {
        const type = currentFiber.type;
        let name = "";

        if (typeof type === "function") {
          name = type.displayName || type.name || "";
        } else if (typeof type === "object" && type) {
          name =
            type.displayName || (type.render ? type.render.name : "") || "";
        }

        if (allDsComponents.includes(name)) {
          if (!firstDsFiber) firstDsFiber = currentFiber;
          if (atoms.includes(name)) {
            foundFiber = currentFiber;
            break;
          }
          foundFiber = currentFiber;
        }
        currentFiber = currentFiber.return;
        depth++;
      }

      // Resolve Atomic Ownership (if we hit a generic inside an Atom)
      if (firstDsFiber) {
        const name =
          (typeof firstDsFiber.type === "function"
            ? firstDsFiber.type.displayName || firstDsFiber.type.name
            : firstDsFiber.type.displayName) || "";
        if (atoms.includes(name)) {
          foundFiber = firstDsFiber;
        } else {
          let p = firstDsFiber.return;
          let d = 0;
          let owner = null;
          while (p && d < 4) {
            const pName =
              (typeof p.type === "function"
                ? p.type.displayName || p.type.name
                : p.type?.displayName) || "";
            if (atoms.includes(pName)) {
              owner = p;
              break;
            }
            p = p.return;
            d++;
          }
          foundFiber = owner || firstDsFiber;
        }
      }

      // 2. Resolve Host Node & Source Info
      if (foundFiber) {
        const rootHost = findNearestHostNode(foundFiber);
        if (rootHost) {
          hostNode = rootHost;
        }
        targetFiber = foundFiber; // Points to the DS Component Fiber (e.g. Action)

        // Prop Extraction
        const rawProps = targetFiber.memoizedProps || {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { children: _children, ...restProps } = rawProps;
        const displayProps: Record<string, any> = {};

        Object.entries(restProps).forEach(([key, value]) => {
          if (key.startsWith("_")) return; // internal props
          if (typeof value === "function") {
            displayProps[key] = "fn()";
          } else if (React.isValidElement(value)) {
            displayProps[key] = "<Element />";
          } else {
            // Pass raw value for object inspection
            displayProps[key] = value;
          }
        });
        setTargetProps(displayProps);

        const rect = hostNode.getBoundingClientRect();
        setTargetRect(rect);
        setTargetElement(hostNode);

        // Name Resolution: Get the component name from the Fiber
        const type = targetFiber.type;
        let componentName = "";
        if (typeof type === "function") {
          componentName = type.displayName || type.name || "Component";
        } else if (typeof type === "object" && type) {
          componentName =
            type.displayName ||
            (type.render ? type.render.name : "") ||
            "Component";
        }

        // Source Resolution: Try data-react-inspector first (Most Accurate Path)
        // The attribute is usually on the host node generated by the component.
        // Format: "src/apps/Sidebar.tsx:42:10"
        const inspectorData = hostNode.getAttribute("data-react-inspector");

        if (inspectorData) {
          // Parse: src/apps/Sidebar.tsx:42:10
          const parts = inspectorData.split(":");
          let line = "";
          let file = inspectorData;

          if (parts.length >= 2) {
            // Last two checks for numbers (line:col)
            if (
              !isNaN(Number(parts[parts.length - 1])) &&
              !isNaN(Number(parts[parts.length - 2]))
            ) {
              line = parts[parts.length - 2]; // Get line number
              parts.pop(); // col
              parts.pop(); // lineNum
              file = parts.join(":"); // Rejoin rest as file path
            }
          }

          // Clean File Path (Handle index.tsx)
          // file: /Users/user/.../src/apps/Sidebar.tsx or plain src/apps/Sidebar.tsx
          const fileParts = file.split("/");
          const base = fileParts.pop();
          if (base && base.startsWith("index.") && fileParts.length > 0) {
            file = `${fileParts.pop()}/${base}`;
          } else {
            file = base || file;
          }

          // Set Target Name: Sidebar.tsx:42(Action)
          setTargetName(`${file}:${line}(${componentName})`);

          // Mock stack for panel (just one item since we used the attribute)
          setComponentStack([
            {
              name: componentName,
              fileName: file,
              lineNumber: line,
              columnNumber: "",
            },
          ]);
        } else {
          // Fallback to Fiber Stack (Old Logic) if attribute missing
          const stack = getStackFromFiber(targetFiber);
          setComponentStack(stack);

          if (stack.length > 0) {
            const top = stack[0];
            setTargetName(`${top.fileName}:${top.lineNumber}(${top.name})`);
          } else {
            setTargetName(componentName || hostNode.tagName.toLowerCase());
          }
        }
      } else {
        setTargetRect(null);
        setTargetName(null);
        setTargetElement(null);
        setTargetProps({});
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
            override={{ rounded: "full", p: "0.5 2", gap: 1.5, shadow: "lg" }}
            surface="primary"
            row
            align="center"
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
                  p: "0 1.5",
                  rounded: "sm",
                  h: 5,
                  gap: 1,
                  shadow: "sm",
                }}
                // 24px
                row
                align="center"
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
            override={{ rounded: "md", p: "1 3", gap: 2, shadow: "lg" }}
            surface="primary"
            row
            align="center"
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

// --- Properties Panel Component ---

const PROMPT_POOL = [
  {
    label: "토큰 사용",
    prompt:
      "이 컴포넌트를 하드코딩된 값(px) 대신 디자인 시스템 토큰(간격, 색상, 반경)을 사용하도록 리팩토링해주세요.",
  },
  {
    label: "콤팩트하게",
    prompt:
      "이 컴포넌트의 패딩과 간격을 줄여서 더 콤팩트하고 정보 밀도를 높여주세요.",
  },
  {
    label: "아이콘 수정",
    prompt:
      "이모지나 일반 SVG 아이콘을 디자인 시스템의 Lucide-React 아이콘으로 교체해주세요.",
  },
  {
    label: "Props 정리",
    prompt:
      "사용하지 않는 불필요한 props를 제거하고 컴포넌트 구조를 단순화해주세요.",
  },
  {
    label: "컴포넌트 추출",
    prompt:
      "이 논리적 단위를 별도의 재사용 가능한 하위 컴포넌트로 추출해주세요.",
  },
  {
    label: "다크모드 수정",
    prompt:
      "다크 모드에서 올바르게 보이도록 모든 색상(배경, 테두리, 텍스트)이 시맨틱 토큰을 사용하는지 확인해주세요.",
  },
  {
    label: "레이아웃 정렬",
    prompt:
      "이 컴포넌트의 자식 요소 정렬이 잘못되었습니다. flex 속성을 수정하여 올바른 레이아웃을 잡아주세요.",
  },
  {
    label: "반응형 적용",
    prompt:
      "이 컴포넌트가 모바일에서도 잘 보이도록 반응형 스타일(flex-wrap 등)을 적용해주세요.",
  },
  {
    label: "접근성 향상",
    prompt:
      "스크린 리더 사용자를 위해 적절한 aria 속성과 시맨틱 태그를 추가해주세요.",
  },
  {
    label: "조건부 렌더링",
    prompt:
      "이 컴포넌트의 렌더링 로직을 확인하고, 조건부 렌더링이 더 깔끔하게 되도록 수정해주세요.",
  },
  {
    label: "타이포그래피",
    prompt:
      "수동 스타일 오버라이드 대신 Text 컴포넌트의 variant prop을 사용하여 타이포그래피를 표준화해주세요.",
  },
];

function getRandomPrompts(count: number) {
  const shuffled = [...PROMPT_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function InspectorPanel({
  element,
  name,
  stack,
  props,
  initialX,
  initialY,
  onClose,
  onCopy,
}: {
  element: HTMLElement;
  name: string;
  stack: ComponentStackItem[];
  props: Record<string, any>;
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

  // DOM Properties Removed as per request
  const properties: {
    section: string;
    items: { key: string; value: any }[];
  }[] = [];

  // Additional Section for Hierarchy
  if (stack && stack.length > 0) {
    properties.push({
      section: "Hierarchy",
      items: stack.map((item, i) => ({
        key: `${i + 1}`, // Simple index key
        value: `${item.fileName}:${item.lineNumber}(${item.name})`, // Format: File:Line(Name)
      })),
    });
  }

  // React Props Section (Priority)
  if (Object.keys(props).length > 0) {
    properties.unshift({
      section: "React Props",
      items: Object.entries(props).map(([key, value]) => ({
        key,
        value,
      })),
    });
  }

  // State
  const [showAiAssist, setShowAiAssist] = useState(false);
  const [randomPrompts, setRandomPrompts] = useState<
    { label: string; prompt: string }[]
  >(() => getRandomPrompts(5));

  const handlePromptClick = (prompt: string) => {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.innerHTML = ""; // Just the shell to avoid noise
    const shell = clone.outerHTML;

    // Construct Prompt
    const fullPrompt = `I need to modify this component in ${name} (${stack[0]?.fileName || "unknown file"}).\n\nComponent Shell:\n${shell}\n\nRequest: ${prompt}\n\nPlease provide the corrected code.`;

    navigator.clipboard.writeText(fullPrompt).then(() => {
      onCopy("Prompt copied!");
    });
  };

  // Filter
  const hasFlex =
    getProp("display").includes("flex") || getProp("display").includes("grid");

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
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
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

  // Determine Title
  const title = stack.length > 0 ? stack[0].name : "Element";

  return (
    <Overlay
      position="fixed"
      x={position.x}
      y={position.y}
      zIndex={10003}
      style={{
        pointerEvents: "auto",
      }}
      clickOutsideToDismiss={false} // Panel handles its own interactions
    >
      <Frame
        override={{
          style: {
            maxHeight: "80vh",
            border: "1px solid var(--border-color)",
          },
          rounded: "lg",
          shadow: "2xl",
        }}
        surface="base"
      >
        {/* Draggable Header - Compact */}
        <Frame
          override={{
            p: "0 2",
            style: {
              cursor: "grab",
              userSelect: "none",
              borderBottom: "1px solid var(--border-color)",
            },
          }}
          surface="sunken"
          row
          align="center"
          justify="between"
          onMouseDown={handleMouseDown}
        >
          <Frame override={{ gap: 1.5 }} row align="center">
            <Lock size={10} className="text-primary" />
            <Text weight="bold" size={FontSize.n10}>
              {title}
            </Text>
          </Frame>
          <Frame override={{ gap: 0.5 }} row>
            <Action
              icon={Copy}
              variant="ghost"
              size={5}
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
              size={5}
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
        <Frame override={{ p: "2 0" }} overflow="auto">
          {/* File Path Subtitle */}
          <Frame override={{ p: "0 2 2 2" }}>
            <Text size={FontSize.n28} color="tertiary" style={{ wordBreak: "break-all" }}>
              {name}
            </Text>
          </Frame>

          {/* AI Assist Section (Collapsible) */}
          <Frame override={{ gap: 0.5, p: "0 2 2 2" }}>
            <Frame row align="center" justify="between">
              <Action
                variant="ghost"
                size={5}
                icon={showAiAssist ? ChevronDown : ChevronRight}
                label="AI Assist"
                onClick={() => setShowAiAssist(!showAiAssist)}
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  color: "var(--text-tertiary)",
                }}
              />
              {showAiAssist && (
                <Action
                  icon={RefreshCw}
                  variant="ghost"
                  size={4}
                  iconSize={10}
                  tooltip="새로운 제안 보기"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRandomPrompts(getRandomPrompts(5));
                  }}
                />
              )}
            </Frame>

            {showAiAssist && (
              <Frame override={{ gap: 0.5, p: "0 0 0 2" }}>
                {randomPrompts.map((item) => (
                  <Action
                    key={item.label}
                    size={FontSize.n9}
                    variant="ghost"
                    justify="start"
                    label={item.label}
                    onClick={() => handlePromptClick(item.prompt)}
                    style={{
                      width: "100%",
                      justifyContent: "flex-start",
                      textAlign: "left",
                    }}
                  />
                ))}
              </Frame>
            )}
          </Frame>

          {/* Properties & Hierarchy (Always Visible now or simplified) */}
          {properties.map((section) => {
            if (section.section === "Flex" && !hasFlex) return null;
            return (
              <Frame
                override={{ gap: 0.5, p: "0 2 2 2" }}
                key={section.section}
              >
                <Text
                  weight="bold"
                  size={FontSize.n9}
                  color="tertiary"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {section.section}
                </Text>
                <Frame
                  override={{
                    gap: 0,
                    style: { border: "1px solid var(--border-color)" },
                    rounded: "sm",
                  }}
                  overflow="hidden"
                >
                  {section.items.map((item, i) => (
                    <PropertyTree
                      key={item.key}
                      label={item.key}
                      value={item.value}
                      background={i % 2 === 0 ? "base" : "sunken"}
                    />
                  ))}
                </Frame>
              </Frame>
            );
          })}
        </Frame>
      </Frame>
    </Overlay>
  );
}

// --- Property Tree Component ---

function PropertyTree({
  label,
  value,
  depth = 0,
  background = "base",
}: {
  label: string;
  value: any;
  depth?: number;
  background?: "base" | "sunken";
}) {
  const [isOpen, setIsOpen] = useState(true);
  const isObject = value !== null && typeof value === "object" && !React.isValidElement(value);
  const isEmpty = isObject && Object.keys(value).length === 0;
  const isArray = Array.isArray(value);

  // Primitive Render
  if (!isObject) {
    return (
      <Frame
        override={{
          p: "0.5 1.5",
          style: {
            borderBottom: "1px solid var(--border-color)",
            paddingLeft: `${depth * 12 + 8}px`,
          },
        }}
        row
        justify="between"
        align="center"
        surface={background}
      >
        <Text size={FontSize.n9} color="secondary">
          {label}
        </Text>
        <Text
          size={FontSize.n9}
          mono
          style={{
            maxWidth: "140px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "right",
          }}
          title={String(value)}
        >
          {String(value)}
        </Text>
      </Frame>
    );
  }

  // Nested Render
  return (
    <>
      <Frame
        override={{
          p: "0.5 1.5",
          style: {
            borderBottom: "1px solid var(--border-color)",
            paddingLeft: `${depth * 12 + 8}px`,
            cursor: isEmpty ? "default" : "pointer",
          },
        }}
        row
        justify="between"
        align="center"
        surface={background}
        onClick={(e) => {
          e.stopPropagation();
          if (!isEmpty) setIsOpen(!isOpen);
        }}
      >
        <Frame row align="center" override={{ gap: 4 }}>
          {!isEmpty && (
            <Icon
              src={isOpen ? ChevronDown : ChevronRight}
              size={IconSize.n10}
              style={{ color: "var(--text-tertiary)" }}
            />
          )}
          {isEmpty && <Frame override={{ w: 10, h: 10 }} />} {/* Spacer */}
          <Text size={FontSize.n9} color="secondary">
            {label}
          </Text>
        </Frame>
        <Text size={FontSize.n9} color="tertiary" mono>
          {isArray ? `Array(${value.length})` : "{...}"}
        </Text>
      </Frame>

      {isOpen && !isEmpty && (
        <Frame>
          {Object.entries(value).map(([k, v]) => (
            <PropertyTree
              key={k}
              label={k}
              value={v}
              depth={depth + 1}
              background={background} // Inherit bg or toggle? Keep simple for now
            />
          ))}
        </Frame>
      )}
    </>
  );
}
