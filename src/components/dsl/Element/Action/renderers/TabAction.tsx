import type { ActionRendererProps } from '@/components/dsl/Element/Action/Action.types';
import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
import { cn } from '@/shared/lib/utils';

export function TabAction({
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
        'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 outline-none overflow-hidden',
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
      {icon && <span className="opacity-70">{icon}</span>}
      <span className="whitespace-nowrap">{children || label}</span>
    </Element>
  );
}
