import type { BlockRendererProps } from '@/components/dsl/Block/Block.types';
import { cn } from '@/shared/lib/utils';

export const PropertyGridRenderer = ({
  children,
  className,
  tokens,
  spec,
  Element = 'div',
  ...rest
}: BlockRendererProps) => {
  // Configurable columns via spec
  const columns = spec?.columns || 2;

  return (
    <Element
      className={cn('grid w-full', `grid-cols-${columns}`, className)}
      style={{
        gap: '0.25rem', // Tight gap for properties
        ...(tokens.spacing.gap ? { gap: tokens.spacing.gap } : {}),
      }}
      {...rest}
    >
      {children}
    </Element>
  );
};
