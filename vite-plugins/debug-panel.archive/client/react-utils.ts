/**
 * React Fiber utilities for extracting component information
 */

import type { Fiber, Layer, PropValue } from './types';
import { root } from './state';

/**
 * Extract props from React Fiber instance
 */
export function getPropsForFiber(fiber: Fiber): Record<string, PropValue> {
  if (!fiber || !fiber.memoizedProps) return {};

  const props: Record<string, PropValue> = { ...fiber.memoizedProps };

  // Remove internal React props
  delete props.key;
  delete props.ref;
  delete props.__self;
  delete props.__source;

  // Simplify children if too complex
  if (props.children) {
    if (typeof props.children === 'object' && props.children !== null) {
      if (Array.isArray(props.children)) {
        props.children = `[${props.children.length} children]`;
      } else if ((props.children as any).$$typeof) {
        // React element
        props.children = '<ReactElement>';
      }
    }
  }

  return props;
}

/**
 * Extract component hierarchy from HTML element
 */
export function getLayersForElement(element: HTMLElement): Layer[] {
  let fiber = getReactInstanceForElement(element);
  const layers: Layer[] = [];

  // Traverse fiber tree upwards, collecting React components only
  while (fiber) {
    // Only add React components (functions/classes), not HTML elements (strings)
    if (typeof fiber.type === 'function') {
      const path = getPath(fiber);
      if (path) {
        const name =
          (fiber.type as any).displayName ??
          (fiber.type as any).name ??
          (fiber.type as any).render?.name ??
          'Anonymous';
        layers.push({ name, path, fiber });
      }
    }

    // Move to parent fiber
    fiber = fiber.return;
  }

  return layers;
}

/**
 * Get file path from fiber debug source
 */
function getPath(fiber: Fiber): string | undefined {
  const source = fiber._debugSource ?? fiber._debugInfo;
  if (!source) {
    console.debug('[Debug Panel] No debug source for fiber', fiber);
    return undefined;
  }

  const { columnNumber = 1, fileName, lineNumber = 1 } = source;
  return `${fileName}:${lineNumber}:${columnNumber}`;
}

/**
 * Get React fiber instance from HTML element
 */
function getReactInstanceForElement(element: HTMLElement): Fiber | undefined {
  // React DevTools Hook 사용
  if ('__REACT_DEVTOOLS_GLOBAL_HOOK__' in window) {
    const { renderers } = window.__REACT_DEVTOOLS_GLOBAL_HOOK__!;
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
    return (element as any)._reactRootContainer._internalRoot.current.child;
  }

  // Fiber 직접 찾기
  for (const key in element) {
    if (key.startsWith('__reactFiber')) {
      return (element as any)[key];
    }
  }

  return undefined;
}

/**
 * Get component name from element (for display)
 */
export function getComponentNameForElement(element: HTMLElement): string {
  const layers = getLayersForElement(element);

  if (layers.length > 0) {
    // Use closest component name
    const componentName = layers[0].name;
    return `<${componentName} />`;
  }

  // Fallback to HTML tag name
  let tagName = element.tagName.toLowerCase();

  // Add ID if exists
  if (element.id) {
    tagName += `#${element.id}`;
  }

  // Add first class if exists
  if (element.className && typeof element.className === 'string') {
    const firstClass = element.className.split(' ').filter(c => c.trim())[0];
    if (firstClass) {
      tagName += `.${firstClass}`;
    }
  }

  // Add role if exists
  const role = element.getAttribute('role');
  if (role) {
    tagName += `[${role}]`;
  }

  return tagName;
}

/**
 * Get max z-index from element parents
 */
export function getMaxZIndex(target: HTMLElement, current: number): number {
  const parent = target.parentElement;
  if (!parent || parent === document.body) return current;

  const zIndex = parseInt(window.getComputedStyle(parent).zIndex);
  return getMaxZIndex(parent, isNaN(zIndex) ? current : Math.max(zIndex, current));
}
