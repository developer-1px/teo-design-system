import React, { useState } from 'react';
import { LayoutPortalContext, type LayoutSlot } from './context/LayoutPortalContext';
import { useIDDLToken } from '@/shared/iddl/token-engine';
import { useDynamicGridTemplate } from './hooks/useDynamicGridTemplate';
import { getRoleConfig } from './role-registry';
import { LayoutProvider } from '@/components/context/IDDLContext';
import { cn } from '@/shared/lib/utils';
import type { PageProps } from './Page.types';

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


// ...

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
  mixed,
  ...rest
}: PageProps) {
  // v4.1: Role registry validation
  const _roleConfig = getRoleConfig(role);

  // ============================================
  // ⚡️ IDDL Token Engine Integration
  // ============================================
  const tokens = useIDDLToken({
    role: role as string,
    prominence,
    intent,
    density,
  });

  // Feature: Dynamic Grid Template Calculation
  const dynamicTemplate = useDynamicGridTemplate(children, layout);

  // Layout logic
  const isDocument = role === 'Document';
  const isApplication = role === 'Application';

  // ============================================
  // 🏗️ Application Layout Skeleton (Portal Nodes)
  // ============================================
  const [topNode, setTopNode] = useState<HTMLDivElement | null>(null);
  const [leftNode, setLeftNode] = useState<HTMLDivElement | null>(null);
  const [centerNode, setCenterNode] = useState<HTMLDivElement | null>(null);
  const [rightNode, setRightNode] = useState<HTMLDivElement | null>(null);
  const [bottomNode, setBottomNode] = useState<HTMLDivElement | null>(null);

  // Slot Registry Logic (Simple Role Mapping)
  const registerSlot = (sectionRole: string): LayoutSlot | null => {
    switch (sectionRole) {
      case 'Header': case 'Toolbar': case 'UtilityBar': return 'top';
      case 'Footer': case 'Statusbar': case 'Dock': return 'bottom';
      case 'Sidebar': case 'PrimarySidebar': case 'ActivityBar': case 'Nav': return 'left';
      case 'Aside': case 'SecondarySidebar': return 'right';
      case 'Main': case 'Canvas': case 'Panel': case 'Editor': return 'center';
      default: return 'center';
    }
  };

  const renderApplicationSkeleton = () => (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* TOP */}
      <div ref={setTopNode} className="flex-shrink-0 z-20 flex flex-col" />

      {/* MIDDLE (Flex Row) */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        <div ref={setLeftNode} className="flex-shrink-0 h-full flex flex-row z-10" />
        <div ref={setCenterNode} className="flex-1 h-full relative z-0 flex flex-col overflow-hidden">
          {/* Main content area */}
        </div>
        <div ref={setRightNode} className="flex-shrink-0 h-full flex flex-row z-10" />
      </div>

      {/* BOTTOM */}
      <div ref={setBottomNode} className="flex-shrink-0 z-20 flex flex-col" />

      {/* 
        Hidden Container for Children 
        (They will Portal out to slots, or stay here if they don't portal)
        NOTE: If they stay here, they are hidden! 
        So everything in Application Layout MUST use Portals (Sections)
        OR layout must support 'Unknowns'.
        
        BETTER STRATEGY: 
        Render children in a hidden fragment? No.
        Render children inside the centerNode?
        If I render children inside the centerNode div above:
          <div ref={setCenterNode}> {children} </div>
        Then:
          - Non-Sections: Appear in Center (Great!)
          - Sections: Mount in Center, then Portal to Top/Left (Great!)
        
        This prevents hidden content issues.
      */}
    </div>
  );

  // Grouping children for Document (Flex flow)
  const renderDocumentContent = () => {
    // ... (same as before)
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

  // Grid styles DEPRECATED for Application
  const gridStyles = isApplication
    ? {} // No Grid styles for App anymore, pure Flex
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

  // NOTE: For Application, we construct the slots object with actual nodes
  const portalSlots = isApplication ? {
    slots: {
      top: { current: topNode },
      left: { current: leftNode },
      center: { current: centerNode },
      right: { current: rightNode },
      bottom: { current: bottomNode },
    } as any, // Cast to match context shape (RefObject vs Node)
    register: registerSlot
  } : null;

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
      <LayoutPortalContext.Provider value={portalSlots}>
        <Component
          className={cn(
            _roleConfig.baseStyles,
            !isApplication && documentConstraintClass,
            className
          )}
          style={{
            ...layoutStyles,
            backgroundColor: tokens.surface.background,
          }}
          data-dsl-component="page"
          data-role={role}
          data-layout={layout}
          data-prominence={prominence}
          data-density={density}
          data-intent={intent}
          onClick={onClick}
          {...rest}
        >
          {isApplication ? (
            <div className="h-full w-full flex flex-col overflow-hidden">
              {/* Skeleton */}
              <div ref={setTopNode} className="flex-shrink-0 z-20 flex flex-col" />
              <div className="flex-1 flex flex-row overflow-hidden relative">
                <div ref={setLeftNode} className="flex-shrink-0 h-full flex flex-row z-10" />
                <div ref={setCenterNode} className="flex-1 h-full relative z-0 flex flex-col overflow-hidden">
                  {children} {/* Default Slot */}
                </div>
                <div ref={setRightNode} className="flex-shrink-0 h-full flex flex-row z-10" />
              </div>
              <div ref={setBottomNode} className="flex-shrink-0 z-20 flex flex-col" />
            </div>
          ) : (isDocument ? renderDocumentContent() : children)}
        </Component>
      </LayoutPortalContext.Provider>
    </LayoutProvider>
  );
}
