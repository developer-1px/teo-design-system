import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { BlockRendererProps } from '../Block.types';

// 1. DescriptionList
export function DescriptionList({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element className={cn('grid grid-cols-[120px_1fr] gap-y-2 text-sm', className)} {...props}>
      {children || (
        <>
          <dt className="text-text-subtle font-medium">Name</dt>
          <dd>Product A</dd>
          <dt className="text-text-subtle font-medium">ID</dt>
          <dd className="font-mono text-xs">#381290</dd>
          <dt className="text-text-subtle font-medium">Status</dt>
          <dd>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </dd>
        </>
      )}
    </Element>
  );
}

// 2. Stats
export function Stats({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn('bg-surface p-4 rounded-lg border border-border-default', className)}
      {...props}
    >
      <div className="text-sm text-text-subtle font-medium">Total Revenue</div>
      <div className="text-2xl font-bold my-1">$45,231.89</div>
      <div className="text-xs text-green-600 font-medium flex items-center">
        ▲ 20.1% from last month
      </div>
    </Element>
  );
}

// 3. Avatar & AvatarGroup
export function Avatar({ Element, children, className, spec, ...props }: BlockRendererProps) {
  const fallback = (spec?.fallback as string) || 'U';
  return (
    <Element
      className={cn(
        'w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border-2 border-surface',
        className
      )}
      {...props}
    >
      {fallback.substring(0, 2).toUpperCase()}
    </Element>
  );
}

export function AvatarGroup({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element className={cn('flex -space-x-3', className)} {...props}>
      <Avatar {...props} role="Avatar" spec={{ fallback: 'AB' }} Element="div" />
      <Avatar {...props} role="Avatar" spec={{ fallback: 'CD' }} Element="div" />
      <Avatar {...props} role="Avatar" spec={{ fallback: 'EF' }} Element="div" />
      <div className="w-10 h-10 rounded-full bg-surface-raised border-2 border-surface flex items-center justify-center text-xs font-medium text-text-subtle">
        +3
      </div>
    </Element>
  );
}

// 4. Badge & Tag
export function Badge({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-white',
        className
      )}
      {...props}
    >
      {children || 'New'}
    </Element>
  );
}

export function Tag({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'inline-flex items-center px-2 py-1 rounded bg-surface-raised border border-border-default text-xs font-medium gap-1',
        className
      )}
      {...props}
    >
      {children || 'Tag Name'}
      <span className="cursor-pointer hover:text-error ml-0.5">✕</span>
    </Element>
  );
}

// 5. EmptyState
export function EmptyState({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-border-default rounded-lg bg-surface-subtle/30',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center text-2xl mb-3">
        📦
      </div>
      <h4 className="font-medium text-text">No items found</h4>
      <p className="text-sm text-text-subtle mt-1 mb-4">Create a new item to get started.</p>
      <button className="px-3 py-1.5 bg-primary text-white text-sm rounded shadow-sm font-medium">
        Create New
      </button>
    </Element>
  );
}
