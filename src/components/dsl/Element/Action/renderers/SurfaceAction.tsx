import React from 'react';
import type { ActionProps } from '@/components/dsl/Element/Action/Action.types';
import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
import { cn } from '@/shared/lib/utils';

export function SurfaceAction({
  children,
  label,
  icon,
  selected,
  loading,
  isDisabled,
  handleClick,
  Element,
  className,
  computedProminence,
  computedIntent,
  computedDensity,
  role,
  tokens,
  ...rest
}: any) {
  const interactiveClasses = getInteractiveClasses({
    prominence: computedProminence || 'Standard',
    intent: computedIntent || 'Neutral',
    config: {
      selected,
      disabled: isDisabled || loading,
      focusable: true,
      clickable: true,
    },
    skipIdle: true,
  });

  return (
    <Element
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden transition-all',
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
      {...rest}
    >
      {children || (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </>
      )}
    </Element>
  );
}
