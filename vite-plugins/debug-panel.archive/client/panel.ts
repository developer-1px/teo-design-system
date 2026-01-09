/**
 * Debug Panel UI Manager
 */

import { getMaxZIndex, getPropsForFiber } from './react-utils';
import { isPanelShown, root, setHasPanel } from './state';
import type { Layer } from './types';

/**
 * Panel Manager class
 */
export class PanelManager {
  private element: HTMLElement;

  constructor() {
    this.element = this.createPanel();
  }

  /**
   * Create panel element
   */
  private createPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    return panel;
  }

  /**
   * Show panel at target position
   */
  public show(target: HTMLElement, layers: Layer[]): void {
    const zIndex = getMaxZIndex(target, 9997);
    if (zIndex > 9997) this.element.style.zIndex = `${zIndex + 1}`;

    const rect = target.getBoundingClientRect();

    // Calculate position (top/bottom based on screen half)
    if (rect.bottom < window.innerHeight / 2) {
      this.element.style.top = `${rect.bottom + 8}px`;
      this.element.style.bottom = '';
      this.element.style.maxHeight = `${window.innerHeight - rect.bottom - 24}px`;
    } else {
      this.element.style.bottom = `${window.innerHeight - rect.top + 8}px`;
      this.element.style.top = '';
      this.element.style.maxHeight = `${rect.top - 24}px`;
    }

    // Left/Right position
    if (rect.left < window.innerWidth / 2) {
      this.element.style.left = `${rect.left}px`;
      this.element.style.right = '';
    } else {
      this.element.style.right = `${window.innerWidth - rect.right}px`;
      this.element.style.left = '';
    }

    // Build panel content
    this.element.innerHTML = '';

    // Header
    const header = document.createElement('div');
    header.id = 'debug-panel-header';

    const title = document.createElement('div');
    title.id = 'debug-panel-title';
    title.textContent = 'Component Hierarchy';
    header.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.id = 'debug-panel-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => this.close());
    header.appendChild(closeBtn);

    this.element.appendChild(header);

    // Component list
    for (const layer of layers) {
      const item = this.createComponentItem(layer);
      this.element.appendChild(item);
    }

    if (!isPanelShown()) {
      document.body.appendChild(this.element);
      setHasPanel(true);
    }
  }

  /**
   * Create component item element
   */
  private createComponentItem(layer: Layer): HTMLElement {
    const item = document.createElement('div');
    item.className = 'debug-panel-item';

    const componentName = document.createElement('div');
    componentName.className = 'debug-panel-component-name';
    componentName.textContent = `<${layer.name} />`;
    item.appendChild(componentName);

    const filePath = document.createElement('div');
    filePath.className = 'debug-panel-file-path';
    filePath.textContent = layer.path.replace(`${root}/`, '');
    item.appendChild(filePath);

    // Props extraction and display
    if (layer.fiber) {
      const props = getPropsForFiber(layer.fiber);
      const propsKeys = Object.keys(props);

      if (propsKeys.length > 0) {
        const { toggle, container } = this.createPropsSection(props, propsKeys.length);
        item.appendChild(toggle);
        item.appendChild(container);
      }
    }

    return item;
  }

  /**
   * Create props section with toggle
   */
  private createPropsSection(
    props: Record<string, unknown>,
    count: number
  ): {
    toggle: HTMLButtonElement;
    container: HTMLDivElement;
  } {
    // Props toggle button
    const toggle = document.createElement('button');
    toggle.className = 'debug-panel-props-toggle';
    toggle.textContent = `Props (${count})`;
    toggle.setAttribute('aria-expanded', 'false');

    // Props container
    const container = document.createElement('div');
    container.className = 'debug-panel-props-container';
    container.style.display = 'none';

    // Props JSON
    const propsJson = document.createElement('pre');
    propsJson.className = 'debug-panel-props-json';
    propsJson.textContent = JSON.stringify(props, null, 2);
    container.appendChild(propsJson);

    // Toggle event
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      container.style.display = isExpanded ? 'none' : 'block';
    });

    return { toggle, container };
  }

  /**
   * Close panel
   */
  public close(): void {
    if (!isPanelShown()) return;
    if (this.element.parentNode) {
      document.body.removeChild(this.element);
    }
    setHasPanel(false);
  }

  /**
   * Get panel element
   */
  public getElement(): HTMLElement {
    return this.element;
  }
}
