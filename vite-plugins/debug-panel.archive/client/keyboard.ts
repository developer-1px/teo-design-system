/**
 * Keyboard event handlers
 */

import type { DebugMode } from './types';
import { getDebugMode, setDebugMode, isPanelShown } from './state';

/**
 * Keyboard Manager class
 */
export class KeyboardManager {
  private onDebugModeChangeCallback?: (mode: DebugMode) => void;
  private onPanelCloseCallback?: () => void;

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Setup keyboard event listeners
   */
  private setupEventListeners(): void {
    // Cmd+D / Ctrl+D to toggle debug mode
    window.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'd') {
        event.preventDefault();
        this.toggleDebugMode();
      }

      // ESC to close panel
      if (event.key === 'Escape' && isPanelShown()) {
        if (this.onPanelCloseCallback) {
          this.onPanelCloseCallback();
        }
      }
    });

    // Block keyboard events in debug mode
    this.setupKeyboardBlocking();
  }

  /**
   * Setup keyboard event blocking
   */
  private setupKeyboardBlocking(): void {
    const blockingEvents = ['keydown', 'keypress', 'keyup', 'input'];

    blockingEvents.forEach(eventType => {
      window.addEventListener(
        eventType,
        (event) => {
          if (getDebugMode() === 0) return;

          const target = event.target;
          if (!(target instanceof HTMLElement)) return;

          // Allow events in panel
          if (target.closest('#debug-panel')) {
            return;
          }

          // Allow Cmd+D / Ctrl+D (debug mode toggle)
          if (
            eventType === 'keydown' &&
            (event.metaKey || event.ctrlKey) &&
            event.key === 'd'
          ) {
            return;
          }

          // Allow ESC (close panel)
          if (eventType === 'keydown' && event.key === 'Escape') {
            return;
          }

          // Block keyboard input
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        },
        true // Capture phase
      );
    });
  }

  /**
   * Toggle debug mode (0 -> 1 -> 2 -> 0)
   */
  private toggleDebugMode(): void {
    const current = getDebugMode();
    const next = ((current + 1) % 3) as DebugMode;
    setDebugMode(next);

    // Update body attribute
    if (next === 0) {
      document.body.removeAttribute('data-debug-mode');
      console.log('[Debug Panel] Debug mode OFF');
    } else if (next === 1) {
      document.body.setAttribute('data-debug-mode', '1');
      console.log('[Debug Panel] Debug mode: ALL');
    } else if (next === 2) {
      document.body.setAttribute('data-debug-mode', '2');
      console.log('[Debug Panel] Debug mode: BTN');
    }

    // Notify callback
    if (this.onDebugModeChangeCallback) {
      this.onDebugModeChangeCallback(next);
    }
  }

  /**
   * Set debug mode change callback
   */
  public onDebugModeChange(callback: (mode: DebugMode) => void): void {
    this.onDebugModeChangeCallback = callback;
  }

  /**
   * Set panel close callback
   */
  public onPanelClose(callback: () => void): void {
    this.onPanelCloseCallback = callback;
  }
}
