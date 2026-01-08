/**
 * Debug Panel Client Script
 *
 * Cmd+D / Ctrl+D로 디버그 모드 토글
 * 디버그 모드에서 컴포넌트 hover + click으로 패널 표시
 */

// =============================================================================
// 상태 관리
// =============================================================================

const root = '__ROOT__';
const base = '__BASE__';

let debugMode = false;
let currentTarget;
let hasPanel = false;

// =============================================================================
// 스타일 주입
// =============================================================================

const style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.setAttribute('data-vite-dev-id', 'debug-panel');
style.innerHTML = `
/* 디버그 모드 토글 버튼 - Compact */
#debug-panel-toggle {
  position: fixed !important;
  bottom: 12px !important;
  right: 12px !important;
  z-index: 9999 !important;
  padding: 4px 8px !important;
  background: rgb(16, 185, 129) !important;
  color: white !important;
  border: none !important;
  border-radius: 4px !important;
  font-size: 11px !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.15s !important;
}

#debug-panel-toggle:hover {
  background: rgb(5, 150, 105) !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15) !important;
}

#debug-panel-toggle.active {
  background: rgb(239, 68, 68) !important;
}

#debug-panel-toggle.active:hover {
  background: rgb(220, 38, 38) !important;
}

/* Hover 시 outline - Compact */
[data-debug-target] {
  outline: 1px solid rgb(16, 185, 129) !important;
  outline-offset: 1px !important;
  cursor: pointer !important;
}

/* 패널 - Compact */
#debug-panel {
  position: fixed !important;
  z-index: 9998 !important;
  background: #ffffff !important;
  border-radius: 6px !important;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  max-width: 400px !important;
  max-height: 300px !important;
  overflow: auto !important;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace !important;
  font-size: 11px !important;
}

#debug-panel-header {
  position: sticky !important;
  top: 0 !important;
  background: #fafafa !important;
  padding: 6px 8px !important;
  border-bottom: 1px solid #e5e5e5 !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}

#debug-panel-title {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #171717 !important;
}

#debug-panel-close {
  background: transparent !important;
  border: none !important;
  color: #525252 !important;
  cursor: pointer !important;
  padding: 2px 4px !important;
  border-radius: 3px !important;
  font-size: 16px !important;
  line-height: 1 !important;
}

#debug-panel-close:hover {
  background: #f5f5f5 !important;
  color: #171717 !important;
}

.debug-panel-item {
  padding: 6px 8px !important;
  border-bottom: 1px solid #f5f5f5 !important;
  transition: background 0.1s !important;
}

.debug-panel-item:hover {
  background: #fafafa !important;
}

.debug-panel-item:last-child {
  border-bottom: none !important;
}

.debug-panel-component-name {
  font-size: 11px !important;
  font-weight: 500 !important;
  color: #171717 !important;
  margin-bottom: 1px !important;
  display: inline !important;
  margin-right: 6px !important;
}

.debug-panel-file-path {
  font-size: 10px !important;
  color: #737373 !important;
  word-break: break-all !important;
  line-height: 1.3 !important;
  display: inline !important;
}
`;
document.head.appendChild(style);

// =============================================================================
// 디버그 모드 토글 버튼 생성
// =============================================================================

const toggleButton = document.createElement('button');
toggleButton.id = 'debug-panel-toggle';
toggleButton.textContent = 'Debug OFF';
toggleButton.addEventListener('click', toggleDebugMode);
document.body.appendChild(toggleButton);

// =============================================================================
// 패널 엘리먼트 생성
// =============================================================================

const panelElement = document.createElement('div');
panelElement.id = 'debug-panel';

// =============================================================================
// 키보드 이벤트: Cmd+D / Ctrl+D로 토글
// =============================================================================

window.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'd') {
    event.preventDefault();
    toggleDebugMode();
  }

  // ESC로 패널 닫기
  if (event.key === 'Escape' && hasPanel) {
    closePanel();
  }
});

// =============================================================================
// 마우스 이벤트: 디버그 모드에서만 동작
// =============================================================================

window.addEventListener('mousemove', (event) => {
  if (!debugMode) {
    clearOverlay();
    return;
  }

  if (hasPanel) return;

  if (!(event.target instanceof HTMLElement)) {
    clearOverlay();
    return;
  }

  // 토글 버튼이나 패널은 제외
  if (
    event.target === toggleButton ||
    event.target.closest('#debug-panel-toggle') ||
    event.target.closest('#debug-panel')
  ) {
    clearOverlay();
    return;
  }

  if (event.target === currentTarget) return;

  clearOverlay();
  currentTarget = event.target;
  event.target.dataset['debugTarget'] = 'true';
});

window.addEventListener('click', (event) => {
  if (!debugMode) return;

  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  // 토글 버튼이나 패널은 제외
  if (
    target === toggleButton ||
    target.closest('#debug-panel-toggle') ||
    target.closest('#debug-panel')
  ) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const layers = getLayersForElement(target);
  if (layers.length === 0) {
    console.warn('[Debug Panel] No React component found for this element');
    return;
  }

  showPanel(target, layers);
});

