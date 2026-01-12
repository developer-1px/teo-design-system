/**
 * Frame - Pure Layout Primitive
 *w
 * 순수한 레이아웃 컴포넌트 (의미론적 역할 없음)
 * IDDL의 role/prominence/intent와 독립적으로 사용
 *
 * @example
 * ```tsx
 * <Frame direction="row" gap={4} justify="between" align="center">
 *   <div>Left</div>
 *   <div>Right</div>
 * </Frame>
 * ```
 */

import React from 'react';
import { cn } from '@/shared/lib/utils';

// Gap scale matching design tokens (4px unit scale)
export type GapScale = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24;

// Standard flexbox types
export type JustifyContent =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'
  | 'stretch';

export type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

// Figma-like Resizing
export type Sizing = 'fill' | 'hug' | number | string;

export interface FrameProps extends Omit<React.HTMLAttributes<HTMLElement>, 'align' | 'width' | 'height'> {
  /** Flex direction (Figma: Vertical/Horizontal direction) */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';

  /** Gap (Figma: Gap between items) */
  gap?: GapScale | string;

  /** Padding (Figma: Padding) - 4px scale or string */
  padding?: GapScale | string;

  /** Horizontal Resizing (Figma: W) */
  width?: Sizing;

  /** Vertical Resizing (Figma: H) */
  height?: Sizing;

  /** Justify content (main axis) */
  justify?: JustifyContent;

  /** Align items (cross axis) */
  align?: AlignItems;

  /** Allow wrapping */
  wrap?: boolean;

  /** HTML element type */
  as?: React.ElementType;

  /** Children */
  children?: React.ReactNode;

  /** 
   * Compatibility props for IDDL migration
   * These may not affect layout directly but are accepted to avoid type errors.
   */
  density?: 'Compact' | 'Standard' | 'Comfortable';
  clickable?: boolean;
}

export interface FrameGridProps extends Omit<FrameProps, 'direction'> {
  columns?: number;
  rows?: number;
}

const JUSTIFY_MAP: Record<JustifyContent, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
  stretch: 'justify-stretch',
};

const ALIGN_MAP: Record<AlignItems, string> = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const GAP_MAP: Record<GapScale, string> = {
  0: 'gap-0',
  1: 'gap-1', // 4px
  2: 'gap-2', // 8px
  3: 'gap-3', // 12px
  4: 'gap-4', // 16px
  6: 'gap-6', // 24px
  8: 'gap-8', // 32px
  12: 'gap-12', // 48px
  16: 'gap-16', // 64px
  24: 'gap-24', // 96px
};

interface FrameComponent extends React.ForwardRefExoticComponent<FrameProps & React.RefAttributes<HTMLElement>> {
  Row: (props: Omit<FrameProps, 'direction'>) => JSX.Element;
  Column: (props: Omit<FrameProps, 'direction'>) => JSX.Element;
  Stack: (props: Omit<FrameProps, 'direction'>) => JSX.Element;
  Inline: (props: Omit<FrameProps, 'direction'>) => JSX.Element;
  Grid: (props: FrameGridProps) => JSX.Element;
  Center: (props: FrameProps) => JSX.Element;
  Spacer: (props: React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
}

export const Frame = React.forwardRef<HTMLElement, FrameProps>(({
  as: Element = 'div',
  direction = 'row',
  gap,
  padding,
  width,
  height,
  justify,
  align,
  wrap = false,
  className,
  children,
  style,
  ...rest
}, ref) => {
  // Gap Handling
  const isPresetGap = typeof gap === 'number' && gap in GAP_MAP;
  const gapClass = isPresetGap ? GAP_MAP[gap as GapScale] : undefined;
  const gapStyle = typeof gap === 'string' ? { gap } : undefined;

  // Padding Handling
  const isPresetPadding = typeof padding === 'number' && padding in GAP_MAP;
  const paddingClass = isPresetPadding ? `p-${padding}` : undefined; // Assuming Tailwind p-{n} matches Gap scale roughly or needs explicit map. 
  // Tailwind p-1 is 0.25rem (4px). Check GapScale. 1->4px. Yes, p-1 matches Gap 1.
  const paddingStyle = typeof padding === 'string' ? { padding } : undefined;

  // Sizing Handling
  // width
  let widthClass = '';
  let widthStyle: any = {};
  if (width === 'fill') widthClass = 'w-full';
  else if (width === 'hug') widthClass = 'w-fit';
  else if (width) widthStyle = { width };

  // height
  let heightClass = '';
  let heightStyle: any = {};
  if (height === 'fill') heightClass = 'h-full';
  else if (height === 'hug') heightClass = 'h-fit';
  else if (height) heightStyle = { height };

  return (
    <Element
      ref={ref}
      className={cn(
        // Layout
        'flex',
        direction === 'column' || direction === 'column-reverse' ? 'flex-col' : 'flex-row',
        direction === 'row-reverse' && 'flex-row-reverse',
        direction === 'column-reverse' && 'flex-col-reverse',

        // Spacing
        gapClass,
        paddingClass,

        // Sizing
        widthClass,
        heightClass,

        // Alignment
        justify && JUSTIFY_MAP[justify],
        align && ALIGN_MAP[align],
        wrap && 'flex-wrap',

        className
      )}
      style={{
        ...gapStyle,
        ...paddingStyle,
        ...widthStyle,
        ...heightStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Element>
  );
}) as FrameComponent;

Frame.displayName = 'Frame';

// Convenience exports
Frame.Row = (props: Omit<FrameProps, 'direction'>) => (
  <Frame direction="row" {...props} />
);

Frame.Column = (props: Omit<FrameProps, 'direction'>) => (
  <Frame direction="column" {...props} />
);

// Stack with default gap
Frame.Stack = (props: Omit<FrameProps, 'direction'>) => (
  <Frame direction="column" gap={props.gap ?? 4} {...props} />
);

// Inline with default gap
Frame.Inline = (props: Omit<FrameProps, 'direction'>) => (
  <Frame direction="row" gap={props.gap ?? 2} {...props} />
);

// Grid (CSS Grid)
Frame.Grid = ({ columns = 1, rows, style, className, gap, ...props }: FrameGridProps) => {
  const isPresetGap = typeof gap === 'number' && gap in GAP_MAP;
  const gapClass = isPresetGap ? GAP_MAP[gap as GapScale] : undefined;
  const gapStyle = typeof gap === 'string' ? { gap } : undefined;

  return (
    <div
      className={cn('grid', gapClass, className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        ...(rows ? { gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` } : {}),
        ...gapStyle,
        ...style,
      }}
      {...props}
    />
  );
};

// Center (Flex center)
Frame.Center = (props: FrameProps) => (
  <Frame justify="center" align="center" {...props} />
);

// Spacer (Flex grow)
Frame.Spacer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex-1', className)} {...props} />
);
