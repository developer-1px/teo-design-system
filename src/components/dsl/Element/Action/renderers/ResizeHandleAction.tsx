/**
 * ResizeHandleAction - IDDL Action role="ResizeHandle" (v4.1)
 *
 * Grid-aware resize handle that automatically positions itself
 * based on target Section's gridArea.
 */

import { cva } from 'class-variance-authority';
import type { ActionProps } from '@/components/dsl/Element/Action/Action.types';
import { cn } from '@/shared/lib/utils';

export interface ResizeHandleProps extends ActionProps {
  role: 'ResizeHandle';
  direction: 'horizontal' | 'vertical';
  target: string; // gridArea name (e.g., 'primarysidebar', 'panel')
  alignment?: 'start' | 'end' | 'center';
  offset?: string; // e.g., '50%' for center positioning
  isActive?: boolean;
}

const resizeHandleVariants = cva('absolute z-50 transition-colors', {
  variants: {
    direction: {
      horizontal: 'w-1 h-full cursor-col-resize hover:bg-accent/20',
      vertical: 'h-1 w-full cursor-row-resize hover:bg-accent/20',
    },
    isActive: {
      true: 'bg-accent/40',
      false: '',
    },
  },
  defaultVariants: {
    isActive: false,
  },
});

export function ResizeHandleAction({
  direction = 'horizontal',
  target,
  alignment = 'end',
  offset = '50%',
  isActive = false,
  className,
  ...rest
}: any) {
  // Use any briefly to allow extra props from Action
  // Compute positioning based on target gridArea
  const positionStyle: React.CSSProperties = {
    gridArea: target,
    ...(direction === 'horizontal' && {
      justifySelf: alignment === 'end' ? 'end' : alignment === 'start' ? 'start' : 'center',
      transform: `translateX(${offset})`,
    }),
    ...(direction === 'vertical' && {
      alignSelf: alignment === 'end' ? 'end' : alignment === 'start' ? 'start' : 'center',
      transform: `translateY(-${offset})`,
    }),
  };

  return (
    <div
      className={cn(resizeHandleVariants({ direction: direction as any, isActive }), className)}
      style={positionStyle}
      data-resize-handle
      data-direction={direction}
      {...rest}
    />
  );
}
