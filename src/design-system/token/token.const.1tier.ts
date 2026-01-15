/**
 * TMDK 1-Tier Numeric Tokens (Branded Type - Enum Enforced)
 *
 * - Branded Type으로 Enum 강제: AI가 직접 숫자 입력 불가
 * - Dead code 추적 가능: TypeScript unused exports로 감지
 * - Zero runtime overhead: 타입만 추가, 런타임 코드 동일
 *
 * @example
 * ```typescript
 * px(Space.n8);   // ✅ OK
 * px(8);          // ❌ Error: number is not SpaceToken
 * ```
 *
 * @see src/design-system/token/brand.ts
 * @see docs/token-enum-enforcement-strategies.md
 */

import type {
  BorderWidthToken,
  ContainerSizeToken,
  ElevationToken,
  FontSizeToken,
  IconSizeToken,
  LineHeightToken,
  OpacityToken,
  RadiusToken,
  SizeToken,
  SpaceToken,
  ZIndexToken,
} from "./brand";

// Re-export branded types for consumer convenience
export type {
  BorderWidthToken,
  ContainerSizeToken,
  ElevationToken,
  FontSizeToken,
  IconSizeToken,
  LineHeightToken,
  OpacityToken,
  RadiusToken,
  SizeToken,
  SpaceToken,
  ZIndexToken,
} from "./brand";

// ---------------------------------
// Helpers
// ---------------------------------
type ScaleOf<T extends readonly number[]> = T[number];
type KeyOf<T extends readonly number[]> = `n${ScaleOf<T>}`;

// ---------------------------------
// Space (spacing)
// ---------------------------------
export const SpaceScale = [
  0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48,
  56, 64, 72, 80, 88, 96, 112, 128, 144, 160,
] as const;
export type SpaceScale = ScaleOf<typeof SpaceScale>;
export type SpaceKey = KeyOf<typeof SpaceScale>;

export const Space = {
  n0: 0 as SpaceToken,
  n2: 2 as SpaceToken,
  n4: 4 as SpaceToken,
  n6: 6 as SpaceToken,
  n8: 8 as SpaceToken,
  n10: 10 as SpaceToken,
  n12: 12 as SpaceToken,
  n14: 14 as SpaceToken,
  n16: 16 as SpaceToken,
  n18: 18 as SpaceToken,
  n20: 20 as SpaceToken,
  n22: 22 as SpaceToken,
  n24: 24 as SpaceToken,
  n26: 26 as SpaceToken,
  n28: 28 as SpaceToken,
  n30: 30 as SpaceToken,
  n32: 32 as SpaceToken,
  n36: 36 as SpaceToken,
  n40: 40 as SpaceToken,
  n44: 44 as SpaceToken,
  n48: 48 as SpaceToken,
  n56: 56 as SpaceToken,
  n64: 64 as SpaceToken,
  n72: 72 as SpaceToken,
  n80: 80 as SpaceToken,
  n88: 88 as SpaceToken,
  n96: 96 as SpaceToken,
  n112: 112 as SpaceToken,
  n128: 128 as SpaceToken,
  n144: 144 as SpaceToken,
  n160: 160 as SpaceToken,
} as const satisfies Record<SpaceKey, SpaceToken>;

// ---------------------------------
// Icon Size
// ---------------------------------
export const IconSizeScale = [
  10,
  12,
  14,
  16,
  18,
  20,
  22,
  24,
  28,
  32,
  36,
  40,
  44,
  48,
  56,
  64,
  72,
  80,
  88,
  96,
  112,
  128,
  144,
  160,
  192, // 대형 empty / landing
  256, // 브랜딩 / splash
  384, // 풀섹션 비주얼
  512, // 최대치 (hero / cover 급)
] as const;

export type IconSizeScale = ScaleOf<typeof IconSizeScale>;
export type IconSizeKey = KeyOf<typeof IconSizeScale>;

export const IconSize = {
  n10: 10 as IconSizeToken,
  n12: 12 as IconSizeToken,
  n14: 14 as IconSizeToken,
  n16: 16 as IconSizeToken,
  n18: 18 as IconSizeToken,
  n20: 20 as IconSizeToken,
  n22: 22 as IconSizeToken,
  n24: 24 as IconSizeToken,
  n28: 28 as IconSizeToken,
  n32: 32 as IconSizeToken,
  n36: 36 as IconSizeToken,
  n40: 40 as IconSizeToken,
  n44: 44 as IconSizeToken,
  n48: 48 as IconSizeToken,
  n56: 56 as IconSizeToken,
  n64: 64 as IconSizeToken,
  n72: 72 as IconSizeToken,
  n80: 80 as IconSizeToken,
  n88: 88 as IconSizeToken,
  n96: 96 as IconSizeToken,
  n112: 112 as IconSizeToken,
  n128: 128 as IconSizeToken,
  n144: 144 as IconSizeToken,
  n160: 160 as IconSizeToken,
  n192: 192 as IconSizeToken,
  n256: 256 as IconSizeToken,
  n384: 384 as IconSizeToken,
  n512: 512 as IconSizeToken,
} as const satisfies Record<IconSizeKey, IconSizeToken>;


