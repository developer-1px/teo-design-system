/**
 * Time Renderer - Complex role for time formatting
 *
 * 상대 시간 표시, 절대 시간 표시, 실시간 업데이트 지원
 *
 * @example
 * <Text role="Time" spec={{ value: new Date(), format: 'relative', live: true }} />
 * → "3 minutes ago" (실시간 업데이트)
 */

import { cva } from 'class-variance-authority';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import type { TextProps } from '../Text.types';

/**
 * Time format options
 */
export type TimeFormat =
  | 'relative' // "3 minutes ago"
  | 'absolute' // "2026-01-11 14:30:00"
  | 'date' // "January 11, 2026"
  | 'time' // "14:30:00"
  | 'datetime' // "January 11, 2026 at 14:30"
  | 'short' // "Jan 11, 2026"
  | 'iso'; // "2026-01-11T14:30:00Z"

/**
 * Time spec
 */
export interface TimeSpec {
  value: Date | string | number; // Date object, ISO string, or timestamp
  format?: TimeFormat; // Default: 'relative'
  live?: boolean; // Auto-update for relative time (default: false)
  locale?: string; // Locale for formatting (default: 'en-US')
}

/**
 * Time variants (CVA)
 */
const timeVariants = cva('', {
  variants: {
    prominence: {
      Hero: 'text-lg font-medium',
      Strong: 'text-base font-medium',
      Standard: 'text-sm',
      Subtle: 'text-xs text-text-muted',
    },
  },
  defaultVariants: {
    prominence: 'Standard',
  },
});

/**
 * Format relative time (without external library)
 */
function formatRelativeTime(date: Date, locale = 'en-US'): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSec < 60) return rtf.format(-diffSec, 'second');
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  if (diffHour < 24) return rtf.format(-diffHour, 'hour');
  if (diffDay < 7) return rtf.format(-diffDay, 'day');
  if (diffWeek < 4) return rtf.format(-diffWeek, 'week');
  if (diffMonth < 12) return rtf.format(-diffMonth, 'month');
  return rtf.format(-diffYear, 'year');
}

/**
 * Format absolute time
 */
function formatAbsoluteTime(date: Date, format: TimeFormat, locale = 'en-US'): string {
  switch (format) {
    case 'date':
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);

    case 'time':
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);

    case 'datetime':
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);

    case 'short':
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);

    case 'iso':
      return date.toISOString();
    default:
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);
  }
}

/**
 * Parse time value to Date
 */
function parseTimeValue(value: Date | string | number): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  return new Date(value);
}

/**
 * Time Renderer Component
 */
export function TimeRenderer({
  prominence = 'Standard',
  intent,
  className,
  spec,
  ...rest
}: TextProps) {
  if (!spec?.value) {
    if (import.meta.env.DEV) {
      console.warn('[TimeRenderer] spec.value is required');
    }
    return <span className={cn(timeVariants({ prominence }), className)}>Invalid time</span>;
  }

  const timeSpec = spec as TimeSpec;
  const date = parseTimeValue(timeSpec.value);
  const format = timeSpec.format || 'relative';
  const live = timeSpec.live ?? false;
  const locale = timeSpec.locale || 'en-US';

  // State for live updates
  const [displayTime, setDisplayTime] = useState(() => {
    if (format === 'relative') {
      return formatRelativeTime(date, locale);
    }
    return formatAbsoluteTime(date, format, locale);
  });

  // Live update effect (only for relative time)
  useEffect(() => {
    if (format !== 'relative' || !live) return;

    const updateInterval = setInterval(() => {
      setDisplayTime(formatRelativeTime(date, locale));
    }, 60000); // Update every minute

    return () => clearInterval(updateInterval);
  }, [date, format, live, locale]);

  return (
    <time
      dateTime={date.toISOString()}
      className={cn(timeVariants({ prominence }), className)}
      data-dsl-component="text"
      data-role="Time"
      data-prominence={prominence}
      data-intent={intent}
      title={date.toLocaleString(locale)} // Tooltip with full date
      {...rest}
    >
      {displayTime}
    </time>
  );
}
