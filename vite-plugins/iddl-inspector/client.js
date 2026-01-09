(function() {
  "use strict";
  function getComponentName(fiber) {
    if (!fiber) return "Unknown";
    const { type, elementType } = fiber;
    if (typeof type === "string") {
      return type;
    }
    if (typeof type === "function") {
      return type.displayName || type.name || "Anonymous";
    }
    if (typeof type === "object" && type !== null) {
      if (type.$$typeof) {
        const symbolString = String(type.$$typeof);
        if (symbolString.includes("context")) {
          const contextName = type._context?.displayName;
          if (contextName) return contextName;
          return "Provider";
        }
      }
    }
    if (typeof type === "symbol") {
      const symbolString = type.toString();
      if (symbolString.includes("Fragment")) return "Fragment";
      if (symbolString.includes("Provider")) return "Provider";
      if (symbolString.includes("Consumer")) return "Consumer";
      if (symbolString.includes("Suspense")) return "Suspense";
      return "React.SymbolComponent";
    }
    if (elementType) {
      if (elementType.displayName) return elementType.displayName;
      if (elementType.name) return elementType.name;
      if (elementType.render && typeof elementType.render === "function") {
        return elementType.render.displayName || elementType.render.name || "Unknown";
      }
      if (elementType.type && typeof elementType.type === "function") {
        return elementType.type.displayName || elementType.type.name || "Unknown";
      }
    }
    return "Unknown";
  }
  function propsToString(props) {
    if (!props) return "";
    const relevantProps = [];
    for (const key in props) {
      if (key === "children" || key === "ref" || key === "key" || key === "className" || // HTML 관련 제외
      key.startsWith("data-") || // HTML data attributes 제외
      key.startsWith("aria-")) continue;
      const value = props[key];
      if (typeof value === "function" || typeof value === "object" || value === void 0 || value === null) continue;
      if (key === "role" || key === "prominence" || key === "intent" || key === "density" || key === "layout" || key === "id") {
        if (typeof value === "string") {
          relevantProps.push(`${key}="${value}"`);
        } else if (typeof value === "number" || typeof value === "boolean") {
          relevantProps.push(`${key}={${value}}`);
        }
      }
    }
    return relevantProps.length > 0 ? " " + relevantProps.join(" ") : "";
  }
  function isReactComponent(fiber) {
    if (!fiber) return false;
    const { type } = fiber;
    if (typeof type === "string") {
      return false;
    }
    if (typeof type === "function") {
      return true;
    }
    if (typeof type === "object" && type !== null) {
      return true;
    }
    return false;
  }
  function shouldRenderFiber(fiber) {
    if (!fiber) return false;
    if (!isReactComponent(fiber)) return false;
    const name = getComponentName(fiber);
    if (name === "Fragment") return false;
    if (name.startsWith("React.")) return false;
    if (name === "Provider" || name === "Consumer") {
      return false;
    }
    if (name === "Unknown" || name === "Anonymous") return false;
    return true;
  }
  function countChildren(fiber) {
    let count = 0;
    let child = fiber;
    while (child) {
      if (shouldRenderFiber(child)) count++;
      child = child.sibling;
    }
    return count;
  }
  function fiberToJSX(fiber, depth = 0) {
    if (!fiber) return "";
    const indent = "  ".repeat(depth);
    let result = "";
    if (shouldRenderFiber(fiber)) {
      const name = getComponentName(fiber);
      const props = propsToString(fiber.memoizedProps);
      const childCount = countChildren(fiber.child);
      if (childCount === 0) {
        result += `${indent}<${name}${props} />
`;
      } else {
        result += `${indent}<${name}${props}>
`;
        let child = fiber.child;
        while (child) {
          result += fiberToJSX(child, depth + 1);
          child = child.sibling;
        }
        result += `${indent}</${name}>
`;
      }
    } else {
      let child = fiber.child;
      while (child) {
        result += fiberToJSX(child, depth);
        child = child.sibling;
      }
    }
    return result;
  }
  function inspectReactTree() {
    try {
      const rootElement = document.getElementById("root");
      if (!rootElement) {
        return "// Error: #root element not found";
      }
      const fiberKey = Object.keys(rootElement).find(
        (key) => key.startsWith("__react")
      );
      if (!fiberKey) {
        return "// Error: React Fiber not found (is this a React app?)";
      }
      const fiberRoot = rootElement[fiberKey];
      let fiber = null;
      if (fiberRoot?.child) {
        fiber = fiberRoot.child;
      } else if (fiberRoot?.current) {
        fiber = fiberRoot.current;
      } else if (fiberRoot?.stateNode?.current) {
        fiber = fiberRoot.stateNode.current;
      } else {
        const internalRoot = fiberRoot?._internalRoot || fiberRoot?.stateNode?._internalRoot;
        if (internalRoot?.current) {
          fiber = internalRoot.current;
        }
      }
      if (!fiber) {
        return "// Error: Could not find React Fiber root node\n// fiberRoot keys: " + Object.keys(fiberRoot || {}).join(", ");
      }
      if (fiber.child && !shouldRenderFiber(fiber)) {
        fiber = fiber.child;
      }
      const jsx = fiberToJSX(fiber, 0);
      if (!jsx || jsx.trim() === "") {
        let debugInfo = "// Error: Empty tree\n";
        debugInfo += "// Root fiber type: " + typeof fiber?.type + "\n";
        debugInfo += "// Root component name: " + getComponentName(fiber) + "\n";
        debugInfo += "// Has child: " + !!fiber?.child + "\n";
        if (fiber?.child) {
          debugInfo += "// Child type: " + typeof fiber.child.type + "\n";
          debugInfo += "// Child name: " + getComponentName(fiber.child) + "\n";
        }
        return debugInfo;
      }
      return jsx;
    } catch (error) {
      return `// Error: ${error.message}
// Stack: ${error.stack}`;
    }
  }
  let isVisible = false;
  let container = null;
  let textarea = null;
  function createUI() {
    const div = document.createElement("div");
    div.id = "iddl-inspector";
    div.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    max-width: 1200px;
    height: 80vh;
    z-index: 999999;
    padding: 0;
  `;
    const ta = document.createElement("textarea");
    ta.readOnly = true;
    ta.spellcheck = false;
    ta.style.cssText = `
    width: 100%;
    height: 100%;
    padding: 16px;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    background: #1e1e1e;
    color: #d4d4d4;
    border: 1px solid #404040;
    border-radius: 8px;
    outline: none;
    resize: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  `;
    div.appendChild(ta);
    textarea = ta;
    return div;
  }
  function showInspector() {
    if (isVisible) return;
    if (!container) {
      container = createUI();
      document.body.appendChild(container);
    }
    const jsx = inspectReactTree();
    if (textarea) {
      textarea.value = jsx;
    }
    isVisible = true;
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        hideInspector();
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);
  }
  function hideInspector() {
    if (!isVisible || !container) return;
    container.remove();
    container = null;
    textarea = null;
    isVisible = false;
  }
  function toggleInspector() {
    if (isVisible) {
      hideInspector();
    } else {
      showInspector();
    }
  }
  function setupKeyboardHandler() {
    document.addEventListener("keydown", (e) => {
      const isMac = /Mac/i.test(navigator.platform);
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      if (modKey && e.key === "d") {
        e.preventDefault();
        toggleInspector();
      }
    });
  }
  setupKeyboardHandler();
  console.log("[IDDL Inspector] Ready. Press Cmd+D (Mac) or Ctrl+D (Win) to inspect React tree.");
})();
