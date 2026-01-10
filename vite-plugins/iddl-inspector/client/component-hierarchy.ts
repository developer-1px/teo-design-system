/**
 * IDDL Inspector - Component Hierarchy Extractor
 *
 * 클릭한 DOM 요소에서 React Fiber 트리를 추출하여
 * 해당 위치의 모든 컴포넌트 계층구조를 반환
 */

import { getComponentName, shouldRenderFiber } from './inspector';

interface Fiber {
  type: any;
  elementType: any;
  child: Fiber | null;
  sibling: Fiber | null;
  return: Fiber | null;
  memoizedProps: any;
  stateNode: any;
  _debugInfo?: any;
  _debugSource?: {
    fileName: string;
    lineNumber: number;
    columnNumber: number;
  };
}

export interface ComponentInfo {
  name: string;
  role?: string;
  props: Record<string, any>;
  className?: string;
  filePath?: string;
  fiber: Fiber;
  element: HTMLElement;
}

/**
 * DOM 요소에서 React Fiber 찾기
 */
function getFiberFromElement(element: HTMLElement): Fiber | null {
  const allKeys = Object.keys(element);
  const fiberKey = allKeys.find((key) => key.startsWith('__reactFiber'));

  if (!fiberKey) {
    console.warn('[Component Hierarchy] No React Fiber found on element:', element);
    return null;
  }

  return (element as any)[fiberKey];
}

/**
 * Fiber에서 파일 경로 추출
 */
function getFilePath(fiber: Fiber): string | undefined {
  // React 19의 _debugSource 사용
  if (fiber._debugSource?.fileName) {
    return fiber._debugSource.fileName;
  }

  // _debugInfo 탐색 (fallback)
  if (fiber._debugInfo) {
    const debugInfo = Array.isArray(fiber._debugInfo) ? fiber._debugInfo[0] : fiber._debugInfo;
    if (debugInfo?.source) {
      return debugInfo.source;
    }
  }

  return undefined;
}

/**
 * Fiber 트리를 위로 순회하여 모든 컴포넌트 수집
 *
 * @param fiber - 시작 Fiber 노드
 * @returns 컴포넌트 계층구조 배열 (자식 → 부모 순서)
 */
export function extractComponentHierarchy(element: HTMLElement): ComponentInfo[] {
  const fiber = getFiberFromElement(element);
  if (!fiber) {
    return [];
  }

  const hierarchy: ComponentInfo[] = [];
  let currentFiber: Fiber | null = fiber;

  while (currentFiber) {
    // React 컴포넌트만 포함
    if (shouldRenderFiber(currentFiber)) {
      const name = getComponentName(currentFiber);
      const props = { ...currentFiber.memoizedProps };
      const role = props.role;
      const className = props.className;
      const filePath = getFilePath(currentFiber);

      // children, ref, key 제외
      delete props.children;
      delete props.ref;
      delete props.key;

      hierarchy.push({
        name,
        role,
        props,
        className,
        filePath,
        fiber: currentFiber,
        element:
          currentFiber.stateNode instanceof HTMLElement
            ? currentFiber.stateNode
            : (element as HTMLElement),
      });
    }

    currentFiber = currentFiber.return;
  }

  return hierarchy;
}

/**
 * ComponentInfo를 읽기 쉬운 문자열로 변환
 */
export function formatComponentInfo(info: ComponentInfo): string {
  let result = `Component: ${info.name}\n`;

  if (info.filePath) {
    result += `File: ${info.filePath}\n`;
  }

  if (info.className) {
    result += `\nTailwind CSS:\n${info.className}\n`;
  }

  result += `\nProps:\n`;
  for (const [key, value] of Object.entries(info.props)) {
    if (typeof value === 'function') {
      result += `  ${key}: [Function]\n`;
    } else if (typeof value === 'object' && value !== null) {
      try {
        const serialized = JSON.stringify(value, null, 2);
        if (serialized.length > 100) {
          result += `  ${key}: ${JSON.stringify(value)}\n`;
        } else {
          result += `  ${key}: ${serialized}\n`;
        }
      } catch {
        result += `  ${key}: [Object]\n`;
      }
    } else {
      result += `  ${key}: ${JSON.stringify(value)}\n`;
    }
  }

  return result;
}
