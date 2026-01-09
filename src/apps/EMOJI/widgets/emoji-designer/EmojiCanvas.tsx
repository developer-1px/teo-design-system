/**
 * EmojiCanvas - 픽셀 그리드 캔버스
 *
 * 마우스로 픽셀을 그릴 수 있는 캔버스
 */

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils.ts';
import type { PixelGrid, PixelColor } from '@/lib/emoji-designer/types.ts';

export interface EmojiCanvasProps {
  grid: PixelGrid;
  selectedColor: PixelColor;
  tool: 'pen' | 'eraser' | 'fill';
  showGrid: boolean;
  onChange: (grid: PixelGrid) => void;
  onFill: (row: number, col: number) => void;
}

export function EmojiCanvas({
  grid,
  selectedColor,
  tool,
  showGrid,
  onChange,
  onFill,
}: EmojiCanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const size = grid.length;
  const pixelSize = 24; // pixels

  const handlePixelClick = (row: number, col: number) => {
    if (tool === 'fill') {
      onFill(row, col);
    } else {
      const newGrid = grid.map((r) => [...r]);
      const color = tool === 'eraser' ? '#FFFFFF00' : selectedColor;
      newGrid[row][col] = color;
      onChange(newGrid);
    }
  };

  const handlePixelEnter = (row: number, col: number) => {
    if (isDrawing && tool !== 'fill') {
      const newGrid = grid.map((r) => [...r]);
      const color = tool === 'eraser' ? '#FFFFFF00' : selectedColor;
      newGrid[row][col] = color;
      onChange(newGrid);
    }
  };

  return (
    <div
      ref={canvasRef}
      className="inline-block bg-layer-2 p-4 rounded-lg shadow-3"
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
    >
      <div
        className={cn(
          'grid gap-0 bg-white',
          showGrid && 'border border-border'
        )}
        style={{
          gridTemplateColumns: `repeat(${size}, ${pixelSize}px)`,
          gridTemplateRows: `repeat(${size}, ${pixelSize}px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                'cursor-crosshair transition-opacity hover:opacity-80',
                showGrid && 'border border-border/20'
              )}
              style={{
                width: `${pixelSize}px`,
                height: `${pixelSize}px`,
                backgroundColor: color === '#FFFFFF00' ? 'transparent' : color,
                backgroundImage:
                  color === '#FFFFFF00'
                    ? 'repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 8px 8px'
                    : undefined,
              }}
              onMouseDown={() => handlePixelClick(rowIndex, colIndex)}
              onMouseEnter={() => handlePixelEnter(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
}
