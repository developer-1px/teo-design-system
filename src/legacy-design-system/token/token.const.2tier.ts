/**
 * TMDK 2-Tier Semantic Tokens (Branded Type Compatible)
 *
 * - Composed from 1-Tier Branded tokens
 * - Component-specific or Semantic-specific
 * - Values are automatically Branded (inherit from 1-Tier)
 *
 * @example
 * ```typescript
 * ActionSize.md.height  // 40 (SizeToken - Branded)
 * ActionSize.md.padding // 8 (SpaceToken - Branded)
 * ```
 */

import { FontSize, IconSize, Size, Space } from "./token.const.1tier";

// ---------------------------------
// Action Size
// ---------------------------------
export const ActionSizeScale = ["xs", "sm", "md", "lg", "xl"] as const;
export type ActionSizeScale = (typeof ActionSizeScale)[number];
export type ActionSizeKey = ActionSizeScale;

export const ActionSize = {
  xs: {
    height: Size.n24,
    icon: IconSize.n14,
    padding: Space.n6,
    fontSize: FontSize.n12,
  },
  sm: {
    height: Size.n32,
    icon: IconSize.n16,
    padding: Space.n8,
    fontSize: FontSize.n13,
  },
  md: {
    height: Size.n40,
    icon: IconSize.n20,
    padding: Space.n10,
    fontSize: FontSize.n14,
  },
  lg: {
    height: Size.n48,
    icon: IconSize.n24,
    padding: Space.n12,
    fontSize: FontSize.n16,
  },
  xl: {
    height: Size.n56,
    icon: IconSize.n28,
    padding: Space.n16,
    fontSize: FontSize.n18,
  },
} as const;

export type ActionSizeToken = keyof typeof ActionSize;

// ---------------------------------
// Button Size
// ---------------------------------
export const ButtonSizeScale = ["xs", "sm", "md", "lg", "xl"] as const;
export type ButtonSizeScale = (typeof ButtonSizeScale)[number];
export type ButtonSizeKey = ButtonSizeScale;

export const ButtonSize = {
  xs: {
    height: Size.n24,
    icon: IconSize.n14,
    padding: Space.n6,
    fontSize: FontSize.n12,
  },
  sm: {
    height: Size.n32,
    icon: IconSize.n16,
    padding: Space.n8,
    fontSize: FontSize.n13,
  },
  md: {
    height: Size.n40,
    icon: IconSize.n20,
    padding: Space.n12,
    fontSize: FontSize.n14,
  },
  lg: {
    height: Size.n48,
    icon: IconSize.n24,
    padding: Space.n16,
    fontSize: FontSize.n16,
  },
  xl: {
    height: Size.n56,
    icon: IconSize.n28,
    padding: Space.n20,
    fontSize: FontSize.n18,
  },
} as const;

export type ButtonSizeToken = keyof typeof ButtonSize;

// ---------------------------------
// Input Size
// ---------------------------------
export const InputSizeScale = ["sm", "md", "lg"] as const;
export type InputSizeScale = (typeof InputSizeScale)[number];
export type InputSizeKey = InputSizeScale;

export const InputSize = {
  sm: {
    height: Size.n32,
    padding: Space.n8,
    fontSize: FontSize.n13,
    iconSize: IconSize.n16,
  },
  md: {
    height: Size.n40,
    padding: Space.n12,
    fontSize: FontSize.n14,
    iconSize: IconSize.n20,
  },
  lg: {
    height: Size.n48,
    padding: Space.n16,
    fontSize: FontSize.n16,
    iconSize: IconSize.n24,
  },
} as const;

export type InputSizeToken = keyof typeof InputSize;


// ---------------------------------
// Shadow - DEPRECATED
// ---------------------------------
// Shadow tokens have been removed from the spec.
// Use Elevation tokens directly in style={{ boxShadow: ... }} if needed.
