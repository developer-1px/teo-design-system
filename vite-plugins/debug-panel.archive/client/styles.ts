/**
 * CSS styles for Debug Panel
 */

export const CSS_STYLES = `
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
  content: 'DEBUG: BTN' !important;
}

/* IDDL Component Type Colors */
/* Page - Purple */
.debug-iddl-page {
  border: 2px solid rgba(139, 92, 246, 0.4) !important;
  background: rgba(139, 92, 246, 0.05) !important;
}

.debug-iddl-page.hover {
  border-color: rgba(139, 92, 246, 0.8) !important;
  background: rgba(139, 92, 246, 0.12) !important;
}

.debug-iddl-page .debug-box-label {
  background: rgba(139, 92, 246, 0.95) !important;
  font-weight: 600 !important;
}

/* Section - Blue */
.debug-iddl-section {
  border: 2px solid rgba(59, 130, 246, 0.4) !important;
  background: rgba(59, 130, 246, 0.05) !important;
}

.debug-iddl-section.hover {
  border-color: rgba(59, 130, 246, 0.8) !important;
  background: rgba(59, 130, 246, 0.12) !important;
}

.debug-iddl-section .debug-box-label {
  background: rgba(59, 130, 246, 0.95) !important;
  font-weight: 600 !important;
}

/* Group - Cyan */
.debug-iddl-group {
  border: 2px solid rgba(6, 182, 212, 0.4) !important;
  background: rgba(6, 182, 212, 0.05) !important;
}

.debug-iddl-group.hover {
  border-color: rgba(6, 182, 212, 0.8) !important;
  background: rgba(6, 182, 212, 0.12) !important;
}

.debug-iddl-group .debug-box-label {
  background: rgba(6, 182, 212, 0.95) !important;
  font-weight: 500 !important;
}

/* Action - Orange */
.debug-iddl-action {
  border: 2px solid rgba(249, 115, 22, 0.4) !important;
  background: rgba(249, 115, 22, 0.05) !important;
}

.debug-iddl-action.hover {
  border-color: rgba(249, 115, 22, 0.8) !important;
  background: rgba(249, 115, 22, 0.12) !important;
}

.debug-iddl-action .debug-box-label {
  background: rgba(249, 115, 22, 0.95) !important;
  font-weight: 500 !important;
}

/* Item - Green */
.debug-iddl-item {
  border: 1px solid rgba(34, 197, 94, 0.4) !important;
  background: rgba(34, 197, 94, 0.05) !important;
}

.debug-iddl-item.hover {
  border-color: rgba(34, 197, 94, 0.8) !important;
  background: rgba(34, 197, 94, 0.12) !important;
}

.debug-iddl-item .debug-box-label {
  background: rgba(34, 197, 94, 0.95) !important;
}

/* Field - Amber */
.debug-iddl-field {
  border: 1px solid rgba(245, 158, 11, 0.4) !important;
  background: rgba(245, 158, 11, 0.05) !important;
}

.debug-iddl-field.hover {
  border-color: rgba(245, 158, 11, 0.8) !important;
  background: rgba(245, 158, 11, 0.12) !important;
}

.debug-iddl-field .debug-box-label {
  background: rgba(245, 158, 11, 0.95) !important;
}

/* Text - Pink */
.debug-iddl-text {
  border: 1px solid rgba(236, 72, 153, 0.4) !important;
  background: rgba(236, 72, 153, 0.05) !important;
}

.debug-iddl-text.hover {
  border-color: rgba(236, 72, 153, 0.8) !important;
  background: rgba(236, 72, 153, 0.12) !important;
}

.debug-iddl-text .debug-box-label {
  background: rgba(236, 72, 153, 0.95) !important;
}

/* Overlay - Red */
.debug-iddl-overlay {
  border: 2px solid rgba(239, 68, 68, 0.4) !important;
  background: rgba(239, 68, 68, 0.05) !important;
}

.debug-iddl-overlay.hover {
  border-color: rgba(239, 68, 68, 0.8) !important;
  background: rgba(239, 68, 68, 0.12) !important;
}

.debug-iddl-overlay .debug-box-label {
  background: rgba(239, 68, 68, 0.95) !important;
  font-weight: 600 !important;
}

/* Debug mode 1 indicator */
body[data-debug-mode="1"]::before {
  background: rgba(139, 92, 246, 0.95) !important;
  content: 'DEBUG: IDDL' !important;
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

/* 디버그 패널만 일반 커서 */
body[data-debug-mode="1"] #debug-panel,
body[data-debug-mode="1"] #debug-panel *,
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

/* Props 토글 버튼 */
.debug-panel-props-toggle {
  display: block !important;
  width: 100% !important;
  margin-top: 4px !important;
  padding: 3px 6px !important;
  background: #f5f5f5 !important;
  border: 1px solid #e5e5e5 !important;
  border-radius: 3px !important;
  font-size: 10px !important;
  font-weight: 500 !important;
  color: #525252 !important;
  cursor: pointer !important;
  text-align: left !important;
  transition: all 0.1s !important;
}

.debug-panel-props-toggle:hover {
  background: #e5e5e5 !important;
  color: #171717 !important;
}

.debug-panel-props-toggle[aria-expanded="true"] {
  background: #e0f2fe !important;
  border-color: #bae6fd !important;
  color: #0369a1 !important;
}

/* Props 컨테이너 */
.debug-panel-props-container {
  margin-top: 4px !important;
  padding: 6px !important;
  background: #fafafa !important;
  border: 1px solid #e5e5e5 !important;
  border-radius: 3px !important;
  overflow: auto !important;
  max-height: 200px !important;
}

/* Props JSON */
.debug-panel-props-json {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 9px !important;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace !important;
  line-height: 1.5 !important;
  color: #404040 !important;
  white-space: pre !important;
  overflow-x: auto !important;
}
`;

/**
 * Inject styles into document head
 */
export function injectStyles(): void {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute('data-vite-dev-id', 'debug-panel');
  style.innerHTML = CSS_STYLES;
  document.head.appendChild(style);
}
