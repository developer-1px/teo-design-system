import type { ActionRendererProps } from '@/components/types/Element/Action/Action.types';
import { cn } from '@/shared/lib/utils';

export function TabAction({
  className,
  children,
  label,
  icon,
  active,
  selected,
  ...props
}: ActionRendererProps) {
  // Tabs often have an active state indicated by border-bottom or background
  const isSelected = active || selected;
  return (
    <button
      role="tab"
      aria-selected={isSelected}
      className={cn(
        'flex items-center gap-2 px-3 py-2 border-b-2 border-transparent transition-colors text-sm font-medium',
        'hover:text-text-primary text-text-subtle',
        isSelected && 'border-primary text-primary',
        className
      )}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span>{children || label}</span>
    </button>
  );
}
