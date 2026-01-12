import type { ActionRendererProps } from '@/components/dsl/Element/Action/Action.types';
import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
import { cn } from '@/shared/lib/utils';

export function ListItemAction({
  className,
  children,
  label,
  icon,
  active,
  selected,
  computedProminence,
  computedIntent,
  computedDensity,
  role,
  handleClick,
  isDisabled,
  tokens,
  Element = 'div',
  ...props
}: ActionRendererProps) {
  const interactiveClasses = getInteractiveClasses({
    prominence: computedProminence,
    intent: computedIntent,
    config: {
      selected,
      disabled: isDisabled,
      clickable: true,
    },
    skipIdle: true,
  });

  return (
    <Element
      role="listitem"
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2 transition-all duration-200 focus:outline-none',
        tokens.surface.background,
        tokens.typography.color,
        tokens.geometry.width,
        tokens.geometry.color,
        tokens.geometry.radius,
        tokens.geometry.outline,
        tokens.geometry.outlineOffset,
        tokens.shadow.boxShadow,
        interactiveClasses,
        className
      )}
      {...props}
    >
      {icon && <span className="text-lg flex-shrink-0 opacity-80">{icon}</span>}
      <span className="flex-1 truncate font-medium">{children || label}</span>
    </Element>
  );
}
