/**
 * Debug Panel Client Entry Point
 *
 * Cmd+D / Ctrl+D로 디버그 모드 토글
 * - 0 -> 1 -> 2 -> 0 순환
 * - Level 1: 모든 인터랙티브 요소 (녹색)
 * - Level 2: Button만 (파란색)
 */

import { injectStyles } from './styles';
import { OverlayManager } from './overlay';
import { PanelManager } from './panel';
import { KeyboardManager } from './keyboard';
import { getDebugMode } from './state';

/**
 * Main application class
 */
class DebugPanelApp {
  private overlay: OverlayManager;
  private panel: PanelManager;
  private keyboard: KeyboardManager;

  constructor() {
    // Inject CSS styles
    injectStyles();

    // Initialize managers
    this.overlay = new OverlayManager();
    this.panel = new PanelManager();
    this.keyboard = new KeyboardManager();

    // Setup event handlers
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers between modules
   */
  private setupEventHandlers(): void {
    // Keyboard: debug mode change
    this.keyboard.onDebugModeChange((mode) => {
      if (mode === 0) {
        // OFF
        this.overlay.disable();
        this.overlay.clearTarget();
        this.panel.close();
      } else if (mode === 1) {
        // Level 1: All components
        this.overlay.enable();
      } else if (mode === 2) {
        // Level 2: Buttons only
        this.overlay.updateOverlay(); // Update to show buttons only
      }
    });

    // Keyboard: panel close
    this.keyboard.onPanelClose(() => {
      this.panel.close();
    });

    // Overlay: box click
    this.overlay.onBoxClick((element, layers) => {
      this.panel.show(element, layers);
    });
  }
}

/**
 * Initialize debug panel when DOM is ready
 */
function init(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new DebugPanelApp();
    });
  } else {
    new DebugPanelApp();
  }
}

// Auto-initialize
init();
