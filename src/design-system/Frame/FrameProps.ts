import type React from "react";
import type {
  AlignToken,
  CursorToken,
  JustifyToken,
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
import type { Radius2Token } from "../token";

// --- 1. LOOSE OVERRIDES (Token | string | number) ---
// Used inside 'override={{ ... }}' prop
export interface FrameOverrides {
  // Layout
  w?: WidthToken;
  h?: HeightToken;

  minWidth?: WidthToken;
  minHeight?: HeightToken;
  maxWidth?: MaxWidthToken;
  maxHeight?: MaxHeightToken;

  // Grid
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  // Flex
  row?: boolean; // Used internally by Layout presets
  wrap?: "wrap" | "nowrap" | "wrap-reverse";

  fill?: boolean;
  flex?: boolean | number | string;
  align?: AlignToken;
  justify?: JustifyToken;
  pack?: boolean;

  p?: SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  pt?: SpaceToken;
  pb?: SpaceToken;
  pl?: SpaceToken;
  pr?: SpaceToken;

  gap?: SpaceToken;

  // border (override: individual sides)
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;

  // BorderRadius
  r?: RadiusToken;

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

  w?: WidthToken;
  h?: HeightToken;

  row?: boolean;
  wrap?: "wrap" | "nowrap" | "wrap-reverse";

  fill?: boolean;
  flex?: boolean | number | string;
  pack?: boolean;

  // Grid
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  // Surface
  surface?: SurfaceToken;
  rounded?: Radius2Token | boolean;
  clip?: boolean;

  // Border
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
