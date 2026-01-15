export type RoundedToken =
  | boolean
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full"
  | "round";
export type SurfaceToken =
  | "base"
  | "raised"
  | "sunken"
  | "overlay"
  | "primary"
  | "selected"
  | "page"
  | "panel"
  | "card"
  | "hover";

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

export type OverflowToken = "hidden" | "auto" | "scroll" | "visible";
export type CursorToken =
  | "pointer"
  | "default"
  | "text"
  | "move"
  | "not-allowed"
  | "grab"
  | "grabbing";
export type ShadowToken = "sm" | "md" | "lg" | "xl" | "2xl";

// Re-export sizing tokens from source of truth
import type {
  FontSizeToken,
  HeightToken,
  MaxHeightToken,
  MaxWidthToken,
  WidthToken,
} from "../token/token.const.1tier";

export type {
  WidthToken,
  HeightToken,
  MaxWidthToken,
  MaxHeightToken,
  FontSizeToken,
};
