/**
 * Overlay Manager - Interactive element highlighting
 */

import {
  applyBoxPosition,
  calculateBoxPosition,
  createOverlayBox,
  createOverlayLayer,
  findInteractiveElements,
  getBoxConfig,
  getSelectorsForMode,
  pulseBoxes,
  removeHoverFromBoxes,
} from './overlay-utils';
import { getComponentNameForElement, getLayersForElement } from './react-utils';
import { getCurrentTarget, getDebugMode, setCurrentTarget } from './state';
import type { Layer } from './types';

/**
 * Overlay Manager class
 */
export class OverlayManager {
  private layer: HTMLElement;
  private interactiveElements: HTMLElement[] = [];
  private boxes = new Map<HTMLElement, HTMLElement>();
  private updateTimer: number | null = null;
  private observer: MutationObserver | null = null;
  private onBoxClickCallback?: (element: HTMLElement, layers: Layer[]) => void;

  constructor() {
    this.layer = createOverlayLayer();
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Click on empty area - pulse all boxes
    this.layer.addEventListener('click', (event) => {
      if (event.target === this.layer) {
        this.pulseAllBoxes();
      }
    });
  }

  /**
   * Pulse all boxes (animation)
   */
  private pulseAllBoxes(): void {
    pulseBoxes(Array.from(this.boxes.values()));
  }

  /**
   * Find interactive elements based on debug mode
   */
  private findInteractiveElementsForCurrentMode(): HTMLElement[] {
    const selectors = getSelectorsForMode(getDebugMode());
    return findInteractiveElements(selectors);
  }

  /**
   * Create overlay box for element
   */
  private createOverlayBoxForElement(element: HTMLElement): HTMLElement {
    // Get box configuration (pure function)
    const config = getBoxConfig(element, getComponentNameForElement);

    // Create box with click handler
    const box = createOverlayBox(element, config, (clickedElement) => {
      const layers = getLayersForElement(clickedElement);
      if (layers.length === 0) {
        console.warn('[Debug Panel] No React component found for this element');
        return;
      }

      if (this.onBoxClickCallback) {
        this.onBoxClickCallback(clickedElement, layers);
      }
    });

    return box;
  }

  /**
   * Update box position to match element
   */
  private updateBoxPosition(box: HTMLElement, element: HTMLElement): void {
    const position = calculateBoxPosition(element);
    applyBoxPosition(box, position);
  }

  /**
   * Update overlay
   */
  public updateOverlay(): void {
    if (getDebugMode() === 0) return;

    // Find current interactive elements
    this.interactiveElements = this.findInteractiveElementsForCurrentMode();

    // Remove old boxes
    this.boxes.forEach((box, element) => {
      if (!this.interactiveElements.includes(element)) {
        box.remove();
        this.boxes.delete(element);
      }
    });

    // Create new boxes and update positions
    this.interactiveElements.forEach((element) => {
      let box = this.boxes.get(element);

      if (!box) {
        box = this.createOverlayBoxForElement(element);
        this.layer.appendChild(box);
        this.boxes.set(element, box);
      }

      this.updateBoxPosition(box, element);
    });
  }

  /**
   * Schedule overlay update (debounced)
   */
  private scheduleUpdate = (): void => {
    if (this.updateTimer) {
      cancelAnimationFrame(this.updateTimer);
    }
    this.updateTimer = requestAnimationFrame(() => this.updateOverlay());
  };

  /**
   * Enable overlay
   */
  public enable(): void {
    // Add layer to DOM
    if (!this.layer.parentNode) {
      document.body.appendChild(this.layer);
    }

    // Initial update
    this.updateOverlay();

    // Listen to scroll/resize
    window.addEventListener('scroll', this.scheduleUpdate, true);
    window.addEventListener('resize', this.scheduleUpdate);

    // Listen to DOM changes
    if (!this.observer) {
      this.observer = new MutationObserver(this.scheduleUpdate);
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
      window.__debugOverlayObserver = this.observer;
    }
  }

  /**
   * Disable overlay
   */
  public disable(): void {
    // Remove layer from DOM
    if (this.layer.parentNode) {
      this.layer.parentNode.removeChild(this.layer);
    }

    // Remove all boxes
    this.boxes.forEach((box) => box.remove());
    this.boxes.clear();
    this.interactiveElements = [];

    // Remove event listeners
    window.removeEventListener('scroll', this.scheduleUpdate, true);
    window.removeEventListener('resize', this.scheduleUpdate);

    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      delete window.__debugOverlayObserver;
      this.observer = null;
    }
  }

  /**
   * Clear current target
   */
  public clearTarget(): void {
    const currentTarget = getCurrentTarget();
    if (!currentTarget) return;

    // Remove legacy data-debug-target
    const current = document.querySelector('[data-debug-target]');
    if (current) delete (current as any).dataset.debugTarget;

    // Remove all hover classes using pure function
    removeHoverFromBoxes(Array.from(this.boxes.values()));

    setCurrentTarget(undefined);
  }

  /**
   * Set box click callback
   */
  public onBoxClick(callback: (element: HTMLElement, layers: Layer[]) => void): void {
    this.onBoxClickCallback = callback;
  }
}
