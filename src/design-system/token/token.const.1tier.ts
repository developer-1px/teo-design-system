/**
 * TMDK 1-Tier Numeric Tokens (scale-enforced)
 * - Enforce allowed scales via `type XScale = typeof XScale[number]`
 * - Enforce value format via template literals (e.g. `opacity.n${OpacityScale}`)
 * - Keep string token-key registry style (resolver-friendly)
 */

// ---------------------------------
// Helpers
// ---------------------------------
type ScaleOf<T extends readonly number[]> = T[number];
type KeyOf<T extends readonly number[]> = `n${ScaleOf<T>}`;

// ---------------------------------
// Space (spacing)
// ---------------------------------
export const SpaceScale = [
  0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44,
  48, 56, 64, 72, 80, 88, 96, 112, 128, 144, 160,
] as const;
export type SpaceScale = ScaleOf<typeof SpaceScale>;
export type SpaceKey = KeyOf<typeof SpaceScale>;

export const Space = {
  n0: "space.n0",
  n2: "space.n2",
  n4: "space.n4",
  n6: "space.n6",
  n8: "space.n8",
  n10: "space.n10",
  n12: "space.n12",
  n14: "space.n14",
  n16: "space.n16",
  n18: "space.n18",
  n20: "space.n20",
  n22: "space.n22",
  n24: "space.n24",
  n26: "space.n26",
  n28: "space.n28",
  n30: "space.n30",
  n32: "space.n32",
  n36: "space.n36",
  n40: "space.n40",
  n44: "space.n44",
  n48: "space.n48",
  n56: "space.n56",
  n64: "space.n64",
  n72: "space.n72",
  n80: "space.n80",
  n88: "space.n88",
  n96: "space.n96",
  n112: "space.n112",
  n128: "space.n128",
  n144: "space.n144",
  n160: "space.n160",
} as const satisfies Record<SpaceKey, `space.n${SpaceScale}`>;

export type SpaceToken = (typeof Space)[keyof typeof Space];

// ---------------------------------
// Icon Size
// ---------------------------------
export const IconSizeScale = [10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40,
  44, 48, 56, 64, 72, 80, 88, 96, 112, 128, 144, 160,
  192,  // 대형 empty / landing
  256,  // 브랜딩 / splash
  384,  // 풀섹션 비주얼
  512,  // 최대치 (hero / cover 급)
] as const;

export type IconSizeScale = ScaleOf<typeof IconSizeScale>;
export type IconSizeKey = KeyOf<typeof IconSizeScale>;

export const IconSize = {
  n10: "icon-size.n10",
  n12: "icon-size.n12",
  n14: "icon-size.n14",
  n16: "icon-size.n16",
  n18: "icon-size.n18",
  n20: "icon-size.n20",
  n22: "icon-size.n22",
  n24: "icon-size.n24",
  n28: "icon-size.n28",
  n32: "icon-size.n32",
  n36: "icon-size.n36",
  n40: "icon-size.n40",
  n44: "icon-size.n44",
  n48: "icon-size.n48",
  n56: "icon-size.n56",
  n64: "icon-size.n64",
  n72: "icon-size.n72",
  n80: "icon-size.n80",
  n88: "icon-size.n88",
  n96: "icon-size.n96",
  n112: "icon-size.n112",
  n128: "icon-size.n128",
  n144: "icon-size.n144",
  n160: "icon-size.n160",
  n192: "icon-size.n192",
  n256: "icon-size.n256",
  n384: "icon-size.n384",
  n512: "icon-size.n512",
} as const satisfies Record<IconSizeKey, `icon-size.n${IconSizeScale}`>;

export type IconSizeToken = (typeof IconSize)[keyof typeof IconSize];

// ---------------------------------
// Size (container / layout)
// ---------------------------------
// ---------------------------------
// Size (container / layout)
// ---------------------------------
export const SizeScale = [
  0, 4, 8, 12, 16, 20, 24, 32, 36, 40, 44, 48, 56, 64, 72, 80, 88, 96, 112, 128, 144, 160, 176, 192, 208,
  224, 240, 256, 288, 320, 384, 448, 512, 576, 640, 704, 768,
] as const;
export type SizeScale = ScaleOf<typeof SizeScale>;
export type SizeNumericKey = KeyOf<typeof SizeScale>;

export const SizeKeywords = ["full", "screen", "min", "max", "fit", "auto"] as const;
export type SizeKeyword = (typeof SizeKeywords)[number];

export type SizeKey = SizeNumericKey | SizeKeyword;
export type SizeValue = `size.n${SizeScale}` | `size.${SizeKeyword}`;

