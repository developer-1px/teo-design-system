

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

export type TypographyVariant = 1 | 2 | 3 | 4 | 5 | 6;
export type FontWeight = "bold" | "regular" | "medium";

export type FrameSizeToken =
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | 13
  | 16 // Components
  | 50
  | 55
  | 60
  | 65
  | 70
  | 80
  | "header"
  | "action"; // Layout

export type AlignToken = "start" | "center" | "end" | "stretch" | "baseline";
export type JustifyToken =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export type BorderToken = boolean | "top" | "bottom" | "left" | "right";
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

