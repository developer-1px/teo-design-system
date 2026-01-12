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
      case 'Footer': case 'Dock': case 'Statusbar': case 'Panel': return 'bottom';
      case 'Sidebar': case 'Nav': case 'ActivityBar': case 'PrimarySidebar': return 'left';
      case 'Aside': case 'UtilityBar': case 'SecondarySidebar': return 'right';
      case 'Main': case 'Editor': return 'center';
      default: return 'center';
    }
  };

  /**
   * Document Layout Renderer
   */
  const renderDocumentContent = () => {
    // Sort middle content for ThreeColumn/Sidebar layouts
    const top: React.ReactNode[] = [];
    const bottom: React.ReactNode[] = [];
    const middle: React.ReactNode[] = [];
    const leftNodes: React.ReactNode[] = [];
    const centerNodes: React.ReactNode[] = [];
    const rightNodes: React.ReactNode[] = [];

    React.Children.forEach(children, (child: any) => {
      if (!child) return;
      const childRole = child.props?.role;

      if (childRole === 'Header') top.push(child);
      else if (childRole === 'Footer') bottom.push(child);
      else if (layout === 'ThreeColumn' || layout === 'Sidebar' || layout === 'Aside') {
        // Auto-sort based on role for structural layouts
        if (['Sidebar', 'Nav', 'PrimarySidebar', 'SecondarySidebar'].includes(childRole)) {
          leftNodes.push(child);
        } else if (['Aside', 'UtilityBar'].includes(childRole)) {
          rightNodes.push(child);
        } else {
          centerNodes.push(child);
        }
      } else {
        middle.push(child);
      }
    });

    const isHorizontalLayout = layout === 'Sidebar' || layout === 'Aside' || layout === 'ThreeColumn';

    // Construct the middle area
    let middleContent: React.ReactNode;

    if (isHorizontalLayout) {
      middleContent = (
        <>
          {leftNodes.length > 0 && <div className="flex-none flex flex-col gap-6">{leftNodes}</div>}
          <div className="flex-1 flex flex-col gap-6 min-w-0">{centerNodes}</div>
          {rightNodes.length > 0 && <div className="flex-none flex flex-col gap-6">{rightNodes}</div>}
          {middle}
        </>
      );
    } else {
      middleContent = middle.concat(centerNodes, leftNodes, rightNodes);
    }

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
          {middleContent}
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
        mode: 'edit',
        layout,
        depth: 0,
        role,
        pageRole: role as string, // v6.3: Root Context Injection
      }}
    >
      <LayoutPortalContext.Provider value={portalSlots}>
        <div
          className={cn(
            pageVariants({ role, density }),
            tokens.surface.background,
            tokens.typography.color,
            tokens.extraClasses,
            className
          )}
          data-role={role}
          data-layout={layout}
        >
          {isApplication ? (
            <div className="h-full w-full flex flex-col overflow-hidden">
              {/* Top - Toolbar/Header */}
              <div ref={setTopNode} className="flex-shrink-0 z-20 flex flex-col" />

              {/* Middle - Row */}
              <div className="flex-1 flex flex-row overflow-hidden relative min-h-0">
                {/* Left - Sidebar/ActivityBar */}
                <div ref={setLeftNode} className="flex-shrink-0 h-full z-10 flex flex-row" />

                {/* Center - Main/Editor (min-w-0 prevents flex blowout) */}
                <div ref={setCenterNode} className="flex-1 h-full relative z-0 flex flex-col overflow-hidden min-w-0">
                  {children}
                </div>

                {/* Right - Aside/Panel */}
                <div ref={setRightNode} className="flex-shrink-0 h-full z-10 flex flex-row" />
              </div>

              {/* Bottom - Panel/Statusbar */}
              <div ref={setBottomNode} className="flex-shrink-0 z-20 flex flex-col" />
            </div>
          ) : (role === 'Document' ? renderDocumentContent() : children)}
        </div>
      </LayoutPortalContext.Provider>
    </LayoutProvider>
  );
}
