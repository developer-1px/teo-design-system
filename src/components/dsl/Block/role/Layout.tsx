import React from 'react';
import { useResizable } from '@/shared/hooks/useResizable';
import { cn } from '@/shared/lib/utils';
import type { BlockRendererProps } from '../Block.types';

// 1. Card
export function Card({
  Element,
  children,
  className,
  tokens,
  role,
  computedProminence,
  computedDensity,
  computedIntent,
  spec,
  ...props
}: BlockRendererProps) {
  return (
    <Frame.Column
      as={Element}
      className={className}
      padding={tokens?.spacing.padding}
      {...props}
    >
      {children}
    </Frame.Column>
  );
}

// 2. Stack (Vertical)
import { Frame } from '@/components/dsl/shared/Frame';

export function Stack({
  Element,
  children,
  className,
  tokens,
  role,
  computedProminence,
  computedDensity,
  computedIntent,
  spec,
  ...props
}: BlockRendererProps) {
  return (
    <Frame.Stack
      as={Element}
      className={className}
      gap={tokens?.spacing.gap}
      padding={tokens?.spacing.padding}
      {...props}
    >
      {children}
    </Frame.Stack>
  );
}

// 3. Grid
export function Grid({
  Element,
  children,
  className,
  spec,
  tokens,
  style,
  role,
  computedProminence,
  computedDensity,
  computedIntent,
  ...props
}: BlockRendererProps) {
  const columns = (spec?.columns as number) || 2;
  return (
    <Element
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: tokens?.spacing.gap,
        padding: tokens?.spacing.padding,
        ...style,
      }}
      {...props}
    >
      {children}
    </Element>
  );
}

// 3.1 Row (Generic Horizontal)
export function Row({
  Element,
  children,
  className,
  tokens,
  role,
  computedProminence,
  computedDensity,
  computedIntent,
  spec,
  ...props
}: BlockRendererProps) {
  return (
    <Frame.Row
      as={Element}
      className={className}
      gap={tokens?.spacing.gap}
      padding={tokens?.spacing.padding}
      {...props}
    >
      {children}
    </Frame.Row>
  );
}

// 4. ScrollArea
export function ScrollArea({
  Element,
  children,
  className,
  spec,
  tokens,
  role,
  computedProminence,
  computedDensity,
  computedIntent,
  ...props
}: BlockRendererProps) {
  const orientation = (spec?.orientation as 'horizontal' | 'vertical') || 'vertical';
  return (
    <Frame
      as={Element}
      direction={orientation === 'vertical' ? 'column' : 'row'}
      className={cn(
        'overflow-auto',
        orientation === 'horizontal' ? 'overflow-x-auto' : 'overflow-y-auto max-h-[500px]',
        className
      )}
      padding={tokens?.spacing.padding}
      gap={tokens?.spacing.gap}
      {...props}
    >
      {children}
    </Frame>
  );
}

// 4.1 Well (Sunken Container)
export function Well({
  Element,
  children,
  className,
  tokens,
  role,
  computedProminence,
  computedDensity,
  computedIntent,
  spec,
  ...props
}: BlockRendererProps) {
  return (
    <Frame.Column
      as={Element}
      className={cn('bg-surface-sunken/50', className)}
      padding={tokens?.spacing.padding}
      gap={tokens?.spacing.gap}
      {...props}
    >
      {children}
    </Frame.Column>
  );
}

// 5. Collapsible (Simple version)
export function Collapsible({
  Element,
  children,
  className,
  tokens,
  role,
  computedProminence,
  computedDensity,
  computedIntent,
  spec,
  ...props
}: BlockRendererProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Element
      className={cn('overflow-hidden', className)}
      style={{
        padding: tokens?.spacing.padding,
        ...((props as any).style || {}),
      }}
      {...props}
    >
      <div
        className="px-4 py-2 bg-slate-50/50 cursor-pointer flex justify-between items-center select-none"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-sm text-slate-700">Collapsible Header</span>
        <span className="text-xs text-slate-400">{open ? '▲' : '▼'}</span>
      </div>
      {open && <div className="p-4">{children}</div>}
    </Element>
  );
}

// 6. Splitter (Functional)
export function Splitter({
  Element,
  children,
  className,
  spec,
  computedProminence,
  computedIntent,
  computedDensity,
  role,
  prominence,
  intent,
  density,
  ...props
}: BlockRendererProps) {
  const direction = (spec?.direction as 'horizontal' | 'vertical') || 'horizontal';
  const initialSize = (spec?.initialSize as number) || 250;
  const minSize = (spec?.minSize as number) || 0;
  const maxSize = (spec?.maxSize as number) || Infinity;
  const reverse = (spec?.reverse as boolean) || false;

  // Splitter requires exactly 2 children/groups roughly to function as a splitter
  // but we can handle 1 child seamlessly by hiding the handle.
  const kids = React.Children.toArray(children);
  const hasSecondPane = kids.length > 1;

  const { size, isResizing, separatorProps = {} as any } = useResizable({
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
    ...(separatorProps?.style || {}),
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
            'hover:bg-primary-default transition-colors',
            isHorizontal
              ? 'cursor-col-resize w-[4px] border-l border-r border-transparent bg-border-subtle'
              : 'cursor-row-resize h-[4px] border-t border-b border-transparent bg-border-subtle',
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
export function AspectRatio({
  Element,
  children,
  className,
  spec,
  style,
  tokens, // Destructure but unused by Frame directly here (Frame doesn't exist here yet, it uses Element)
  role,
  computedProminence,
  computedDensity,
  computedIntent,
  ...props
}: BlockRendererProps) {
  const ratio = (spec?.ratio as number) || 16 / 9;
  return (
    <Element
      className={cn('relative w-full rounded-md overflow-hidden bg-surface-container', className)}
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    >
      {children || (
        <div className="absolute inset-0 flex items-center justify-center text-text-subtle">
          Aspect Ratio {ratio}
        </div>
      )}
    </Element>
  );
}

// 8. Toolbar
// Default: Bordered, Rounded, Surface
export function Toolbar({
  Element,
  children,
  className,
  tokens,
  role,
  computedProminence,
  computedDensity,
  computedIntent,
  spec,
  ...props
}: BlockRendererProps) {
  return (
    <Frame.Row
      as={Element}
      className={cn(
        // Default Toolbar Aesthetics if not overridden
        'border border-border-default/50 bg-surface-elevated/50 backdrop-blur-sm rounded-md shadow-sm',
        className
      )}
      gap={tokens?.spacing.gap ?? 2}
      padding={tokens?.spacing.padding ?? 2}
      {...props}
    >
      {children}
    </Frame.Row>
  );
}

// 9. ControlPanel
export function ControlPanel({
  Element,
  children,
  className,
  tokens,
  role,
  computedProminence,
  computedDensity,
  computedIntent,
  spec,
  ...props
}: BlockRendererProps) {
  return (
    <Frame.Stack
      as={Element}
      className={cn('bg-surface-elevated/10', className)}
      gap={tokens?.spacing.gap ?? 4}
      padding={tokens?.spacing.padding ?? 4}
      {...props}
    >
      {children}
    </Frame.Stack>
  );
}
