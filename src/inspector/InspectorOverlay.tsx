import { Copy, Lock, Unlock, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Action } from "../design-system/Action";
import { Text } from "../design-system/Text";
import { Frame } from "../design-system/Frame";

// --- React Fiber Helpers ---

// Internal React Fiber property key (depends on React version, usually starts with __reactFiber)
function getFiberFromElement(element: any): any {
  // Try standard key
  const key = Object.keys(element).find((k) => k.startsWith("__reactFiber$"));
  if (key) return element[key];

  // Fallback: Iterate all keys (including non-enumerable if possible via loop, though Object.keys assumes enumerable)
  // Some React versions use __reactInternalInstance$
  for (const k in element) {
    if (k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$")) {
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
      name = type.displayName || (type.render ? type.render.name : "") || "Component";
    } else if (typeof type === "string") {
      name = type; // 'div', 'span'
    }

    if (name && debugSource) {
      // Clean up filename
      let fileName = debugSource.fileName ? debugSource.fileName : "";
      if (fileName) {
        const parts = fileName.split("/");
        const base = parts.pop(); // index.tsx
        if (base && (base === "index.tsx" || base === "index.ts" || base === "index.js" || base === "index.jsx") && parts.length > 0) {
          fileName = `${parts.pop()}/${base}`;
        } else {
          fileName = base || "";
        }
      }

      stack.push({
        name,
        fileName,
        lineNumber: debugSource.lineNumber,
        columnNumber: debugSource.columnNumber
      });
    }

    fiber = fiber.return;
  }

  return stack.filter((item, index, self) =>
    index === 0 ||
    (item.fileName !== self[index - 1].fileName || item.lineNumber !== self[index - 1].lineNumber)
  );
}