// ---------------------------------
// Size (container / layout)
// ---------------------------------
// ---------------------------------
// Size (container / layout)
// ---------------------------------
export const SizeScale = [
  0, 4, 8, 12, 16, 20, 24, 32, 36, 40, 44, 48, 56, 64, 72, 80, 88, 96, 112, 128,
  144, 160, 176, 192, 208, 224, 240, 256, 288, 320, 384, 448, 512, 576, 640,
  704, 768,
] as const;
export type SizeScale = ScaleOf<typeof SizeScale>;
export type SizeNumericKey = KeyOf<typeof SizeScale>;

export const SizeKeywords = [
  "full",
  "screen",
  "min",
  "max",
  "fit",
  "auto",
] as const;
export type SizeKeyword = (typeof SizeKeywords)[number];

export type SizeKey = SizeNumericKey | SizeKeyword;

export const Size = {
  n0: 0 as SizeToken,
  n4: 4 as SizeToken,
  n8: 8 as SizeToken,
  n12: 12 as SizeToken,
  n16: 16 as SizeToken,
  n20: 20 as SizeToken,
  n24: 24 as SizeToken,
  n32: 32 as SizeToken,
  n36: 36 as SizeToken,
  n40: 40 as SizeToken,
  n44: 44 as SizeToken,
  n48: 48 as SizeToken,
  n56: 56 as SizeToken,
  n64: 64 as SizeToken,
  n72: 72 as SizeToken,
  n80: 80 as SizeToken,
  n88: 88 as SizeToken,
  n96: 96 as SizeToken,
  n112: 112 as SizeToken,
  n128: 128 as SizeToken,
  n144: 144 as SizeToken,
  n160: 160 as SizeToken,
  n176: 176 as SizeToken,
  n192: 192 as SizeToken,
  n208: 208 as SizeToken,
  n224: 224 as SizeToken,
  n240: 240 as SizeToken,
  n256: 256 as SizeToken,
  n288: 288 as SizeToken,
  n320: 320 as SizeToken,
  n384: 384 as SizeToken,
  n448: 448 as SizeToken,
  n512: 512 as SizeToken,
  n576: 576 as SizeToken,
  n640: 640 as SizeToken,
  n704: 704 as SizeToken,
  n768: 768 as SizeToken,

  // Keywords (CSS values, now branded for enum enforcement)
  full: "100%" as SizeToken,
  screen: "100vh" as SizeToken,
  min: "min-content" as SizeToken,
  max: "max-content" as SizeToken,
  fit: "fit-content" as SizeToken,
  auto: "auto" as SizeToken,
} as const satisfies Record<SizeKey, SizeToken>;


// ---------------------------------
// Container (max widths)
// ---------------------------------
export const ContainerSizeScale = [
  0, 320, 480, 640, 768, 800, 1024, 1280, 1440, 1536, 1600,
] as const;
export type ContainerSizeScale = ScaleOf<typeof ContainerSizeScale>;
export type ContainerSizeKey = KeyOf<typeof ContainerSizeScale>;

export const ContainerSize = {
  n0: 0 as ContainerSizeToken,
  n320: 320 as ContainerSizeToken,
  n480: 480 as ContainerSizeToken,
  n640: 640 as ContainerSizeToken,
  n768: 768 as ContainerSizeToken,
  n800: 800 as ContainerSizeToken,
  n1024: 1024 as ContainerSizeToken,
  n1280: 1280 as ContainerSizeToken,
  n1440: 1440 as ContainerSizeToken,
  n1536: 1536 as ContainerSizeToken,
  n1600: 1600 as ContainerSizeToken,
} as const satisfies Record<ContainerSizeKey, ContainerSizeToken>;

// ---------------------------------
// Sizing unions (safe)
// ---------------------------------
export type MaxWidthToken = ContainerSizeToken;
export type MaxHeightToken = ContainerSizeToken;
export type WidthToken = SizeToken | ContainerSizeToken;
export type HeightToken = SizeToken | ContainerSizeToken;

// ---------------------------------
// Radius
// ---------------------------------
export const RadiusScale = [
  0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32,
] as const;
export type RadiusScale = ScaleOf<typeof RadiusScale>;
export type RadiusNumericKey = KeyOf<typeof RadiusScale>;

