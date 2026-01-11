import { cn } from '@/shared/lib/utils';
import type { BlockRendererProps } from '../Block.types';

// 1. DragDropZone
export function DragDropZone({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'border-2 border-dashed border-border-default hover:border-primary hover:bg-primary/5 rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer',
        className
      )}
      {...props}
    >
      <div className="text-4xl text-text-subtle mb-2">☁️</div>
      <div className="font-medium text-text">Click or drag file to upload</div>
      <div className="text-xs text-text-subtle mt-1">SVG, PNG, JPG (max 2MB)</div>
    </Element>
  );
}

// 2. Sortable (Simple List Wrapper)
export function Sortable({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element className={cn('space-y-2', className)} {...props}>
      <div className="bg-surface border border-border-default rounded flex items-center gap-3 p-2 shadow-sm cursor-grab active:cursor-grabbing">
        <span className="text-text-subtle">⣿</span>
        <span className="text-sm">Item 1</span>
      </div>
      <div className="bg-surface border border-border-default rounded flex items-center gap-3 p-2 shadow-sm cursor-grab active:cursor-grabbing">
        <span className="text-text-subtle">⣿</span>
        <span className="text-sm">Item 2</span>
      </div>
      <div className="bg-surface border border-border-default rounded flex items-center gap-3 p-2 shadow-sm opacity-50 border-dashed">
        <span className="text-text-subtle">⣿</span>
        <span className="text-sm">Item 3 (Dragging)</span>
      </div>
    </Element>
  );
}

// 3. Resizable
export function Resizable({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn(
        'relative border border-primary w-[200px] h-[100px] flex items-center justify-center bg-surface-raised',
        className
      )}
      {...props}
    >
      <span className="text-xs text-primary font-mono">Resizable Box</span>
      <div className="absolute right-0 bottom-0 w-3 h-3 bg-primary cursor-se-resize" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary/20 hover:bg-primary cursor-e-resize" />
    </Element>
  );
}

// 4. SelectionArea
export function SelectionArea({ Element, children, className, ...props }: BlockRendererProps) {
  return (
    <Element
      className={cn('relative border border-border-default h-[200px] bg-grid-pattern', className)}
      {...props}
    >
      <div className="absolute left-10 top-10 w-20 h-20 bg-surface border border-border-default shadow-sm rounded flex items-center justify-center text-xs">
        Item A
      </div>
      <div className="absolute right-20 bottom-20 w-20 h-20 bg-primary/10 border border-primary shadow-sm rounded flex items-center justify-center text-xs text-primary font-bold">
        Item B
      </div>

      <div className="absolute left-[30%] top-[30%] w-[150px] h-[100px] bg-primary/20 border border-primary/50 pointer-events-none" />
    </Element>
  );
}
