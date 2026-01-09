/**
 * IDDL Inspector - React Tree to JSX Converter
 *
 * React Fiber 트리를 순회하여 JSX 형식의 문자열로 변환
 */

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

/**
 * React 컴포넌트 이름 추출
 */
function getComponentName(fiber: Fiber): string {
  if (!fiber) return 'Unknown';

  const { type, elementType } = fiber;

  // DOM 요소
  if (typeof type === 'string') {
    return type;
  }

  // 함수/클래스 컴포넌트
  if (typeof type === 'function') {
    return type.displayName || type.name || 'Anonymous';
  }

  // React 내장 타입
  if (typeof type === 'symbol') {
    const symbolString = type.toString();
    if (symbolString.includes('Fragment')) return 'Fragment';
    if (symbolString.includes('Provider')) return 'Provider';
    if (symbolString.includes('Consumer')) return 'Consumer';
    if (symbolString.includes('Suspense')) return 'Suspense';
    return 'React.SymbolComponent';
  }

  // Forward Ref, Memo 등
  if (elementType) {
    if (elementType.displayName) return elementType.displayName;
    if (elementType.name) return elementType.name;

    // Memo, ForwardRef 내부 컴포넌트 이름 추출
    if (elementType.render && typeof elementType.render === 'function') {
      return elementType.render.displayName || elementType.render.name || 'Unknown';
    }
    if (elementType.type && typeof elementType.type === 'function') {
      return elementType.type.displayName || elementType.type.name || 'Unknown';
    }
  }

  return 'Unknown';
}

/**
 * Props를 JSX 속성 문자열로 변환
 */
function propsToString(props: any): string {
  if (!props) return '';

  const relevantProps: string[] = [];

  // 중요한 props만 필터링
  for (const key in props) {
    // 제외할 props
    if (
      key === 'children' ||
      key === 'ref' ||
      key === 'key' ||
      key === 'className' || // HTML 관련 제외
      key.startsWith('data-') || // HTML data attributes 제외
      key.startsWith('aria-') // HTML aria attributes 제외
    ) continue;

    const value = props[key];

    // 함수, 객체, undefined, null은 제외
    if (
      typeof value === 'function' ||
      typeof value === 'object' ||
      value === undefined ||
      value === null
    ) continue;

    // IDDL 관련 중요한 props만 포함
    if (
      key === 'role' ||
      key === 'prominence' ||
      key === 'intent' ||
      key === 'density' ||
      key === 'layout' ||
      key === 'id'
    ) {
      if (typeof value === 'string') {
        relevantProps.push(`${key}="${value}"`);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        relevantProps.push(`${key}={${value}}`);
      }
    }
  }

  return relevantProps.length > 0 ? ' ' + relevantProps.join(' ') : '';
}

/**
 * Fiber 노드가 React 컴포넌트인지 확인 (HTML DOM 요소 제외)
 */
function isReactComponent(fiber: Fiber): boolean {
  if (!fiber) return false;

  const { type } = fiber;

  // HTML DOM 요소는 제외 (string type)
  if (typeof type === 'string') {
    return false;
  }

  // 함수/클래스 컴포넌트만 포함
  if (typeof type === 'function') {
    return true;
  }

  // Provider, Consumer 등 React 특수 타입 포함
  if (typeof type === 'object' && type !== null) {
    return true;
  }

  return false;
}

/**
 * Fiber 노드가 렌더링할 가치가 있는지 확인
 */
function shouldRenderFiber(fiber: Fiber): boolean {
  if (!fiber) return false;

  // React 컴포넌트만 렌더링
  if (!isReactComponent(fiber)) return false;

  const name = getComponentName(fiber);

  // Fragment는 스킵 (자식만 렌더링)
  if (name === 'Fragment') return false;

  // React 내부 컴포넌트는 스킵
  if (name.startsWith('React.')) return false;

  // Context Provider/Consumer는 스킵 (의미 없음)
  if (name === 'Provider' || name === 'Consumer') return false;

  // Unknown, Anonymous 컴포넌트는 스킵 (자식만 렌더링)
  if (name === 'Unknown' || name === 'Anonymous') return false;

  return true;
}

/**
 * Fiber 노드의 자식들을 카운트
 */
function countChildren(fiber: Fiber | null): number {
  let count = 0;
  let child = fiber;
  while (child) {
    if (shouldRenderFiber(child)) count++;
    child = child.sibling;
  }
  return count;
}

/**
 * React Fiber 트리를 JSX 형식으로 변환 (재귀)
 */
function fiberToJSX(fiber: Fiber | null, depth: number = 0): string {
  if (!fiber) return '';

  const indent = '  '.repeat(depth);
  let result = '';

  // 현재 노드 처리
  if (shouldRenderFiber(fiber)) {
    const name = getComponentName(fiber);
    const props = propsToString(fiber.memoizedProps);
    const childCount = countChildren(fiber.child);

    if (childCount === 0) {
      // 자식이 없으면 self-closing tag
      result += `${indent}<${name}${props} />\n`;
    } else {
      // 자식이 있으면 opening tag
      result += `${indent}<${name}${props}>\n`;

      // 자식 노드 처리
      let child = fiber.child;
      while (child) {
        result += fiberToJSX(child, depth + 1);
        child = child.sibling;
      }

      // Closing tag
      result += `${indent}</${name}>\n`;
    }
  } else {
    // Fragment 같은 경우 자식만 렌더링
    let child = fiber.child;
    while (child) {
      result += fiberToJSX(child, depth);
      child = child.sibling;
    }
  }

  return result;
}

/**
 * React Root에서 전체 트리 추출
 */
export function inspectReactTree(): string {
  try {
    // React 19의 Root 찾기
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return '// Error: #root element not found';
    }

    // React Fiber Root 찾기
    const fiberKey = Object.keys(rootElement).find(key =>
      key.startsWith('__react')
    );

    if (!fiberKey) {
      return '// Error: React Fiber not found (is this a React app?)';
    }

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
      // 최후의 수단: _internalRoot 탐색
      const internalRoot = fiberRoot?._internalRoot || fiberRoot?.stateNode?._internalRoot;
      if (internalRoot?.current) {
        fiber = internalRoot.current;
      }
    }

    if (!fiber) {
      return '// Error: Could not find React Fiber root node';
    }

    // JSX 변환 시작
    const jsx = fiberToJSX(fiber);
    return jsx || '// Error: Empty tree';

  } catch (error: any) {
    return `// Error: ${error.message}\n// Stack: ${error.stack}`;
  }
}
