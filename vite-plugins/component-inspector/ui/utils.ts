
export function getDebugSource(el: HTMLElement | null): { fileName: string; lineNumber: number; columnNumber: number } | null {
    if (!el) return null;

    // 1. Check for explicit data attribute (fastest)
    const inspectorLine = el.getAttribute('data-inspector-line')
    if (inspectorLine) {
        const [fileName, line, col] = inspectorLine.split(':')
        return {
            fileName,
            lineNumber: parseInt(line, 10),
            columnNumber: parseInt(col, 10)
        }
    }

    // 2. Fallback to Fiber traversal
    let key: string | undefined;
    for (const k in el) {
        if (k.startsWith('__reactFiber$')) {
            key = k;
            break;
        }
    }

    if (!key) {
        return null;
    }

    // @ts-ignore
    let fiber = el[key];

    while (fiber) {
        if (fiber._debugSource) return fiber._debugSource;
        if (fiber._debugInfo) return fiber._debugInfo;

        // Also check owner (component that created this)
        // Often describing the component is more useful than the host node
        // But for the overlay we might want the exact host node's source if available
        // For now, let's stick to the closest debug source in the tree.

        if (fiber._debugOwner && fiber._debugOwner._debugSource) {
            // return fiber._debugOwner._debugSource;
            // Note: Using owner might jump to the parent component.
            // Standard React DevTools inspector logic is complex.
            // Let's use the simple traversal for now.
        }

        fiber = fiber.return;
    }
    return null;
}
