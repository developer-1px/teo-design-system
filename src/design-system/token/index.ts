/**
 * Token System Entry Point
 *
 * Re-exports all 1-tier and 2-tier tokens for convenient import
 *
 * @example
 * ```typescript
 * import { Space, Radius, Radius2, ActionSize } from './token';
 *
 * // 1-tier: primitive numeric tokens
 * const spacing = Space.n8;
 * const radius = Radius.n6;
 *
 * // 2-tier: semantic aliases
 * const roundedMd = Radius2.md;  // → Radius.n6
 * ```
 */

// Re-export all 1-tier tokens
export * from './token.const.1tier';

// Re-export all 2-tier tokens
export * from './token.const.2tier';

// Re-export branded types
export * from './lib/brand';
