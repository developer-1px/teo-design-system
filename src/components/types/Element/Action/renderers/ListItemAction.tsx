import type { ActionRendererProps } from '@/components/types/Element/Action/Action.types';
import { cn } from '@/shared/lib/utils'; // Assuming utils exists

export function ListItemAction({
  className,
  children,
  label,
  icon,
  active,
  selected,
  ...props
}: ActionRendererProps) {
  return (
    <div
      role="listitem"
      className={cn(
        'flex items-center gap-2 p-2 rounded cursor-pointer transition-colors',
        'hover:bg-surface-hover',
        (active || selected) && 'bg-surface-selected text-primary',
        className
      )}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span className="flex-1 truncate">{children || label}</span>
    </div>
  );
}
