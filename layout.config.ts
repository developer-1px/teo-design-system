/**
 * Layout Configuration
 *
 * Defines legitimate layout combinations in the system.
 * This file is used to generate `Layout.ts`.
 *
 * Pattern:
 * Row.[Cross].[Main]
 * Col.[Cross].[Main]
 *
 * Cross Axis:
 * - Row: Top, Middle, Bottom, Stretch
 * - Col: Left, Center, Right, Stretch
 *
 * Main Axis:
 * - Start, Center, End, Between
 */

const MAIN_AXIS = ["Start", "Center", "End", "Between"];

const ROW_CROSS_AXIS = ["Top", "Middle", "Bottom", "Stretch", "Baseline"];
const COL_CROSS_AXIS = ["Left", "Center", "Right", "Stretch"];

const ROWS = ROW_CROSS_AXIS.flatMap((cross) =>
  MAIN_AXIS.map((main) => ["Row", cross, main]),
);

const COLS = COL_CROSS_AXIS.flatMap((cross) =>
  MAIN_AXIS.map((main) => ["Col", cross, main]),
);

export const LAYOUT_CONFIG = [...ROWS, ...COLS] as const;
