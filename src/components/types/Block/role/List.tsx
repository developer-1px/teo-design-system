import { cn } from '@/shared/lib/utils';
import type { BlockRendererProps } from '../Block.types';

// 1. List
export function List({
  Element,
  children,
  className,
  computedProminence,
  computedIntent,
  computedDensity,
  role,
  prominence,
  intent,
  density,
  ...props
}: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'flex flex-col divide-y divide-border-subtle border border-border-default rounded-md overflow-hidden',
        className
      )}
      {...props}
    >
      {children ||
        [1, 2, 3].map((i) => (
          <div
            key={i}
            className="px-4 py-3 hover:bg-surface-hover cursor-pointer transition-colors text-sm"
          >
            List Item {i}
          </div>
        ))}
    </Element>
  );
}

// 2. Menu
export function Menu({
  Element,
  children,
  className,
  computedProminence,
  computedIntent,
  computedDensity,
  role,
  prominence,
  intent,
  density,
  ...props
}: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'min-w-[200px] border border-border-default rounded-md shadow-lg bg-surface py-1',
        className
      )}
      {...props}
    >
      {children ||
        ['Edit', 'Duplicate', 'Delete'].map((item) => (
          <div
            key={item}
            className={cn(
              'px-3 py-1.5 text-sm hover:bg-primary hover:text-white cursor-pointer mx-1 rounded-sm',
              item === 'Delete' && 'text-error hover:bg-error'
            )}
          >
            {item}
          </div>
        ))}
    </Element>
  );
}

// 3. CommandPalette
export function CommandPalette({
  Element,
  children,
  className,
  computedProminence,
  computedIntent,
  computedDensity,
  role,
  prominence,
  intent,
  density,
  ...props
}: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'max-w-xl mx-auto border border-border-default rounded-xl shadow-2xl bg-surface overflow-hidden flex flex-col',
        className
      )}
      {...props}
    >
      <div className="flex items-center px-4 border-b border-border-default h-12">
        <span className="text-text-subtle mr-2">🔍</span>
        <input
          className="flex-1 bg-transparent border-none focus:outline-none text-sm"
          placeholder="Type a command or search..."
        />
      </div>
      <div className="max-h-[300px] overflow-y-auto p-2">
        <div className="text-xs font-bold text-text-subtle px-2 py-1 mb-1">Suggestions</div>
        <div className="px-2 py-1.5 bg-surface-selected rounded-md text-sm mb-1">Search Files</div>
        <div className="px-2 py-1.5 hover:bg-surface-hover rounded-md text-sm text-text-subtle">
          Run Command
        </div>
      </div>
    </Element>
  );
}

// 4. TreeView
export function TreeView({
  Element,
  children,
  className,
  computedProminence,
  computedIntent,
  computedDensity,
  role,
  prominence,
  intent,
  density,
  ...props
}: BlockRendererProps) {
  return (
    <Element className={cn('flex flex-col text-sm', className)} {...props}>
      <div className="pl-4 border-l border-border-default ml-2">
        <div className="flex items-center gap-1 py-1 hover:text-primary cursor-pointer">📂 src</div>
        <div className="pl-4 border-l border-border-default ml-2">
          <div className="flex items-center gap-1 py-1 hover:text-primary cursor-pointer">
            📂 components
          </div>
          <div className="pl-4 border-l border-border-default ml-2">
            <div className="flex items-center gap-1 py-1 hover:text-primary cursor-pointer">
              📄 Block.tsx
            </div>
          </div>
          <div className="flex items-center gap-1 py-1 hover:text-primary cursor-pointer">
            📄 App.tsx
          </div>
        </div>
      </div>
    </Element>
  );
}

// 5. Timeline
export function Timeline({
  Element,
  children,
  className,
  computedProminence,
  computedIntent,
  computedDensity,
  role,
  prominence,
  intent,
  density,
  ...props
}: BlockRendererProps) {
  return (
    <Element className={cn('flex flex-col ml-4', className)} {...props}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative pl-8 pb-8 border-l-2 border-border-default last:border-0">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-surface border-2 border-primary" />
          <div className="text-xs text-text-subtle mb-1">Today, 10:00 AM</div>
          <div className="text-sm font-medium">Event {i} happened</div>
          <div className="text-sm text-text-subtle">Description for event {i}</div>
        </div>
      ))}
    </Element>
  );
}

// 6. Combobox
export function Combobox({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center justify-between border border-border-default rounded-md px-3 py-2 text-sm bg-surface shadow-sm cursor-pointer hover:border-primary">
        <span>Selected Option</span>
        <span className="text-xs opacity-50">▼</span>
      </div>
    </div>
  );
}
