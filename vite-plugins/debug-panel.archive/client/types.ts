/**
 * Type definitions for Debug Panel
 */

/**
 * React Fiber instance (internal React structure)
 */
export interface Fiber {
  type: string | Function;
  return?: Fiber;
  memoizedProps?: Record<string, unknown>;
  _debugSource?: DebugSource;
  _debugInfo?: DebugSource;
}

/**
 * Debug source information from React
 */
export interface DebugSource {
  fileName: string;
  lineNumber?: number;
  columnNumber?: number;
}

/**
 * Component layer information
 */
export interface Layer {
  name: string;
  path: string;
  fiber?: Fiber;
}

/**
 * React DevTools global hook
 */
export interface ReactDevToolsHook {
  renderers: Map<number, ReactRenderer>;
}

/**
 * React renderer instance
 */
export interface ReactRenderer {
  findFiberByHostInstance: (element: HTMLElement) => Fiber | null;
}

/**
 * Props value type (can be any serializable value)
 */
export type PropValue = unknown;

/**
 * Debug mode levels
 * 0: OFF
 * 1: All interactive elements (green)
 * 2: Buttons only (blue)
 */
export type DebugMode = 0 | 1 | 2;

/**
 * Window with React DevTools hook
 */
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: ReactDevToolsHook;
    __debugOverlayObserver?: MutationObserver;
  }
}
