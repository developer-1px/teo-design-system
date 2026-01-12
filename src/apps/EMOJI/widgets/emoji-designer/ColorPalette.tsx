/**
 * ColorPalette - 색상 팔레트 선택
 */

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { PixelColor } from '@/apps/EMOJI/lib/emoji-designer/types';
import { Block } from '@/components/dsl/Block/Block';
import { Button } from '@/components/dsl/Element/Action/role/Button';
// Input removed
import { Text } from '@/components/dsl/Element/Text/Text';
import { cn } from '@/shared/lib/utils';

export interface ColorPaletteProps {
  palette: PixelColor[];
  selectedColor: PixelColor;
  onSelectColor: (color: PixelColor) => void;
  onAddColor: (color: PixelColor) => void;
  onRemoveColor: (index: number) => void;
}

export function ColorPalette({
  palette,
  selectedColor,
  onSelectColor,
  onAddColor,
  onRemoveColor,
}: ColorPaletteProps) {
  const [newColor, setNewColor] = useState('#000000');

  return (
    <div className="space-y-3">
      {/* Color Grid */}
      <div className="grid grid-cols-4 gap-2">
        {palette.map((color, index) => (
          <div key={index} className="relative group">
            <button
              onClick={() => onSelectColor(color)}
              className={cn(
                'w-full h-12 rounded-md border-2 transition-all',
                selectedColor === color
                  ? 'border-accent ring-2 ring-accent/50'
                  : 'border-border hover:border-accent/50'
              )}
              style={{
                backgroundColor: color === '#FFFFFF00' ? 'transparent' : color,
                backgroundImage:
                  color === '#FFFFFF00'
                    ? 'repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 8px 8px'
                    : undefined,
              }}
              title={color}
            />
            {/* Remove button */}
            <button
              onClick={() => onRemoveColor(index)}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Color */}
      <Block role="Form">
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="h-9 w-20 rounded border border-border cursor-pointer"
        />
        <input
          type="text"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="flex-1 h-9 px-3 bg-layer-2 border border-border rounded text-sm focus:outline-none focus:border-accent"
          placeholder="#000000"
        />
        <Button
          prominence="Subtle"
          onClick={() => {
            onAddColor(newColor);
          }}
        >
          <Plus size={16} />
        </Button>
      </Block>

      {/* Selected Color Info */}
      <div className="p-2 bg-layer-1 rounded-md">
        <Text role="Label" content="Selected Color" />
        <Text role="Body" prominence="Hero" content={selectedColor} />
      </div>
    </div>
  );
}
