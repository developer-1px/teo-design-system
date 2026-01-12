import type { ActionRendererProps } from '@/components/dsl/Element/Action/Action.types';
import { Text } from '@/components/dsl/Element/Text/Text';
import { cn } from '@/shared/lib/utils';

export const Option = ({
  label,
  icon,
  loading,
  selected,
  disabled,
  handleClick,
  className,
  tokens,
  Element = 'button',
  children,
  ...rest
}: ActionRendererProps) => {
  return (
    <Element
      className={cn(
        // Base Layout
        'flex items-center justify-center gap-1.5 relative transition-all duration-200',
        // Layout: Padding & Radius from Token Engine (mapped to Option)
        tokens.spacing.padding,
        tokens.geometry.radius,

        // Visuals: Surface & Border
        selected ? 'bg-surface-active' : 'hover:bg-surface-hover/50',
        selected ? 'text-text-primary' : 'text-text-secondary',

        // Typography inherited via tokens (but we force Micro text below)
        className
      )}
      onClick={handleClick}
      disabled={disabled || loading}
      data-selected={selected}
      {...rest}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {label && (
        <Text
          role="Micro"
          content={label}
          prominence={selected ? 'Strong' : 'Standard'}
          className={cn('pointer-events-none', selected && 'font-semibold')}
        />
      )}
      {children}
    </Element>
  );
};
