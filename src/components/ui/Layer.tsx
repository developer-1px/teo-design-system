import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * 7-Layer Depth System - 면으로 깊이를 표현하는 계층 구조
 *
 * Layer 0: Background - 앱 전체 배경
 * Layer 1: Sunken - Input, Terminal 등 함몰된 영역
 * Layer 2: Base Surface - Sidebar, Panel의 기본 배경
 * Layer 3: Primary Surface - Editor, Main Content
 * Layer 4: Elevated - Toolbar, Active Tab
 * Layer 5: Floating - Dropdown, Popover
 * Layer 6: Overlay - Modal, Dialog
 */
export type LayerLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface LayerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Layer level (0-6)
   */
  level: LayerLevel;
  /**
   * Apply rounded corners
   * - true: 기본 (lg)
   * - 'sm' | 'md' | 'lg' | 'xl' | '2xl': 특정 크기
   */
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Make the layer clickable with hover effect
   */
  clickable?: boolean;
}

const layerStyles: Record<LayerLevel, string> = {
  0: 'bg-layer-0 shadow-layer-0 z-layer-0',
  1: 'bg-layer-1 shadow-layer-1 z-layer-1',
  2: 'bg-layer-2 shadow-layer-2 z-layer-2',
  3: 'bg-layer-3 shadow-layer-3 z-layer-3',
  4: 'bg-layer-4 shadow-layer-4 z-layer-4',
  5: 'bg-layer-5 shadow-layer-5 z-layer-5',
  6: 'bg-layer-6 shadow-layer-6 z-layer-6',
};

const roundedStyles = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

export const Layer = forwardRef<HTMLDivElement, LayerProps>(
  ({ className, level, rounded = false, clickable = false, ...props }, ref) => {
    const roundedClass = rounded === true
      ? 'rounded-lg'
      : rounded
      ? roundedStyles[rounded]
      : '';

    const clickableClass = clickable
      ? 'cursor-pointer transition-all duration-200 hover:brightness-[0.98] active:brightness-[0.96]'
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          layerStyles[level],
          roundedClass,
          clickableClass,
          className
        )}
        {...props}
      />
    );
  }
);

Layer.displayName = 'Layer';
