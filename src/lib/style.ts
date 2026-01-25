import { css, type CSSProperties } from './engine';

export type StyleRule = CSSProperties;

/**
 * A runtime version of Vanilla Extract's `style` function.
 * Accepts an array of style objects (patterns) and merges them into a single class string.
 *
 * @example
 * const className = style([
 *   pattern.surface.card,
 *   { padding: 16 }
 * ]);
 */
export function style(args: (StyleRule | undefined | null | false)[]): string {
    const mergedStyles: CSSProperties = {};

    for (const arg of args) {
        if (!arg) continue;
        Object.assign(mergedStyles, arg);
    }

    return css(mergedStyles);
}
