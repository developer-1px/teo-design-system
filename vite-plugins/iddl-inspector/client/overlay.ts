/**
 * IDDL Inspector - Hover Outline Overlay
 *
 * 마우스 hover 시 요소에 outline 표시
 */

import { extractComponentHierarchy } from './component-hierarchy';

let overlayDiv: HTMLDivElement | null = null;
let tagBadge: HTMLDivElement | null = null;
let isActive = false;

/**
 * Overlay 생성
 */
function createOverlay(): HTMLDivElement {
  const div = document.createElement('div');
  div.id = 'iddl-inspector-overlay';
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

/**
 * Type Tag Badge 생성
 */
function createTagBadge(): HTMLDivElement {
  const badge = document.createElement('div');
  badge.id = 'iddl-inspector-tag';
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
 * 요소 위치에 맞춰 overlay 업데이트
 */
function updateOverlayPosition(element: HTMLElement, componentName?: string, role?: string): void {
  if (!overlayDiv) return;

  const rect = element.getBoundingClientRect();
  overlayDiv.style.top = `${rect.top}px`;
  overlayDiv.style.left = `${rect.left}px`;
  overlayDiv.style.width = `${rect.width}px`;
  overlayDiv.style.height = `${rect.height}px`;
  overlayDiv.style.display = 'block';

  // Tag Badge 업데이트
  if (tagBadge && (componentName || role)) {
    const icon = getRoleIcon(role, componentName);
    const label = role ? `{${role}}` : componentName;
    tagBadge.innerHTML = `<span style="margin-right: 4px;">${icon}</span>${label}`;
    tagBadge.style.top = `${rect.top - 20}px`;
    tagBadge.style.left = `${rect.left}px`;
    tagBadge.style.display = 'flex';
    tagBadge.style.alignItems = 'center';
  }
}

/**
 * Overlay 숨기기
 */
function hideOverlay(): void {
  if (overlayDiv) {
    overlayDiv.style.display = 'none';
  }
  if (tagBadge) {
    tagBadge.style.display = 'none';
  }
}

/**
 * Inspect 모드 활성화
 */
export function activateInspectMode(): void {
  if (isActive) return;

  if (!overlayDiv) {
    overlayDiv = createOverlay();
  }

  if (!tagBadge) {
    tagBadge = createTagBadge();
  }

  isActive = true;

  // 디버그 모드 시 cursor를 default로 고정
  document.body.style.cursor = 'default';
  // 모든 자식 요소의 cursor도 default로 강제
  const style = document.createElement('style');
  style.id = 'iddl-inspector-cursor-override';
  style.textContent = `
    * {
      cursor: default !important;
    }
  `;
  document.head.appendChild(style);

  // mousemove 이벤트로 hover 추적
  document.addEventListener('mousemove', handleMouseMove);
}

/**
 * Inspect 모드 비활성화
 */
export function deactivateInspectMode(): void {
  if (!isActive) return;

  isActive = false;
  hideOverlay();

  // cursor 스타일 복원
  document.body.style.cursor = '';
  const cursorStyle = document.getElementById('iddl-inspector-cursor-override');
  if (cursorStyle) {
    cursorStyle.remove();
  }

  document.removeEventListener('mousemove', handleMouseMove);
}

/**
 * Mouse move 핸들러
 */
function handleMouseMove(e: MouseEvent): void {
  if (!isActive) return;

  const element = e.target as HTMLElement;

  // Inspector UI 자체는 제외
  if (
    element.id === 'iddl-inspector-overlay' ||
    element.id === 'iddl-inspector-tag' ||
    element.id === 'iddl-inspector-panel' ||
    element.closest('#iddl-inspector-panel')
  ) {
    hideOverlay();
    return;
  }

  // 컴포넌트 정보 가져오기
  const hierarchy = extractComponentHierarchy(element);
  const first = hierarchy.length > 0 ? hierarchy[0] : undefined;
  const componentName = first?.name;
  const role = first?.role;

  updateOverlayPosition(element, componentName, role);
}

/**
 * Inspect 모드 활성 상태 확인
 */
export function isInspectModeActive(): boolean {
  return isActive;
}
