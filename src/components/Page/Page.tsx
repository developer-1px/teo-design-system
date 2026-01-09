/**
 * Page - 최상위 페이지 컨테이너 (IDDL v2.0)
 *
 * 전체 페이지를 감싸는 루트 컴포넌트
 *
 * v1.0.1: title, description, layout, breadcrumbs, condition 추가, CVA 적용
 * v2.0: role 기반 variants, prominence/density/intent 통합, NavigationConfig 지원
 */

import { cva } from 'class-variance-authority';
import { ChevronRight, Loader2 } from 'lucide-react';
import { LayoutProvider } from '@/components/Unknown/context/IDDLContext';
import type { PageLayout, PageProps, PageRole } from '@/components/Unknown/utils/types';
import { cn } from '@/shared/lib/utils';

/**
 * Role별 기본 layout 매핑
 */
const roleToLayout: Record<PageRole, PageLayout> = {
  App: 'full',
  Document: 'single',
  Dashboard: 'dashboard',
  Wizard: 'wizard',
  Settings: 'sidebar',
  Canvas: 'full',
  Gallery: 'masonry',
  Feed: 'single',
};

/**
 * Role별 기본 maxWidth
 */
const roleToMaxWidth: Record<PageRole, string> = {
  App: 'none',
  Document: 'max-w-4xl', // 1024px
  Dashboard: 'max-w-none',
  Wizard: 'max-w-2xl', // 640px
  Settings: 'max-w-7xl', // 1280px
  Canvas: 'max-w-none',
  Gallery: 'max-w-screen-2xl', // 1440px
  Feed: 'max-w-3xl', // 768px
};

/**
 * Page container variants (CVA)
 */
const pageContainerVariants = cva('bg-surface-base flex flex-col', {
  variants: {
    // Role-driven base styles
    role: {
      App: 'h-screen w-screen overflow-hidden',
      Document: 'h-full w-full overflow-y-auto',
      Dashboard: 'h-full w-full overflow-y-auto',
      Wizard: 'h-full w-full overflow-hidden',
      Settings: 'h-full w-full overflow-y-auto',
      Canvas: 'h-screen w-screen overflow-hidden',
      Gallery: 'h-full w-full overflow-y-auto',
      Feed: 'h-full w-full overflow-y-auto',
    },
    // Prominence (visual hierarchy)
    prominence: {
      Hero: 'bg-surface-raised',
      Primary: 'bg-surface',
      Secondary: 'bg-surface-sunken',
      Tertiary: 'bg-surface-base',
    },
  },
  defaultVariants: {
    role: 'Document',
    prominence: 'Primary',
  },
});

/**
 * Page layout variants (CVA)
 */
const pageLayoutVariants = cva('flex-1', {
  variants: {
    layout: {
      single: 'p-6 mx-auto',
      sidebar: 'p-6 grid grid-cols-[250px_1fr] gap-6',
      dashboard: 'p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      split: 'p-6 grid grid-cols-2 gap-6',
      wizard: 'p-6 mx-auto',
      full: '', // Full layout: no padding, no constraints (for app root)
      studio: 'flex gap-0 overflow-hidden', // v2.0: IDE/Studio
      'three-column': 'grid grid-cols-[250px_1fr_250px] gap-0', // v2.0: 3컬럼
      masonry: 'p-6 columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6', // v2.0: Masonry
      timeline: 'p-6 max-w-4xl mx-auto', // v2.0: Timeline
    },
    density: {
      Comfortable: 'p-8',
      Standard: 'p-6',
      Compact: 'p-4',
    },
  },
  compoundVariants: [
    // full과 studio는 padding 무시
    {
      layout: ['full', 'studio'],
      class: '!p-0',
    },
  ],
  defaultVariants: {
    layout: 'single',
    density: 'Standard',
  },
});

export function Page({
  // Identity & Structure
  role = 'Document',
  title,
  description,

  // Design Tokens
  prominence = 'Primary',
  density = 'Standard',
  intent = 'Neutral',

  // Layout Control
  layout,
  maxWidth,
  centered = false,

  // Navigation
  breadcrumbs,
  navigation,

  // State & Behavior
  scrollable,
  loading = false,
  error,

  // React Integration
  children,
  className,
  onClick,
  condition,
}: PageProps) {
  // 조건부 렌더링 (v1.0.1)
  // TODO: condition 표현식 평가 구현
  if (condition) {
    // 현재는 조건부 렌더링 미구현
  }

  // Role에 따른 기본값 계산
  const computedLayout = layout || roleToLayout[role];
  const computedMaxWidth = maxWidth
    ? typeof maxWidth === 'number'
      ? `max-w-[${maxWidth}px]`
      : maxWidth === 'none'
        ? 'max-w-none'
        : `max-w-${maxWidth}`
    : roleToMaxWidth[role];
  const computedScrollable =
    scrollable ?? (role !== 'App' && role !== 'Canvas' && role !== 'Wizard');

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <div
        className={cn(
          pageContainerVariants({ role, prominence }),
          'items-center justify-center',
          className
        )}
        data-dsl-component="page"
        data-role={role}
        data-state="loading"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-text-secondary" />
          <p className="text-sm text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div
        className={cn(
          pageContainerVariants({ role, prominence }),
          'items-center justify-center',
          className
        )}
        data-dsl-component="page"
        data-role={role}
        data-state="error"
      >
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <p className="text-lg font-semibold text-critical">Error</p>
          <p className="text-sm text-text-secondary">{error}</p>
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
        depth: 0,
        mode: 'view',
      }}
    >
      <div
        className={cn(
          pageContainerVariants({ role, prominence }),
          computedScrollable && 'overflow-y-auto',
          className
        )}
        data-dsl-component="page"
        data-role={role}
        data-layout={computedLayout}
        data-prominence={prominence}
        data-density={density}
        data-intent={intent}
        onClick={onClick}
      >
        {/* Navigation Header (v2.0) */}
        {navigation?.header?.show && (
          <header
            className={cn(
              'px-6 py-3 border-b border-border bg-surface',
              navigation.header.sticky && 'sticky top-0 z-10',
              navigation.header.transparent && 'bg-transparent border-transparent'
            )}
          >
            {/* Placeholder for future header content */}
          </header>
        )}

        {/* Breadcrumbs (v1.0.1) */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="px-6 py-3 border-b border-border bg-surface" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight size={16} className="text-text-tertiary" />}
                  {crumb.to ? (
                    <a href={crumb.to} className="text-accent hover:underline">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-text-secondary">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Page Header (v1.0.1) */}
        {(title || description) && (
          <header className="px-6 py-6 border-b border-border bg-surface">
            {title && <h1 className="text-3xl font-semibold text-text-primary mb-2">{title}</h1>}
            {description && <p className="text-base text-text-secondary">{description}</p>}
          </header>
        )}

        {/* Page Content with Layout */}
        <main
          className={cn(
            pageLayoutVariants({ layout: computedLayout, density }),
            computedMaxWidth,
            centered && 'mx-auto'
          )}
        >
          {children}
        </main>

        {/* Navigation Footer (v2.0) */}
        {navigation?.footer?.show && (
          <footer
            className={cn(
              'px-6 py-3 border-t border-border bg-surface',
              navigation.footer.sticky && 'sticky bottom-0 z-10'
            )}
          >
            {/* Placeholder for future footer content */}
          </footer>
        )}
      </div>
    </LayoutProvider>
  );
}
