export interface ComponentStackItem {
    name: string;
    fileName?: string;
    lineNumber?: string;
    columnNumber?: string;
}

// Internal React Fiber property key (depends on React version, usually starts with __reactFiber)
export function getFiberFromElement(element: any): any {
    // Try standard key
    const key = Object.keys(element).find((k) => k.startsWith("__reactFiber$"));
    if (key) return element[key];

    // Fallback: Iterate all keys (including non-enumerable if possible via loop, though Object.keys assumes enumerable)
    // Some React versions use __reactInternalInstance$
    for (const k in element) {
        if (
            k.startsWith("__reactFiber$") ||
            k.startsWith("__reactInternalInstance$")
        ) {
            return element[k];
        }
    }
    return null;
}

export function getStackFromFiber(startFiber: any): ComponentStackItem[] {
    const stack: ComponentStackItem[] = [];
    let fiber = startFiber;

    while (fiber) {
        const debugSource = fiber._debugSource;
        const type = fiber.type;

        let name = "";
        if (typeof type === "function") {
            name = type.displayName || type.name || "Anonymous";
        } else if (typeof type === "object" && type !== null) {
            // Memo, ForwardRef, etc.
            name =
                type.displayName ||
                (type.render ? type.render.name : "") ||
                "Component";
        } else if (typeof type === "string") {
            name = type; // 'div', 'span'
        }

        if (name && debugSource) {
            // Clean up filename
            let fileName = debugSource.fileName ? debugSource.fileName : "";
            if (fileName) {
                const parts = fileName.split("/");
                const base = parts.pop(); // index.tsx
                if (
                    base &&
                    (base === "index.tsx" ||
                        base === "index.ts" ||
                        base === "index.js" ||
                        base === "index.jsx") &&
                    parts.length > 0
                ) {
                    fileName = `${parts.pop()}/${base}`;
                } else {
                    fileName = base || "";
                }
            }

            stack.push({
                name,
                fileName,
                lineNumber: debugSource.lineNumber,
                columnNumber: debugSource.columnNumber,
            });
        }

        fiber = fiber.return;
    }

    return stack.filter(
        (item, index, self) =>
            index === 0 ||
            item.fileName !== self[index - 1].fileName ||
            item.lineNumber !== self[index - 1].lineNumber,
    );
}

export function findNearestHostNode(fiber: any): HTMLElement | null {
    let current = fiber;
    while (current) {
        if (
            typeof current.type === "string" &&
            current.stateNode instanceof HTMLElement
        ) {
            return current.stateNode;
        }
        // We only need to go down to find the *first* host node.
        // If a component returns a Fragment or array, this might find just the first one.
        // This is generally acceptable for highlighting "the component".
        current = current.child;
    }
    return null;
}
