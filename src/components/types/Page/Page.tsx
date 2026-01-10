/**
 * Page - Application Root (IDDL v5.0)
 *
 * **Why-based API**: "이 페이지는 어떻게 움직이는가?" + "공간을 어떻게 나누었는가?"
 *
 * **Four Page Types** (물리법칙):
 * - type="Application": 전체 화면, 스크롤 없음 (w-screen h-screen overflow-hidden)
 * - type="Document" (default): 스크롤 가능한 문서 페이지 (min-height: 100vh)
 * - type="Focus": 중앙 집중형 (로그인, 결제 등, 화면 정중앙 배치)
 * - type="Fullscreen": 전체화면 고정 (프레젠테이션, 키오스크, 스크롤 불가)
 *
 * **Seven Page Layouts** (공간 분할):
 * - layout="Single": Header + Container + Footer (1단 기본형)
 * - layout="Sidebar": Navigator(좌) + Container(우) (2단 좌측 메뉴형)
 * - layout="Aside": Container(좌) + Aside(우) (2단 우측 정보형)
 * - layout="HolyGrail": Header + Navigator + Container + Aside + Footer (3단 완전체)
 * - layout="Split": PanelLeft + PanelRight (5:5 분할형)
 * - layout="Studio": ActivityBar + PrimarySidebar + Editor + Panel (IDE 전용)
 * - layout="Blank": 빈 캔버스 (dialog, custom)
 *
 * **Why-based Developer Experience**:
 * ```tsx
 * // ❌ Before (v4.0)
 * <Page role="App" layout="grid" template="studio">
 *
 * // ✅ After (v5.0)
 * <Page type="Application" layout="Studio">
 * ```
 *
 * v1.0.1: title, description, layout, breadcrumbs, condition 추가
 * v2.0: role, prominence, density, intent, maxWidth, centered, navigation, scrollable, loading, error 추가
 * v3.0: main 태그 제거, layout 단순화 (flex/grid만 지원), role/navigation 제거
 * v4.0: Template-aware architecture, Section role validation
 * v5.0: role→type, template→layout 통합, Focus/Fullscreen 추가, direction 제거
 */

import { cva } from 'class-variance-authority';
import { ChevronRight, Loader2 } from 'lucide-react';
import { LayoutProvider } from '@/components/context/IDDLContext.tsx';
import type {
  PageProps,
  PageRole,
} from '@/components/types/Atom/types.ts';
import { cn } from '@/shared/lib/utils.ts';

// Import App layout renderer
import { AppLayout } from './renderers/AppLayout';
import { FullscreenLayout } from './renderers/FullscreenLayout';

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
 * Document page content variants (v5.0)
 * type="Document"일 때만 사용 (기존 role="Content")
 */
const documentPageVariants = cva('w-full flex-1 flex flex-col', {
  variants: {
    centered: {
      true: 'mx-auto',
      false: '',
    },
  },
  defaultVariants: {
    centered: false,
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
  role = 'Document',
  layout: layoutProp,
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
  onClick,
  condition,
  sizes,
  // Deprecated props (v5.0) - 하위 호환성
  direction,
  ...rest
}: PageProps) {
  // 하위 호환성: "App" → "Application", "Content" → "Document"
  const normalizedRole: PageRole =
    role === ('App' as any) ? 'Application' : role === ('Content' as any) ? 'Document' : role;

  // Layout prop usage
  const layout = layoutProp;

  // 조건부 렌더링
  if (condition) {
    // TODO: condition 표현식 평가 구현
  }

  // v5.0: role="Application" → AppLayout 렌더러 사용
  if (normalizedRole === 'Application') {
    return (
      <LayoutProvider
        value={{
          prominence,
          density,
          intent,
          depth: 0,
          mode: 'view',
          layout, // v5.0: Pass layout for Section role validation
        }}
      >
        <AppLayout
          layout={layout}
          gap={gap}
          prominence={prominence}
          intent={intent}
          onClick={onClick}
          sizes={sizes}
        >
          {children}
        </AppLayout>
      </LayoutProvider>
    );
  }

  // v5.0: role="Fullscreen" → FullscreenLayout 렌더러 사용
  if (normalizedRole === 'Fullscreen') {
    return (
      <LayoutProvider
        value={{
          prominence,
          density,
          intent,
          depth: 0,
          mode: 'view',
          layout, // v5.0: Pass layout for Section role validation
        }}
      >
        <FullscreenLayout
          prominence={prominence}
          intent={intent}
          onClick={onClick}
        >
          {children}
        </FullscreenLayout>
      </LayoutProvider>
    );
  }

  // TODO: role="Focus" → FocusLayout (v5.0)

  // role="Document" (default): 기존 Content 페이지 로직

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <div
        className={cn(
          pageContainerVariants({ prominence }),
          'items-center justify-center',
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
        layout, // v5.0: Pass layout for Section role validation
      }}
    >
      <Component
        className={cn(pageContainerVariants({ prominence }))}
        data-dsl-component="page"
        data-role={normalizedRole}
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
                    <span className="text-PrimarySidebartext-secondary">{crumb.label}</span>
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
            documentPageVariants({ centered }),
            getGapClass(gap),
            maxWidthClass
          )}
        >
          {children}
        </div>
      </Component>
    </LayoutProvider>
  );
}
