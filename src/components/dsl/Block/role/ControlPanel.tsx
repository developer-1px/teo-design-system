import type { BlockRendererProps } from '@/components/dsl/Block/Block.types';
import { cn } from '@/shared/lib/utils';

export const ControlPanelRenderer = ({
  children,
  className,
  tokens,
  Element = 'div',
  ...rest
}: BlockRendererProps) => {
  return (
    <Element
      className={cn(
        // Base Layout
        'flex flex-col relative w-full h-full',
        // Token Engine Styles
        tokens.surface.background,
        tokens.surface.blur,
        tokens.geometry.radius,
        tokens.geometry.color,
        tokens.geometry.width,
        tokens.geometry.outline,
        tokens.shadow.boxShadow,
        // Custom
        'p-2', // Default tight padding
        className
      )}
      style={{
        gap: tokens.spacing.gap,
        padding: tokens.spacing.padding || '0.5rem', // Fallback
      }}
      {...rest}
    >
      {children}
    </Element>
  );
};
