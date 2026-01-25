export type RoundedToken =
  | boolean
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

export type SurfaceToken =
  | "ghost"
  | "base"
  | "raised"
  | "sunken"
  | "overlay"
  | "primary"
  | "selected"
  | "panel";

export type ActionVariant = "ghost" | "surface" | "primary";

export type FontWeight = "bold" | "regular" | "medium";

export type AlignToken = "start" | "center" | "end" | "stretch" | "baseline";

export type JustifyToken =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export type CursorToken =
  | "pointer"
  | "default"
  | "text"
  | "move"
  | "not-allowed"
  | "grab"
  | "grabbing";

// Re-export sizing tokens from source of truth
import type {
  FontSizeToken,
  HeightToken,
  MaxHeightToken,
  MaxWidthToken,
  WidthToken,
  ZIndexToken,
} from "../token/token.const.1tier";

export type {
  WidthToken,
  HeightToken,
  MaxWidthToken,
  MaxHeightToken,
  FontSizeToken,
  ZIndexToken,
};
