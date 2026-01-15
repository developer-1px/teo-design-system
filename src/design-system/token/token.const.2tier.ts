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

import {FontSize, IconSize, Radius, Size, Space} from "./token.const.1tier"

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
        padding: Space.n4,
        fontSize: FontSize.n12,
    },
    sm: {
        height: Size.n32,
        icon: IconSize.n16,
        padding: Space.n6,
        fontSize: FontSize.n13,
    },
    md: {
        height: Size.n40,
        icon: IconSize.n20,
        padding: Space.n8,
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
// Radius2 (2-Tier: Semantic Aliases)
// ---------------------------------
export const Radius2Scale = [
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "full",
] as const;
export type Radius2Scale = (typeof Radius2Scale)[number];
export type Radius2Key = Radius2Scale;
export type Radius2Token = Radius2Key;

export const Radius2 = {
  none: Radius.n0,
  sm: Radius.n4,
  md: Radius.n6,
  lg: Radius.n12,
  xl: Radius.n16,
  "2xl": Radius.n20,
  "3xl": Radius.n24,
  full: Radius.n9999,
} as const;
