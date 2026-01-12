import type { ActionRendererProps } from '@/components/dsl/Element/Action/Action.types';
import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
import { cn } from '@/shared/lib/utils';

export function ChipAction({
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
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold transition-all duration-200',
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
      {icon && <span>{icon}</span>}
      <span>{children || label}</span>
    </Element>
  );
}
