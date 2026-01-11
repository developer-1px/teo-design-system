/**
 * BadgeRenderer - Badge role custom renderer
 *
 * IDDL Text의 Badge role을 렌더링합니다.
 * intent prop을 variant로 매핑하고, spec으로 추가 옵션을 제공합니다.
 *
 * @see docs/2-areas/spec/4-element/text/text.spec.md#661-badge
 */

import { forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';
import type { TextProps } from '../Text.types';

/**
 * Intent → Variant 매핑
 */
const intentToVariant = {
  Neutral: 'default',
  Brand: 'default',
  Positive: 'success',
  Caution: 'warning',
  Critical: 'error',
  Info: 'info',
} as const;

/**
 * Badge Renderer Component
 */
export const BadgeRenderer = forwardRef<HTMLSpanElement, TextProps>(
  (
    { content, children, intent = 'Neutral', prominence = 'Standard', spec, className, ...props },
    ref
  ) => {
    // Intent에서 variant 결정
    const variant = intentToVariant[intent as keyof typeof intentToVariant] || 'default';

    // Prominence에서 size 결정
    const size = prominence === 'Hero' || prominence === 'Strong' ? 'md' : 'sm';

    // spec 옵션
    const dot = spec?.dot ?? false; // Dot indicator만 표시
    const pulse = spec?.pulse ?? false; // Pulse animation
    const _icon = spec?.icon; // Icon (미구현)

    // Dot only mode
    if (dot) {
      return (
        <span
          ref={ref}
          className={cn(
            'inline-block w-2 h-2 rounded-full',
            {
              'bg-accent': variant === 'default',
              'bg-green-500': variant === 'success',
              'bg-yellow-500': variant === 'warning',
              'bg-red-500': variant === 'error',
              'bg-blue-500': variant === 'info',
            },
            pulse && 'animate-pulse',
            className
          )}
          {...props}
        />
      );
    }

    // Full badge
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-full font-medium',
          'transition-colors',

          // Sizes
          {
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-2.5 py-1 text-xs': size === 'md',
          },

          // Variants (intent-based)
          {
            // Default/Brand - accent color
            'bg-accent/10 text-accent border border-accent/20': variant === 'default',

            // Positive - green
            'bg-green-500/10 text-green-600 border border-green-500/20': variant === 'success',

            // Caution - yellow
            'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20': variant === 'warning',

            // Critical - red
            'bg-red-500/10 text-red-600 border border-red-500/20': variant === 'error',

            // Info - blue
            'bg-blue-500/10 text-blue-600 border border-blue-500/20': variant === 'info',
          },

          // Pulse animation
          pulse && 'animate-pulse',

          className
        )}
        data-dsl-component="text"
        data-role="Badge"
        data-intent={intent}
        data-prominence={prominence}
        {...props}
      >
        {children || content}
      </span>
    );
  }
);

BadgeRenderer.displayName = 'BadgeRenderer';
