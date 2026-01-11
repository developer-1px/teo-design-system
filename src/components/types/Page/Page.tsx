import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { LayoutProvider } from '@/components/context/IDDLContext.tsx';
import { useDynamicGridTemplate } from '@/components/types/Page/hooks/useDynamicGridTemplate';
import type { PageProps } from '@/components/types/Page/Page.types';
import { cn } from '@/shared/lib/utils';
import { getRoleConfig } from './role-registry';

/**
 * Page Physics Variants (Role-based)
 */
const pagePhysicsVariants = cva(
  'transition-colors', // Common base
  {
    variants: {
      role: {
        Document: 'relative min-h-screen w-full overflow-y-auto flex flex-col', // Standard Web (Flow)
        Application: 'relative h-screen w-screen overflow-hidden grid', // App Shell (Grid)
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
  mixed, // Filter out from rest
  ...rest
}: PageProps) {
  // v4.1: Role registry validation
  const _roleConfig = getRoleConfig(role);

  // Feature: Dynamic Grid Template Calculation
  const dynamicTemplate = useDynamicGridTemplate(children, layout);

  // Layout logic
  const isDocument = role === 'Document';
  const isApplication = role === 'Application';

  // Grouping children for Document (Flex flow)
  const renderDocumentContent = () => {
    const top: React.ReactNode[] = [];
    const middle: React.ReactNode[] = [];
    const bottom: React.ReactNode[] = [];

    // Simple heuristic: Header/Toolbar/Dock at top/bottom
    React.Children.forEach(children, (child: any) => {
      if (!child) return;
      const childRole = child.props?.role;

      if (
        childRole === 'Header' ||
        childRole === 'Toolbar' ||
        (childRole === 'Nav' && layout === 'Single')
      ) {
        top.push(child);
      } else if (childRole === 'Footer' || childRole === 'Status' || childRole === 'Dock') {
        bottom.push(child);
      } else {
        middle.push(child);
      }
    });

    const isHorizontalMiddle =
      layout === 'Sidebar' || layout === 'Aside' || layout === 'HolyGrail' || layout === 'Split';

    return (
      <>
        {top.length > 0 && <div className="flex flex-col w-full flex-shrink-0 z-20">{top}</div>}
        <div
          className={cn(
            'flex-1 flex w-full',
            isHorizontalMiddle ? 'flex-row' : 'flex-col',
            maxWidth && isDocument ? 'mx-auto' : ''
          )}
          style={
            maxWidth && isDocument
              ? { maxWidth: typeof maxWidth === 'number' ? maxWidth : undefined }
              : {}
          }
        >
          {middle}
        </div>
        {bottom.length > 0 && (
          <div className="flex flex-col w-full flex-shrink-0 z-10">{bottom}</div>
        )}
      </>
    );
  };

  // Grid styles for Application role
  const gridStyles = isApplication
    ? {
        display: 'grid',
        gridTemplateAreas: dynamicTemplate.gridTemplateAreas,
        gridTemplateColumns: dynamicTemplate.gridTemplateColumns,
        gridTemplateRows: dynamicTemplate.gridTemplateRows,
      }
    : {};

  // Additional classes for Document role constraints
  const documentConstraintClass = isDocument
    ? cn(getMaxWidthClass(maxWidth), centered ? 'mx-auto' : '')
    : '';

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

  // Layout Styles
  const layoutStyles: React.CSSProperties = {
    ...gridStyles,
    '--iddl-sidebar-width': layout === 'Sidebar' ? '288px' : layout === 'Aside' ? '256px' : 'auto',
  } as React.CSSProperties;

  return (
    <LayoutProvider
      value={{
        prominence,
        density,
        intent,
        mode: 'view',
        layout,
        depth: 0,
        role,
      }}
    >
      <Component
        className={cn(
          pagePhysicsVariants({ role, prominence }),
          !isApplication && documentConstraintClass,
          className
        )}
        style={layoutStyles}
        data-dsl-component="page"
        data-role={role}
        data-layout={layout}
        data-prominence={prominence}
        data-density={density}
        data-intent={intent}
        onClick={onClick}
        {...rest}
      >
        {isDocument ? renderDocumentContent() : children}
      </Component>
    </LayoutProvider>
  );
}
