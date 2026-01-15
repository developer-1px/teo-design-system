import type React from "react"
import type {AlignToken, CursorToken, JustifyToken, ShadowToken, SurfaceToken,} from "../lib/types.ts"
import type {
  HeightToken,
  MaxHeightToken,
  MaxWidthToken,
  OpacityToken,
  RadiusToken,
  SpaceToken,
  WidthToken,
} from "../token/token.const.1tier.ts"
import type {Radius2Token} from "../token"

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

  minWidth?: WidthToken;
  minHeight?: HeightToken;
  maxWidth?: MaxWidthToken;
  maxHeight?: MaxHeightToken;

  // border (override: individual sides)
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;

  // BorderRadius
  r?: RadiusToken;

  // Grid
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  align?: AlignToken;
  justify?: JustifyToken;

  // Surface
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

  className?: string;
}

// --- 2. STRICT PROPS (Token Only) ---
// Used as top-level props on <Frame ... />
interface FrameStrictProps {
  // Layout
  gap?: SpaceToken;
  pack?: boolean;

  w?: WidthToken;
  h?: HeightToken;

  row?: boolean;
  wrap?: "wrap" | "nowrap" | "wrap-reverse";

  fill?: boolean;
  flex?: boolean | number | string;

  // Grid
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  align?: AlignToken;
  justify?: JustifyToken;

  // Surface
  surface?: SurfaceToken;
  rounded?: Radius2Token | boolean;
  clip?: boolean;

  // Border (1-tier: all sides)
  border?: boolean;

  // Smart Layout
  scroll?: boolean | "x" | "y";
  shrink?: boolean | number;

  // Visual
  shadow?: ShadowToken;
  opacity?: OpacityToken;
  ratio?: string;
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
