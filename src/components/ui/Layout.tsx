import { HTMLAttributes, forwardRef, ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

/**
 * Layout System - 모든 OS 앱에서 사용 가능한 범용 레이아웃
 *
 * Depth (깊이): 0-6 - 시각적 계층 구조
 * Variant (타입): grid | flex | stack | scroll | surface - 레이아웃 패턴
 * Island: 독립적인 UI 영역 (Bento Grid의 각 셀)
 *
 * @see DESIGN_PRINCIPLES.md
 */
export type LayoutDepth = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type LayoutVariant =
  | 'surface'  // 기본 (기존 Layer 동작)
  | 'grid'     // Bento Grid (CSS Grid)
  | 'flex'     // Flexbox
  | 'stack'    // Vertical/Horizontal Stack (스크롤 가능)
  | 'scroll';  // Pure Scroll Container

export type GridTemplate =
  | 'ide'                    // IDE 레이아웃
  | 'sidebar-content'        // 사이드바 + 콘텐츠
  | 'dashboard'              // 대시보드 (Bento)
  | 'split'                  // 2분할
  | 'custom';                // 커스텀

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 시각적 깊이 (0-6)
   * 0: App base, 1: Sunken, 2: Surface, 3: Elevated, 4: Floating, 5: Modal, 6: Overlay
   */
  depth?: LayoutDepth;

  /**
   * 레이아웃 타입
   * - surface: 기본 (기존 Layer 동작)
   * - grid: CSS Grid 기반
   * - flex: Flexbox 기반
   * - stack: 수직/수평 스택 (스크롤 가능)
   * - scroll: 순수 스크롤 컨테이너
   */
  variant?: LayoutVariant;

  /**
   * Grid 템플릿 (variant="grid"일 때만)
   */
  template?: GridTemplate;

  /**
   * 커스텀 Grid template (template="custom"일 때)
   */
  gridTemplate?: string;

  /**
   * Stack 방향 (variant="stack"일 때만)
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * 둥근 모서리
   */
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /**
   * 클릭 가능 (호버 효과)
   */
  clickable?: boolean;

  /**
   * 크기 조절 가능
   */
  resizable?: boolean;

  /**
   * 펼침/접힘 가능
   */
  collapsible?: boolean;

  /**
   * 떠있는 패널
   */
  floating?: boolean;

  /**
   * Gap (spacing between children)
   */
  gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24;
}

const depthStyles: Record<LayoutDepth, string> = {
  0: 'bg-layer-0 shadow-layer-0 z-layer-0',
  1: 'bg-layer-1 shadow-layer-1 z-layer-1',
  2: 'bg-layer-2 shadow-layer-2 z-layer-2',
  3: 'bg-layer-3 shadow-layer-3 z-layer-3',
  4: 'bg-layer-4 shadow-layer-4 z-layer-4',
  5: 'bg-layer-5 shadow-layer-5 z-layer-5',
  6: 'bg-layer-6 shadow-layer-6 z-layer-6',
};

const roundedStyles = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

const variantStyles: Record<LayoutVariant, string> = {
  surface: '',
  grid: 'grid',
  flex: 'flex',
  stack: 'flex overflow-auto',
  scroll: 'overflow-auto',
};

const gridTemplateStyles: Record<GridTemplate, string> = {
  'ide': 'grid-template-ide',
  'sidebar-content': 'grid-cols-[250px_1fr]',
  'dashboard': 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))]',
  'split': 'grid-cols-2',
  'custom': '',
};

const gapStyles = {
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

export const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({
    className,
    depth = 2,
    variant = 'surface',
    template,
    gridTemplate,
    direction = 'vertical',
    rounded = false,
    clickable = false,
    resizable = false,
    collapsible = false,
    floating = false,
    gap,
    style,
    ...props
  }, ref) => {
    const roundedClass = rounded === true
      ? 'rounded-lg'
      : rounded
      ? roundedStyles[rounded]
      : '';

    const clickableClass = clickable
      ? 'cursor-pointer transition-all duration-200 hover:brightness-[0.98] active:brightness-[0.96]'
      : '';

    const floatingClass = floating
      ? 'fixed'
      : '';

    const directionClass = variant === 'stack'
      ? direction === 'horizontal' ? 'flex-row' : 'flex-col'
      : '';

    const templateClass = variant === 'grid' && template && template !== 'custom'
      ? gridTemplateStyles[template]
      : '';

    const gapClass = gap !== undefined ? gapStyles[gap] : '';

    const customStyle: CSSProperties = {
      ...style,
      ...(variant === 'grid' && template === 'custom' && gridTemplate
        ? { gridTemplate }
        : {}),
    };

    return (
      <div
        ref={ref}
        className={cn(
          depthStyles[depth],
          variantStyles[variant],
          roundedClass,
          clickableClass,
          floatingClass,
          directionClass,
          templateClass,
          gapClass,
          resizable && 'resize',
          className
        )}
        style={customStyle}
        data-layout-variant={variant}
        data-layout-depth={depth}
        data-interactive={clickable ? 'true' : undefined}
        {...props}
      />
    );
  }
);

Layout.displayName = 'Layout';

/**
 * Layout.Island - 독립적인 UI 영역 (Bento Grid의 각 셀)
 */
export interface LayoutIslandProps extends Omit<LayoutProps, 'depth'> {
  /**
   * Grid area name (parent가 grid일 때)
   */
  area?: string;

  /**
   * Island depth (상속 가능)
   */
  depth?: LayoutDepth;

  /**
   * 최소 크기 (resizable일 때)
   */
  minWidth?: number;
  minHeight?: number;

  /**
   * 최대 크기 (resizable일 때)
   */
  maxWidth?: number;
  maxHeight?: number;
}

export const LayoutIsland = forwardRef<HTMLDivElement, LayoutIslandProps>(
  ({
    area,
    depth = 2,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    style,
    className,
    ...props
  }, ref) => {
    const customStyle: CSSProperties = {
      ...style,
      ...(area ? { gridArea: area } : {}),
      ...(minWidth ? { minWidth: `${minWidth}px` } : {}),
      ...(minHeight ? { minHeight: `${minHeight}px` } : {}),
      ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {}),
      ...(maxHeight ? { maxHeight: `${maxHeight}px` } : {}),
    };

    return (
      <Layout
        ref={ref}
        depth={depth}
        style={customStyle}
        className={cn('layout-island', className)}
        data-island-area={area}
        {...props}
      />
    );
  }
);

LayoutIsland.displayName = 'Layout.Island';

// Attach Island as a property of Layout
(Layout as any).Island = LayoutIsland;

/**
 * Type augmentation for Layout.Island
 */
declare module 'react' {
  interface FunctionComponent {
    Island?: typeof LayoutIsland;
  }
}

// Export backward compatibility alias
export const Layer = Layout;
export type LayerLevel = LayoutDepth;
export type LayerProps = LayoutProps;
