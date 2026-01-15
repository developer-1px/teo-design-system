/**
 * TMDK 2-Tier Semantic Tokens
 * - Composed from 1-Tier tokens
 * - Component-specific or Semantic-specific
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
