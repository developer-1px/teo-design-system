import React from 'react';
import type { ActionRendererProps } from '@/components/types/Element/Action/Action.types';
import { cn } from '@/shared/lib/utils';

export function MenuItemAction({
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
      role="menuitem"
      className={cn(
        'w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm transition-colors',
        'hover:bg-surface-hover',
        (active || selected) && 'bg-surface-selected text-primary',
        className
      )}
      {...props}
    >
      {icon && <span className="opacity-70">{icon}</span>}
      <span className="flex-1">{children || label}</span>
    </button>
  );
}