export const RadiusAliases = [
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "soft",
  "full",
] as const;
export type RadiusAliasKey = (typeof RadiusAliases)[number];

export type RadiusKey = RadiusNumericKey | RadiusAliasKey;
export type RadiusValue = RadiusToken;

export const Radius = {
  n0: 0 as RadiusToken,
  n2: 2 as RadiusToken,
  n4: 4 as RadiusToken,
  n6: 6 as RadiusToken,
  n8: 8 as RadiusToken,
  n10: 10 as RadiusToken,
  n12: 12 as RadiusToken,
  n14: 14 as RadiusToken,
  n16: 16 as RadiusToken,
  n20: 20 as RadiusToken,
  n24: 24 as RadiusToken,
  n28: 28 as RadiusToken,
  n32: 32 as RadiusToken,

  // aliases (compat)
  none: 0 as RadiusToken,
  sm: 4 as RadiusToken,
  md: 6 as RadiusToken,
  lg: 12 as RadiusToken,
  xl: 16 as RadiusToken,
  "2xl": 20 as RadiusToken,
  "3xl": 24 as RadiusToken,
  soft: 8 as RadiusToken,
  full: 32 as RadiusToken,
} as const satisfies Record<RadiusKey, RadiusValue>;


// ---------------------------------
// BorderWidth
// ---------------------------------
export const BorderWidthScale = [0, 1, 2, 3, 4, 6] as const;
export type BorderWidthScale = ScaleOf<typeof BorderWidthScale>;
export type BorderWidthKey = KeyOf<typeof BorderWidthScale>;

export const BorderWidth = {
  n0: 0 as BorderWidthToken,
  n1: 1 as BorderWidthToken,
  n2: 2 as BorderWidthToken,
  n3: 3 as BorderWidthToken,
  n4: 4 as BorderWidthToken,
  n6: 6 as BorderWidthToken,
} as const satisfies Record<BorderWidthKey, BorderWidthToken>;

// ---------------------------------
// FontSize
// ---------------------------------
export const FontSizeScale = [
  9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64,
  72, 80, 96, 112, 128,
] as const;
export type FontSizeScale = ScaleOf<typeof FontSizeScale>;
export type FontSizeKey = KeyOf<typeof FontSizeScale>;

export const FontSize = {
  n9: 9 as FontSizeToken,
  n10: 10 as FontSizeToken,
  n11: 11 as FontSizeToken,
  n12: 12 as FontSizeToken,
  n13: 13 as FontSizeToken,
  n14: 14 as FontSizeToken,
  n15: 15 as FontSizeToken,
  n16: 16 as FontSizeToken,
  n18: 18 as FontSizeToken,
  n20: 20 as FontSizeToken,
  n22: 22 as FontSizeToken,
  n24: 24 as FontSizeToken,
  n26: 26 as FontSizeToken,
  n28: 28 as FontSizeToken,
  n32: 32 as FontSizeToken,
  n36: 36 as FontSizeToken,
  n40: 40 as FontSizeToken,
  n48: 48 as FontSizeToken,
  n56: 56 as FontSizeToken,
  n64: 64 as FontSizeToken,
  n72: 72 as FontSizeToken,
  n80: 80 as FontSizeToken,
  n96: 96 as FontSizeToken,
  n112: 112 as FontSizeToken,
  n128: 128 as FontSizeToken,
} as const satisfies Record<FontSizeKey, FontSizeToken>;


// ---------------------------------
// LineHeight
// ---------------------------------
export const LineHeightScale = [
  100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170,
  175, 180, 190, 200, 210, 220,
] as const;
export type LineHeightScale = ScaleOf<typeof LineHeightScale>;
export type LineHeightKey = KeyOf<typeof LineHeightScale>;

export const LineHeight = {
  n100: 100 as LineHeightToken,
  n105: 105 as LineHeightToken,
  n110: 110 as LineHeightToken,
  n115: 115 as LineHeightToken,
  n120: 120 as LineHeightToken,
  n125: 125 as LineHeightToken,
  n130: 130 as LineHeightToken,
  n135: 135 as LineHeightToken,
  n140: 140 as LineHeightToken,
  n145: 145 as LineHeightToken,
  n150: 150 as LineHeightToken,
  n155: 155 as LineHeightToken,
  n160: 160 as LineHeightToken,
  n165: 165 as LineHeightToken,
  n170: 170 as LineHeightToken,
  n175: 175 as LineHeightToken,
  n180: 180 as LineHeightToken,
  n190: 190 as LineHeightToken,
  n200: 200 as LineHeightToken,
  n210: 210 as LineHeightToken,
  n220: 220 as LineHeightToken,
} as const satisfies Record<LineHeightKey, LineHeightToken>;


