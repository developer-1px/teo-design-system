/**
 * Page - Application Root (IDDL v5.0 Final)
 *
 * **Physics (Role)**: Controls Scroll & Viewport behavior.
 * **Zoning (Layout)**: Controls Grid/Flex structure.
 *
 * This component acts as the "God Component" for the page structure,
 * enforcing the physical laws defined in the IDDL spec.
 */

import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { LayoutProvider } from '@/components/context/IDDLContext.tsx';
import { useDynamicGridTemplate } from '@/components/types/Page/hooks/useDynamicGridTemplate';
import type { PageProps } from '@/components/types/Page/Page.types';
import { cn } from '@/shared/lib/utils';

/**
 * Page Physics Variants (Role-based)
 */
const pagePhysicsVariants = cva(
  'transition-colors', // Common base
  {
    variants: {
      role: {
        Document: 'relative min-h-screen w-full overflow-y-auto flex flex-col', // Standard Web
        Application: 'relative h-screen w-screen overflow-hidden grid', // App Shell
        Focus:
          'relative min-h-screen w-full overflow-y-auto flex flex-col items-center justify-center', // Center
        Fullscreen: 'fixed inset-0 z-50 h-full w-full overflow-hidden', // Kiosk
        Immersive: 'relative h-screen w-full overflow-y-scroll snap-y snap-mandatory', // PPT
        Overlay: 'fixed inset-0 z-50 h-full w-full overflow-y-auto bg-black/50', // Backdrop
        Paper:
          'relative mx-auto w-[210mm] min-h-[297mm] overflow-visible shadow-lg bg-white text-black bg-surface', // A4 Print
      },
      prominence: {
        Hero: 'bg-surface-raised',
        Standard: 'bg-surface',
        Strong: 'bg-surface-sunken',
        Subtle: 'bg-surface-base',
      },
    },
    defaultVariants: {
      role: 'Document',
      prominence: 'Standard',
    },
  }
);

/**
 * Document Width Constraints
 */
const maxWidthMap: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  none: 'max-w-none',
};

/**
 * Helper to get max-width class
 */
const getMaxWidthClass = (mw?: string | number) => {
  if (!mw) return undefined;
  if (typeof mw === 'number') return `max-w-[${mw}px]`;
  return maxWidthMap[mw] || maxWidthMap.none;
};

export function Page({
  as: Component = 'div',
  role = 'Document',
  layout = 'Single',
  title,
  description,
  maxWidth,
  centered = false,
  prominence = 'Standard',
  density = 'Standard',
  intent = 'Neutral',
  loading = false,
  error,
  children,
  className,
  onClick,
  condition,
  // Note: gap, breadcrumbs, direction, template are REMOVED (Legacy)
  ...rest
}: PageProps) {
  // Feature: Dynamic Grid Template Calculation
  // Analyzes <Section> children to build grid-areas automatically.
  const dynamicTemplate = useDynamicGridTemplate(children, layout);

  // Layout Styles (Applied only if role supports Grid layout)
  // Document role uses Flex usually, but can use Grid if layout is complex (like HolyGrail).
  // Application role ALWAYS uses Grid.
  // Focus uses Flex Center.

  const hasDynamicLayout =
    layout &&
    ['Single', 'Sidebar', 'Split', 'Aside', 'HolyGrail', 'Mobile', 'Studio'].includes(layout);

  const isGridPowered = role === 'Application' || (role === 'Document' && hasDynamicLayout);

  const layoutStyles = isGridPowered
    ? {
      display: 'grid',
      gridTemplateAreas: dynamicTemplate.gridTemplateAreas,
      gridTemplateColumns: dynamicTemplate.gridTemplateColumns,
      gridTemplateRows: dynamicTemplate.gridTemplateRows,
    }
    : {};

  // Additional classes for Document role constraints
  const documentConstraintClass =
    role === 'Document'
      ? cn(
        getMaxWidthClass(maxWidth),
        centered ? 'mx-auto' : ''
      )
      : '';

  // Condition check
  if (condition) {
    // TODO: Evaluate condition string
  }

  // Loading State
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-text-secondary" />
          <p className="text-sm text-text-secondary">Loading {title}...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-surface-base">
        <div className="text-center">
          <h1 className="text-xl font-bold text-critical">Error Loading Page</h1>
          <p className="text-text-secondary mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <LayoutProvider
      value={{
        prominence,
        density,
        intent,
        mode: 'view',
        layout, // Important: Passed down directly for Section validation
        depth: 0,
        role, // Pass role down so children know their physics context?
      }}
    >
      <Component
        className={cn(
          pagePhysicsVariants({ role, prominence }),
          documentConstraintClass,
          className
        )}
        style={{ ...layoutStyles }}
        data-dsl-component="page"
        data-role={role}
        data-layout={layout}
        data-prominence={prominence}
        data-density={density}
        data-intent={intent}
        onClick={onClick}
        {...rest}
      >
        {/* Title/Description Header (Optional, mostly for Document) */}
        {children}
      </Component>
    </LayoutProvider>
  );
}
