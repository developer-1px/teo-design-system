import { cva, type VariantProps } from 'class-variance-authority';
import type { Prominence } from '@/components/dsl/Shared.types';
import { cn } from '@/shared/lib/utils';

const separatorVariants = cva('shrink-0 bg-border-default', {
  variants: {
    orientation: {
      horizontal: 'h-[1px] w-full',
      vertical: 'h-full w-[1px]',
    },
    role: {
      ToolbarDivider: 'bg-border-muted h-4 w-px self-center mx-1',
      Divider: '',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  role?: 'Divider' | 'ToolbarDivider';
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  prominence?: Prominence;
}

export function Separator({
  className,
  orientation = 'horizontal',
  role = 'Divider',
  decorative = true,
  prominence,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(separatorVariants({ orientation, role }), className)}
      data-role={role}
      {...props}
    />
  );
}