// ---------------------------------
// Opacity
// ---------------------------------
export const OpacityScale = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
  100,
] as const;
export type OpacityScale = ScaleOf<typeof OpacityScale>;
export type OpacityKey = KeyOf<typeof OpacityScale>;

export const Opacity = {
  n0: 0 as OpacityToken,
  n5: 5 as OpacityToken,
  n10: 10 as OpacityToken,
  n15: 15 as OpacityToken,
  n20: 20 as OpacityToken,
  n25: 25 as OpacityToken,
  n30: 30 as OpacityToken,
  n35: 35 as OpacityToken,
  n40: 40 as OpacityToken,
  n45: 45 as OpacityToken,
  n50: 50 as OpacityToken,
  n55: 55 as OpacityToken,
  n60: 60 as OpacityToken,
  n65: 65 as OpacityToken,
  n70: 70 as OpacityToken,
  n75: 75 as OpacityToken,
  n80: 80 as OpacityToken,
  n85: 85 as OpacityToken,
  n90: 90 as OpacityToken,
  n95: 95 as OpacityToken,
  n100: 100 as OpacityToken,
} as const satisfies Record<OpacityKey, OpacityToken>;


// ---------------------------------
// ZIndex
// ---------------------------------
export const ZIndexScale = [
  0, 1, 2, 3, 5, 10, 20, 30, 40, 50, 75, 100, 200,
] as const;
export type ZIndexScale = ScaleOf<typeof ZIndexScale>;
export type ZIndexKey = KeyOf<typeof ZIndexScale>;

export const ZIndex = {
  n0: 0 as ZIndexToken,
  n1: 1 as ZIndexToken,
  n2: 2 as ZIndexToken,
  n3: 3 as ZIndexToken,
  n5: 5 as ZIndexToken,
  n10: 10 as ZIndexToken,
  n20: 20 as ZIndexToken,
  n30: 30 as ZIndexToken,
  n40: 40 as ZIndexToken,
  n50: 50 as ZIndexToken,
  n75: 75 as ZIndexToken,
  n100: 100 as ZIndexToken,
  n200: 200 as ZIndexToken,
} as const satisfies Record<ZIndexKey, ZIndexToken>;


// ---------------------------------
// Elevation
// ---------------------------------
export const ElevationScale = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12] as const;
export type ElevationScale = ScaleOf<typeof ElevationScale>;
export type ElevationKey = KeyOf<typeof ElevationScale>;

export const Elevation = {
  n0: 0 as ElevationToken,
  n1: 1 as ElevationToken,
  n2: 2 as ElevationToken,
  n3: 3 as ElevationToken,
  n4: 4 as ElevationToken,
  n5: 5 as ElevationToken,
  n6: 6 as ElevationToken,
  n8: 8 as ElevationToken,
  n10: 10 as ElevationToken,
  n12: 12 as ElevationToken,
} as const satisfies Record<ElevationKey, ElevationToken>;


// ---------------------------------
// AspectRatio
// ---------------------------------
export const AspectRatioScale = [
  "1_1",
  "4_3",
  "3_4",
  "16_9",
  "9_16",
  "21_9",
  "2_1",
  "3_2",
  "2_3",
  "5_4",
  "4_5",
] as const;
export type AspectRatioScale = (typeof AspectRatioScale)[number];
export type AspectRatioKey = `n${AspectRatioScale}`;

export const AspectRatio = {
  n1_1: "aspect-ratio.n1_1",
  n4_3: "aspect-ratio.n4_3",
  n3_4: "aspect-ratio.n3_4",
  n16_9: "aspect-ratio.n16_9",
  n9_16: "aspect-ratio.n9_16",
  n21_9: "aspect-ratio.n21_9",
  n2_1: "aspect-ratio.n2_1",
  n3_2: "aspect-ratio.n3_2",
  n2_3: "aspect-ratio.n2_3",
  n5_4: "aspect-ratio.n5_4",
  n4_5: "aspect-ratio.n4_5",
} as const satisfies Record<
  AspectRatioKey,
  `aspect-ratio.n${AspectRatioScale}`
>;

// ---------------------------------
// Shadow (Legacy)
// ---------------------------------
export const ShadowScale = ["sm", "md", "lg", "xl", "2xl"] as const;
export type ShadowScale = (typeof ShadowScale)[number];

export const Shadow = {
  sm: "shadow.sm",
  md: "shadow.md",
  lg: "shadow.lg",
  xl: "shadow.xl",
  "2xl": "shadow.2xl",
} as const satisfies Record<ShadowScale, `shadow.${ShadowScale}`>;
