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

let debugMode = 0; // 0: OFF, 1: All components, 2: Buttons only
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

/* 레거시 스타일 (호환성 유지) */
[data-debug-target] {
  outline: 1px solid rgb(16, 185, 129) !important;
  outline-offset: 1px !important;
  cursor: pointer !important;
}

/* 디버그 오버레이 레이어 - 클릭 차단 */
#debug-overlay-layer {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9997 !important;
  pointer-events: auto !important;
  overflow: hidden !important;
  cursor: crosshair !important;
}

/* 인터랙티브 요소 박스 - Compact & Minimal */
.debug-interactive-box {
  position: absolute !important;
  border: 1px solid rgba(16, 185, 129, 0.25) !important;
  background: rgba(16, 185, 129, 0.03) !important;
  pointer-events: auto !important;
  transition: all 0.08s ease !important;
  box-sizing: border-box !important;
  cursor: pointer !important;
}

/* Hover 상태 박스 */
.debug-interactive-box.hover {
  border-color: rgba(16, 185, 129, 0.7) !important;
  background: rgba(16, 185, 129, 0.08) !important;
  border-width: 1px !important;
}

/* Pulse 애니메이션 - Figma 스타일 */
.debug-interactive-box.pulse {
  animation: debug-pulse 0.6s ease-out !important;
}

@keyframes debug-pulse {
  0% {
    border-color: rgba(16, 185, 129, 0.9) !important;
    background: rgba(16, 185, 129, 0.2) !important;
  }
  100% {
    border-color: rgba(16, 185, 129, 0.25) !important;
    background: rgba(16, 185, 129, 0.03) !important;
  }
}

/* 디버그 레벨 2 (Button만) - 파란색 */
body[data-debug-mode="2"] .debug-interactive-box {
  border: 1px solid rgba(59, 130, 246, 0.25) !important;
  background: rgba(59, 130, 246, 0.03) !important;
}

body[data-debug-mode="2"] .debug-interactive-box.hover {
  border-color: rgba(59, 130, 246, 0.7) !important;
  background: rgba(59, 130, 246, 0.08) !important;
}

body[data-debug-mode="2"] .debug-interactive-box.pulse {
  animation: debug-pulse-blue 0.6s ease-out !important;
}

@keyframes debug-pulse-blue {
  0% {
    border-color: rgba(59, 130, 246, 0.9) !important;
    background: rgba(59, 130, 246, 0.2) !important;
  }
  100% {
    border-color: rgba(59, 130, 246, 0.25) !important;
    background: rgba(59, 130, 246, 0.03) !important;
  }
}

body[data-debug-mode="2"] .debug-box-label {
  background: rgba(59, 130, 246, 0.95) !important;
}

body[data-debug-mode="2"]::before {
  background: rgba(59, 130, 246, 0.95) !important;
  content: 'DEBUG: BUTTONS' !important;
}

body[data-debug-mode="2"] #debug-panel-toggle {
  background: rgb(59, 130, 246) !important;
}

body[data-debug-mode="2"] #debug-panel-toggle:hover {
  background: rgb(37, 99, 235) !important;
}

/* 요소 태그 라벨 - Compact */
.debug-box-label {
  position: absolute !important;
  top: -14px !important;
  left: 0 !important;
  padding: 1px 4px !important;
  background: rgba(16, 185, 129, 0.95) !important;
  color: white !important;
  font-size: 9px !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
  font-weight: 500 !important;
  border-radius: 2px !important;
  white-space: nowrap !important;
  opacity: 0 !important;
  transition: opacity 0.1s !important;
  pointer-events: none !important;
  line-height: 1.4 !important;
  letter-spacing: -0.01em !important;
}

.debug-interactive-box.hover .debug-box-label {
  opacity: 1 !important;
}

/* 디버그 모드에서 모든 요소를 검사 모드 커서로 변경 */
body[data-debug-mode="1"],
body[data-debug-mode="1"] *,
body[data-debug-mode="2"],
body[data-debug-mode="2"] * {
  cursor: crosshair !important;
}

