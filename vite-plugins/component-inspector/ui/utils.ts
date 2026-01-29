
export function getDebugSource(el: HTMLElement | null): { fileName: string; lineNumber: number; columnNumber: number; loc?: number } | null {
    if (!el) return null;

    // 1. Check for explicit data attribute (fastest)
    const inspectorLine = el.getAttribute('data-inspector-line')
    const locAttr = el.getAttribute('data-inspector-loc')

    if (inspectorLine) {
        const [fileName, line, col] = inspectorLine.split(':')
        return {
            fileName,
            lineNumber: parseInt(line, 10),
            columnNumber: parseInt(col, 10),
            loc: locAttr ? parseInt(locAttr, 10) : undefined
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
        if (fiber._debugSource) {
            // Fiber doesn't have locAttr easily, but we can return fiber._debugSource
            return fiber._debugSource;
        }
        if (fiber._debugInfo) return fiber._debugInfo;

        fiber = fiber.return;
    }
    return null;
}

export function getComponentStack(el: HTMLElement | null): string[] {
    if (!el) return [];

    let key: string | undefined;
    for (const k in el) {
        if (k.startsWith('__reactFiber$')) {
            key = k;
            break;
        }
    }

    if (!key) return [];

    // @ts-ignore
    let fiber = el[key];
    const stack: string[] = [];

    while (fiber) {
        const type = fiber.type;
        let name = '';

        if (typeof type === 'function') {
            name = type.displayName || type.name || 'Anonymous';
        } else if (typeof type === 'string') {
            // Skip host components (div, span, etc) if we only want React Components
            // but keep primitives like 'Box' or 'Flex' if they have data attributes
        } else if (type && typeof type === 'object' && type.$$typeof) {
            // Handle Memo, ForwardRef, etc.
            const wrappedType = type.type || type.render;
            if (wrappedType) {
                name = wrappedType.displayName || wrappedType.name || '';
            }
        }

        if (name && name !== 'Anonymous' && !stack.includes(name)) {
            stack.unshift(name);
        }

        fiber = fiber.return;
    }

    return stack;
}
