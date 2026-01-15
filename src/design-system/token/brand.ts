/**
 * Token Branding System
 *
 * Branded Types를 사용하여 토큰 타입의 Enum 강제를 구현합니다.
 *
 * @example
 * ```typescript
 * // ✅ 올바른 사용
 * px(Space.n8);  // SpaceToken
 *
 * // ❌ 타입 에러
 * px(8);  // number는 SpaceToken이 아님
 * ```
 *
 * @see docs/token-enum-enforcement-strategies.md
 */

// ---------------------------------
// Brand Type Definition
// ---------------------------------
declare const __brand: unique symbol;
export type Brand<T, TBrand extends string> = T & { [__brand]: TBrand };

// ---------------------------------
// Token Brands (1-Tier Primitive Tokens)
// ---------------------------------

/** Space token (spacing scale) */
export type SpaceToken = Brand<number, "Space">;

/** Size token (layout/container dimensions) - includes numeric scale and CSS keywords */
export type SizeToken = Brand<
  number | "100%" | "100vh" | "min-content" | "max-content" | "fit-content" | "auto",
  "Size"
>;

/** FontSize token (typography scale) */
export type FontSizeToken = Brand<number, "FontSize">;

/** IconSize token (icon dimensions) */
export type IconSizeToken = Brand<number, "IconSize">;

/** Radius token (border radius) */
export type RadiusToken = Brand<number, "Radius">;

/** BorderWidth token (border thickness) */
export type BorderWidthToken = Brand<number, "BorderWidth">;

/** LineHeight token (typography line-height, percentage) */
export type LineHeightToken = Brand<number, "LineHeight">;

/** Opacity token (transparency, 0-100) */
export type OpacityToken = Brand<number, "Opacity">;

/** ZIndex token (stacking order) */
export type ZIndexToken = Brand<number, "ZIndex">;

/** Elevation token (shadow depth) */
export type ElevationToken = Brand<number, "Elevation">;

/** ContainerSize token (max-width breakpoints) */
export type ContainerSizeToken = Brand<number, "ContainerSize">;

// ---------------------------------
// Union Types (for utility functions)
// ---------------------------------

/** All length-based tokens (Space + Size) */
export type LengthToken = SpaceToken | SizeToken;

/** All typography-related tokens */
export type TypographyToken = FontSizeToken | LineHeightToken;

/** All numeric tokens (for px conversion) */
export type NumericToken =
  | SpaceToken
  | SizeToken
  | FontSizeToken
  | IconSizeToken
  | RadiusToken
  | BorderWidthToken
  | ContainerSizeToken;

/** All percentage-based tokens */
export type PercentageToken = OpacityToken | LineHeightToken;
