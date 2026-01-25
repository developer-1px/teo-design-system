import { Radius } from "./token.const.1tier";
import type { Brand } from "./lib/brand";

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
export type Radius2Token = Brand<string, "Radius2">;

export const Radius2 = {
    none: Radius.n0 as unknown as Radius2Token,
    sm: Radius.n4 as unknown as Radius2Token,
    md: Radius.n6 as unknown as Radius2Token,
    lg: Radius.n12 as unknown as Radius2Token,
    xl: Radius.n16 as unknown as Radius2Token,
    "2xl": Radius.n20 as unknown as Radius2Token,
    "3xl": Radius.n24 as unknown as Radius2Token,
    full: Radius.n9999 as unknown as Radius2Token,
} as const;
