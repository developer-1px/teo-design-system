import React from 'react';
import { cn } from '@/shared/lib/utils';
import { BlockRendererProps } from '../../Block.types';

// 1. Dialog (Mock inline)
export function Dialog({ Element, children, className, ...props }: BlockRendererProps) {
    return (
        <Element className={cn('relative p-6 bg-surface shadow-2xl rounded-xl border border-border-default max-w-sm mx-auto my-4', className)} {...props}>
            <div className='absolute right-4 top-4 text-text-subtle cursor-pointer'>✕</div>
            <h3 className="text-lg font-bold mb-2">Dialog Title</h3>
            <div className="text-sm text-text-subtle mb-4">This is a simulated dialog. In a real app, this would be a modal overlay.</div>
            {children}
            <div className="flex justify-end gap-2 mt-4">
                <button className="px-3 py-1.5 text-sm rounded hover:bg-surface-hover">Cancel</button>
                <button className="px-3 py-1.5 text-sm bg-primary text-white rounded">Confirm</button>
            </div>
        </Element>
    );
}

// 2. Alert (Feedback role, but defined in spec separately, putting here or Feedback, spec says Overlay/Modal: AlertDialog)
export function AlertDialog({ Element, children, className, ...props }: BlockRendererProps) {
    return (
        <Element className={cn('bg-surface-warning/10 border-l-4 border-warning p-4 rounded-r-md max-w-sm mx-auto', className)} {...props}>
            <h4 className="flex items-center font-bold text-warning mb-1">
                ⚠️ Confirm Deletion
            </h4>
            <div className="text-sm mb-3">Are you sure you want to delete this item? This action cannot be undone.</div>
            <div className="flex gap-2">
                <button className="px-3 py-1 bg-warning text-white text-sm rounded font-medium">Delete</button>
                <button className="px-3 py-1 text-sm text-text-subtle hover:text-text">Cancel</button>
            </div>
        </Element>
    )
}

// 3. Sheet
export function Sheet({ Element, children, className, spec, ...props }: BlockRendererProps) {
    const side = (spec?.side as string) || 'right';
    return (
        <Element className={cn('h-[300px] w-[250px] bg-surface shadow-xl border border-border-default flex flex-col', side === 'right' ? 'ml-auto border-l' : 'mr-auto border-r', className)} {...props}>
            <div className="p-4 border-b border-border-default font-bold flex justify-between">
                <span>Sheet ({side})</span>
                <span className="cursor-pointer">✕</span>
            </div>
            <div className="p-4 flex-1">Content...</div>
        </Element>
    )
}

// 4. Popover
export function Popover({ Element, children, className, ...props }: BlockRendererProps) {
    return (
        <Element className={cn('bg-surface shadow-lg border border-border-default rounded-md p-3 max-w-xs text-sm', className)} {...props}>
            <div className="font-medium mb-1">Popover Header</div>
            <div className="text-text-subtle">Additional info providing context.</div>
            {children}
        </Element>
    )
}

// 5. Tooltip
export function Tooltip({ Element, children, className, ...props }: BlockRendererProps) {
    return (
        <Element className={cn('bg-surface-inverse text-surface-on-inverse px-2 py-1 rounded text-xs inline-block shadow-md', className)} {...props}>
            {children || 'Tooltip text'}
        </Element>
    )
}

// 6. Toast
export function Toast({ Element, children, className, ...props }: BlockRendererProps) {
    return (
        <Element className={cn('bg-surface shadow-lg border border-border-default rounded-md p-3 flex items-center gap-3 w-80 animate-in slide-in-from-bottom-2', className)} {...props}>
            <div className="w-2 h-2 rounded-full bg-success shrink-0" />
            <div className="flex-1 text-sm">
                <div className="font-medium">Success</div>
                <div className="text-text-subtle text-xs">Operation completed successfully.</div>
            </div>
            <div className="text-text-subtle text-xs cursor-pointer hover:text-text">✕</div>
        </Element>
    )
}
