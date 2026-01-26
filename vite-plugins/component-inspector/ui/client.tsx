
import React from 'react';
import { createRoot } from 'react-dom/client';
import { DebugManager } from './DebugManager';

const rootId = 'vite-plugin-component-inspector-root';

// Ensure we only mount once
if (!document.getElementById(rootId)) {
    const container = document.createElement('div');
    container.id = rootId;
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '0';
    container.style.height = '0';
    container.style.zIndex = '999999';
    container.style.pointerEvents = 'none'; // Don't block clicks unless active (DebugManager handles its own pointer events)

    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<DebugManager />);

    // console.log('[Component Inspector] Mounted');
}
