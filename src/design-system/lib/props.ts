import type React from "react";
import type {
  OpacityToken,
  SizeToken,
  SpaceToken,
} from "../token/token.const.1tier.ts";

import type {
  AlignToken,
  CursorToken,
  JustifyToken,
  OverflowToken,
  SurfaceToken,
  RoundedToken,
  ShadowToken,
} from "./types.ts";

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

  w?: SizeToken
  h?: SizeToken

  flex?: boolean | number | string;
  row?: boolean;
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  fill?: boolean;

  minWidth?: SizeToken
  minHeight?: SizeToken
  maxWidth?: SizeToken
  maxHeight?: SizeToken

  // Grid
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  align?: AlignToken;
  justify?: JustifyToken;

  // Surface
  surface?: SurfaceToken;
  rounded?: RoundedToken | (string & {}) | number;
  overflow?: OverflowToken;
  cursor?: CursorToken;

  // Visual
  shadow?: ShadowToken;
  opacity?: OpacityToken | number;
  ratio?: string;
  border?: boolean | string;
  borderColor?: string;

  style?: React.CSSProperties;
  className?: string;
}

import type {
  WidthToken,
  HeightToken,
  MaxWidthToken,
  MaxHeightToken
} from "./types.ts";

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
  pack?: boolean;

  w?: WidthToken;
  h?: HeightToken;

  flex?: boolean | number;
  row?: boolean;
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  fill?: boolean;

  minWidth?: WidthToken;
  minHeight?: HeightToken;
  maxWidth?: MaxWidthToken;
  maxHeight?: MaxHeightToken;

  // Grid
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  align?: AlignToken;
  justify?: JustifyToken;

  // Surface
  surface?: SurfaceToken;
  rounded?: RoundedToken;
  overflow?: OverflowToken;
  cursor?: CursorToken;

  // Visual
  shadow?: ShadowToken;
  opacity?: OpacityToken;
  ratio?: string;
  border?: boolean | string;
  borderColor?: string;
}

export interface FrameProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "style" | "title" | "color">,
  FrameStrictProps {
  children?: React.ReactNode;
  as?: React.ElementType;

  /**
   * High-level layout preset.
   */
  layout?: import("../Layout").LayoutToken;

  /**
   * Ad-hoc overrides for specific instances.
   * Takes precedence over both 'layout' preset and top-level props.
   * Use this for loose values (numbers, raw strings).
   */
  override?: FrameOverrides;

  // Semantic
  title?: string;
}
