/**
 * TMDK 1-Tier Numeric Tokens
 * Reconstructed from design system tokens.
 */

// Space
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
  n24: "space.n24",
  n28: "space.n28",
  n32: "space.n32",
  n36: "space.n36",
  n40: "space.n40",
  n44: "space.n44",
  n48: "space.n48",
  n56: "space.n56",
  n64: "space.n64",
  n72: "space.n72",
  n80: "space.n80",
  n96: "space.n96",
} as const;

export type SpaceToken = (typeof Space)[keyof typeof Space];

// Size
export const Size = {
  n0: "size.n0",
  n1: "size.n1", // Usually added for 1px
  n2: "size.n2",
  n4: "size.n4",
  n6: "size.n6",
  n8: "size.n8",
  n10: "size.n10",
  n12: "size.n12",
  n14: "size.n14",
  n16: "size.n16",
  n20: "size.n20",
  n24: "size.n24",
  n28: "size.n28",
  n32: "size.n32",
  n36: "size.n36",
  n40: "size.n40",
  n44: "size.n44",
  n48: "size.n48",
  n56: "size.n56",
  n64: "size.n64",
  n72: "size.n72",
  n80: "size.n80",
  n96: "size.n96",
  n112: "size.n112",
  n128: "size.n128",
  n160: "size.n160",
  n192: "size.n192",
  n224: "size.n224",
  n256: "size.n256",
  n320: "size.n320",
  n384: "size.n384",
  n448: "size.n448",
  n512: "size.n512",

  // Keywords
  full: "size.full",
  screen: "size.screen",
  min: "size.min",
  max: "size.max",
  fit: "size.fit",
  auto: "size.auto",
} as const;

export type SizeToken = (typeof Size)[keyof typeof Size];

// Radius
export const Radius = {
  n0: "radius.n0",
  n2: "radius.n2",
  n4: "radius.n4",
  n6: "radius.n6",
  n8: "radius.n8",
  n10: "radius.n10",
  n12: "radius.n12",
  n16: "radius.n16",
  n20: "radius.n20",
  n24: "radius.n24",

  // Keywords common in tokens.css but maybe strict here?
  none: "radius.none",
  sm: "radius.sm",
  md: "radius.md",
  lg: "radius.lg",
  xl: "radius.xl",
  "2xl": "radius.2xl",
  "3xl": "radius.3xl",
  full: "radius.full",
  round: "radius.round",
} as const;

export type RadiusToken = (typeof Radius)[keyof typeof Radius];

// Opacity
export const Opacity = {
  n0: "opacity.n0",
  n5: "opacity.n5",
  n10: "opacity.n10",
  n20: "opacity.n20",
  n30: "opacity.n30",
  n40: "opacity.n40",
  n50: "opacity.n50",
  n60: "opacity.n60",
  n70: "opacity.n70",
  n80: "opacity.n80",
  n90: "opacity.n90",
  n100: "opacity.n100",
} as const;

export type OpacityToken = (typeof Opacity)[keyof typeof Opacity];

// Shadow
export const Shadow = {
  sm: "shadow.sm",
  md: "shadow.md",
  lg: "shadow.lg",
  xl: "shadow.xl",
  "2xl": "shadow.2xl",
} as const;

export type ShadowToken = (typeof Shadow)[keyof typeof Shadow];

// BorderWidth
export const BorderWidth = {
  n0: "border-width.n0",
  n1: "border-width.n1",
  n2: "border-width.n2",
  n3: "border-width.n3",
  n4: "border-width.n4",
} as const;

export type BorderWidthToken = (typeof BorderWidth)[keyof typeof BorderWidth];
