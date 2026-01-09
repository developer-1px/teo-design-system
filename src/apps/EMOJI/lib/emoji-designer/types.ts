/**
 * Emoji Designer Types
 *
 * JSON 기반 이모지 디자인 시스템
 */

/**
 * Pixel Color (hex string)
 */
export type PixelColor = string;

/**
 * Pixel Grid - 2D array of colors
 */
export type PixelGrid = PixelColor[][];

/**
 * Emoji Design
 */
export interface EmojiDesign {
  id: string;
  name: string;
  size: number; // Grid size (e.g., 16 = 16x16)
  grid: PixelGrid;
  palette: PixelColor[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Designer State
 */
export interface DesignerState {
  design: EmojiDesign;
  selectedColor: PixelColor;
  tool: 'pen' | 'eraser' | 'fill';
  showGrid: boolean;
}

/**
 * Preset Palettes
 */
export const PRESET_PALETTES: Record<string, PixelColor[]> = {
  classic: [
    '#000000', // black
    '#FFFFFF', // white
    '#FF0000', // red
    '#00FF00', // green
    '#0000FF', // blue
    '#FFFF00', // yellow
    '#FF00FF', // magenta
    '#00FFFF', // cyan
    '#FFA500', // orange
    '#800080', // purple
    '#FFC0CB', // pink
    '#A52A2A', // brown
    '#808080', // gray
    '#C0C0C0', // silver
    '#FFD700', // gold
    '#FFFFFF00', // transparent
  ],

  skin: [
    '#FFDFC4',
    '#F0C9A0',
    '#E8B896',
    '#D1A684',
    '#C68B6B',
    '#B87A5B',
    '#A56A4D',
    '#8D5A3F',
    '#724A32',
    '#5C3A26',
    '#FFFFFF00', // transparent
  ],

  nature: [
    '#228B22',
    '#32CD32',
    '#90EE90',
    '#006400',
    '#556B2F',
    '#8B4513',
    '#D2691E',
    '#A0522D',
    '#CD853F',
    '#DEB887',
    '#87CEEB',
    '#4682B4',
    '#1E90FF',
    '#191970',
    '#FFFFFF00', // transparent
  ],
};
