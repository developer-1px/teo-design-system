/**
 * LayerDemo - Interactive 7-Layer 시각화
 */

import { Layer } from '@/components/ui/Layer';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface LayerDemoProps {
  className?: string;
  variant?: 'stacked' | 'side-by-side' | 'nested';
}

export const LayerDemo = ({ className, variant = 'nested' }: LayerDemoProps) => {
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  const layers = [
    { level: 0, name: 'Background', color: 'bg-layer-0' },
    { level: 1, name: 'Sunken', color: 'bg-layer-1' },
    { level: 2, name: 'Base Surface', color: 'bg-layer-2' },
    { level: 3, name: 'Primary', color: 'bg-layer-3' },
    { level: 4, name: 'Elevated', color: 'bg-layer-4' },
    { level: 5, name: 'Floating', color: 'bg-layer-5' },
    { level: 6, name: 'Overlay', color: 'bg-layer-6' },
  ] as const;

  if (variant === 'side-by-side') {
    return (
      <div className={cn("grid grid-cols-7 gap-4", className)}>
        {layers.map(({ level, name }) => (
          <div
            key={level}
            className="relative"
            onMouseEnter={() => setHoveredLayer(level)}
            onMouseLeave={() => setHoveredLayer(null)}
          >
            <Layer
              level={level}
              rounded="lg"
              className={cn(
                "h-32 flex flex-col items-center justify-center transition-all",
                hoveredLayer === level && "scale-105"
              )}
            >
              <div className="text-3xl font-bold text-text-tertiary mb-2">
                {level}
              </div>
              <div className="text-xs text-text-secondary text-center px-2">
                {name}
              </div>
            </Layer>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={cn("relative h-96", className)}>
        {layers.map(({ level, name }, index) => (
          <Layer
            key={level}
            level={level}
            rounded="lg"
            className={cn(
              "absolute left-0 right-0 p-4 transition-all",
              hoveredLayer === level && "scale-105 z-50"
            )}
            style={{
              top: `${index * 40}px`,
              zIndex: level,
            }}
            onMouseEnter={() => setHoveredLayer(level)}
            onMouseLeave={() => setHoveredLayer(null)}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-text">Layer {level}</span>
                <span className="text-sm text-text-secondary ml-2">{name}</span>
              </div>
              <div className="text-xs text-text-tertiary">
                z-index: {level * 10}
              </div>
            </div>
          </Layer>
        ))}
      </div>
    );
  }

  // nested variant (default)
  return (
    <Layer
      level={0}
      rounded="lg"
      className={cn("p-8 relative", className)}
    >
      <div className="text-sm text-text-secondary mb-4">Layer 0: Background</div>

      <Layer level={1} rounded="lg" className="p-6 ml-4 mr-4 relative">
        <div className="text-sm text-text-secondary mb-4">Layer 1: Sunken</div>

        <Layer level={2} rounded="lg" className="p-6 ml-4 mr-4 relative">
          <div className="text-sm text-text-secondary mb-4">Layer 2: Base Surface</div>

          <Layer level={3} rounded="lg" className="p-6 ml-4 mr-4 relative">
            <div className="text-sm text-text-secondary mb-4">Layer 3: Primary Surface</div>

            <Layer level={4} rounded="lg" className="p-6 ml-4 mr-4 relative">
              <div className="text-sm text-text-secondary mb-4">Layer 4: Elevated</div>

              <div className="flex gap-4">
                <Layer level={5} rounded="lg" className="p-4 flex-1">
                  <div className="text-sm text-text-secondary">Layer 5: Floating</div>
                </Layer>

                <Layer level={6} rounded="lg" className="p-4 flex-1">
                  <div className="text-sm text-text-secondary">Layer 6: Overlay</div>
                </Layer>
              </div>
            </Layer>
          </Layer>
        </Layer>
      </Layer>
    </Layer>
  );
};
