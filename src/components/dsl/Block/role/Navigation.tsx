import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { BlockRendererProps } from '../Block.types';

// 1. Breadcrumbs
export function Breadcrumbs({ Element, children, className, spec, ...props }: BlockRendererProps) {
  const items = (spec?.items as string[]) || ['Home', 'Section', 'Page'];
  return (
    <Element
      className={cn('flex items-center gap-2 text-sm text-text-subtle', className)}
      {...props}
    >
      {children ||
        items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="opacity-50">/</span>}
            <span
              className={cn(
                i === items.length - 1
                  ? 'text-text font-medium'
                  : 'hover:text-text cursor-pointer transition-colors'
              )}
            >
              {item}
            </span>
          </React.Fragment>
        ))}
    </Element>
  );
}

// 2. Pagination
export function Pagination({ Element, children, className, spec, ...props }: BlockRendererProps) {
  return (
    <Element className={cn('flex items-center gap-1 justify-center', className)} {...props}>
      <button className="px-2 py-1 rounded hover:bg-surface-hover text-sm">Previous</button>
      <button className="px-3 py-1 rounded bg-primary text-white text-sm">1</button>
      <button className="px-3 py-1 rounded hover:bg-surface-hover text-sm">2</button>
      <button className="px-3 py-1 rounded hover:bg-surface-hover text-sm">3</button>
      <span className="text-text-subtle">...</span>
      <button className="px-2 py-1 rounded hover:bg-surface-hover text-sm">Next</button>
    </Element>
  );
}

// 3. Stepper
export function Stepper({ Element, children, className, spec, ...props }: BlockRendererProps) {
  const steps = ['Step 1', 'Step 2', 'Step 3'];
  const current = 1; // 0-indexed usually, but visual is 2nd step
  return (
    <Element className={cn('flex items-center w-full', className)} {...props}>
      {steps.map((_step, i) => (
        <div key={i} className="flex flex-1 items-center">
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2',
              i <= current
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-text-subtle border-border-default'
            )}
          >
            {i + 1}
          </div>
          <div
            className={cn(
              'flex-1 h-0.5 mx-2',
              i === steps.length - 1 ? 'hidden' : '',
              i < current ? 'bg-primary' : 'bg-border-default'
            )}
          />
        </div>
      ))}
    </Element>
  );
}

// 4. NavigationMenu (Functional)
export function NavigationMenu({ Element, children, className, ...props }: BlockRendererProps) {
  if (children) {
    return (
      <Element className={cn('flex items-center', className)} {...props}>
        {children}
      </Element>
    );
  }
  return (
    <Element className={cn('flex gap-6 border-b border-border-default px-4', className)} {...props}>
      {['Overview', 'Features', 'Pricing', 'Docs'].map((item) => (
        <div
          key={item}
          className="py-3 text-sm font-medium text-text-subtle hover:text-text cursor-pointer border-b-2 border-transparent hover:border-text-subtle transition-all"
        >
          {item}
        </div>
      ))}
    </Element>
  );
}

// 5. Sidebar (Mock)
export function Sidebar({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'w-64 border-r border-border-default bg-surface h-full flex flex-col',
        className
      )}
      {...props}
    >
      <div className="p-4 font-bold border-b border-border-default">Sidebar</div>
      <div className="flex-1 p-2 space-y-1">
        <div className="px-3 py-2 bg-surface-selected rounded-md text-sm font-medium text-primary">
          Dashboard
        </div>
        <div className="px-3 py-2 hover:bg-surface-hover rounded-md text-sm text-text">
          Settings
        </div>
        <div className="px-3 py-2 hover:bg-surface-hover rounded-md text-sm text-text">Profile</div>
      </div>
    </Element>
  );
}

// 6. AppBar
export function AppBar({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'h-14 border-b border-border-default bg-surface/80 backdrop-blur sticky top-0 z-50 flex items-center px-4 justify-between',
        className
      )}
      {...props}
    >
      <div className="font-bold text-lg">App Title</div>
      <div className="flex items-center gap-4">
        <span className="text-sm">Link 1</span>
        <button className="px-3 py-1.5 bg-primary text-white text-sm rounded-md shadow-sm">
          Action
        </button>
      </div>
    </Element>
  );
}
