/**
 * Global state management for Debug Panel
 */

import type { DebugMode } from './types';

/**
 * Root path (injected by plugin)
 */
export let root = '__ROOT__';

/**
 * Base path (injected by plugin)
 */
export let base = '__BASE__';

/**
 * Current debug mode
 * 0: OFF, 1: All components, 2: Buttons only
 */
export let debugMode: DebugMode = 0;

/**
 * Currently targeted element
 */
export let currentTarget: HTMLElement | undefined;

/**
 * Whether panel is currently shown
 */
export let hasPanel = false;

/**
 * Set debug mode
 */
export function setDebugMode(mode: DebugMode): void {
  debugMode = mode;
}

/**
 * Set current target element
 */
export function setCurrentTarget(target: HTMLElement | undefined): void {
  currentTarget = target;
}

/**
 * Set panel visibility state
 */
export function setHasPanel(value: boolean): void {
  hasPanel = value;
}

/**
 * Get current debug mode
 */
export function getDebugMode(): DebugMode {
  return debugMode;
}

/**
 * Get current target
 */
export function getCurrentTarget(): HTMLElement | undefined {
  return currentTarget;
}

/**
 * Check if panel is shown
 */
export function isPanelShown(): boolean {
  return hasPanel;
}
