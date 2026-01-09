/**
 * Emoji Designer Utilities
 */

import type { EmojiDesign, PixelGrid, PixelColor } from './types';

/**
 * Create empty grid
 */
export function createEmptyGrid(size: number, defaultColor = '#FFFFFF00'): PixelGrid {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => defaultColor)
  );
}

/**
 * Create new emoji design
 */
export function createNewDesign(
  name: string = 'Untitled Emoji',
  size: number = 16,
  palette: PixelColor[] = []
): EmojiDesign {
  const now = new Date().toISOString();

  return {
    id: `emoji-${Date.now()}`,
    name,
    size,
    grid: createEmptyGrid(size),
    palette,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Set pixel color
 */
export function setPixel(
  grid: PixelGrid,
  row: number,
  col: number,
  color: PixelColor
): PixelGrid {
  const newGrid = grid.map((r) => [...r]);
  newGrid[row][col] = color;
  return newGrid;
}

/**
 * Flood fill algorithm
 */
export function floodFill(
  grid: PixelGrid,
  row: number,
  col: number,
  newColor: PixelColor
): PixelGrid {
  const oldColor = grid[row][col];
  if (oldColor === newColor) return grid;

  const size = grid.length;
  const newGrid = grid.map((r) => [...r]);

  function fill(r: number, c: number) {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    if (newGrid[r][c] !== oldColor) return;

    newGrid[r][c] = newColor;

    fill(r - 1, c);
    fill(r + 1, c);
    fill(r, c - 1);
    fill(r, c + 1);
  }

  fill(row, col);
  return newGrid;
}

/**
 * Export design as JSON
 */
export function exportDesign(design: EmojiDesign): string {
  return JSON.stringify(design, null, 2);
}

/**
 * Import design from JSON
 */
export function importDesign(json: string): EmojiDesign {
  return JSON.parse(json);
}

/**
 * Resize grid (crop or expand)
 */
export function resizeGrid(
  grid: PixelGrid,
  newSize: number,
  defaultColor = '#FFFFFF00'
): PixelGrid {
  const oldSize = grid.length;
  const newGrid = createEmptyGrid(newSize, defaultColor);

  for (let r = 0; r < Math.min(oldSize, newSize); r++) {
    for (let c = 0; c < Math.min(oldSize, newSize); c++) {
      newGrid[r][c] = grid[r][c];
    }
  }

  return newGrid;
}
