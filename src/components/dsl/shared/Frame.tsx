/**
 * Frame - Pure Layout Primitive
 *
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

import type React from 'react';
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

export interface FrameProps {
  /** Flex direction */
  direction?: 'row' | 'column';

  /** Gap between children (in 4px units: 0, 1, 2, 3, 4, 6, 8, 12, 16, 24) */
  gap?: GapScale;

  /** Justify content (main axis) */
  justify?: JustifyContent;

  /** Align items (cross axis) */
  align?: AlignItems;

  /** Allow wrapping */
  wrap?: boolean;

  /** Full width */
  fullWidth?: boolean;

  /** Full height */
  fullHeight?: boolean;

  /** Additional className */
  className?: string;

  /** Children */
  children?: React.ReactNode;

  /** HTML element type */
  as?: keyof JSX.IntrinsicElements;

  /** Style prop */
  style?: React.CSSProperties;

  /** Other props */
  [key: string]: any;
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

export function Frame({
  as: Element = 'div',
  direction = 'row',
  gap = 0,
  justify,
  align,
  wrap = false,
  fullWidth = false,
  fullHeight = false,
  className,
  children,
  style,
  ...rest
}: FrameProps) {
  return (
    <Element
      className={cn(
        // Base flex
        'flex',

        // Direction
        direction === 'column' ? 'flex-col' : 'flex-row',

        // Gap
        GAP_MAP[gap],

        // Justify
        justify && JUSTIFY_MAP[justify],

        // Align
        align && ALIGN_MAP[align],

        // Wrap
        wrap && 'flex-wrap',

        // Full width/height
        fullWidth && 'w-full',
        fullHeight && 'h-full',

        // Custom className
        className
      )}
      style={style}
      {...rest}
    >
      {children}
    </Element>
  );
}

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
