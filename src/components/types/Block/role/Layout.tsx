import React from 'react';
import { cn } from '@/shared/lib/utils';
import { useResizable } from '@/shared/hooks/useResizable';
import { BlockRendererProps } from '../../Block.types';

// 1. Card
export function Card({ Element, children, className, ...props }: BlockRendererProps) {
    return (
        <Element className={cn('bg-surface-raised rounded-lg border border-border-subtle p-4 shadow-sm', className)} {...props}>
            {children}
        </Element>
    );
}

// 2. Stack (Vertical)
export function Stack({ Element, children, className, computedDensity, ...props }: BlockRendererProps) {
    const gap = computedDensity === 'Compact' ? 'gap-2' : computedDensity === 'Comfortable' ? 'gap-6' : 'gap-4';
    return (
        <Element className={cn('flex flex-col', gap, className)} {...props}>
            {children}
        </Element>
    );
}

// 3. Grid
export function Grid({ Element, children, className, spec, style, ...props }: BlockRendererProps) {
    const columns = (spec?.columns as number) || 2;
    return (
        <Element
            className={cn('grid gap-4', className)}
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, ...style }}
            {...props}
        >
            {children}
        </Element>
    );
}

// 4. ScrollArea
export function ScrollArea({ Element, children, className, spec, ...props }: BlockRendererProps) {
    const orientation = (spec?.orientation as 'horizontal' | 'vertical') || 'vertical';
    return (
        <Element
            className={cn(
                'overflow-auto border border-border-default rounded-md bg-surface',
                orientation === 'horizontal' ? 'overflow-x-auto whitespace-nowrap' : 'overflow-y-auto max-h-[300px]',
                className
            )}
            {...props}
        >
            {children}
        </Element>
    );
}

// 5. Collapsible (Simple version)
export function Collapsible({ Element, children, className, ...props }: BlockRendererProps) {
    const [open, setOpen] = React.useState(false);
    return (
        <Element className={cn('border border-border-default rounded-md overflow-hidden', className)} {...props}>
            <div
                className="px-4 py-2 bg-surface-subtle cursor-pointer flex justify-between items-center select-none"
                onClick={() => setOpen(!open)}
            >
                <span className="font-medium text-sm">Collapsible Header</span>
                <span className="text-xs text-text-subtle">{open ? '▲' : '▼'}</span>
            </div>
            {open && <div className="p-4 bg-surface">{children}</div>}
        </Element>
    );
}

// 6. Splitter (Functional)
export function Splitter({ Element, children, className, spec, ...props }: BlockRendererProps) {
    const direction = (spec?.direction as 'horizontal' | 'vertical') || 'horizontal';
    const initialSize = (spec?.initialSize as number) || 250;
    const minSize = (spec?.minSize as number) || 0;
    const maxSize = (spec?.maxSize as number) || Infinity;
    const reverse = (spec?.reverse as boolean) || false;

    // Splitter requires exactly 2 children/groups roughly to function as a splitter
    // but we can handle 1 child seamlessly by hiding the handle.
    const kids = React.Children.toArray(children);
    const hasSecondPane = kids.length > 1;

    const { size, isResizing, separatorProps } = useResizable({
        initialSize,
        minSize,
        maxSize,
        direction,
        reverse,
    });

    const isHorizontal = direction === 'horizontal';

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
    };

    // Style for the pane controlled by 'size'
    const sizedPaneStyle: React.CSSProperties = {
        flexBasis: hasSecondPane ? size : '100%',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        minHeight: 0,
        minWidth: 0,
    };

    // Style for the flexible pane
    const flexiblePaneStyle: React.CSSProperties = {
        flex: 1,
        overflow: 'hidden',
        minHeight: 0,
        minWidth: 0,
    };

    // Handle Style
    const handleStyle: React.CSSProperties = {
        ...separatorProps.style,
        flexBasis: isHorizontal ? '4px' : '4px',
        flexShrink: 0, // Prevent handle from collapsing
        backgroundColor: isResizing ? 'var(--color-primary-default)' : 'transparent',
        zIndex: 10,
        transition: 'background-color 0.2s',
        position: 'relative', // Ensure z-index works
    };

    // If reverse, the second pane is sized. If normal, the first pane is sized.
    const pane1Style = reverse ? flexiblePaneStyle : sizedPaneStyle;
    const pane2Style = reverse ? sizedPaneStyle : flexiblePaneStyle;

    return (
        <Element className={cn(className)} style={containerStyle} {...props}>
            <div style={pane1Style} className="splitter-pane-content">
                {kids[0]}
            </div>

            {hasSecondPane && (
                <div
                    {...separatorProps}
                    className={cn(
                        "hover:bg-primary-default transition-colors",
                        isHorizontal ? "cursor-col-resize w-[4px] border-l border-r border-transparent bg-border-subtle" : "cursor-row-resize h-[4px] border-t border-b border-transparent bg-border-subtle",
                        separatorProps.className
                    )}
                    style={handleStyle}
                />
            )}

            {hasSecondPane && (
                <div style={pane2Style} className="splitter-pane-content">
                    {kids.slice(1)}
                </div>
            )}
        </Element>
    );
}

// 7. AspectRatio
export function AspectRatio({ Element, children, className, spec, style, ...props }: BlockRendererProps) {
    const ratio = (spec?.ratio as number) || 16 / 9;
    return (
        <Element className={cn('relative w-full rounded-md overflow-hidden bg-surface-container', className)} style={{ aspectRatio: ratio, ...style }} {...props}>
            {children || <div className="absolute inset-0 flex items-center justify-center text-text-subtle">Aspect Ratio {ratio}</div>}
        </Element>
    );
}
