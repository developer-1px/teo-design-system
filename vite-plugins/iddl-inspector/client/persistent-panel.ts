/**
 * IDDL Inspector - Persistent Panel UI
 *
 * 항상 화면에 표시되는 작은 패널:
 * - 현재 필터 레벨 표시
 * - 컴포넌트 리스트 표시
 * - 드래그 가능
 */

import {
  type FilterLevel,
  getAllFilterLevels,
  getCurrentFilterLevel,
  getFilterConfig,
} from './filter-state';
import {
  getSelectedComponentDetails,
  getSelectedIndex,
  selectComponent,
} from './multi-highlighter';

interface ComponentListItem {
  name: string;
  props: Record<string, any>;
  element: HTMLElement;
}

let panelDiv: HTMLDivElement | null = null;
let isVisible = false;
let currentComponents: ComponentListItem[] = [];

/**
 * Persistent Panel 생성
 */
function createPersistentPanel(): HTMLDivElement {
  const div = document.createElement('div');
  div.id = 'iddl-inspector-persistent-panel';

  // 초기 위치: 우측 상단
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

  // 드래그 기능 추가
  setupDragFunctionality(div);

  return div;
}

/**
 * 드래그 기능 설정
 */
function setupDragFunctionality(panel: HTMLDivElement): void {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  // Header에만 드래그 적용
  const header = panel.querySelector('#iddl-panel-header') as HTMLElement;
  if (!header) return;

  header.style.cursor = 'move';
  header.style.userSelect = 'none';

  header.addEventListener('mousedown', (e: MouseEvent) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const rect = panel.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    header.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // right 대신 left 사용
    panel.style.right = 'auto';
    panel.style.left = `${initialLeft + deltaX}px`;
    panel.style.top = `${initialTop + deltaY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      header.style.cursor = 'move';
    }
  });
}

/**
 * Panel 내용 업데이트
 */
export function updatePanelContent(components: ComponentListItem[]): void {
  if (!panelDiv) return;

  currentComponents = components;
  const filterLevel = getCurrentFilterLevel();
  const config = getFilterConfig(filterLevel);

  // Header
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

  // Component List
  const selectedIdx = getSelectedIndex();
  const listItems = components
    .map((item, index) => {
      const isSelected = selectedIdx === index;

      // Props를 1줄로 표시
      const propsText = [
        item.props.role ? `role="${item.props.role}"` : null,
        item.props.prominence ? `prominence="${item.props.prominence}"` : null,
      ]
        .filter(Boolean)
        .join(' ');

      return `
    <div
      data-component-index="${index}"
      class="component-list-item"
      style="
        padding: 8px 16px;
        border-bottom: 1px solid #2a2a2a;
        cursor: pointer;
        transition: background 0.15s;
        background: ${isSelected ? 'rgba(0, 0, 0, 0.4)' : 'transparent'};
        font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
      "
    >
      <div style="font-size: 11px; color: ${config.color};">
        <span style="font-weight: 600;">&lt;${item.name}</span>${propsText ? ` <span style="color: #888;">${propsText}</span>` : ''}<span style="font-weight: 600;"> /&gt;</span>
      </div>
    </div>
  `;
    })
    .join('');

  // Details Section (선택된 컴포넌트 상세 정보)
  const details = getSelectedComponentDetails();
  let detailsSection = '';
  if (details) {
    const fileLocation = `${details.fileName}${details.lineNumber}`;
    const combinedCode = `// ${fileLocation}\n${details.reactCode}\n\n// HTML\n${details.htmlCode}`;
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

  // Footer
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

  panelDiv.innerHTML =
    header +
    `<div style="overflow-y: auto; flex: 1;">${listItems || '<div style="padding: 16px; text-align: center; color: #666;">No components found</div>'}</div>` +
    detailsSection +
    footer;

  // 이벤트 리스너 등록
  panelDiv.querySelector('#iddl-close-panel-btn')?.addEventListener('click', () => {
    hidePanel();
  });

  // Drag 기능 재설정
  setupDragFunctionality(panelDiv);

  // 각 컴포넌트 항목에 hover/click 이벤트
  components.forEach((item, index) => {
    const itemEl = panelDiv?.querySelector(`[data-component-index="${index}"]`) as HTMLElement;
    if (!itemEl) return;

    const selectedIdx = getSelectedIndex();
    const isSelected = selectedIdx === index;

    itemEl.addEventListener('mouseenter', () => {
      if (!isSelected) {
        itemEl.style.background = 'rgba(0, 0, 0, 0.25)';
      }
    });

    itemEl.addEventListener('mouseleave', () => {
      if (!isSelected) {
        itemEl.style.background = 'transparent';
      }
    });

    itemEl.addEventListener('click', () => {
      // 컴포넌트 선택 (하이라이트 강조 + 스크롤)
      selectComponent(index);
      // 패널 내용 업데이트하여 선택 상태 반영
      updatePanelContent(currentComponents);
    });
  });
}

/**
 * Panel 표시
 */
export function showPanel(): void {
  if (isVisible) return;

  if (!panelDiv) {
    panelDiv = createPersistentPanel();
  } else {
    panelDiv.style.display = 'flex';
  }

  isVisible = true;
  updatePanelContent(currentComponents);
}

/**
 * Panel 숨기기
 */
export function hidePanel(): void {
  if (!isVisible || !panelDiv) return;

  panelDiv.style.display = 'none';
  isVisible = false;
}

/**
 * Panel 토글
 */
export function togglePanel(): void {
  if (isVisible) {
    hidePanel();
  } else {
    showPanel();
  }
}

/**
 * Panel 표시 여부 확인
 */
export function isPanelVisible(): boolean {
  return isVisible;
}

/**
 * Panel 초기화
 */
export function initPersistentPanel(): void {
  // overlay 클릭 시 패널 업데이트 (한 번만 등록)
  window.addEventListener('iddl-component-selected', () => {
    console.log('[Persistent Panel] Component selected event received');
    updatePanelContent(currentComponents);
  });

  console.log('[Persistent Panel] Event listener registered');
}
