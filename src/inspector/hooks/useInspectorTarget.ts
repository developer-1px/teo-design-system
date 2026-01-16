import React, {useEffect, useState} from "react"
import {type ComponentStackItem, findNearestHostNode, getFiberFromElement, getStackFromFiber,} from "../lib/fiber-utils"

export function useInspectorTarget(isActive: boolean, isLocked: boolean) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [targetName, setTargetName] = useState<string | null>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [componentStack, setComponentStack] = useState<ComponentStackItem[]>(
    [],
  );
  const [targetProps, setTargetProps] = useState<Record<string, any>>({});

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
        const inspectorData = hostNode.getAttribute("data-react-inspector");

        if (inspectorData) {
          const parts = inspectorData.split(":");
          let line = "";
          let file = inspectorData;

          if (parts.length >= 2) {
            if (
              !Number.isNaN(Number(parts[parts.length - 1])) &&
              !Number.isNaN(Number(parts[parts.length - 2]))
            ) {
              line = parts[parts.length - 2];
              parts.pop();
              parts.pop();
              file = parts.join(":");
            }
          }

          const fileParts = file.split("/");
          const base = fileParts.pop();
          if (base?.startsWith("index.") && fileParts.length > 0) {
            file = `${fileParts.pop()}/${base}`;
          } else {
            file = base || file;
          }

          setTargetName(`${file}:${line}(${componentName})`);

          setComponentStack([
            {
              name: componentName,
              fileName: file,
              lineNumber: line,
              columnNumber: "",
            },
          ]);
        } else {
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

  const resetTarget = () => {
    setTargetRect(null);
    setTargetName(null);
    setTargetElement(null);
    setComponentStack([]);
    setTargetProps({});
  };

  return {
    targetRect,
    targetName,
    targetElement,
    componentStack,
    targetProps,
    setTargetElement, // Exposed mostly for clearing via parent if needed, though resetTarget covers most
    resetTarget,
  };
}
