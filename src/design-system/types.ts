export type RadiusToken = "none" | "full" | "round";
export type SurfaceToken = "base" | "raised" | "sunken" | "overlay" | "primary" | "selected";

export type ActionVariant = "ghost" | "surface" | "primary";

export type TypographyVariant = 1 | 2 | 3 | 4;
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
	| 80; // Layout

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
	| "not-allowed";
export type ShadowToken = "sm" | "md" | "lg";