// =============================================================================
// 디버그 모드 토글
// =============================================================================

function toggleDebugMode() {
  debugMode = !debugMode;

  if (debugMode) {
    toggleButton.textContent = 'Debug ON';
    toggleButton.classList.add('active');
  } else {
    toggleButton.textContent = 'Debug OFF';
    toggleButton.classList.remove('active');
    clearOverlay();
    closePanel();
  }
}

// =============================================================================
// Overlay 제거
// =============================================================================

function clearOverlay() {
  if (!currentTarget) return;

  const current = document.querySelector('[data-debug-target]');
  if (current) delete current.dataset['debugTarget'];

  currentTarget = undefined;
}

// =============================================================================
// 패널 표시
// =============================================================================

function showPanel(target, layers) {
  const zIndex = getMaxZIndex(target, 9997);
  if (zIndex > 9997) panelElement.style.zIndex = `${zIndex + 1}`;

  const rect = target.getBoundingClientRect();

  // 위치 계산 (화면 절반 기준으로 위/아래 결정)
  if (rect.bottom < window.innerHeight / 2) {
    panelElement.style.top = `${rect.bottom + 8}px`;
    panelElement.style.bottom = '';
    panelElement.style.maxHeight = `${window.innerHeight - rect.bottom - 24}px`;
  } else {
    panelElement.style.bottom = `${window.innerHeight - rect.top + 8}px`;
    panelElement.style.top = '';
    panelElement.style.maxHeight = `${rect.top - 24}px`;
  }

  // 좌우 위치
  if (rect.left < window.innerWidth / 2) {
    panelElement.style.left = `${rect.left}px`;
    panelElement.style.right = '';
  } else {
    panelElement.style.right = `${window.innerWidth - rect.right}px`;
    panelElement.style.left = '';
  }

  // 내용 생성
  panelElement.innerHTML = '';

  // 헤더
  const header = document.createElement('div');
  header.id = 'debug-panel-header';

  const title = document.createElement('div');
  title.id = 'debug-panel-title';
  title.textContent = 'Component Hierarchy';
  header.appendChild(title);

  const closeBtn = document.createElement('button');
  closeBtn.id = 'debug-panel-close';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', closePanel);
  header.appendChild(closeBtn);

  panelElement.appendChild(header);

  // 컴포넌트 리스트
  for (const layer of layers) {
    const item = document.createElement('div');
    item.className = 'debug-panel-item';

    const componentName = document.createElement('div');
    componentName.className = 'debug-panel-component-name';
    componentName.textContent = `<${layer.name} />`;
    item.appendChild(componentName);

    const filePath = document.createElement('div');
    filePath.className = 'debug-panel-file-path';
    filePath.textContent = layer.path.replace(`${root}/`, '');
    item.appendChild(filePath);

    panelElement.appendChild(item);
  }

  if (!hasPanel) {
    document.body.appendChild(panelElement);
    hasPanel = true;
  }
}

// =============================================================================
// 패널 닫기
// =============================================================================

function closePanel() {
  if (!hasPanel) return;
  document.body.removeChild(panelElement);
  hasPanel = false;
}

// =============================================================================
// 최대 z-index 찾기
// =============================================================================

function getMaxZIndex(target, current) {
  const parent = target.parentElement;
  if (!parent || parent === document.body) return current;

  const zIndex = parseInt(window.getComputedStyle(parent).zIndex);
  return getMaxZIndex(parent, isNaN(zIndex) ? current : Math.max(zIndex, current));
}

// =============================================================================
// React 컴포넌트 정보 추출
// =============================================================================

function getLayersForElement(element) {
  let instance = getReactInstanceForElement(element);
  const layers = [];

  while (instance) {
    const path = getPath(instance);
    if (path) {
      const name =
        typeof instance.type === 'string'
          ? instance.type
          : instance.type.displayName ??
            instance.type.name ??
            instance.type.render?.name ??
            'Anonymous';
      layers.push({ name, path });
    }
    instance = instance._debugOwner;
  }

  return layers;
}

function getPath(fiber) {
  const source = fiber._debugSource ?? fiber._debugInfo;
  if (!source) {
    console.debug('[Debug Panel] No debug source for fiber', fiber);
    return;
  }

  const { columnNumber = 1, fileName, lineNumber = 1 } = source;
  return `${fileName}:${lineNumber}:${columnNumber}`;
}

function getReactInstanceForElement(element) {
  // React DevTools Hook 사용
  if ('__REACT_DEVTOOLS_GLOBAL_HOOK__' in window) {
    const { renderers } = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    for (const renderer of renderers.values()) {
      try {
        const fiber = renderer.findFiberByHostInstance(element);
        if (fiber) return fiber;
      } catch {
        // ignore
      }
    }
  }

  // React 17 이하
  if ('_reactRootContainer' in element) {
    return element._reactRootContainer._internalRoot.current.child;
  }

  // Fiber 직접 찾기
  for (const key in element) {
    if (key.startsWith('__reactFiber')) {
      return element[key];
    }
  }

  return undefined;
}
