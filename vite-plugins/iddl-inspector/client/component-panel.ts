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
  const panelWidth = 800;
  const panelHeight = Math.min(window.innerHeight * 0.8, 800);

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
 * IDDL Role 별 아이콘 반환
 */
function getRoleIcon(role?: string, name?: string): string {
  if (!role) {
    if (name === 'Page') return '📄';
    if (name === 'Section') return '📦';
    if (name === 'Group') return '🗂️';
    if (name === 'Action') return '⚡';
    if (name === 'Text') return '📝';
    if (name === 'Field') return '📥';
    return '🧩';
  }

  const r = role.toLowerCase();
  if (r.includes('page') || r.includes('application')) return '📄';
  if (r.includes('sidebar') || r.includes('nav') || r.includes('aside')) return '📂';
  if (r.includes('editor')) return '💻';
  if (r.includes('panel') || r.includes('footer')) return '🖥️';
  if (r.includes('toolbar')) return '🛠️';
  if (r.includes('button') || r.includes('action')) return '⚡';
  if (r.includes('input') || r.includes('field')) return '📥';
  if (r.includes('text') || r.includes('title') || r.includes('body')) return '📝';
  if (r.includes('card') || r.includes('container')) return '🗂️';
  if (r.includes('grid') || r.includes('list')) return '📋';

  return '🧩';
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
    .map((info, index) => {
      const icon = getRoleIcon(info.role, info.name);
      const label = info.role ? `{${info.role}}` : info.name;

      return `
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
      <div style="font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 14px;">${icon}</span>
        <span style="color: ${info.role ? '#3b82f6' : '#61afef'};">
          ${label}
        </span>
        ${info.role ? `<span style="font-size: 11px; color: #666; font-weight: 400;">(${info.name})</span>` : ''}
      </div>
      ${
        info.filePath
          ? `<div style="font-size: 11px; color: #888; margin-top: 4px; padding-left: 22px;">
          ${info.filePath}
        </div>`
          : ''
      }
    </div>
  `;
    })
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
 * 요소의 Computed Style 추출하여 HTML로 반환
 */
function getComputedStylesHtml(element: HTMLElement): string {
  const styles = window.getComputedStyle(element);
  const relevantProps = [
    'display',
    'position',
    'flex-direction',
    'justify-content',
    'align-items',
    'width',
    'height',
    'margin',
    'padding',
    'gap',
    'background-color',
    'color',
    'font-size',
    'font-weight',
    'border',
    'border-radius',
    'box-shadow',
    'opacity',
    'z-index',
  ];

  let html =
    '<div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 11px;">';

  relevantProps.forEach((prop) => {
    const value = styles.getPropertyValue(prop);
    if (
      value &&
      value !== 'initial' &&
      value !== 'none' &&
      value !== 'normal' &&
      value !== '0px' &&
      value !== 'rgba(0, 0, 0, 0)'
    ) {
      html += `
        <div style="color: #9cdcfe;">${prop}:</div>
        <div style="color: #ce9178; word-break: break-all;">${value};</div>
      `;
    }
  });

  html += '</div>';
  return html;
}

/**
 * 상세 정보 렌더링
 */
function renderDetailsView(info: ComponentInfo): void {
  if (!panelDiv) return;

  currentMode = 'details';

  const formattedInfo = formatComponentInfo(info);
  const cssHtml = getComputedStylesHtml(info.element);

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
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="font-size: 14px; font-weight: 600; color: #3b82f6;">
              ${info.role ? `{${info.role}}` : info.name}
            </div>
            ${info.role ? `<div style="font-size: 11px; color: #888;">(${info.name})</div>` : ''}
          </div>
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
        >Copy JSX</button>
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
    <div style="display: flex; flex: 1; overflow: hidden;">
      <div style="
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        font-size: 12px;
        line-height: 1.6;
        white-space: pre-wrap;
        font-family: 'JetBrains Mono', monospace;
        border-right: 1px solid #404040;
      ">${formattedInfo}</div>

      <div style="
        width: 300px;
        padding: 16px;
        overflow-y: auto;
        background: #1a1a1a;
      ">
        <div style="font-size: 12px; font-weight: 600; color: #3b82f6; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
          <span>🎨</span> Computed Styles
        </div>
        ${cssHtml}
      </div>
    </div>
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
          btn.textContent = 'Copy JSX';
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
