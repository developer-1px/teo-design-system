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

import type { CSSProperties } from "react";
import { FontSize, IconSize, Size, Space } from "./token.const.1tier";
import { px } from "./lib/utils.ts";

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

/**
 * Resolve ActionSize token to CSS properties with px conversion
 *
 * @param size - Action size key (xs, sm, md, lg, xl)
 * @returns CSS properties object with px values
 *
 * @example
 * ```typescript
 * resolveActionSize("md")
 * // Returns: { height: "40px", "--icon-size": "20px", padding: "8px", fontSize: "14px" }
 * ```
 */
export function resolveActionSize(size: ActionSizeToken): CSSProperties & {
  "--icon-size": string;
} {
  const token = ActionSize[size];
  return {
    height: px(token.height),
    "--icon-size": px(token.icon),
    padding: px(token.padding),
    fontSize: px(token.fontSize),
  };
}