export const Size = {
  n0: "size.n0",
  n4: "size.n4",
  n8: "size.n8",
  n12: "size.n12",
  n16: "size.n16",
  n20: "size.n20",
  n24: "size.n24",
  n32: "size.n32",
  n36: "size.n36",
  n40: "size.n40",
  n44: "size.n44",
  n48: "size.n48",
  n56: "size.n56",
  n64: "size.n64",
  n72: "size.n72",
  n80: "size.n80",
  n88: "size.n88",
  n96: "size.n96",
  n112: "size.n112",
  n128: "size.n128",
  n144: "size.n144",
  n160: "size.n160",
  n176: "size.n176",
  n192: "size.n192",
  n208: "size.n208",
  n224: "size.n224",
  n240: "size.n240",
  n256: "size.n256",
  n288: "size.n288",
  n320: "size.n320",
  n384: "size.n384",
  n448: "size.n448",
  n512: "size.n512",
  n576: "size.n576",
  n640: "size.n640",
  n704: "size.n704",
  n768: "size.n768",

  full: "size.full",
  screen: "size.screen",
  min: "size.min",
  max: "size.max",
  fit: "size.fit",
  auto: "size.auto",
} as const satisfies Record<SizeKey, SizeValue>;

export type SizeToken = (typeof Size)[keyof typeof Size];

// ---------------------------------
// Container (max widths)
// ---------------------------------
export const ContainerSizeScale = [0, 320, 480, 640, 768, 800, 1024, 1280, 1440, 1536, 1600] as const;
export type ContainerSizeScale = ScaleOf<typeof ContainerSizeScale>;
export type ContainerSizeKey = KeyOf<typeof ContainerSizeScale>;

export const ContainerSize = {
  n0: "container.n0",
  n320: "container.n320",
  n480: "container.n480",
  n640: "container.n640",
  n768: "container.n768",
  n800: "container.n800",
  n1024: "container.n1024",
  n1280: "container.n1280",
  n1440: "container.n1440",
  n1536: "container.n1536",
  n1600: "container.n1600",
} as const satisfies Record<ContainerSizeKey, `container.n${ContainerSizeScale}`>;

export type ContainerToken = (typeof ContainerSize)[keyof typeof ContainerSize];

// ---------------------------------
// Sizing unions (safe)
// ---------------------------------
export type LengthToken = SizeToken; // Removed SpaceToken to enforce strict absolute sizing
export type MaxWidthToken = ContainerToken;
export type MaxHeightToken = ContainerToken;
export type WidthToken = SizeToken | ContainerToken;
export type HeightToken = SizeToken | ContainerToken;
export type SizingToken = WidthToken | MaxWidthToken | MaxHeightToken;

// ---------------------------------
// Radius
// ---------------------------------
export const RadiusScale = [0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32] as const;
export type RadiusScale = ScaleOf<typeof RadiusScale>;
export type RadiusNumericKey = KeyOf<typeof RadiusScale>;

export const RadiusAliases = ["none", "sm", "md", "lg", "xl", "2xl", "3xl", "soft", "full"] as const;
export type RadiusAliasKey = (typeof RadiusAliases)[number];

export type RadiusKey = RadiusNumericKey | RadiusAliasKey;
export type RadiusValue = `radius.n${RadiusScale}`;

export const Radius = {
  n0: "radius.n0",
  n2: "radius.n2",
  n4: "radius.n4",
  n6: "radius.n6",
  n8: "radius.n8",
  n10: "radius.n10",
  n12: "radius.n12",
  n14: "radius.n14",
  n16: "radius.n16",
  n20: "radius.n20",
  n24: "radius.n24",
  n28: "radius.n28",
  n32: "radius.n32",

  // aliases (compat)
  none: "radius.n0",
  sm: "radius.n4",
  md: "radius.n6",
  lg: "radius.n12",
  xl: "radius.n16",
  "2xl": "radius.n20",
  "3xl": "radius.n24",
  soft: "radius.n8",
  full: "radius.n32",
} as const satisfies Record<RadiusKey, RadiusValue>;

export type RadiusToken = (typeof Radius)[keyof typeof Radius];

// ---------------------------------
// BorderWidth
// ---------------------------------
export const BorderWidthScale = [0, 1, 2, 3, 4, 6] as const;
export type BorderWidthScale = ScaleOf<typeof BorderWidthScale>;
export type BorderWidthKey = KeyOf<typeof BorderWidthScale>;

export const BorderWidth = {
  n0: "border-width.n0",
  n1: "border-width.n1",
  n2: "border-width.n2",
  n3: "border-width.n3",
  n4: "border-width.n4",
  n6: "border-width.n6",
} as const satisfies Record<BorderWidthKey, `border-width.n${BorderWidthScale}`>;

export type BorderWidthToken = (typeof BorderWidth)[keyof typeof BorderWidth];

// ---------------------------------
// FontSize
// ---------------------------------
export const FontSizeScale = [9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64] as const;
export type FontSizeScale = ScaleOf<typeof FontSizeScale>;
export type FontSizeKey = KeyOf<typeof FontSizeScale>;

