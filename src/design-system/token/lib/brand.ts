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

/** Space token (spacing scale) - CSS variable string */
export type SpaceToken = Brand<string, "Space">;

/** Size token (layout/container dimensions) - CSS variable string or CSS keywords */
export type SizeToken = Brand<string, "Size">;

/** FontSize token (typography scale) - CSS variable string */
export type FontSizeToken = Brand<string, "FontSize">;

/** IconSize token (icon dimensions) - CSS variable string */
export type IconSizeToken = Brand<string, "IconSize">;

/** Radius token (border radius) - CSS variable string */
export type RadiusToken = Brand<string, "Radius">;

/** BorderWidth token (border thickness) - CSS variable string */
export type BorderWidthToken = Brand<string, "BorderWidth">;

/** LineHeight token (typography line-height) - CSS variable string */
export type LineHeightToken = Brand<string, "LineHeight">;

/** Opacity token (transparency) - CSS variable string */
export type OpacityToken = Brand<string, "Opacity">;

/** ZIndex token (stacking order) - CSS variable string */
export type ZIndexToken = Brand<string, "ZIndex">;

/** Elevation token (shadow depth) - CSS variable string */
export type ElevationToken = Brand<string, "Elevation">;

/** ContainerSize token (max-width breakpoints) - CSS variable string */
export type ContainerSizeToken = Brand<string, "ContainerSize">;

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
