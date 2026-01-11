import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { LayoutPortalContext, type LayoutSlot } from './context/LayoutPortalContext';
import { useIDDLToken } from '@/shared/iddl/token-engine';
import { LayoutProvider } from '@/components/context/IDDLContext';
import { cn } from '@/shared/lib/utils';
import type { PageProps } from './Page.types';

/**
 * Page Variants using CVA
 */
export const pageVariants = cva('iddl-page w-full transition-colors duration-200', {
  variants: {
    role: {
      Document: 'min-h-screen overflow-y-auto',
      Application: 'h-screen overflow-hidden flex flex-col',
      Focus: 'h-screen flex items-center justify-center overflow-hidden',
      Immersive: 'h-screen overflow-y-scroll snap-y snap-mandatory',
      Overlay: 'fixed inset-0 z-50 overflow-y-auto bg-black/50',
      Paper: 'min-h-screen bg-surface-base py-12 overflow-y-auto',
    },
    density: {
      Standard: '',
      Comfortable: 'gap-8',
      Compact: 'gap-2',
    }
  },
  defaultVariants: {
    role: 'Document',
    density: 'Standard',
  },
});

/**
 * IDDL Page Component
 */
export function Page({
  role = 'Document',
  layout = 'Single',
  title,
  prominence = 'Standard',
  density = 'Standard',
  intent = 'Neutral',
  children,
  className,
}: PageProps) {

  // Token Engine Integration
  const tokens = useIDDLToken({
    role: role as string,
    prominence,
    intent,
    density,
  });

  const isApplication = role === 'Application';
  const isDocument = role === 'Document';

  // Portal Nodes for Application Layout
  const [topNode, setTopNode] = useState<HTMLDivElement | null>(null);
  const [leftNode, setLeftNode] = useState<HTMLDivElement | null>(null);
  const [centerNode, setCenterNode] = useState<HTMLDivElement | null>(null);
  const [rightNode, setRightNode] = useState<HTMLDivElement | null>(null);
  const [bottomNode, setBottomNode] = useState<HTMLDivElement | null>(null);

  // Slot Registry Logic
  const registerSlot = (sectionRole: string): LayoutSlot | null => {
    switch (sectionRole) {
      case 'Header': case 'Toolbar': return 'top';
      case 'Footer': case 'Dock': return 'bottom';
      case 'Sidebar': case 'Nav': return 'left';
      case 'Aside': return 'right';
      case 'Main': case 'Editor': return 'center';
      default: return 'center';
    }
  };

  /**
   * Document Layout Renderer
   */
  const renderDocumentContent = () => {
    const top: React.ReactNode[] = [];
    const middle: React.ReactNode[] = [];
    const bottom: React.ReactNode[] = [];

    React.Children.forEach(children, (child: any) => {
      if (!child) return;
      const childRole = child.props?.role;

      if (childRole === 'Header') top.push(child);
      else if (childRole === 'Footer') bottom.push(child);
      else middle.push(child);
    });

    const isHorizontalLayout = layout === 'Sidebar' || layout === 'Aside' || layout === 'ThreeColumn';

    return (
      <div className={cn(
        "flex flex-col min-h-screen w-full",
        density === 'Comfortable' ? "gap-12" : density === 'Compact' ? "gap-4" : "gap-8"
      )}>
        {top.length > 0 && <div className="flex-shrink-0 z-20">{top}</div>}
        <div className={cn(
          "flex-1 flex w-full max-w-screen-2xl mx-auto px-6",
          isHorizontalLayout ? "flex-row gap-6" : "flex-col",
          density === 'Comfortable' ? "gap-10" : density === 'Compact' ? "gap-4" : "gap-8"
        )}>
          {middle}
        </div>
        {bottom.length > 0 && <div className="flex-shrink-0 z-10">{bottom}</div>}
      </div>
    );
  };

  const portalSlots = isApplication ? {
    slots: {
      top: { current: topNode },
      left: { current: leftNode },
      center: { current: centerNode },
      right: { current: rightNode },
      bottom: { current: bottomNode },
    } as any,
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
        <div
          className={cn(
            pageVariants({ role, density }),
            tokens.surface.background,
            tokens.typography.color,
            className
          )}
          data-role={role}
          data-layout={layout}
        >
          {isApplication ? (
            <div className="h-full w-full flex flex-col overflow-hidden">
              <div ref={setTopNode} className="flex-shrink-0 z-20" />
              <div className="flex-1 flex flex-row overflow-hidden relative">
                <div ref={setLeftNode} className="flex-shrink-0 h-full z-10" />
                <div ref={setCenterNode} className="flex-1 h-full relative z-0 flex flex-col overflow-hidden">
                  {children}
                </div>
                <div ref={setRightNode} className="flex-shrink-0 h-full z-10" />
              </div>
              <div ref={setBottomNode} className="flex-shrink-0 z-20" />
            </div>
          ) : (role === 'Document' ? renderDocumentContent() : children)}
        </div>
      </LayoutPortalContext.Provider>
    </LayoutProvider>
  );
}
