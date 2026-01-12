import { cn } from '@/shared/lib/utils';
import type { TextRendererProps } from '../Text.types';

export function SkeletonRenderer({ className, prominence, ...props }: TextRendererProps) {
  const sizeClass =
    {
      Hero: 'h-8',
      Strong: 'h-6',
      Standard: 'h-4',
      Subtle: 'h-3',
    }[prominence || 'Standard'] || 'h-4';

  return (
    <div
      className={cn('animate-pulse bg-surface-raised rounded w-full', sizeClass, className)}
      {...props}
    />
  );
}
