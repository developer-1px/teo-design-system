/**
 * Page - Application Root (IDDL v4.0)
 *
 * **Two modes**:
 * - role="Content" (default): Scrollable, max-width constrained, content container
 * - role="App": Full-screen, overflow-hidden, grid-based application layout
 *
 * **role="Content" 특징**:
 * - h-full (부모에 맞춤) - Full height
 * - overflow-y-auto - 스크롤 가능
 * - flex 또는 grid 레이아웃
 * - max-width, centered 지원
 *
 * **role="App" 특징**:
 * - w-screen h-screen - Full viewport
 * - overflow-hidden - 스크롤 없음
 * - **template prop으로 Section role 결정** (studio, sidebar-content, master-detail, etc.)
 * - Section들이 grid-area로 배치됨
 *
 * **Template System (v4.0)**:
 * - `template="studio"` → ActivityBar, PrimarySidebar, Editor, Panel 등
 * - `template="sidebar-content"` → Navigator, Main, Aside 등
 * - `template="master-detail"` → Master, Detail 등
 * - Page template이 Section role을 결정하는 주체
 *
 * v1.0.1: title, description, layout, breadcrumbs, condition 추가
 * v2.0: role, prominence, density, intent, maxWidth, centered, navigation, scrollable, loading, error 추가
 * v3.0: main 태그 제거, layout 단순화 (flex/grid만 지원), role/navigation 제거
 * v4.0: Template-aware architecture, Section role validation
 */

import { cva } from 'class-variance-authority';
import { ChevronRight, Loader2 } from 'lucide-react';
import { LayoutProvider } from '@/components/context/IDDLContext.tsx';
import type { PageProps } from '@/components/types/Atom/types.ts';
import { cn } from '@/shared/lib/utils.ts';
import './grid-templates.css';

// Import App layout renderer
import { AppLayout } from './renderers/AppLayout';

/**
 * Page container variants (CVA)
 * v3.1: text-base 추가 - 모든 하위 Text가 상속받도록 함 (text-* 최소화)
 */
const pageContainerVariants = cva(
  'h-full w-full overflow-y-auto bg-surface-base flex flex-col text-base text-text-primary',
  {
    variants: {
      prominence: {
        Hero: 'bg-surface-raised',
        Standard: 'bg-surface',
        Strong: 'bg-surface-sunken',
        Subtle: 'bg-surface-base',
      },
    },
    defaultVariants: {
      prominence: 'Standard',
    },
  }
);

/**
 * Page layout variants (CVA)
 */
const pageLayoutVariants = cva('w-full flex-1', {
  variants: {
    layout: {
      flex: 'flex',
      grid: 'grid',
    },
    direction: {
      row: 'flex-row',
      column: 'flex-col',
    },
  },
  defaultVariants: {
    layout: 'flex',
    direction: 'column',
  },
});

/**
 * Grid template variants (Content role only)
 * v4.0: Template-aware, Section role과 1:1 대응
 */
const contentGridTemplateVariants = cva('', {
  variants: {
    template: {
      studio: 'grid-template-studio', // IDE/Studio layout
      'sidebar-content': 'grid-template-sidebar', // Web standard (nav + content + aside)
      'master-detail': '', // Master-Detail: 동적 계산
      '3-col': 'grid-template-3col', // 3-column layout
      dashboard: 'grid-template-dashboard', // Dashboard: auto-fit grid
      dialog: '', // Dialog: 동적 계산
      presentation: '', // Presentation: 동적 계산 (v4.0)
      custom: '', // Custom: 사용자 정의
    },
  },
});

/**
 * Gap utility - Convert number to Tailwind gap class
 */
function getGapClass(gap: number): string {
  const gapMap: Record<number, string> = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    12: 'gap-12',
    16: 'gap-16',
    24: 'gap-24',
  };
  return gapMap[gap] || 'gap-0';
}

/**
 * Max width mapping
 */
const maxWidthMap: Record<string, string> = {
  sm: 'max-w-sm', // 640px
  md: 'max-w-md', // 768px
  lg: 'max-w-lg', // 1024px
  xl: 'max-w-xl', // 1280px
  '2xl': 'max-w-2xl', // 1536px
  '4xl': 'max-w-4xl', // 2048px
  none: 'max-w-none',
};

export function Page({
  as: Component = 'div',
  role = 'Content',
  layout = 'flex',
  direction = 'column',
  template,
  gap = 0,
  maxWidth,
  centered = false,
  title,
  description,
  breadcrumbs,
  prominence = 'Standard',
  density = 'Standard',
  intent = 'Neutral',
  loading = false,
  error,
  children,
  className,
  onClick,
  condition,
  ...rest
}: PageProps) {
  // 조건부 렌더링
  if (condition) {
    // TODO: condition 표현식 평가 구현
  }

  // v4.0: role="App" → AppLayout 렌더러 사용 (Field 패턴과 동일)
  if (role === 'App') {
    return (
      <LayoutProvider
        value={{
          prominence,
          density,
          intent,
          depth: 0,
          mode: 'view',
          template, // v4.0: Pass template for Section role validation
        }}
      >
        <AppLayout
          template={template}
          gap={gap}
          prominence={prominence}
          intent={intent}
          className={className}
          onClick={onClick}
        >
          {children}
        </AppLayout>
      </LayoutProvider>
    );
  }

  // role="Content" (default): 기존 Content 페이지 로직

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <div
        className={cn(
          pageContainerVariants({ prominence }),
          'items-center justify-center',
          className
        )}
        data-dsl-component="page"
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
          pageContainerVariants({ prominence }),
          'items-center justify-center',
          className
        )}
        data-dsl-component="page"
        data-state="error"
      >
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <p className="text-lg font-semibold text-critical">Error</p>
          <p className="text-sm text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  const maxWidthClass = maxWidth
    ? typeof maxWidth === 'number'
      ? `max-w-[${maxWidth}px]`
      : maxWidthMap[maxWidth] || maxWidthMap.none
    : undefined;

  return (
    <LayoutProvider
      value={{
        prominence,
        density,
        intent,
        depth: 0,
        mode: 'view',
        template, // v4.0: Pass template for Section role validation
      }}
    >
      <Component
        className={cn(pageContainerVariants({ prominence }), className)}
        data-dsl-component="page"
        data-layout={layout}
        data-prominence={prominence}
        data-density={density}
        data-intent={intent}
        onClick={onClick}
        {...rest}
      >
        {/* Breadcrumbs */}
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

        {/* Page Header */}
        {(title || description) && (
          <header className="px-6 py-6 border-b border-border bg-surface">
            {title && <h1 className="text-3xl font-semibold text-text-primary mb-2">{title}</h1>}
            {description && <p className="text-base text-text-secondary">{description}</p>}
          </header>
        )}

        {/* Page Content */}
        <div
          className={cn(
            pageLayoutVariants({
              layout,
              direction: layout === 'flex' ? direction : undefined,
            }),
            layout === 'grid' && template && contentGridTemplateVariants({ template }),
            getGapClass(gap),
            maxWidthClass,
            centered && 'mx-auto'
          )}
        >
          {children}
        </div>
      </Component>
    </LayoutProvider>
  );
}
