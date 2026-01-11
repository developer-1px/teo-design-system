import { cn } from '@/shared/lib/utils';
import type { TextRendererProps } from '../Text.types';

export function SpinnerRenderer({
  className,
  prominence,
  intent = 'Brand',
  ...props
}: TextRendererProps) {
  const sizeClass =
    {
      Hero: 'w-8 h-8',
      Strong: 'w-6 h-6',
      Standard: 'w-4 h-4',
      Subtle: 'w-3 h-3',
    }[prominence || 'Standard'] || 'w-4 h-4';

  const intentColor =
    {
      Neutral: 'text-icon-default',
      Brand: 'text-accent',
      Positive: 'text-green-500',
      Caution: 'text-yellow-500',
      Critical: 'text-red-500',
      Info: 'text-blue-500',
    }[intent] || 'text-accent';

  return (
    <div
      role="status"
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClass,
        intentColor,
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
