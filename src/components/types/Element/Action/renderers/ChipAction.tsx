import React from 'react';
import type { ActionRendererProps } from '@/components/types/Element/Action/Action.types';
import { cn } from '@/shared/lib/utils';

export function ChipAction({
  className,
  children,
  label,
  icon,
  active,
  selected,
  ...props
}: ActionRendererProps) {
  return (
    <button
      role="button" // Chip can be button or separate role depending on context, button is safe for interactive
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
        'bg-surface-raised border-border-default hover:bg-surface-hover',
        (active || selected) && 'bg-primary/10 border-primary text-primary',
        className
      )}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span>{children || label}</span>
    </button>
  );
}
