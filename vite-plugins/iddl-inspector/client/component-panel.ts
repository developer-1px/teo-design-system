/**
 * IDDL Inspector - Component Panel UI
 *
 * 컴포넌트 계층구조 목록과 상세 정보를 표시하는 UI
 *
 * Selection Pattern (표준 useSelection 패턴과 동일):
 * - Hover: 마우스를 올렸을 때만 표시 (매우 얇은 반투명 배경)
 * - Selection: 클릭하면 고정되어 유지 (accent 배경 + ring)
 */

import type { ComponentInfo } from './component-hierarchy';
import { formatComponentInfo } from './component-hierarchy';

let panelDiv: HTMLDivElement | null = null;
let currentMode: 'hierarchy' | 'details' = 'hierarchy';
let selectedComponent: ComponentInfo | null = null;
let selectedIndex: number | null = null; // 선택된 항목 인덱스
let hoveredIndex: number | null = null; // hover된 항목 인덱스
let clickedRect: DOMRect | null = null;
let currentHierarchy: ComponentInfo[] = [];

/**
 * Panel UI 생성
 */
function createPanel(rect: DOMRect): HTMLDivElement {
  const div = document.createElement('div');
  div.id = 'iddl-inspector-panel';

  // 패널 크기
  const panelWidth = 600;
  const panelHeight = Math.min(window.innerHeight * 0.8, 600);

  // 선택한 영역 근처에 배치 (우선순위: 오른쪽 > 왼쪽 > 아래 > 위)
  let top = rect.top;
  let left = rect.right + 10;

  // 오른쪽 공간이 부족하면 왼쪽에 배치
  if (left + panelWidth > window.innerWidth) {
    left = rect.left - panelWidth - 10;
  }

  // 왼쪽 공간도 부족하면 아래에 배치
  if (left < 0) {
    left = rect.left;
    top = rect.bottom + 10;
  }

  // 아래 공간도 부족하면 위에 배치
  if (top + panelHeight > window.innerHeight) {
    top = rect.top - panelHeight - 10;
  }

  // 화면 밖으로 나가지 않도록 조정
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

/**
 * 항목 스타일 업데이트 (hover + selection 패턴)
 */
function updateItemStyle(index: number): void {
  const item = panelDiv?.querySelector(`[data-component-index="${index}"]`) as HTMLElement;
  if (!item) return;

  const isSelected = index === selectedIndex;
  const isHovered = index === hoveredIndex;

  // 선택된 항목: 고정된 accent 배경 + ring
  if (isSelected) {
    item.style.background = 'rgba(59, 130, 246, 0.15)'; // accent/15
    item.style.boxShadow = 'inset 0 0 0 2px #3b82f6'; // ring-2 ring-accent
  }
  // Hover된 항목: 매우 얇은 반투명 배경
  else if (isHovered) {
    item.style.background = 'rgba(0, 0, 0, 0.02)'; // bg-black/[0.02]
    item.style.boxShadow = 'none';
  }
  // 일반 항목: 투명
  else {
    item.style.background = 'transparent';
    item.style.boxShadow = 'none';
  }
}

/**
 * 계층구조 목록 렌더링
 */
function renderHierarchyList(hierarchy: ComponentInfo[]): void {
  if (!panelDiv) return;

  currentMode = 'hierarchy';

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

  const listItems = hierarchy
    .map(
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
      ${
        info.filePath
          ? `<div style="font-size: 11px; color: #888; margin-top: 4px;">
          ${info.filePath}
        </div>`
          : ''
      }
      ${
        info.className
          ? `<div style="
          font-size: 11px;
          color: #98c379;
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        ">
          ${info.className}
        </div>`
          : ''
      }
    </div>
  `
    )
    .join('');

  panelDiv.innerHTML = header + `<div style="overflow-y: auto; flex: 1;">${listItems}</div>`;

  // 이벤트 리스너 등록
  panelDiv.querySelector('#iddl-close-panel')?.addEventListener('click', hidePanel);

  hierarchy.forEach((info, index) => {
    const item = panelDiv?.querySelector(`[data-component-index="${index}"]`) as HTMLElement;
    if (!item) return;

    // Hover 이벤트 (마우스 위치 추적)
    item.addEventListener('mouseenter', () => {
      const prevHovered = hoveredIndex;
      hoveredIndex = index;

      // 이전 hover 항목 스타일 업데이트
      if (prevHovered !== null) {
        updateItemStyle(prevHovered);
      }

      // 현재 hover 항목 스타일 업데이트
      updateItemStyle(index);
    });

    item.addEventListener('mouseleave', () => {
      if (hoveredIndex === index) {
        hoveredIndex = null;
        updateItemStyle(index);
      }
    });

    // Click 이벤트 (선택 고정)
    item.addEventListener('click', () => {
      const prevSelected = selectedIndex;
      selectedIndex = index;
      selectedComponent = info;

      // 이전 선택 항목 스타일 업데이트
      if (prevSelected !== null && prevSelected !== index) {
        updateItemStyle(prevSelected);
      }

      // 현재 선택 항목 스타일 업데이트
      updateItemStyle(index);

      // Detail View 표시
      renderDetailsView(info);
    });
  });

  // 초기 스타일 적용 (선택된 항목이 있으면)
  if (selectedIndex !== null) {
    updateItemStyle(selectedIndex);
  }
}

/**
 * 상세 정보 렌더링
 */
function renderDetailsView(info: ComponentInfo): void {
  if (!panelDiv) return;

  currentMode = 'details';

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
          ${
            info.filePath
              ? `<div style="font-size: 11px; color: #888; margin-top: 4px;">
            ${info.filePath}
          </div>`
              : ''
          }
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

  // 이벤트 리스너 등록
  panelDiv.querySelector('#iddl-back-button')?.addEventListener('click', () => {
    // 계층구조 목록으로 돌아가되, 선택 상태는 유지
    renderHierarchyList(currentHierarchy);
  });

  panelDiv.querySelector('#iddl-copy-button')?.addEventListener('click', () => {
    navigator.clipboard.writeText(formattedInfo).then(() => {
      const btn = panelDiv?.querySelector('#iddl-copy-button') as HTMLButtonElement;
      if (btn) {
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, 2000);
      }
    });
  });

  panelDiv.querySelector('#iddl-close-panel')?.addEventListener('click', hidePanel);
}

/**
 * Panel 표시 (계층구조 목록)
 */
export function showPanel(hierarchy: ComponentInfo[], rect: DOMRect): void {
  clickedRect = rect;
  currentHierarchy = hierarchy;

  if (!panelDiv) {
    panelDiv = createPanel(rect);
  }

  renderHierarchyList(hierarchy);
}

/**
 * Panel 숨기기
 */
export function hidePanel(): void {
  if (panelDiv) {
    panelDiv.remove();
    panelDiv = null;
  }
  currentMode = 'hierarchy';
  selectedComponent = null;
  selectedIndex = null; // 선택 상태 초기화
  hoveredIndex = null; // Hover 상태 초기화
  clickedRect = null;
  currentHierarchy = [];
}

/**
 * Panel 표시 여부 확인
 */
export function isPanelVisible(): boolean {
  return panelDiv !== null;
}
