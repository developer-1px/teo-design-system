/**
 * AppLayout - Full-screen Application Layout Renderer (v4.0)
 *
 * w-screen h-screen overflow-hidden grid 기반 레이아웃
 * Section들의 gridArea를 자동 분석하여 동적으로 grid-template 생성
 *
 * 특징:
 * - Full viewport (w-screen h-screen)
 * - overflow-hidden (스크롤 없음, 각 Section이 자체 스크롤 관리)
 * - 동적 grid 레이아웃 (gridArea 조합으로 자동 계산)
 * - template prop은 힌트일 뿐, 실제로는 gridArea가 레이아웃 결정
 *
 * 지원하는 gridArea 패턴:
 * - Studio: activitybar, sidebar, editor, panel, rightbar
 * - Presentation: header, footer, left, right, main, top-left, top-right, bottom-left, bottom-right
 * - Sidebar: nav, content
 * - 3-Column: left, center, right
 *
 * @example
 * // Studio 레이아웃 (IDE)
 * <Page role="App" template="studio">
 *   <Section gridArea="activitybar">...</Section>
 *   <Section gridArea="sidebar">...</Section>
 *   <Section gridArea="editor">...</Section>
 *   <Section gridArea="panel">...</Section>
 * </Page>
 *
 * @example
 * // Presentation 레이아웃 (PPT)
 * <Page role="App" template="presentation">
 *   <Section gridArea="header">...</Section>
 *   <Section gridArea="left">...</Section>
 *   <Section gridArea="main">...</Section>
 *   <Section gridArea="right">...</Section>
 * </Page>
 */

import { cva } from 'class-variance-authority';
import { type ReactNode } from 'react';
import { useDynamicGridTemplate } from '@/components/types/Page/hooks/useDynamicGridTemplate';
import type { GridTemplate, Intent, Prominence } from '@/components/types/Atom/types';
import { cn } from '@/shared/lib/utils';

/**
 * App Layout Container Variants (CVA)
 */
const appLayoutVariants = cva(
  [
    'w-screen h-screen overflow-hidden',
    'bg-surface text-base text-text',
  ],
  {
    variants: {
      prominence: {
        Hero: 'bg-surface-raised',
        Standard: 'bg-surface',
        Strong: 'bg-surface-sunken',
        Subtle: 'bg-surface-base',
      },
      layout: {
        flex: 'flex',
        grid: 'grid',
      },
    },
    defaultVariants: {
      prominence: 'Standard',
      layout: 'grid',
    },
  }
);

/**
 * Grid Template Variants (v4.0: Template-aware)
 */
const gridTemplateVariants = cva('', {
  variants: {
    template: {
      // Studio layout (IDE/Studio): toolbar(auto) + activitybar(48px) + sidebar(250px) + editor(1fr) + panel(300px)
      studio: 'grid-template-studio',
      // Sidebar-Content layout: nav(250px) + content(1fr) + aside(250px)
      'sidebar-content': 'grid-template-sidebar',
      // Master-Detail layout: master(300px) + detail(1fr)
      'master-detail': '', // 동적 계산
      // 3-column layout: left(250px) + center(1fr) + right(250px)
      '3-col': 'grid-template-3col',
      // Dashboard layout: auto-fit grid with minmax(300px, 1fr)
      dashboard: 'grid-template-dashboard',
      // Dialog layout: dialog-header(auto) + dialog-content(1fr) + dialog-footer(auto)
      dialog: '', // 동적 계산
      // Presentation layout: 동적 Holy Grail + 코너 패널 (v4.0)
      presentation: '', // CSS is dynamically generated
      // Custom: user-defined (use className to override)
      custom: '',
    },
  },
  defaultVariants: {
    template: 'studio',
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

export interface AppLayoutProps {
  /**
   * Grid template type
   */
  template?: GridTemplate;

  /**
   * Gap between grid areas
   */
  gap?: number;

  /**
   * Prominence level
   */
  prominence?: Prominence;

  /**
   * Intent (semantic color)
   */
  intent?: Intent;

  /**
   * Children (Sections with gridArea)
   */
  children: ReactNode;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent) => void;
}

export function AppLayout(props: AppLayoutProps) {
  const {
    template = 'studio',
    gap = 0,
    prominence = 'Standard',
    intent = 'Neutral',
    children,
    className,
    onClick,
  } = props;

  // v4.1: role 기반 동적 템플릿 계산 (template 전달)
  const dynamicTemplate = useDynamicGridTemplate(children, template);

  // dashboard는 특수 케이스 (auto-fit grid)
  const isDashboard = template === 'dashboard';

  // Inline style로 동적 grid 적용 (dashboard 제외)
  const inlineStyle = !isDashboard
    ? {
        gridTemplateAreas: dynamicTemplate.gridTemplateAreas,
        gridTemplateColumns: dynamicTemplate.gridTemplateColumns,
        gridTemplateRows: dynamicTemplate.gridTemplateRows,
      }
    : undefined;

  return (
    <div
      className={cn(
        appLayoutVariants({ prominence, layout: 'grid' }),
        isDashboard && gridTemplateVariants({ template: 'dashboard' }),
        getGapClass(gap),
        className
      )}
      style={inlineStyle}
      data-dsl-component="page"
      data-role="app"
      data-layout="grid"
      data-template={template}
      data-prominence={prominence}
      data-intent={intent}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
