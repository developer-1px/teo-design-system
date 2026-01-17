/**
 * Utility functions for design-lint
 */

/**
 * Convert token reference to CSS variable
 * e.g., "Space.n12" → "var(--space-n12)"
 * e.g., "Size.fill" → "var(--size-fill)"
 */
export function tokenToCSSVariable(token: string): string {
  if (typeof token !== "string") return token;

  // Check if it's a token reference (e.g., Space.n12, Size.fill)
  const tokenPattern =
    /^(Space|Size|Radius|ContainerSize|FontSize|IconSize|Opacity|ZIndex)\.(.+)$/;
  const match = token.match(tokenPattern);

  if (match) {
    const [, type, value] = match;
    // Convert to CSS variable format: Space.n12 → var(--space-n12)
    return `var(--${type.toLowerCase()}-${value.toLowerCase()})`;
  }

  return token;
}

/**
 * Deep equality check for primitive values, objects, and Token values
 * Used to compare layout preset values with override values
 * Automatically converts token references to CSS variables before comparison
 */
export function isEqual(a: any, b: any): boolean {
  // Convert tokens to CSS variables if needed
  const normalizedA = typeof a === "string" ? tokenToCSSVariable(a) : a;
  const normalizedB = typeof b === "string" ? tokenToCSSVariable(b) : b;

  // Same reference or primitive equality
  if (normalizedA === normalizedB) return true;

  // Handle null/undefined
  if (normalizedA == null || normalizedB == null) return false;

  // Different types
  if (typeof normalizedA !== typeof normalizedB) return false;

  // Object comparison
  if (typeof normalizedA === "object" && typeof normalizedB === "object") {
    // Array comparison
    if (Array.isArray(normalizedA) && Array.isArray(normalizedB)) {
      if (normalizedA.length !== normalizedB.length) return false;
      return normalizedA.every((val, idx) => isEqual(val, normalizedB[idx]));
    }

    // Plain object comparison
    const keysA = Object.keys(normalizedA);
    const keysB = Object.keys(normalizedB);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) => isEqual(normalizedA[key], normalizedB[key]));
  }

  // Primitive comparison (fallback)
  return false;
}
