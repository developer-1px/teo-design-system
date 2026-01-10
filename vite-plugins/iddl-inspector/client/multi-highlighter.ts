/**
 * IDDL Inspector - Multi Highlighter
 *
 * 필터 레벨에 맞는 모든 컴포넌트에 동시에 outline 표시:
 * - React Fiber 트리 순회
 * - DOM 요소 찾기
 * - Overlay + Label 생성
 */

import { getFilterColor, getCurrentFilterLevel, FilterLevel } from './filter-state';
import { getComponentName } from './inspector';

interface Fiber {
  type: any;
  elementType: any;
  child: Fiber | null;
  sibling: Fiber | null;
  return: Fiber | null;
  memoizedProps: any;
  stateNode: any;
  _debugInfo?: any;
}

interface ComponentHighlight {
  componentName: string;
  element: HTMLElement;
  overlay: HTMLDivElement;
  label: HTMLDivElement;
  fiber: Fiber;
  isSelected: boolean;
}

let activeHighlights: ComponentHighlight[] = [];
let selectedIndex: number | null = null;

/**
 * Fiber에서 DOM 요소 찾기
 */
function findDOMNode(fiber: Fiber): HTMLElement | null {
  // stateNode이 HTMLElement면 직접 반환
  if (fiber.stateNode && fiber.stateNode instanceof HTMLElement) {
    return fiber.stateNode;
  }

  // 자식 Fiber 탐색
  let child = fiber.child;
  while (child) {
    const node = findDOMNode(child);
    if (node) return node;
    child = child.sibling;
  }

  return null;
}

/**
 * 컴포넌트 타입 판별
 */
function getComponentType(fiber: Fiber): FilterLevel | null {
  const name = getComponentName(fiber);

  // Page
  if (name === 'Page' || name.startsWith('App')) {
    return FilterLevel.Page;
  }

  // Section
  if (name === 'Section') {
    return FilterLevel.Section;
  }

  // Group
  if (name === 'Group') {
    return FilterLevel.Group;
  }

  // Atom (Field, Action, Text)
  if (name === 'Field' || name === 'Action' || name === 'Text') {
    return FilterLevel.Atom;
  }

  return null;
}

/**
 * Fiber 트리 순회하여 필터 레벨에 맞는 컴포넌트 수집
 */
function collectComponentsByLevel(
  fiber: Fiber | null,
  targetLevel: FilterLevel,
  collected: Array<{ fiber: Fiber; name: string; element: HTMLElement }> = []
): Array<{ fiber: Fiber; name: string; element: HTMLElement }> {
  if (!fiber) return collected;

  const componentType = getComponentType(fiber);

  // 타겟 레벨에 맞으면 수집
  if (targetLevel === FilterLevel.All || componentType === targetLevel) {
    const element = findDOMNode(fiber);
    if (element) {
      collected.push({
        fiber,
        name: getComponentName(fiber),
        element,
      });
    }
  }

  // 자식 노드 순회
  let child = fiber.child;
  while (child) {
    collectComponentsByLevel(child, targetLevel, collected);
    child = child.sibling;
  }

  return collected;
}

/**
 * React Root Fiber 찾기
 */
function getRootFiber(): Fiber | null {
  const rootElement = document.getElementById('root');
  if (!rootElement) return null;

  const allKeys = Object.keys(rootElement);
  const fiberKey = allKeys.find((key) => key.startsWith('__react'));
  if (!fiberKey) return null;

  const fiberRoot = (rootElement as any)[fiberKey];

  // Fiber 트리의 시작점 찾기
  let fiber: Fiber | null = null;

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

/**
 * Overlay + Label 생성
 */
function createOverlayForElement(
  element: HTMLElement,
  componentName: string,
  color: string,
  isSelected: boolean = false,
  onClickCallback?: () => void
): { overlay: HTMLDivElement; label: HTMLDivElement } {
  const rect = element.getBoundingClientRect();

  // 선택 여부에 따라 색상 강도 조절
  const borderColor = isSelected ? color : `${color}40`; // 선택 안됨: 25% opacity
  const backgroundColor = isSelected ? `${color}33` : `${color}0D`; // 선택 안됨: 5% opacity

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'iddl-inspector-highlight-overlay';
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

  // 클릭 이벤트 추가
  if (onClickCallback) {
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      onClickCallback();
    });
  }

  // Label
  const label = document.createElement('div');
  label.className = 'iddl-inspector-highlight-label';
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
    opacity: ${isSelected ? '1' : '0.7'};
    top: ${rect.top - 20}px;
    left: ${rect.left}px;
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(label);

  return { overlay, label };
}