/* 디버그 토글 버튼과 패널만 일반 커서 */
body[data-debug-mode="1"] #debug-panel-toggle,
body[data-debug-mode="1"] #debug-panel,
body[data-debug-mode="1"] #debug-panel *,
body[data-debug-mode="2"] #debug-panel-toggle,
body[data-debug-mode="2"] #debug-panel,
body[data-debug-mode="2"] #debug-panel * {
  cursor: pointer !important;
}

/* 디버그 모드 활성화 오버레이 - Compact */
body[data-debug-mode="1"]::before {
  content: 'DEBUG';
  position: fixed;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  padding: 3px 8px;
  background: rgba(16, 185, 129, 0.95);
  color: white;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
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
// 디버그 오버레이 레이어 생성
// =============================================================================

const overlayLayer = document.createElement('div');
overlayLayer.id = 'debug-overlay-layer';

let interactiveElements = [];
let overlayBoxes = new Map(); // element -> box element
let updateOverlayTimer = null;

// 오버레이 레이어 클릭 이벤트 - 빈 영역 클릭 시 모든 박스 펄스
overlayLayer.addEventListener('click', (event) => {
  // 박스가 아닌 빈 영역을 클릭한 경우
  if (event.target === overlayLayer) {
    // 모든 박스에 펄스 애니메이션
    overlayBoxes.forEach(box => {
      box.classList.remove('pulse');
      // Reflow를 강제로 트리거하여 애니메이션 재시작
      void box.offsetWidth;
      box.classList.add('pulse');
    });

    // 애니메이션 종료 후 클래스 제거
    setTimeout(() => {
      overlayBoxes.forEach(box => {
        box.classList.remove('pulse');
      });
    }, 600);
  }
});

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
// 키보드 이벤트 차단 (디버그 모드에서)
// =============================================================================

const blockingEvents = ['keydown', 'keypress', 'keyup', 'input'];

blockingEvents.forEach(eventType => {
  window.addEventListener(eventType, (event) => {
    if (!debugMode) return;

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    // 토글 버튼이나 패널은 예외
    if (
      target === toggleButton ||
      target.closest('#debug-panel-toggle') ||
      target.closest('#debug-panel')
    ) {
      return;
    }

    // Cmd+D / Ctrl+D는 허용 (디버그 모드 토글용)
    if (eventType === 'keydown' && (event.metaKey || event.ctrlKey) && event.key === 'd') {
      return;
    }

    // ESC는 허용 (패널 닫기용)
    if (eventType === 'keydown' && event.key === 'Escape') {
      return;
    }

    // 키보드 입력 차단
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }, true); // 캡처링 단계에서 실행 (true)
});

// =============================================================================
// 디버그 오버레이 업데이트
// =============================================================================

function findInteractiveElements() {
  const selectors = [
    'button',
    'a',
    'input',
    'textarea',
    'select',
    '[role="button"]',
    '[role="link"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[onclick]',
    '[tabindex]:not([tabindex="-1"])',
    '[data-interactive="true"]',
  ];

  const elements = document.querySelectorAll(selectors.join(','));

  return Array.from(elements).filter(el => {
    // 디버그 토글 버튼과 패널은 제외
    if (el === toggleButton ||
        el.closest('#debug-panel-toggle') ||
        el.closest('#debug-panel') ||
        el.closest('#debug-overlay-layer')) {
      return false;
    }

    // 보이는 요소만
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
}

function createOverlayBox(element) {
  const box = document.createElement('div');
  box.className = 'debug-interactive-box';

  // 요소 정보 라벨 생성
  const label = document.createElement('div');
  label.className = 'debug-box-label';

  // 태그 이름
  let tagName = element.tagName.toLowerCase();

  // ID가 있으면 추가
  if (element.id) {
    tagName += `#${element.id}`;
  }

  // 클래스가 있으면 첫 번째만 추가
  if (element.className && typeof element.className === 'string') {
    const firstClass = element.className.split(' ').filter(c => c.trim())[0];
    if (firstClass) {
      tagName += `.${firstClass}`;
    }
  }

  // role이 있으면 추가
  const role = element.getAttribute('role');
  if (role) {
    tagName += `[${role}]`;
  }

  label.textContent = tagName;
  box.appendChild(label);

  box.dataset.debugBoxFor = element.tagName.toLowerCase();

  // 박스 클릭 시 해당 요소의 디버그 패널 표시
  box.addEventListener('click', (event) => {
    event.stopPropagation();

    const layers = getLayersForElement(element);
    if (layers.length === 0) {
      console.warn('[Debug Panel] No React component found for this element');
      return;
    }

    showPanel(element, layers);
  });

  // 박스에 마우스오버 시 하이라이트
  box.addEventListener('mouseenter', () => {
    box.classList.add('hover');
  });

  box.addEventListener('mouseleave', () => {
    box.classList.remove('hover');
  });

  return box;
}

function updateBoxPosition(box, element) {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);

  box.style.left = `${rect.left}px`;
  box.style.top = `${rect.top}px`;
  box.style.width = `${rect.width}px`;
  box.style.height = `${rect.height}px`;

  // 요소의 border-radius를 그대로 복사
  box.style.borderRadius = computedStyle.borderRadius;
}

function updateOverlay() {
  if (!debugMode) return;

  // 현재 인터랙티브 요소들 찾기
  interactiveElements = findInteractiveElements();

  // 기존 박스들 제거
  overlayBoxes.forEach((box, element) => {
    if (!interactiveElements.includes(element)) {
      box.remove();
      overlayBoxes.delete(element);
    }
  });

  // 새 박스들 생성 및 업데이트
  interactiveElements.forEach(element => {
    let box = overlayBoxes.get(element);

    if (!box) {
      box = createOverlayBox(element);
      overlayLayer.appendChild(box);
      overlayBoxes.set(element, box);
    }

    updateBoxPosition(box, element);
  });
}

function scheduleOverlayUpdate() {
  if (updateOverlayTimer) {
    cancelAnimationFrame(updateOverlayTimer);
  }
  updateOverlayTimer = requestAnimationFrame(updateOverlay);
}

// =============================================================================
// 디버그 모드 토글
// =============================================================================

function toggleDebugMode() {
  debugMode = !debugMode;

  if (debugMode) {
    toggleButton.textContent = 'Debug ON';
    toggleButton.classList.add('active');
    document.body.setAttribute('data-debug-mode', 'true');

    // 오버레이 레이어 추가
    document.body.appendChild(overlayLayer);
    updateOverlay();

    // 스크롤/리사이즈 시 업데이트
    window.addEventListener('scroll', scheduleOverlayUpdate, true);
    window.addEventListener('resize', scheduleOverlayUpdate);

    // DOM 변경 감지 (MutationObserver)
    const observer = new MutationObserver(scheduleOverlayUpdate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
    window.__debugOverlayObserver = observer;
  } else {
    toggleButton.textContent = 'Debug OFF';
    toggleButton.classList.remove('active');
    document.body.removeAttribute('data-debug-mode');

    // 오버레이 레이어 제거
    if (overlayLayer.parentNode) {
      overlayLayer.parentNode.removeChild(overlayLayer);
    }

    // 모든 박스 제거
    overlayBoxes.forEach(box => box.remove());
    overlayBoxes.clear();
    interactiveElements = [];

    // 이벤트 리스너 제거
    window.removeEventListener('scroll', scheduleOverlayUpdate, true);
    window.removeEventListener('resize', scheduleOverlayUpdate);

    // MutationObserver 제거
    if (window.__debugOverlayObserver) {
      window.__debugOverlayObserver.disconnect();
      delete window.__debugOverlayObserver;
    }

    clearOverlay();
    closePanel();
  }
}

// =============================================================================
// Overlay 제거
// =============================================================================

function clearOverlay() {
  if (!currentTarget) return;

  // 기존 data-debug-target 제거 (레거시)
  const current = document.querySelector('[data-debug-target]');
  if (current) delete current.dataset['debugTarget'];

  // 모든 hover 클래스 제거
  overlayBoxes.forEach(box => {
    box.classList.remove('hover');
  });

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
