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
  function getFiberFromElement(element) {
    const allKeys = Object.keys(element);
    const fiberKey = allKeys.find((key) => key.startsWith("__reactFiber"));
    if (!fiberKey) {
      console.warn("[Component Hierarchy] No React Fiber found on element:", element);
      return null;
    }
    return element[fiberKey];
  }
  function getFilePath(fiber) {
    if (fiber._debugSource?.fileName) {
      return fiber._debugSource.fileName;
    }
    if (fiber._debugInfo) {
      const debugInfo = Array.isArray(fiber._debugInfo) ? fiber._debugInfo[0] : fiber._debugInfo;
      if (debugInfo?.source) {
        return debugInfo.source;
      }
    }
    return void 0;
  }
  function extractComponentHierarchy(element) {
    const fiber = getFiberFromElement(element);
    if (!fiber) {
      return [];
    }
    const hierarchy = [];
    let currentFiber = fiber;
    while (currentFiber) {
      if (shouldRenderFiber(currentFiber)) {
        const name = getComponentName(currentFiber);
        const props = { ...currentFiber.memoizedProps };
        const className = props.className;
        const filePath = getFilePath(currentFiber);
        delete props.children;
        delete props.ref;
        delete props.key;
        hierarchy.push({
          name,
          props,
          className,
          filePath,
          fiber: currentFiber
        });
      }
      currentFiber = currentFiber.return;
    }
    return hierarchy;
  }
  function formatComponentInfo(info) {
    let result = `Component: ${info.name}
`;
    if (info.filePath) {
      result += `File: ${info.filePath}
`;
    }
    if (info.className) {
      result += `
Tailwind CSS:
${info.className}
`;
    }
    result += `
Props:
`;
    for (const [key, value] of Object.entries(info.props)) {
      if (typeof value === "function") {
        result += `  ${key}: [Function]
`;
      } else if (typeof value === "object" && value !== null) {
        try {
          const serialized = JSON.stringify(value, null, 2);
          if (serialized.length > 100) {
            result += `  ${key}: ${JSON.stringify(value)}
`;
          } else {
            result += `  ${key}: ${serialized}
`;
          }
        } catch {
          result += `  ${key}: [Object]
`;
        }
      } else {
        result += `  ${key}: ${JSON.stringify(value)}
`;
      }
    }
    return result;
  }
  let overlayDiv = null;
  let tagBadge = null;
  let isActive = false;
  function createOverlay() {
    const div = document.createElement("div");
    div.id = "iddl-inspector-overlay";
    div.style.cssText = `
    position: fixed;
    pointer-events: none;
    border: 2px solid #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    z-index: 999998;
    transition: all 0.05s ease;
  `;
    document.body.appendChild(div);
    return div;
  }
  function createTagBadge() {
    const badge = document.createElement("div");
    badge.id = "iddl-inspector-tag";
    badge.style.cssText = `
    position: fixed;
    pointer-events: none;
    background: #3b82f6;
    color: white;
    padding: 2px 6px;
    font-size: 11px;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    font-weight: 500;
    border-radius: 3px;
    z-index: 999999;
    white-space: nowrap;
    transition: all 0.05s ease;
  `;
    document.body.appendChild(badge);
    return badge;
  }
  function updateOverlayPosition(element, componentName) {
    if (!overlayDiv) return;
    const rect = element.getBoundingClientRect();
    overlayDiv.style.top = `${rect.top}px`;
    overlayDiv.style.left = `${rect.left}px`;
    overlayDiv.style.width = `${rect.width}px`;
    overlayDiv.style.height = `${rect.height}px`;
    overlayDiv.style.display = "block";
    if (tagBadge && componentName) {
      tagBadge.textContent = componentName;
      tagBadge.style.top = `${rect.top - 20}px`;
      tagBadge.style.left = `${rect.left}px`;
      tagBadge.style.display = "block";
    }
  }
  function hideOverlay() {
    if (overlayDiv) {
      overlayDiv.style.display = "none";
    }
    if (tagBadge) {
      tagBadge.style.display = "none";
    }
  }
  function activateInspectMode() {
    if (isActive) return;
    if (!overlayDiv) {
      overlayDiv = createOverlay();
    }
    if (!tagBadge) {
      tagBadge = createTagBadge();
    }
    isActive = true;
    document.body.style.cursor = "default";
    const style = document.createElement("style");
    style.id = "iddl-inspector-cursor-override";
    style.textContent = `
    * {
      cursor: default !important;
    }
  `;
    document.head.appendChild(style);
    document.addEventListener("mousemove", handleMouseMove);
  }
  function deactivateInspectMode() {
    if (!isActive) return;
    isActive = false;
    hideOverlay();
    document.body.style.cursor = "";
    const cursorStyle = document.getElementById("iddl-inspector-cursor-override");
    if (cursorStyle) {
      cursorStyle.remove();
    }
    document.removeEventListener("mousemove", handleMouseMove);
  }
  function handleMouseMove(e) {
    if (!isActive) return;
    const element = e.target;
    if (element.id === "iddl-inspector-overlay" || element.id === "iddl-inspector-tag" || element.id === "iddl-inspector-panel" || element.closest("#iddl-inspector-panel")) {
      hideOverlay();
      return;
    }
    const hierarchy = extractComponentHierarchy(element);
    const componentName = hierarchy.length > 0 ? hierarchy[0].name : void 0;
    updateOverlayPosition(element, componentName);
  }
  function isInspectModeActive() {
    return isActive;
  }
  let panelDiv = null;
  let selectedIndex = null;
  let hoveredIndex = null;
  let currentHierarchy = [];
  function createPanel(rect) {
    const div = document.createElement("div");
    div.id = "iddl-inspector-panel";
    const panelWidth = 600;
    const panelHeight = Math.min(window.innerHeight * 0.8, 600);
    let top = rect.top;
    let left = rect.right + 10;
    if (left + panelWidth > window.innerWidth) {
      left = rect.left - panelWidth - 10;
    }
    if (left < 0) {
      left = rect.left;
      top = rect.bottom + 10;
    }
    if (top + panelHeight > window.innerHeight) {
      top = rect.top - panelHeight - 10;
    }
    top = Math.max(10, Math.min(top, window.innerHeight - panelHeight - 10));
    left = Math.max(10, Math.min(left, window.innerWidth - panelWidth - 10));
    div.style.cssText = `
    position: fixed;
    top: ${top}px;
    left: ${left}px;
    width: ${panelWidth}px;
    max-height: ${panelHeight}px;
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
    return div;
  }
  function updateItemStyle(index) {
    const item = panelDiv?.querySelector(`[data-component-index="${index}"]`);
    if (!item) return;
    const isSelected = index === selectedIndex;
    const isHovered = index === hoveredIndex;
    if (isSelected) {
      item.style.background = "rgba(59, 130, 246, 0.15)";
      item.style.boxShadow = "inset 0 0 0 2px #3b82f6";
    } else if (isHovered) {
      item.style.background = "rgba(0, 0, 0, 0.02)";
      item.style.boxShadow = "none";
    } else {
      item.style.background = "transparent";
      item.style.boxShadow = "none";
    }
  }
  function renderHierarchyList(hierarchy) {
    if (!panelDiv) return;
    const header = `
    <div style="
      padding: 16px;
      border-bottom: 1px solid #404040;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <div>
        <div style="font-size: 14px; font-weight: 600; color: #3b82f6;">Component Hierarchy</div>
        <div style="font-size: 11px; color: #888; margin-top: 4px;">
          Click to select, hover to preview
        </div>
      </div>
      <button
        id="iddl-close-panel"
        style="
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 18px;
          padding: 4px 8px;
        "
      >✕</button>
    </div>
  `;
    const listItems = hierarchy.map(
      (info, index) => `
    <div
      data-component-index="${index}"
      class="hierarchy-item"
      style="
        padding: 12px 16px;
        border-bottom: 1px solid #2a2a2a;
        cursor: pointer;
        transition: background 0.1s, box-shadow 0.1s;
        background: transparent;
      "
    >
      <div style="font-size: 13px; font-weight: 500; color: #61afef;">
        ${info.name}
      </div>
      ${info.filePath ? `<div style="font-size: 11px; color: #888; margin-top: 4px;">
          ${info.filePath}
        </div>` : ""}
      ${info.className ? `<div style="
          font-size: 11px;
          color: #98c379;
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        ">
          ${info.className}
        </div>` : ""}
    </div>
  `
    ).join("");
    panelDiv.innerHTML = header + `<div style="overflow-y: auto; flex: 1;">${listItems}</div>`;
    panelDiv.querySelector("#iddl-close-panel")?.addEventListener("click", hidePanel);
    hierarchy.forEach((info, index) => {
      const item = panelDiv?.querySelector(`[data-component-index="${index}"]`);
      if (!item) return;
      item.addEventListener("mouseenter", () => {
        const prevHovered = hoveredIndex;
        hoveredIndex = index;
        if (prevHovered !== null) {
          updateItemStyle(prevHovered);
        }
        updateItemStyle(index);
      });
      item.addEventListener("mouseleave", () => {
        if (hoveredIndex === index) {
          hoveredIndex = null;
          updateItemStyle(index);
        }
      });
      item.addEventListener("click", () => {
        const prevSelected = selectedIndex;
        selectedIndex = index;
        if (prevSelected !== null && prevSelected !== index) {
          updateItemStyle(prevSelected);
        }
        updateItemStyle(index);
        renderDetailsView(info);
      });
    });
    if (selectedIndex !== null) {
      updateItemStyle(selectedIndex);
    }
  }
  function renderDetailsView(info) {
    if (!panelDiv) return;
    const formattedInfo = formatComponentInfo(info);
    const header = `
    <div style="
      padding: 16px;
      border-bottom: 1px solid #404040;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button
          id="iddl-back-button"
          style="
            background: transparent;
            border: 1px solid #404040;
            color: #d4d4d4;
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
          "
        >← Back</button>
        <div>
          <div style="font-size: 14px; font-weight: 600; color: #3b82f6;">${info.name}</div>
          ${info.filePath ? `<div style="font-size: 11px; color: #888; margin-top: 4px;">
            ${info.filePath}
          </div>` : ""}
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button
          id="iddl-copy-button"
          style="
            background: #3b82f6;
            border: none;
            color: white;
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
          "
        >Copy</button>
        <button
          id="iddl-close-panel"
          style="
            background: transparent;
            border: none;
            color: #888;
            cursor: pointer;
            font-size: 18px;
            padding: 4px 8px;
          "
        >✕</button>
      </div>
    </div>
  `;
    const content = `
    <div style="
      padding: 16px;
      overflow-y: auto;
      flex: 1;
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      font-family: 'JetBrains Mono', monospace;
    ">${formattedInfo}</div>
  `;
    panelDiv.innerHTML = header + content;
    panelDiv.querySelector("#iddl-back-button")?.addEventListener("click", () => {
      renderHierarchyList(currentHierarchy);
    });
    panelDiv.querySelector("#iddl-copy-button")?.addEventListener("click", () => {
      navigator.clipboard.writeText(formattedInfo).then(() => {
        const btn = panelDiv?.querySelector("#iddl-copy-button");
        if (btn) {
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 2e3);
        }
      });
    });
    panelDiv.querySelector("#iddl-close-panel")?.addEventListener("click", hidePanel);
  }
  function showPanel(hierarchy, rect) {
    currentHierarchy = hierarchy;
    if (!panelDiv) {
      panelDiv = createPanel(rect);
    }
    renderHierarchyList(hierarchy);
  }
  function hidePanel() {
    if (panelDiv) {
      panelDiv.remove();
      panelDiv = null;
    }
    selectedIndex = null;
    hoveredIndex = null;
    currentHierarchy = [];
  }
  let clickHandler = null;
  let mouseDownHandler = null;
  let mouseUpHandler = null;
  let escapeHandler = null;
  function enableInspectMode() {
    if (isInspectModeActive()) return;
    console.log("[Element Inspector] Inspect mode enabled");
    activateInspectMode();
    const shouldBlockEvent = (target) => {
      return !(target.id === "iddl-inspector-overlay" || target.id === "iddl-inspector-tag" || target.id === "iddl-inspector-panel" || target.closest("#iddl-inspector-panel"));
    };
    mouseDownHandler = (e) => {
      const target = e.target;
      if (shouldBlockEvent(target)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };
    mouseUpHandler = (e) => {
      const target = e.target;
      if (shouldBlockEvent(target)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };
    clickHandler = (e) => {
      const target = e.target;
      if (!shouldBlockEvent(target)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const hierarchy = extractComponentHierarchy(target);
      console.log("[Element Inspector] Component hierarchy:", hierarchy);
      if (hierarchy.length > 0) {
        const rect = target.getBoundingClientRect();
        showPanel(hierarchy, rect);
      } else {
        console.warn("[Element Inspector] No React components found at this element");
      }
    };
    document.addEventListener("mousedown", mouseDownHandler, true);
    document.addEventListener("mouseup", mouseUpHandler, true);
    document.addEventListener("click", clickHandler, true);
    escapeHandler = (e) => {
      if (e.key === "Escape") {
        disableInspectMode();
      }
    };
    document.addEventListener("keydown", escapeHandler);
  }
  function disableInspectMode() {
    if (!isInspectModeActive()) return;
    console.log("[Element Inspector] Inspect mode disabled");
    deactivateInspectMode();
    hidePanel();
    if (mouseDownHandler) {
      document.removeEventListener("mousedown", mouseDownHandler, true);
      mouseDownHandler = null;
    }
    if (mouseUpHandler) {
      document.removeEventListener("mouseup", mouseUpHandler, true);
      mouseUpHandler = null;
    }
    if (clickHandler) {
      document.removeEventListener("click", clickHandler, true);
      clickHandler = null;
    }
    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
      escapeHandler = null;
    }
  }
  function toggleInspectMode() {
    if (isInspectModeActive()) {
      disableInspectMode();
    } else {
      enableInspectMode();
    }
  }
  function setupKeyboardHandler() {
    document.addEventListener("keydown", (e) => {
      const isMac = /Mac/i.test(navigator.platform);
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      if (modKey && e.key === "d") {
        e.preventDefault();
        toggleInspectMode();
      }
    });
  }
  setupKeyboardHandler();
  console.log("[IDDL Inspector] Ready. Press Cmd+D (Mac) or Ctrl+D (Win) to start inspecting.");
})();