function findNearestHostNode(fiber: any): HTMLElement | null {
  let current = fiber;
  while (current) {
    if (typeof current.type === 'string' && current.stateNode instanceof HTMLElement) {
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
  const [componentStack, setComponentStack] = useState<ComponentStackItem[]>([]);
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
        "Action", "Field", "Input", "Switch", "Checkbox", "Radio",
        "Badge", "Avatar", "Prose", "ProseDocument", "ProseSection"
      ];

      const allDsComponents = [
        ...atoms,
        "Frame", "Text", "Separator", "Stack", "Grid", "Cell",
        "Section", "Sidebar", "Part", "Header", "Footer"
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
          name = type.displayName || (type.render ? type.render.name : "") || "";
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
        const name = (typeof firstDsFiber.type === 'function' ? firstDsFiber.type.displayName || firstDsFiber.type.name : firstDsFiber.type.displayName) || "";
        if (atoms.includes(name)) {
          foundFiber = firstDsFiber;
        } else {
          let p = firstDsFiber.return;
          let d = 0;
          let owner = null;
          while (p && d < 4) {
            const pName = (typeof p.type === 'function' ? p.type.displayName || p.type.name : (p.type?.displayName)) || "";
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

        const rect = hostNode.getBoundingClientRect();
        setTargetRect(rect);
        setTargetElement(hostNode);

        // Name Resolution: Get the component name from the Fiber
        const type = targetFiber.type;
        let componentName = "";
        if (typeof type === "function") {
          componentName = type.displayName || type.name || "Component";
        } else if (typeof type === "object" && type) {
          componentName = type.displayName || (type.render ? type.render.name : "") || "Component";
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
            if (!isNaN(Number(parts[parts.length - 1])) && !isNaN(Number(parts[parts.length - 2]))) {
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
          if (base && (base.startsWith("index.") && fileParts.length > 0)) {
            file = `${fileParts.pop()}/${base}`;
          } else {
            file = base || file;
          }

          // Set Target Name: Sidebar.tsx:42(Action)
          setTargetName(`${file}:${line}(${componentName})`);

          // Mock stack for panel (just one item since we used the attribute)
          setComponentStack([{
            name: componentName,
            fileName: file,
            lineNumber: line,
            columnNumber: ""
          }]);
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
          {isLocked ? (
            <Lock size={10} color="var(--primary-fg)" />
          ) : (
            <Unlock size={10} color="var(--primary-fg)" />
          )}
          <Text
            variant={6}
            weight="bold"
            style={{ color: "var(--primary-fg)" }}
          >
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
            <Frame
              position="absolute"
              top={targetRect.top < 30 ? "0px" : "-25px"} // Flip inside if no space above
              left="-1px"
              style={{
                backgroundColor: "var(--link-color)",
                borderBottomLeftRadius: targetRect.top < 30 ? 0 : undefined,
                borderBottomRightRadius:
                  targetRect.top < 30 ? "4px" : undefined,
              }}
              p="0 1.5"
              rounded="sm"
              h={5} // 24px
              row
              align="center"
              gap={1}
              shadow="sm"
            >
              <Text size={6} weight="bold" style={{ color: "white" }}>
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
          stack={componentStack}
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
  stack,
  initialX,
  initialY,
  onClose,
  onCopy,
}: {
  element: HTMLElement;
  name: string;
  stack: ComponentStackItem[];
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
      section: "Layout",
      items: [
        { key: "Display", value: getProp("display") },
        { key: "Pos", value: getProp("position") },
        { key: "W", value: `${Math.round(element.offsetWidth)}` },
        { key: "H", value: `${Math.round(element.offsetHeight)}` },
        { key: "Pad", value: getProp("padding") },
        { key: "Marg", value: getProp("margin") },
      ],
    },
    {
      section: "Flex",
      items: [
        { key: "Dir", value: getProp("flex-direction") },
        { key: "Align", value: getProp("align-items") },
        { key: "Justify", value: getProp("justify-content") },
        { key: "Gap", value: getProp("gap") },
        { key: "Wrap", value: getProp("flex-wrap") },
      ],
    },
    {
      section: "Style",
      items: [
        { key: "Bg", value: getProp("background-color") },
        { key: "Color", value: getProp("color") },
        { key: "Radius", value: getProp("border-radius") },
        {
          key: "Font",
          value: `${getProp("font-size")} ${getProp("font-family").split(",")[0]}`,
        },
      ],
    },
  ];

  // Additional Section for Hierarchy
  if (stack && stack.length > 0) {
    properties.push({
      section: "Hierarchy",
      items: stack.map((item, i) => ({
        key: `${i + 1}`, // Simple index key
        value: `${item.fileName}:${item.lineNumber}(${item.name})` // Format: File:Line(Name)
      }))
    });
  }

  // AI Assist Prompts
  const aiPrompts = [
    { label: "Fix Padding", prompt: "The padding on this component looks wrong. Please adjust it to match the design system spacing (use p prop with scalar 2, 3, etc)." },
    { label: "Fix Alignment", prompt: "The alignment of children in this component is incorrect. Please fix the flex properties (align, justify) to ensure proper layout." },
    { label: "Convert to Row", prompt: "Convert this component to a horizontal row layout (add 'row' prop) and ensure spacing is correct." },
    { label: "Convert to Column", prompt: "Convert this component to a vertical stack layout (default Frame) and ensure spacing is correct." },
    { label: "Tighten Spacing", prompt: "Reduce the gap and padding in this component to make it more compact." },
    { label: "Make Responsive", prompt: "Ensure this component is responsive. It should adapt gracefully to smaller screens (use flex-wrap or responsive props)." },
  ];

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
          userSelect: "none",
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
      <Frame p="2 0" overflow="auto">
        {/* AI Assist Section */}
        <Frame gap={0.5} p="0 2 2 2">
          <Text
            weight="bold"
            size={6}
            color="tertiary"
            style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
          >
            AI Assist
          </Text>
          <Frame gap={0.5}>
            {aiPrompts.map((item) => (
              <Action
                key={item.label}
                size={5}
                variant="ghost"
                justify="start"
                label={item.label}
                onClick={() => handlePromptClick(item.prompt)}
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  textAlign: "left"
                }}
              />
            ))}
          </Frame>
        </Frame>

        {/* Properties & Hierarchy */}
        {properties.map((section) => {
          if (section.section === "Flex" && !hasFlex) return null;
          return (
            <Frame key={section.section} gap={0.5} p="0 2 2 2">
              <Text
                weight="bold"
                size={6}
                color="tertiary"
                style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
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
                      borderBottom:
                        i < section.items.length - 1
                          ? "1px solid var(--border-color)"
                          : undefined,
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
