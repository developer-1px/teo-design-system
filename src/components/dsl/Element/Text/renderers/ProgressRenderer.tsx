import { cn } from '@/shared/lib/utils';
import type { TextRendererProps } from '../Text.types';

export function ProgressRenderer({
  className,
  spec,
  intent = 'Brand',
  ...props
}: TextRendererProps) {
  const value = (spec as any)?.value || 0;
  const max = (spec as any)?.max || 100;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const intentColor =
    {
      Neutral: 'bg-icon-default',
      Brand: 'bg-accent',
      Positive: 'bg-green-500',
      Caution: 'bg-yellow-500',
      Critical: 'bg-red-500',
      Info: 'bg-blue-500',
    }[intent] || 'bg-accent';

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn('h-2 w-full bg-surface-raised rounded-full overflow-hidden', className)}
      {...props}
    >
      <div
        className={cn('h-full transition-all duration-300', intentColor)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
