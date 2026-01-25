import { ABBREVIATION_MAP } from './full-table.ts';
import { camelToKebab } from './abbreviation.ts';

export type CSSProperties = Record<string, string | number>;

const abbrMap = ABBREVIATION_MAP;

// Cache for injected styles
const injectedStyles = new Set<string>();
let styleElement: HTMLStyleElement | null = null;

function getStyleElement() {
    if (typeof document === 'undefined') return null;
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'project-x-runtime';
        document.head.appendChild(styleElement);
    }
    return styleElement;
}

function escapeClassName(className: string) {
    // Escape special characters for CSS selector
    // ( ) . % / , | etc
    return className.replace(/([()\.%/,|])/g, '\\$1');
}

function formatValue(value: string | number) {
    let strValue = String(value);
    // Rule: Trim spaces around commas
    strValue = strValue.replace(/\s*,\s*/g, ',');
    // Rule: Trim spaces around slashes
    strValue = strValue.replace(/\s*\/\s*/g, '/');
    // Rule: Space to Pipe
    return strValue.replace(/\s+/g, '|');
}

export function css(styles: CSSProperties): string {
    const classNames: string[] = [];

    for (const [prop, value] of Object.entries(styles)) {
        const abbr = abbrMap[prop] || prop.toLowerCase();
        const formattedValue = formatValue(value);
        const className = `${abbr}(${formattedValue})`;

        classNames.push(className);

        // Injection logic
        if (!injectedStyles.has(className)) {
            const styleTag = getStyleElement();
            if (styleTag) {
                const kebabProp = camelToKebab(prop);
                const escapedSelector = `.${escapeClassName(className)}`;
                const rule = `${escapedSelector} { ${kebabProp}: ${value}; }`;
                styleTag.innerHTML += rule + '\n';
                injectedStyles.add(className);
            }
        }
    }

    return classNames.join(' ');
}