/**
 * 모든 하이라이트 업데이트 (스크롤/리사이즈 대응)
 */
function updateHighlightPositions(): void {
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

/**
 * 필터 레벨에 맞는 모든 컴포넌트 하이라이트
 */
export function highlightAllComponents(): { name: string; props: any; element: HTMLElement }[] {
  // 기존 하이라이트 제거
  clearAllHighlights();

  const filterLevel = getCurrentFilterLevel();
  const color = getFilterColor(filterLevel);

  // Root Fiber 찾기
  const rootFiber = getRootFiber();
  if (!rootFiber) {
    console.warn('[Multi Highlighter] Root fiber not found');
    return [];
  }

  // 필터 레벨에 맞는 컴포넌트 수집
  const components = collectComponentsByLevel(rootFiber, filterLevel);

  console.log(`[Multi Highlighter] Found ${components.length} components for level: ${filterLevel}`);

  // 각 컴포넌트에 overlay 생성
  components.forEach((component, index) => {
    const { overlay, label } = createOverlayForElement(
      component.element,
      component.name,
      color,
      false,
      () => {
        // overlay 클릭 시 해당 컴포넌트 선택
        selectComponent(index);
        // 패널 업데이트를 위해 이벤트 발생
        window.dispatchEvent(new CustomEvent('iddl-component-selected', { detail: { index } }));
      }
    );

    activeHighlights.push({
      componentName: component.name,
      element: component.element,
      overlay,
      label,
      fiber: component.fiber,
      isSelected: false,
    });
  });

  // 스크롤/리사이즈 이벤트 리스너 등록
  window.addEventListener('scroll', updateHighlightPositions, true);
  window.addEventListener('resize', updateHighlightPositions);

  // 컴포넌트 정보 반환 (패널 업데이트용)
  return components.map((c) => ({
    name: c.name,
    props: c.fiber.memoizedProps || {},
    element: c.element,
  }));
}

/**
 * 모든 하이라이트 제거
 */
export function clearAllHighlights(): void {
  activeHighlights.forEach((highlight) => {
    highlight.overlay.remove();
    highlight.label.remove();
  });

  activeHighlights = [];
  selectedIndex = null;

  window.removeEventListener('scroll', updateHighlightPositions, true);
  window.removeEventListener('resize', updateHighlightPositions);
}

/**
 * 현재 하이라이트 개수 반환
 */
export function getHighlightCount(): number {
  return activeHighlights.length;
}

/**
 * 컴포넌트 선택
 */
export function selectComponent(index: number): void {
  if (index < 0 || index >= activeHighlights.length) return;

  const filterLevel = getCurrentFilterLevel();
  const color = getFilterColor(filterLevel);

  // 기존 선택 해제
  if (selectedIndex !== null && selectedIndex < activeHighlights.length) {
    const prevHighlight = activeHighlights[selectedIndex];
    prevHighlight.isSelected = false;
    prevHighlight.overlay.style.border = `2px solid ${color}40`;
    prevHighlight.overlay.style.background = `${color}0D`;
    prevHighlight.label.style.opacity = '0.7';
  }

  // 새로운 컴포넌트 선택
  const highlight = activeHighlights[index];
  highlight.isSelected = true;
  selectedIndex = index;

  // 하이라이트 스타일 업데이트
  highlight.overlay.style.border = `2px solid ${color}`;
  highlight.overlay.style.background = `${color}33`;
  highlight.label.style.opacity = '1';

  // 요소로 스크롤
  highlight.element.scrollIntoView({ behavior: 'smooth', block: 'center' });

  console.log('[Multi Highlighter] Component selected:', index, getSelectedComponentDetails());
}

/**
 * 선택 해제
 */
export function clearSelection(): void {
  if (selectedIndex === null || selectedIndex >= activeHighlights.length) return;

  const filterLevel = getCurrentFilterLevel();
  const color = getFilterColor(filterLevel);

  const highlight = activeHighlights[selectedIndex];
  highlight.isSelected = false;
  highlight.overlay.style.border = `2px solid ${color}40`;
  highlight.overlay.style.background = `${color}0D`;
  highlight.label.style.opacity = '0.7';

  selectedIndex = null;
}

/**
 * 현재 선택된 컴포넌트 인덱스 반환
 */
export function getSelectedIndex(): number | null {
  return selectedIndex;
}

/**
 * 선택된 컴포넌트의 상세 정보 반환
 */
export function getSelectedComponentDetails(): {
  fileName: string;
  lineNumber: string;
  reactCode: string;
  htmlCode: string;
} | null {
  if (selectedIndex === null || selectedIndex >= activeHighlights.length) {
    return null;
  }

  const highlight = activeHighlights[selectedIndex];
  const fiber = highlight.fiber;

  // 파일명 및 라인 정보 추출
  let fileName = 'Unknown.tsx';
  let lineNumber = '';

  // React 19의 _debugSource 또는 _debugInfo 확인
  if (fiber._debugSource) {
    const source = fiber._debugSource;
    if (source.fileName) {
      // 전체 경로에서 파일명만 추출
      const parts = source.fileName.split('/');
      fileName = parts[parts.length - 1];

      // 라인 정보
      if (source.lineNumber) {
        lineNumber = `:${source.lineNumber}`;
        if (source.columnNumber) {
          lineNumber += `:${source.columnNumber}`;
        }
      }
    }
  } else if (fiber._debugInfo) {
    // React 19 새로운 방식
    console.log('[Multi Highlighter] _debugInfo:', fiber._debugInfo);
  }

  // React 코드 생성 (JSX)
  const componentName = highlight.componentName;
  const props = fiber.memoizedProps || {};

  // 우선순위 있는 props 먼저
  const priorityKeys = ['role', 'prominence', 'intent', 'density', 'layout', 'direction', 'gridArea'];
  const otherKeys = Object.keys(props)
    .filter((key) =>
      !priorityKeys.includes(key) &&
      key !== 'children' &&
      key !== 'ref' &&
      key !== 'key' &&
      key !== 'className' &&
      !key.startsWith('on') &&
      !key.startsWith('data-') &&
      !key.startsWith('aria-') &&
      !key.startsWith('computed')
    );

  const allKeys = [...priorityKeys.filter(k => k in props), ...otherKeys];

  const propsStr = allKeys
    .map((key) => {
      const value = props[key];
      if (value === undefined || value === null) return null;

      if (typeof value === 'string') {
        return `${key}="${value}"`;
      } else if (typeof value === 'number') {
        return `${key}={${value}}`;
      } else if (typeof value === 'boolean' && value === true) {
        return key;
      } else if (typeof value === 'object') {
        // 객체는 간략하게 표시
        return `${key}={{...}}`;
      }
      return null;
    })
    .filter(Boolean)
    .join(' ');

  const reactCode = propsStr ? `<${componentName} ${propsStr} />` : `<${componentName} />`;

  // HTML 코드 추출 (더 읽기 쉽게 포맷팅)
  let htmlCode = highlight.element.outerHTML;

  // 긴 속성값 제거하여 가독성 향상
  htmlCode = htmlCode
    .replace(/\s+/g, ' ') // 연속된 공백 제거
    .replace(/style="[^"]*"/g, 'style="..."') // style 속성 간략화
    .replace(/class="([^"]{50,}?)"/g, 'class="..."') // 긴 class 간략화
    .substring(0, 800); // 최대 800자

  return {
    fileName,
    lineNumber,
    reactCode,
    htmlCode,
  };
}
