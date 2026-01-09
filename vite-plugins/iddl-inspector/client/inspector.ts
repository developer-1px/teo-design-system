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
export function getComponentName(fiber: Fiber): string {
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

  // React 내장 타입 (Context.Provider 등)
  if (typeof type === 'object' && type !== null) {
    // Context Provider/Consumer
    if (type.$$typeof) {
      const symbolString = String(type.$$typeof);
      if (symbolString.includes('context')) {
        // Context에서 이름 추출 시도
        const contextName = type._context?.displayName;
        if (contextName) return contextName;
        return 'Provider'; // 또는 'Consumer'
      }
    }
  }

  // React Symbol 타입
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
 * 값을 간략한 문자열로 serialize (객체/배열 간략화)
 */
function serializeValue(value: any, maxLength: number = 50): string {
  try {
    const serialized = JSON.stringify(value);

    // maxLength 초과 시 간략화
    if (serialized.length > maxLength) {
      if (Array.isArray(value)) {
        return `[...${value.length} items]`;
      } else if (typeof value === 'object' && value !== null) {
        const keys = Object.keys(value);
        return `{...${keys.length} keys}`;
      }
    }

    return serialized;
  } catch (error) {
    // 순환 참조 등의 에러 처리
    if (Array.isArray(value)) {
      return '[...]';
    } else if (typeof value === 'object' && value !== null) {
      return '{...}';
    }
    return String(value);
  }
}

/**
 * Props를 JSX 속성 문자열로 변환
 */
function propsToString(props: any): string {
  if (!props) return '';

  const relevantProps: string[] = [];

  // 모든 props 순회
  for (const key in props) {
    // 제외할 props
    if (
      key === 'children' ||
      key === 'ref' ||
      key === 'key' ||
      key === 'className' || // HTML 관련 제외
      key.startsWith('data-') || // HTML data attributes 제외
      key.startsWith('aria-') // HTML aria attributes 제외
    )
      continue;

    const value = props[key];

    // undefined, null 제외
    if (value === undefined || value === null) continue;

    // 함수 제외
    if (typeof value === 'function') continue;

    // Primitive 값 (string, number, boolean)
    if (typeof value === 'string') {
      relevantProps.push(`${key}="${value}"`);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      relevantProps.push(`${key}={${value}}`);
    }
    // 객체/배열
    else if (typeof value === 'object') {
      const serialized = serializeValue(value);
      relevantProps.push(`${key}={${serialized}}`);
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
export function shouldRenderFiber(fiber: Fiber): boolean {
  if (!fiber) return false;

  // React 컴포넌트만 렌더링
  if (!isReactComponent(fiber)) return false;

  const name = getComponentName(fiber);

  // Fragment는 스킵 (자식만 렌더링)
  if (name === 'Fragment') return false;

  // React 내부 컴포넌트는 스킵
  if (name.startsWith('React.')) return false;

  // Context Provider/Consumer는 스킵하되 자식은 표시
  if (name === 'Provider' || name === 'Consumer') {
    return false; // 자식만 렌더링
  }

  // Unknown, Anonymous 컴포넌트는 스킵 (자식만 렌더링)
  if (name === 'Unknown' || name === 'Anonymous') return false;

  return true;
}

/**
 * React Fiber 트리를 JSX 형식으로 변환 (재귀)
 */
function fiberToJSX(fiber: Fiber | null, depth: number = 0): string {
  if (!fiber) return '';

  const indent = '  '.repeat(depth);
  let result = '';

  const name = getComponentName(fiber);
  const shouldRender = shouldRenderFiber(fiber);

  // 현재 노드 처리
  if (shouldRender) {
    const props = propsToString(fiber.memoizedProps);
    const hasChild = !!fiber.child; // ✅ 실제 child 존재 여부만 확인!

    if (!hasChild) {
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
    // Fragment, Provider, Consumer 같은 경우 자식만 렌더링 (depth 유지)
    let child = fiber.child;
    while (child) {
      result += fiberToJSX(child, depth);
      child = child.sibling;
    }
  }

  // Sibling 처리는 while loop에서 이미 처리되므로 여기서는 하지 않음
  return result;
}

/**
 * React Root에서 전체 트리 추출
 */
export function inspectReactTree(): string {
  try {
    // React 19의 Root 찾기
    const rootElement = document.getElementById('root');
    console.log('[IDDL Inspector] Root element:', rootElement);
    if (!rootElement) {
      return '// Error: #root element not found';
    }

    // React Fiber Root 찾기
    const allKeys = Object.keys(rootElement);
    console.log('[IDDL Inspector] Root element keys:', allKeys);
    const fiberKey = allKeys.find((key) => key.startsWith('__react'));
    console.log('[IDDL Inspector] Fiber key:', fiberKey);

    if (!fiberKey) {
      return '// Error: React Fiber not found (is this a React app?)\n// Available keys: ' + allKeys.join(', ');
    }

    const fiberRoot = (rootElement as any)[fiberKey];
    console.log('[IDDL Inspector] Fiber root:', fiberRoot);
    console.log('[IDDL Inspector] Fiber root keys:', Object.keys(fiberRoot || {}));

    // Fiber 트리의 시작점 찾기
    let fiber: Fiber | null = null;
    let foundPath = '';

    // React 19 구조 탐색 (여러 경로 시도)
    if (fiberRoot?.child) {
      fiber = fiberRoot.child;
      foundPath = 'fiberRoot.child';
    } else if (fiberRoot?.current) {
      fiber = fiberRoot.current;
      foundPath = 'fiberRoot.current';
    } else if (fiberRoot?.stateNode?.current) {
      fiber = fiberRoot.stateNode.current;
      foundPath = 'fiberRoot.stateNode.current';
    } else {
      // 최후의 수단: _internalRoot 탐색
      const internalRoot = fiberRoot?._internalRoot || fiberRoot?.stateNode?._internalRoot;
      if (internalRoot?.current) {
        fiber = internalRoot.current;
        foundPath = 'internalRoot.current';
      }
    }

    console.log('[IDDL Inspector] Found fiber via:', foundPath);
    console.log('[IDDL Inspector] Fiber:', fiber);

    if (!fiber) {
      return (
        '// Error: Could not find React Fiber root node\n' +
        '// fiberRoot keys: ' + Object.keys(fiberRoot || {}).join(', ') + '\n' +
        '// fiberRoot.child: ' + !!fiberRoot?.child + '\n' +
        '// fiberRoot.current: ' + !!fiberRoot?.current + '\n' +
        '// fiberRoot.stateNode: ' + !!fiberRoot?.stateNode
      );
    }

    // Fiber가 HostRoot면 child로 이동
    if (fiber.child && !shouldRenderFiber(fiber)) {
      console.log('[IDDL Inspector] Moving to child (HostRoot skip)');
      fiber = fiber.child;
    }

    console.log('[IDDL Inspector] Starting JSX conversion from:', getComponentName(fiber));
    console.log('[IDDL Inspector] Fiber type:', typeof fiber?.type);
    console.log('[IDDL Inspector] Should render:', shouldRenderFiber(fiber));

    // JSX 변환 시작 (depth 0부터)
    const jsx = fiberToJSX(fiber, 0);

    console.log('[IDDL Inspector] JSX conversion result length:', jsx.length);

    if (!jsx || jsx.trim() === '') {
      // 디버깅 정보 출력
      let debugInfo = '// Error: Empty tree\n';
      debugInfo += '// Root fiber type: ' + typeof fiber?.type + '\n';
      debugInfo += '// Root component name: ' + getComponentName(fiber) + '\n';
      debugInfo += '// Should render: ' + shouldRenderFiber(fiber) + '\n';
      debugInfo += '// Has child: ' + !!fiber?.child + '\n';

      if (fiber?.child) {
        debugInfo += '// Child type: ' + typeof fiber.child.type + '\n';
        debugInfo += '// Child name: ' + getComponentName(fiber.child) + '\n';
        debugInfo += '// Child should render: ' + shouldRenderFiber(fiber.child) + '\n';
      }

      return debugInfo;
    }

    return jsx;
  } catch (error: any) {
    console.error('[IDDL Inspector] Error:', error);
    return `// Error: ${error.message}\n// Stack: ${error.stack}`;
  }
}
