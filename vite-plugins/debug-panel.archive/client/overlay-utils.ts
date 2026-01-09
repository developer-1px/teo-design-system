/**
 * Pure utility functions for overlay management
 */

import type { DebugMode } from './types';

/**
 * Get selectors based on debug mode (Pure function)
 */
export function getSelectorsForMode(debugMode: DebugMode): string[] {
  // Level 1: All IDDL components
  if (debugMode === 1) {
    return [
      '[data-component-type="Page"]',
      '[data-component-type="Section"]',
      '[data-component-type="Group"]',
      '[data-component-type="Action"]',
      '[data-component-type="Item"]',
      '[data-component-type="Field"]',
      '[data-component-type="Text"]',
      '[data-component-type="Overlay"]',
    ];
  }
  // Level 2: Buttons only
  if (debugMode === 2) {
    return ['button', '[role="button"]'];
  }
  // Level 0: OFF (should not be called)
  return [];
}

/**
 * Check if element should be excluded (Pure function)
 */
export function shouldExcludeElement(element: HTMLElement): boolean {
  // Exclude debug panel and overlay
  if (element.closest('#debug-panel') || element.closest('#debug-overlay-layer')) {
    return true;
  }
  return false;
}

/**
 * Check if element is visible (Pure function)
 */
export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/**
 * Get IDDL component type from element (Pure function)
 */
export function getIDDLComponentType(element: HTMLElement): string | null {
  return element.dataset.componentType || null;
}

/**
 * Calculate box position from element (Pure function)
 */
export interface BoxPosition {
  left: string;
  top: string;
  width: string;
  height: string;
  borderRadius: string;
}

export function calculateBoxPosition(element: HTMLElement): BoxPosition {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);

  return {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderRadius: computedStyle.borderRadius,
  };
}

/**
 * Apply position to box element (Impure: DOM mutation)
 */
export function applyBoxPosition(box: HTMLElement, position: BoxPosition): void {
  box.style.left = position.left;
  box.style.top = position.top;
  box.style.width = position.width;
  box.style.height = position.height;
  box.style.borderRadius = position.borderRadius;
}

/**
 * Find interactive elements (Impure: DOM query)
 */
export function findInteractiveElements(selectors: string[]): HTMLElement[] {
  if (selectors.length === 0) return [];

  const elements = document.querySelectorAll<HTMLElement>(selectors.join(','));

  return Array.from(elements).filter(el => {
    return !shouldExcludeElement(el) && isElementVisible(el);
  });
}

/**
 * Create overlay layer element (Impure: DOM creation)
 */
export function createOverlayLayer(): HTMLElement {
  const layer = document.createElement('div');
  layer.id = 'debug-overlay-layer';
  return layer;
}

/**
 * Add pulse animation to boxes (Impure: DOM mutation)
 */
export function pulseBoxes(boxes: HTMLElement[]): void {
  boxes.forEach(box => {
    box.classList.remove('pulse');
    // Force reflow to restart animation
    void box.offsetWidth;
    box.classList.add('pulse');
  });

  // Remove pulse class after animation
  setTimeout(() => {
    boxes.forEach(box => {
      box.classList.remove('pulse');
    });
  }, 600);
}

/**
 * Remove hover class from all boxes (Impure: DOM mutation)
 */
export function removeHoverFromBoxes(boxes: HTMLElement[]): void {
  boxes.forEach(box => {
    box.classList.remove('hover');
  });
}

/**
 * Get box configuration for element (Pure function)
 */
export interface BoxConfig {
  baseClassName: string;
  iddlClassName?: string;
  displayName: string;
  datasetValue: string;
}

export function getBoxConfig(
  element: HTMLElement,
  getComponentName: (el: HTMLElement) => string
): BoxConfig {
  const iddlType = getIDDLComponentType(element);
  const displayName = iddlType || getComponentName(element);

  return {
    baseClassName: 'debug-interactive-box',
    iddlClassName: iddlType ? `debug-iddl-${iddlType.toLowerCase()}` : undefined,
    displayName,
    datasetValue: iddlType || element.tagName.toLowerCase(),
  };
}

/**
 * Create overlay box element (Impure: DOM creation)
 */
export function createOverlayBox(
  element: HTMLElement,
  config: BoxConfig,
  onClickCallback?: (element: HTMLElement) => void
): HTMLElement {
  const box = document.createElement('div');
  box.className = config.baseClassName;

  // Add IDDL-specific class for color coding
  if (config.iddlClassName) {
    box.classList.add(config.iddlClassName);
  }

  // Element label
  const label = document.createElement('div');
  label.className = 'debug-box-label';
  label.textContent = config.displayName;
  box.appendChild(label);

  box.dataset.debugBoxFor = config.datasetValue;

  // Click event - show panel
  if (onClickCallback) {
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      onClickCallback(element);
    });
  }

  // Hover events
  box.addEventListener('mouseenter', () => {
    box.classList.add('hover');
  });

  box.addEventListener('mouseleave', () => {
    box.classList.remove('hover');
  });

  return box;
}
