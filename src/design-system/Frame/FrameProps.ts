import type React from "react";
import type {
  AlignToken,
  CursorToken,
  JustifyToken,
  RoundedToken,
  ShadowToken,
  SurfaceToken,
} from "../lib/types.ts";
import type {
  HeightToken,
  MaxHeightToken,
  MaxWidthToken,
  OpacityToken,
  RadiusToken,
  SpaceToken,
  WidthToken,
} from "../token/token.const.1tier.ts";

// --- 1. LOOSE OVERRIDES (Token | string | number) ---
// Used inside 'override={{ ... }}' prop
export interface FrameOverrides {
  // Layout
  p?: SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  pt?: SpaceToken;
  pb?: SpaceToken;
  pl?: SpaceToken;
  pr?: SpaceToken;

  gap?: SpaceToken;
  pack?: boolean;

  w?: WidthToken;
  h?: HeightToken;

  row?: boolean; // Used internally by Layout presets
  wrap?: "wrap" | "nowrap" | "wrap-reverse";

  fill?: boolean;
  flex?: boolean | number | string;

  minWidth?: WidthToken | (string & {});
  minHeight?: HeightToken | (string & {});
  maxWidth?: MaxWidthToken | (string & {});
  maxHeight?: MaxHeightToken | (string & {});

  // Grid
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  align?: AlignToken;
  justify?: JustifyToken;

  // Surface
  surface?: SurfaceToken;
  r?: RadiusToken;
  rounded?: RoundedToken | (string & {}) | number;
  // deprecated overflow removed
  clip?: boolean;

  cursor?: CursorToken;

  // Smart Layout
  scroll?: boolean | "x" | "y";
  shrink?: boolean | number;

  override?: FrameOverrides;

  // Visual
  shadow?: ShadowToken;
  opacity?: OpacityToken;
  ratio?: string;
  border?: boolean | string;
  borderTop?: boolean | string;
  borderRight?: boolean | string;
  borderBottom?: boolean | string;
  borderLeft?: boolean | string;
  borderColor?: string;

  className?: string;
}

// --- 2. STRICT PROPS (Token Only) ---
// Used as top-level props on <Frame ... />
export interface FrameStrictProps {
  // Layout
  p?: SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  pt?: SpaceToken;
  pb?: SpaceToken;
  pl?: SpaceToken;
  pr?: SpaceToken;

  gap?: SpaceToken;

  w?: WidthToken;
  h?: HeightToken;

  row?: boolean; // Flexbox direction (default: column)
  flex?: boolean | number;
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  fill?: boolean;

  minWidth?: WidthToken | (string & {});
  minHeight?: HeightToken | (string & {});
  maxWidth?: MaxWidthToken | (string & {});
  maxHeight?: MaxHeightToken | (string & {});

  // Grid
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  align?: AlignToken;
  justify?: JustifyToken;
  pack?: boolean;

  // Surface
  surface?: SurfaceToken;
  r?: RadiusToken;
  rounded?: RoundedToken;
  clip?: boolean;

  cursor?: CursorToken;

  // Smart Layout
  scroll?: boolean | "x" | "y";
  shrink?: boolean | number;

  // Visual
  shadow?: ShadowToken;
  opacity?: OpacityToken;
  ratio?: string;
  border?: boolean | string;
  borderTop?: boolean | string;
  borderRight?: boolean | string;
  borderBottom?: boolean | string;
  borderLeft?: boolean | string;
  borderColor?: string;
}

export interface FrameProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "color">,
    FrameStrictProps {
  children?: React.ReactNode;
  as?: React.ElementType;

  /**
   * High-level layout preset.
   */
  layout?: import("./Layout/Layout.ts").LayoutToken;

  /**
   * Ad-hoc overrides for specific instances.
   * Takes precedence over both 'layout' preset and top-level props.
   * Use this for loose values (numbers, raw strings).
   */
  override?: FrameOverrides;

  // Semantic
  title?: string;
}
