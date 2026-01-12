/**
 * Block - Functional Component (IDDL v1.0 Spec Strict)
 * 
 * Implements the Part 1 core specification:
 * - 5 Axes: Role, Intent, Prominence, Density, Spec
 * - Hierarchy: Block children can be Block or Element
 */

import React, { useRef } from 'react';
import { BlockLayoutProvider, useBlockLayoutContext, useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { BlockProps, BlockRendererProps } from '@/components/dsl/Block/Block.types';
import { cn } from '@/shared/lib/utils';
import { getRoleConfig } from './role-config';
import { useIDDLToken } from '@/shared/iddl/token-engine';

export function Block({
  as,
  role,
  prominence,
  density,
  intent,
  spec,
  children,
  className,
  onClick,
  selectionModel,
  value,
  ...rest
}: BlockProps) {
  // 1. Inherit Axis from Context
  const parentCtx = useBlockLayoutContext();
  const sectionCtx = useLayoutContext();

  const computedProminence = prominence ?? parentCtx.prominence ?? 'Standard';
  const computedDensity = density ?? parentCtx.density ?? 'Standard';
  const computedIntent = intent ?? parentCtx.intent ?? 'Neutral';

  // ⚡️ IDDL Token Engine Integration (v6.0)
  const tokens = useIDDLToken({
    role: role as string,
    sectionRole: sectionCtx.role,
    prominence: computedProminence,
    intent: computedIntent,
    density: computedDensity,
    state: {
      selected: selectionModel?.isSelected?.(value) ?? false,
    }
  });

  // 2. Fetch Role Configuration
  const roleConfig = getRoleConfig(role);

  // 3. Determine Component Tag
  const componentRef = useRef<HTMLElement>(null);
  const Component: any = as || roleConfig?.htmlTag || 'div';
  const ariaProps = roleConfig?.ariaProps || {};

  // 4. Resolve Contextual Styles (Section Overrides)
  const sectionRole = sectionCtx.role as string;
  const sectionOverride = roleConfig?.sectionOverrides?.[sectionRole];

  // Selection Handling (v1.0.2)
  const isSelected = selectionModel?.isSelected?.(value) ?? false;
  const handleBlockClick = (e: React.MouseEvent<HTMLElement>) => {
    if (selectionModel?.handleItemClick) {
      selectionModel.handleItemClick(value, e);
    }
    onClick?.(e);
  };

  const finalClassName = cn(
    roleConfig?.baseStyles,
    sectionOverride?.baseStyles,
    tokens.surface.background,
    tokens.surface.blur,     // v6.1: backdrop-blur class
    tokens.typography.color,
    tokens.geometry.width,  // v6.0: border width class (e.g. border-2)
    tokens.geometry.color,  // v6.0: border color class (e.g. border-primary)
    tokens.geometry.radius, // v6.0: border radius class (e.g. rounded-lg)
    tokens.geometry.outline, // v6.2: outline class (e.g. outline-1)
    tokens.geometry.outlineOffset, // v6.2: outline-offset class
    tokens.shadow.boxShadow, // v6.0: shadow class (e.g. shadow-md)
    tokens.extraClasses,     // v6.5: Premium extra classes
    className
  );

  // 5. Prepare Block Layout Context
  const layoutValue = {
    prominence: computedProminence,
    role: role || 'Container',
    density: computedDensity,
    intent: computedIntent,
    depth: (parentCtx.depth || 0) + 1,
    mode: sectionCtx.mode,
    sectionRole: sectionCtx.role as string,
    pageRole: sectionCtx.pageRole,
  };

  const Renderer = roleConfig?.renderer;

  return (
    <BlockLayoutProvider value={layoutValue}>
      {Renderer ? (
        <Renderer
          {...rest}
          role={role!}
          Element={Component}
          computedProminence={computedProminence}
          computedDensity={computedDensity}
          computedIntent={computedIntent}
          spec={spec}
          tokens={tokens}
          className={finalClassName}
          onClick={handleBlockClick}
          data-selected={isSelected}
        >
          {children}
        </Renderer>
      ) : (
        <Component
          ref={(el: HTMLElement | null) => {
            (componentRef as any).current = el;
            if (rest.selectionModel?.registerItemRef) {
              rest.selectionModel.registerItemRef(rest.value, el);
            }
          }}
          {...rest}
          className={finalClassName}
          style={{
            padding: tokens.spacing.padding,
            gap: tokens.spacing.gap,
            ...((rest as any).style || {})
          }}
          {...ariaProps}
          data-role={role}
          data-prominence={computedProminence}
          data-density={computedDensity}
          data-intent={computedIntent}
          data-selected={isSelected}
          onClick={handleBlockClick}
        >
          {children}
        </Component>
      )}
    </BlockLayoutProvider>
  );
}

// Re-export shared types for convenience
export * from './Block.types';
