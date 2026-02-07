export interface Violation {
    element: HTMLElement;
    type: 'NO_SPACING' | 'INLINE_STYLE';
    message: string;
    rect: DOMRect;
    source?: string;
}

export interface DesignLintParams {
    root: HTMLElement;
}

/** Extract React fiber source (FileName:Line) from DOM element */
function getDebugSource(el: HTMLElement | null): string | undefined {
    if (!el) return undefined;

    // 1. Data Attribute
    const inspectorLine = el.getAttribute('data-inspector-line');
    if (inspectorLine) return inspectorLine;

    // 2. React Fiber Traversal
    let key: string | undefined;
    for (const k in el) {
        if (k.startsWith('__reactFiber$')) {
            key = k;
            break;
        }
    }
    if (!key) return undefined;

    // @ts-ignore
    let fiber = el[key];
    while (fiber) {
        const source = fiber._debugSource || fiber._debugInfo;
        if (source) {
            return `${source.fileName}:${source.lineNumber}:${source.columnNumber}`;
        }
        if (fiber._debugOwner && fiber._debugOwner._debugSource) {
            // Optional: Use owner source
        }
        fiber = fiber.return;
    }
    return undefined;
}

/** Check if element has direct text nodes with content */
function hasDirectText(el: HTMLElement): boolean {
    return Array.from(el.childNodes).some(
        n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim().length! > 0
    );
}

/** Check if all sides of Padding are 0 */
function hasNoPadding(style: CSSStyleDeclaration): boolean {
    const top = parseInt(style.paddingTop) || 0;
    const right = parseInt(style.paddingRight) || 0;
    const bottom = parseInt(style.paddingBottom) || 0;
    const left = parseInt(style.paddingLeft) || 0;
    return (top + right + bottom + left) === 0;
}

/** Check if all sides of Margin are 0 */
function hasNoMargin(style: CSSStyleDeclaration): boolean {
    const top = parseInt(style.marginTop) || 0;
    const right = parseInt(style.marginRight) || 0;
    const bottom = parseInt(style.marginBottom) || 0;
    const left = parseInt(style.marginLeft) || 0;
    return (top + right + bottom + left) === 0;
}

/** Check if element has forbidden inline styles (Design Token violations) */
function getInlineStyleViolations(el: HTMLElement): string[] {
    const style = el.getAttribute('style');
    if (!style) return [];

    const violations: string[] = [];
    const s = el.style;

    if (s.padding || s.paddingTop || s.paddingRight || s.paddingBottom || s.paddingLeft) violations.push('padding');
    if (s.margin || s.marginTop || s.marginRight || s.marginBottom || s.marginLeft) violations.push('margin');
    if (s.color) violations.push('color');
    if (s.backgroundColor || s.background) violations.push('background');
    if (s.fontSize || s.fontWeight || s.fontFamily) violations.push('typography');
    if (s.border || s.borderColor || s.borderWidth) violations.push('border');
    if (s.borderRadius) violations.push('radius');
    if (s.gap || s.rowGap || s.columnGap) violations.push('gap');
    if (s.boxShadow) violations.push('shadow');

    return violations;
}

export function runDesignLint({ root }: DesignLintParams): Violation[] {
    const violations: Violation[] = [];
    const candidates = Array.from(root.querySelectorAll('*')) as HTMLElement[];

    candidates.forEach(el => {
        // 0. Safety Skips
        if (el.closest('[data-design-lint-ignore]')) return;
        if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'HEAD', 'META', 'LINK', 'TITLE'].includes(el.tagName)) return;

        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        // Skip invisible
        if (rect.width === 0 || rect.height === 0 || style.display === 'none' || style.visibility === 'hidden') return;

        // RULE 1: INLINE STYLE CHECK
        const inlineViolations = getInlineStyleViolations(el);
        if (inlineViolations.length > 0) {
            violations.push({
                element: el,
                type: 'INLINE_STYLE',
                message: `Avoid inline styles for design properties: ${inlineViolations.join(', ')}. Use spacing tokens or classes.`,
                rect,
                source: getDebugSource(el)
            });
        }

        // RULE 2: SPACING CHECK
        if (style.display === 'inline') return;
        if (!hasDirectText(el)) return;

        const noPadding = hasNoPadding(style);
        const noMargin = hasNoMargin(style);

        if (noPadding && noMargin) {
            const parent = el.parentElement;
            if (parent) {
                const parentStyle = window.getComputedStyle(parent);
                const isFlexOrGrid = parentStyle.display.includes('flex') || parentStyle.display.includes('grid');
                if (isFlexOrGrid) {
                    const gap = parentStyle.gap || parentStyle.columnGap || parentStyle.rowGap;
                    const gapValue = parseInt(gap) || 0;
                    if (gapValue > 0) {
                        return;
                    }
                }
            }

            violations.push({
                element: el,
                type: 'NO_SPACING',
                message: `No Spacing (or use margin).`,
                rect,
                source: getDebugSource(el)
            });
        }
    });

    return violations;
}
