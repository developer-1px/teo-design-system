export interface Violation {
    element: HTMLElement;
    type: 'NO_SPACING' | 'INLINE_STYLE';
    message: string;
    rect: DOMRect;
    source?: string; // e.g. "Components.tsx:42:10"
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
        // Try to get source from fiber or owner
        const source = fiber._debugSource || fiber._debugInfo;
        if (source) {
            return `${source.fileName}:${source.lineNumber}:${source.columnNumber}`;
        }
        if (fiber._debugOwner && fiber._debugOwner._debugSource) {
            // Optional: Use owner source
            // const s = fiber._debugOwner._debugSource;
            // return `${s.fileName}:${s.lineNumber}:${s.columnNumber}`;
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

    // Parse inline style string manually or check el.style properties
    // el.style only contains inline values.
    const violations: string[] = [];
    const s = el.style;

    // List of properties that should be TOKENS (not inline)
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
            // If we found inline style issues, we can still check for spacing violations below, 
            // OR we can return early to avoid noise? 
            // Let's allow both.
        }

        // RULE 2: SPACING CHECK ("Non-inline Element"...)
        if (style.display === 'inline') return;
        if (!hasDirectText(el)) return;

        // 3. "No Padding or Margin" (Interpreted as: If it lacks BOTH, it's definitely a 'brick')
        // Or "If it lacks EITHER?"
        // User phrase: "padding이나 margin이 없어" (Padding OR Margin is missing).
        // If I have padding (internal room) but no margin (external room), I might handle it.
        // If I have margin (external room) but no padding (internal room), I might handle it (e.g. text).
        // Let's flag if BOTH are missing first. This is the safest "Design Smell".
        // A Block with Text that has NO internal breathing room AND NO external breathing room is almost always bad.

        const noPadding = hasNoPadding(style);
        const noMargin = hasNoMargin(style);

        if (noPadding && noMargin) {
            // EXEMPTION: Parent has GAP.
            // If parent manages spacing via gap, the child doesn't need margin.
            const parent = el.parentElement;
            if (parent) {
                const parentStyle = window.getComputedStyle(parent);
                const isFlexOrGrid = parentStyle.display.includes('flex') || parentStyle.display.includes('grid');
                if (isFlexOrGrid) {
                    const gap = parentStyle.gap || parentStyle.columnGap || parentStyle.rowGap; // "16px" or "10px 20px" or "normal"
                    // Parse gap. "normal" is usually 0px for flex, but sometimes treated as 0. W3C says 'normal' for flex is 0, for grid is 0 usually.
                    // If it has a pixel value:
                    const gapValue = parseInt(gap) || 0;
                    if (gapValue > 0) {
                        // Parent provides the spacing. Safe.
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