export const FontSize = {
  n9: "font-size.n9",
  n10: "font-size.n10",
  n11: "font-size.n11",
  n12: "font-size.n12",
  n13: "font-size.n13",
  n14: "font-size.n14",
  n15: "font-size.n15",
  n16: "font-size.n16",
  n18: "font-size.n18",
  n20: "font-size.n20",
  n22: "font-size.n22",
  n24: "font-size.n24",
  n26: "font-size.n26",
  n28: "font-size.n28",
  n32: "font-size.n32",
  n36: "font-size.n36",
  n40: "font-size.n40",
  n48: "font-size.n48",
  n56: "font-size.n56",
  n64: "font-size.n64",
} as const satisfies Record<FontSizeKey, `font-size.n${FontSizeScale}`>;

export type FontSizeToken = (typeof FontSize)[keyof typeof FontSize];

// ---------------------------------
// LineHeight
// ---------------------------------
export const LineHeightScale = [100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 190, 200, 210, 220] as const;
export type LineHeightScale = ScaleOf<typeof LineHeightScale>;
export type LineHeightKey = KeyOf<typeof LineHeightScale>;

export const LineHeight = {
  n100: "line-height.n100",
  n105: "line-height.n105",
  n110: "line-height.n110",
  n115: "line-height.n115",
  n120: "line-height.n120",
  n125: "line-height.n125",
  n130: "line-height.n130",
  n135: "line-height.n135",
  n140: "line-height.n140",
  n145: "line-height.n145",
  n150: "line-height.n150",
  n155: "line-height.n155",
  n160: "line-height.n160",
  n165: "line-height.n165",
  n170: "line-height.n170",
  n175: "line-height.n175",
  n180: "line-height.n180",
  n190: "line-height.n190",
  n200: "line-height.n200",
  n210: "line-height.n210",
  n220: "line-height.n220",
} as const satisfies Record<LineHeightKey, `line-height.n${LineHeightScale}`>;

export type LineHeightToken = (typeof LineHeight)[keyof typeof LineHeight];

// ---------------------------------
// Opacity
// ---------------------------------
export const OpacityScale = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100] as const;
export type OpacityScale = ScaleOf<typeof OpacityScale>;
export type OpacityKey = KeyOf<typeof OpacityScale>;

export const Opacity = {
  n0: "opacity.n0",
  n5: "opacity.n5",
  n10: "opacity.n10",
  n15: "opacity.n15",
  n20: "opacity.n20",
  n25: "opacity.n25",
  n30: "opacity.n30",
  n35: "opacity.n35",
  n40: "opacity.n40",
  n45: "opacity.n45",
  n50: "opacity.n50",
  n55: "opacity.n55",
  n60: "opacity.n60",
  n65: "opacity.n65",
  n70: "opacity.n70",
  n75: "opacity.n75",
  n80: "opacity.n80",
  n85: "opacity.n85",
  n90: "opacity.n90",
  n95: "opacity.n95",
  n100: "opacity.n100",
} as const satisfies Record<OpacityKey, `opacity.n${OpacityScale}`>;

export type OpacityToken = (typeof Opacity)[keyof typeof Opacity];

// ---------------------------------
// ZIndex
// ---------------------------------
export const ZIndexScale = [0, 1, 2, 3, 5, 10, 20, 30, 40, 50, 75, 100, 200] as const;
export type ZIndexScale = ScaleOf<typeof ZIndexScale>;
export type ZIndexKey = KeyOf<typeof ZIndexScale>;

export const ZIndex = {
  n0: "z-index.n0",
  n1: "z-index.n1",
  n2: "z-index.n2",
  n3: "z-index.n3",
  n5: "z-index.n5",
  n10: "z-index.n10",
  n20: "z-index.n20",
  n30: "z-index.n30",
  n40: "z-index.n40",
  n50: "z-index.n50",
  n75: "z-index.n75",
  n100: "z-index.n100",
  n200: "z-index.n200",
} as const satisfies Record<ZIndexKey, `z-index.n${ZIndexScale}`>;

export type ZIndexToken = (typeof ZIndex)[keyof typeof ZIndex];

// ---------------------------------
// Elevation
// ---------------------------------
export const ElevationScale = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12] as const;
export type ElevationScale = ScaleOf<typeof ElevationScale>;
export type ElevationKey = KeyOf<typeof ElevationScale>;

export const Elevation = {
  n0: "elevation.n0",
  n1: "elevation.n1",
  n2: "elevation.n2",
  n3: "elevation.n3",
  n4: "elevation.n4",
  n5: "elevation.n5",
  n6: "elevation.n6",
  n8: "elevation.n8",
  n10: "elevation.n10",
  n12: "elevation.n12",
} as const satisfies Record<ElevationKey, `elevation.n${ElevationScale}`>;

export type ElevationToken = (typeof Elevation)[keyof typeof Elevation];

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
} as const satisfies Record<AspectRatioKey, `aspect-ratio.n${AspectRatioScale}`>;

export type AspectRatioToken = (typeof AspectRatio)[keyof typeof AspectRatio];

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

export type ShadowToken = (typeof Shadow)[keyof typeof Shadow];
