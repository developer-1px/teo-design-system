(function() {
  "use strict";
  var FilterLevel = /* @__PURE__ */ ((FilterLevel2) => {
    FilterLevel2["Page"] = "Page";
    FilterLevel2["Section"] = "Section";
    FilterLevel2["Group"] = "Group";
    FilterLevel2["Atom"] = "Atom";
    FilterLevel2["All"] = "All";
    return FilterLevel2;
  })(FilterLevel || {});
  const FILTER_CONFIGS = {
    [
      "Page"
      /* Page */
    ]: {
      level: "Page",
      color: "#a855f7",
      label: "Page",
      description: "최상위 Page 컴포넌트"
    },
    [
      "Section"
      /* Section */
    ]: {
      level: "Section",
      color: "#3b82f6",
      label: "Section",
      description: "Section 레이아웃 영역"
    },
    [
      "Group"
      /* Group */
    ]: {
      level: "Group",
      color: "#10b981",
      label: "Group",
      description: "Group 논리적 그룹"
    },
    [
      "Atom"
      /* Atom */
    ]: {
      level: "Atom",
      color: "#f59e0b",
      label: "Atom",
      description: "Atom (Field, Action, Text)"
    },
    [
      "All"
      /* All */
    ]: {
      level: "All",
      color: "#6b7280",
      label: "All",
      description: "모든 IDDL 컴포넌트"
    }
  };
  const FILTER_CYCLE = [
    "Page",
    "Section",
    "Group",
    "Atom",
    "All"
    /* All */
  ];
  let currentFilterLevel = "All";
  function cycleFilterLevel() {
    const currentIndex = FILTER_CYCLE.indexOf(currentFilterLevel);
    const nextIndex = (currentIndex + 1) % FILTER_CYCLE.length;
    currentFilterLevel = FILTER_CYCLE[nextIndex];
    return currentFilterLevel;
  }
  function getCurrentFilterLevel() {
    return currentFilterLevel;
  }
  function getFilterColor(level) {
    return FILTER_CONFIGS[level || currentFilterLevel].color;
  }
  function getFilterConfig(level) {
    return FILTER_CONFIGS[level || currentFilterLevel];
  }
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
  let activeHighlights = [];
  let selectedIndex = null;
  function findDOMNode(fiber) {
    if (fiber.stateNode && fiber.stateNode instanceof HTMLElement) {
      return fiber.stateNode;
    }
    let child = fiber.child;
    while (child) {
      const node = findDOMNode(child);
      if (node) return node;
      child = child.sibling;
    }
    return null;
  }
  function getComponentType(fiber) {
    const name = getComponentName(fiber);
    if (name === "Page" || name.startsWith("App")) {
      return FilterLevel.Page;
    }
    if (name === "Section") {
      return FilterLevel.Section;
    }
    if (name === "Group") {
      return FilterLevel.Group;
    }
    if (name === "Field" || name === "Action" || name === "Text") {
      return FilterLevel.Atom;
    }
    return null;
  }
  function collectComponentsByLevel(fiber, targetLevel, collected = []) {
    if (!fiber) return collected;
    const componentType = getComponentType(fiber);
    if (targetLevel === FilterLevel.All || componentType === targetLevel) {
      const element = findDOMNode(fiber);
      if (element) {
        collected.push({
          fiber,
          name: getComponentName(fiber),
          element
        });
      }
    }
    let child = fiber.child;
    while (child) {
      collectComponentsByLevel(child, targetLevel, collected);
      child = child.sibling;
    }
    return collected;
  }
  function getRootFiber() {
    const rootElement = document.getElementById("root");
    if (!rootElement) return null;
    const allKeys = Object.keys(rootElement);
    const fiberKey = allKeys.find((key) => key.startsWith("__react"));
    if (!fiberKey) return null;
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
    return fiber;
  }
  function createOverlayForElement(element, componentName, color, isSelected = false, onClickCallback) {
    const rect = element.getBoundingClientRect();
    const borderColor = isSelected ? color : `${color}40`;
    const backgroundColor = isSelected ? `${color}33` : `${color}0D`;
    const overlay = document.createElement("div");
    overlay.className = "iddl-inspector-highlight-overlay";
    overlay.style.cssText = `
    position: fixed;
    pointer-events: auto;
    cursor: pointer;
    border: 2px solid ${borderColor};
    background: ${backgroundColor};
    z-index: 999998;
    transition: all 0.15s ease;
    top: ${rect.top}px;
    left: ${rect.left}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
  `;
    if (onClickCallback) {
      overlay.addEventListener("click", (e) => {
        e.stopPropagation();
        onClickCallback();
      });
    }
    const label = document.createElement("div");
    label.className = "iddl-inspector-highlight-label";
    label.textContent = componentName;
    label.style.cssText = `
    position: fixed;
    pointer-events: none;
    background: ${color};
    color: white;
    padding: 2px 6px;
    font-size: 11px;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    font-weight: 500;
    border-radius: 3px;
    z-index: 999999;
    white-space: nowrap;
    opacity: ${isSelected ? "1" : "0.7"};
    top: ${rect.top - 20}px;
    left: ${rect.left}px;
  `;
    document.body.appendChild(overlay);
    document.body.appendChild(label);
    return { overlay, label };
  }
  function updateHighlightPositions() {
    activeHighlights.forEach((highlight) => {
      const rect = highlight.element.getBoundingClientRect();
      highlight.overlay.style.top = `${rect.top}px`;
      highlight.overlay.style.left = `${rect.left}px`;
      highlight.overlay.style.width = `${rect.width}px`;
      highlight.overlay.style.height = `${rect.height}px`;
      highlight.label.style.top = `${rect.top - 20}px`;
      highlight.label.style.left = `${rect.left}px`;
    });
  }
  function highlightAllComponents() {
    clearAllHighlights();
    const filterLevel = getCurrentFilterLevel();
    const color = getFilterColor(filterLevel);
    const rootFiber = getRootFiber();
    if (!rootFiber) {
      console.warn("[Multi Highlighter] Root fiber not found");
      return [];
    }
    const components = collectComponentsByLevel(rootFiber, filterLevel);
    console.log(`[Multi Highlighter] Found ${components.length} components for level: ${filterLevel}`);
    components.forEach((component, index) => {
      const { overlay, label } = createOverlayForElement(
        component.element,
        component.name,
        color,
        false,
        () => {
          selectComponent(index);
          window.dispatchEvent(new CustomEvent("iddl-component-selected", { detail: { index } }));
        }
      );
      activeHighlights.push({
        componentName: component.name,
        element: component.element,
        overlay,
        label,
        fiber: component.fiber,
        isSelected: false
      });
    });
    window.addEventListener("scroll", updateHighlightPositions, true);
    window.addEventListener("resize", updateHighlightPositions);
    return components.map((c) => ({
      name: c.name,
      props: c.fiber.memoizedProps || {},
      element: c.element
    }));
  }
  function clearAllHighlights() {
    activeHighlights.forEach((highlight) => {
      highlight.overlay.remove();
      highlight.label.remove();
    });
    activeHighlights = [];
    selectedIndex = null;
    window.removeEventListener("scroll", updateHighlightPositions, true);
    window.removeEventListener("resize", updateHighlightPositions);
  }
  function selectComponent(index) {
    if (index < 0 || index >= activeHighlights.length) return;
    const filterLevel = getCurrentFilterLevel();
    const color = getFilterColor(filterLevel);
    if (selectedIndex !== null && selectedIndex < activeHighlights.length) {
      const prevHighlight = activeHighlights[selectedIndex];
      prevHighlight.isSelected = false;
      prevHighlight.overlay.style.border = `2px solid ${color}40`;
      prevHighlight.overlay.style.background = `${color}0D`;
      prevHighlight.label.style.opacity = "0.7";
    }
    const highlight = activeHighlights[index];
    highlight.isSelected = true;
    selectedIndex = index;
    highlight.overlay.style.border = `2px solid ${color}`;
    highlight.overlay.style.background = `${color}33`;
    highlight.label.style.opacity = "1";
    highlight.element.scrollIntoView({ behavior: "smooth", block: "center" });
    console.log("[Multi Highlighter] Component selected:", index, getSelectedComponentDetails());
  }
  function getSelectedIndex() {
    return selectedIndex;
  }
  function getSelectedComponentDetails() {
    if (selectedIndex === null || selectedIndex >= activeHighlights.length) {
      return null;
    }
    const highlight = activeHighlights[selectedIndex];
    const fiber = highlight.fiber;
    let fileName = "Unknown.tsx";
    let lineNumber = "";
    if (fiber._debugSource) {
      const source = fiber._debugSource;
      if (source.fileName) {
        const parts = source.fileName.split("/");
        fileName = parts[parts.length - 1];
        if (source.lineNumber) {
          lineNumber = `:${source.lineNumber}`;
          if (source.columnNumber) {
            lineNumber += `:${source.columnNumber}`;
          }
        }
      }
    } else if (fiber._debugInfo) {
      console.log("[Multi Highlighter] _debugInfo:", fiber._debugInfo);
    }
    const componentName = highlight.componentName;
    const props = fiber.memoizedProps || {};
    const priorityKeys = ["role", "prominence", "intent", "density", "layout", "direction", "gridArea"];
    const otherKeys = Object.keys(props).filter(
      (key) => !priorityKeys.includes(key) && key !== "children" && key !== "ref" && key !== "key" && key !== "className" && !key.startsWith("on") && !key.startsWith("data-") && !key.startsWith("aria-") && !key.startsWith("computed")
    );
    const allKeys = [...priorityKeys.filter((k) => k in props), ...otherKeys];
    const propsStr = allKeys.map((key) => {
      const value = props[key];
      if (value === void 0 || value === null) return null;
      if (typeof value === "string") {
        return `${key}="${value}"`;
      } else if (typeof value === "number") {
        return `${key}={${value}}`;
      } else if (typeof value === "boolean" && value === true) {
        return key;
      } else if (typeof value === "object") {
        return `${key}={{...}}`;
      }
      return null;
    }).filter(Boolean).join(" ");
    const reactCode = propsStr ? `<${componentName} ${propsStr} />` : `<${componentName} />`;
    let htmlCode = highlight.element.outerHTML;
    htmlCode = htmlCode.replace(/\s+/g, " ").replace(/style="[^"]*"/g, 'style="..."').replace(/class="([^"]{50,}?)"/g, 'class="..."').substring(0, 800);
    return {
      fileName,
      lineNumber,
      reactCode,
      htmlCode
    };
  }
  let panelDiv = null;
  let isVisible = false;
  let currentComponents = [];
  function createPersistentPanel() {
    const div = document.createElement("div");
    div.id = "iddl-inspector-persistent-panel";
    const initialTop = 20;
    const initialRight = 20;
    div.style.cssText = `
    position: fixed;
    top: ${initialTop}px;
    right: ${initialRight}px;
    width: 320px;
    max-height: 400px;
    background: #1e1e1e;
    border: 1px solid #404040;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    z-index: 999999;
    display: flex;
    flex-direction: column;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    color: #d4d4d4;
  `;
    document.body.appendChild(div);
    setupDragFunctionality(div);
    return div;
  }
  function setupDragFunctionality(panel) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    const header = panel.querySelector("#iddl-panel-header");
    if (!header) return;
    header.style.cursor = "move";
    header.style.userSelect = "none";
    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      header.style.cursor = "grabbing";
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      panel.style.right = "auto";
      panel.style.left = `${initialLeft + deltaX}px`;
      panel.style.top = `${initialTop + deltaY}px`;
    });
    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = "move";
      }
    });
  }
  function updatePanelContent(components) {
    if (!panelDiv) return;
    currentComponents = components;
    const filterLevel = getCurrentFilterLevel();
    const config = getFilterConfig(filterLevel);
    const header = `
    <div
      id="iddl-panel-header"
      style="
        padding: 12px 16px;
        background: linear-gradient(135deg, ${config.color}22, ${config.color}11);
        border-bottom: 1px solid #404040;
        border-radius: 8px 8px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <div style="display: flex; align-items: center; gap: 8px;">
        <div
          style="
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${config.color};
          "
        ></div>
        <div>
          <div style="font-size: 13px; font-weight: 600; color: ${config.color};">
            ${config.label}
          </div>
          <div style="font-size: 10px; color: #888; margin-top: 2px;">
            ${components.length} components
          </div>
        </div>
      </div>
      <button
        id="iddl-close-panel-btn"
        style="
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 16px;
          padding: 4px 8px;
          transition: color 0.2s;
        "
      >✕</button>
    </div>
  `;
    const selectedIdx = getSelectedIndex();
    const listItems = components.map(
      (item, index) => {
        const isSelected = selectedIdx === index;
        const propsText = [
          item.props.role ? `role="${item.props.role}"` : null,
          item.props.prominence ? `prominence="${item.props.prominence}"` : null
        ].filter(Boolean).join(" ");
        return `
    <div
      data-component-index="${index}"
      class="component-list-item"
      style="
        padding: 8px 16px;
        border-bottom: 1px solid #2a2a2a;
        cursor: pointer;
        transition: background 0.15s;
        background: ${isSelected ? "rgba(0, 0, 0, 0.4)" : "transparent"};
        font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
      "
    >
      <div style="font-size: 11px; color: ${config.color};">
        <span style="font-weight: 600;">&lt;${item.name}</span>${propsText ? ` <span style="color: #888;">${propsText}</span>` : ""}<span style="font-weight: 600;"> /&gt;</span>
      </div>
    </div>
  `;
      }
    ).join("");
    const details = getSelectedComponentDetails();
    let detailsSection = "";
    if (details) {
      const fileLocation = `${details.fileName}${details.lineNumber}`;
      const combinedCode = `// ${fileLocation}
${details.reactCode}

// HTML
${details.htmlCode}`;
      detailsSection = `
    <div
      style="
        padding: 12px 16px;
        border-top: 1px solid #404040;
        background: #1a1a1a;
        max-height: 200px;
        overflow-y: auto;
      "
    >
      <div style="font-size: 10px; color: #888; margin-bottom: 4px;">Selected Component:</div>
      <textarea
        id="iddl-component-details"
        readonly
        onclick="this.select()"
        style="
          width: 100%;
          min-height: 120px;
          background: #0d0d0d;
          border: 1px solid #333;
          border-radius: 4px;
          color: #d4d4d4;
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
          font-size: 11px;
          padding: 8px;
          resize: vertical;
          line-height: 1.4;
          cursor: text;
        "
      >${combinedCode}</textarea>
    </div>
  `;
    }
    const footer = `
    <div
      style="
        padding: 8px 16px;
        border-top: 1px solid #404040;
        background: #252525;
        border-radius: 0 0 8px 8px;
        font-size: 10px;
        color: #888;
      "
    >
      <kbd style="
        padding: 2px 6px;
        background: #333;
        border: 1px solid #444;
        border-radius: 3px;
        font-family: inherit;
      ">Cmd+D</kbd> Cycle Filter
      &nbsp;&nbsp;
      <kbd style="
        padding: 2px 6px;
        background: #333;
        border: 1px solid #444;
        border-radius: 3px;
        font-family: inherit;
      ">ESC</kbd> Close
    </div>
  `;
    panelDiv.innerHTML = header + `<div style="overflow-y: auto; flex: 1;">${listItems || '<div style="padding: 16px; text-align: center; color: #666;">No components found</div>'}</div>` + detailsSection + footer;
    panelDiv.querySelector("#iddl-close-panel-btn")?.addEventListener("click", () => {
      hidePanel();
    });
    setupDragFunctionality(panelDiv);
    components.forEach((item, index) => {
      const itemEl = panelDiv?.querySelector(`[data-component-index="${index}"]`);
      if (!itemEl) return;
      const selectedIdx2 = getSelectedIndex();
      const isSelected = selectedIdx2 === index;
      itemEl.addEventListener("mouseenter", () => {
        if (!isSelected) {
          itemEl.style.background = "rgba(0, 0, 0, 0.25)";
        }
      });
      itemEl.addEventListener("mouseleave", () => {
        if (!isSelected) {
          itemEl.style.background = "transparent";
        }
      });
      itemEl.addEventListener("click", () => {
        selectComponent(index);
        updatePanelContent(currentComponents);
      });
    });
  }
  function showPanel() {
    if (isVisible) return;
    if (!panelDiv) {
      panelDiv = createPersistentPanel();
    } else {
      panelDiv.style.display = "flex";
    }
    isVisible = true;
    updatePanelContent(currentComponents);
  }
  function hidePanel() {
    if (!isVisible || !panelDiv) return;
    panelDiv.style.display = "none";
    isVisible = false;
  }
  function isPanelVisible() {
    return isVisible;
  }
  function initPersistentPanel() {
    window.addEventListener("iddl-component-selected", () => {
      console.log("[Persistent Panel] Component selected event received");
      updatePanelContent(currentComponents);
    });
    console.log("[Persistent Panel] Event listener registered");
  }
  function setupKeyboardHandler() {
    document.addEventListener("keydown", (e) => {
      const isMac = /Mac/i.test(navigator.platform);
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      if (e.key === "Escape" && isPanelVisible()) {
        e.preventDefault();
        hidePanel();
        clearAllHighlights();
        return;
      }
      if (modKey && e.key === "d") {
        e.preventDefault();
        handleFilterCycle();
      }
    });
  }
  function handleFilterCycle() {
    if (!isPanelVisible()) {
      showPanel();
    }
    const newLevel = cycleFilterLevel();
    console.log(`[IDDL Inspector] Filter level changed to: ${newLevel}`);
    const components = highlightAllComponents();
    updatePanelContent(components);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  function init() {
    setupKeyboardHandler();
    initPersistentPanel();
    console.log("[IDDL Inspector] Ready.");
    console.log("  - Cmd+D: Show Inspector & Cycle Filter Level");
    console.log("  - ESC: Hide Inspector");
  }
})();
