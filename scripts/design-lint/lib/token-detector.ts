/**
 * Token detection utilities for style → override conversion
 */

import {
  CSS_TO_OVERRIDE_PROP,
  SPACE_VALUES_TO_TOKENS,
  SIZE_VALUES_TO_TOKENS,
  OPACITY_VALUES_TO_TOKENS,
  ZINDEX_VALUES_TO_TOKENS,
} from "./constants";
import type { BorderFixResult, TokenizationResult, TokenConversion } from "./types";

/**
 * Check if style can be converted to border prop
 */
export function isBorderStyleFixable(styleObj: Record<string, string>): BorderFixResult {
  const borderProps = ["border", "borderTop", "borderBottom", "borderLeft", "borderRight"];

  for (const prop of borderProps) {
    if (styleObj[prop] === "1px solid var(--border-color)") {
      return { fixable: true, borderType: prop as any };
    }
  }

  return { fixable: false, borderType: null };
}

/**
 * Detect tokenizable styles that can be converted to override prop
 * ⚠️ NO REGEX - AST only
 */
export function detectTokenizableStyles(styleObj: Record<string, string>): TokenizationResult {
  const conversions: TokenConversion[] = [];

  for (const [cssProp, cssValue] of Object.entries(styleObj)) {
    // Skip non-tokenizable properties
    if (!CSS_TO_OVERRIDE_PROP[cssProp]) continue;

    const overrideProp = CSS_TO_OVERRIDE_PROP[cssProp];
    let tokenValue: string | null = null;

    // Try Space tokens first (for padding, gap)
    if (["padding", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "paddingInline", "paddingBlock", "gap"].includes(cssProp)) {
      tokenValue = SPACE_VALUES_TO_TOKENS[cssValue] || null;
    }

    // Try Size tokens (for width, height)
    if (!tokenValue && ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight"].includes(cssProp)) {
      tokenValue = SIZE_VALUES_TO_TOKENS[cssValue] || null;
    }

    // Try Opacity tokens
    if (!tokenValue && cssProp === "opacity") {
      tokenValue = OPACITY_VALUES_TO_TOKENS[cssValue] || null;
    }

    // Try ZIndex tokens
    if (!tokenValue && cssProp === "zIndex") {
      tokenValue = ZINDEX_VALUES_TO_TOKENS[cssValue] || null;
    }

    // Also check for var(--space-*) or var(--size-*) format
    // Extract number from "var(--space-n12)" → "Space.n12"
    if (!tokenValue && cssValue.startsWith("var(--space-n")) {
      const numPart = cssValue.slice("var(--space-n".length, -1); // Remove "var(--space-n" and ")"
      if (numPart && !numPart.includes("-")) { // Ensure it's just a number
        tokenValue = `Space.n${numPart}`;
      }
    }

    if (!tokenValue && cssValue.startsWith("var(--size-n")) {
      const numPart = cssValue.slice("var(--size-n".length, -1);
      if (numPart && !numPart.includes("-")) {
        tokenValue = `Size.n${numPart}`;
      }
    }

    if (tokenValue) {
      conversions.push({ cssProp, cssValue, overrideProp, tokenValue });
    }
  }

  return {
    fixable: conversions.length > 0,
    conversions,
  };
}
