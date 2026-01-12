import type { ActionRendererProps } from '@/components/dsl/Element/Action/Action.types';
import { cn } from '@/shared/lib/utils';
import { getInteractiveClasses } from '@/shared/config/interactive-tokens';

export function MenuItemAction({
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
  Element = 'button',
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
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 w-full text-left outline-none',
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
      {icon && <span className="opacity-70 flex-shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children || label}</span>
    </Element>
  );
}
