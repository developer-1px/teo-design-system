import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { BlockRendererProps } from '../Block.types';

// 1. Alert (Inline)
export function Alert({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'flex gap-3 p-3 rounded-md bg-info/10 text-info-text border border-info/20',
        className
      )}
      {...props}
    >
      <span className="text-lg">ℹ️</span>
      <div className="flex-1 text-sm">
        <div className="font-medium">Information</div>
        <div className="opacity-90">{children || 'This is an alert message.'}</div>
      </div>
    </Element>
  );
}

// 2. Progress
export function Progress({ Element, children, className, spec, ...props }: BlockRendererProps) {
  const value = (spec?.value as number) || 45;
  const max = (spec?.max as number) || 100;
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <Element
      className={cn('w-full h-2 bg-surface-raised rounded-full overflow-hidden', className)}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </Element>
  );
}

// 3. Spinner
export function Spinner({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element className={cn('flex justify-center p-2', className)} {...props}>
      <div className="w-6 h-6 border-2 border-border-default border-t-primary rounded-full animate-spin" />
    </Element>
  );
}

// 4. Banner
export function Banner({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'w-full bg-primary text-white px-4 py-2 flex items-center justify-between text-sm shadow-md',
        className
      )}
      {...props}
    >
      <span className="font-medium">✨ New features available!</span>
      <button className="text-white/80 hover:text-white px-2 uppercase text-xs font-bold tracking-wider">
        Learn More
      </button>
    </Element>
  );
}

// 5. Callout
export function Callout({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'pl-4 border-l-4 border-accent bg-surface-raised/50 py-2 pr-2 my-2 rounded-r',
        className
      )}
      {...props}
    >
      {children || (
        <div className="text-sm italic text-text-subtle">
          "This is a highlighted quote or note."
        </div>
      )}
    </Element>
  );
}
