/**
 * Section - 콘텐츠 섹션 (IDDL v1.0.1)
 *
 * prominence, density, intent를 설정하고 자식에게 전파
 * Context를 통해 Group과 Item에 속성 제공
 *
 * v1.0.1: Aside role 추가, condition 지원, CVA 적용
 */

import { cva } from 'class-variance-authority';
import { LayoutProvider, useLayoutContext } from '@/components/context/IDDLContext';
import type { SectionProps } from '@/components/Item/types';
import { cn } from '@/shared/lib/utils';

/**
 * Section variants (CVA)
 * v1.1.0: IDE/Studio layout roles 추가
 */
const sectionVariants = cva('', {
  variants: {
    // Role (layout patterns)
    role: {
      // General Layout
      Container: 'flex-1 overflow-hidden',
      SplitContainer: 'flex-1 overflow-hidden flex flex-row',
      Main: 'flex-1 overflow-hidden',
      Header: 'sticky top-0 z-10 bg-surface-elevated border-b border-border-muted py-2 px-4',
      Footer: 'sticky bottom-0 z-10 bg-surface-elevated border-t border-border-muted py-2 px-4',
      Navigator: 'flex flex-col w-72 flex-shrink-0 border-r border-border-default overflow-y-auto',
      Aside: 'flex flex-col w-64 flex-shrink-0 border-l border-border-default overflow-y-auto',

      // IDE/Studio Specific (v1.1.0)
      ActivityBar:
        'flex flex-col w-12 flex-shrink-0 bg-surface-elevated border-r border-border-default overflow-hidden',
      PrimarySidebar:
        'flex flex-col w-64 flex-shrink-0 bg-surface border-r border-border-default overflow-y-auto',
      SecondarySidebar:
        'flex flex-col w-56 flex-shrink-0 bg-surface border-l border-border-default overflow-y-auto',
      Editor: 'flex-1 flex flex-col min-w-0 overflow-hidden bg-surface',
      Panel:
        'flex flex-col h-48 flex-shrink-0 bg-surface-sunken border-t border-border-default overflow-hidden',
      Auxiliary:
        'flex flex-col w-80 flex-shrink-0 bg-surface-cool border-l border-border-default overflow-y-auto',

      // Dialog/Modal Specific (v1.1.1)
      DialogHeader: 'flex items-center border-b border-border-default',
      DialogFooter: 'flex items-center justify-end border-t border-border-default',
      DialogContent: 'flex-1 overflow-y-auto',
    },
    // Prominence (visual hierarchy + spacing) - only for Container
    prominence: {
      Hero: 'bg-surface-raised p-8',
      Primary: 'bg-surface p-6',
      Secondary: 'bg-surface-sunken p-4',
      Tertiary: 'bg-surface-base p-2',
    },
    // Density (spacing multiplier) - only for Container
    density: {
      Comfortable: 'p-8',
      Standard: 'p-6',
      Compact: 'p-4',
    },
  },
  compoundVariants: [
    // IDE/Studio roles는 prominence와 density 무시 (v1.1.0)
    {
      role: [
        'Header',
        'Footer',
        'Navigator',
        'Aside',
        'SplitContainer',
        'ActivityBar',
        'PrimarySidebar',
        'SecondarySidebar',
        'Editor',
        'Panel',
        'Auxiliary',
      ],
      class: '!p-0 !bg-transparent',
    },
    // Header는 고유 스타일 유지
    {
      role: 'Header',
      class: 'sticky top-0 z-10 bg-surface-elevated border-b border-border-muted py-2 px-4',
    },
    // Footer는 고유 스타일 유지
    {
      role: 'Footer',
      class: 'sticky bottom-0 z-10 bg-surface-elevated border-t border-border-muted py-2 px-4',
    },
    // Navigator는 고유 스타일 유지
    {
      role: 'Navigator',
      class: 'flex flex-col w-72 flex-shrink-0 border-r border-border-default overflow-y-auto',
    },
    // Aside는 고유 스타일 유지
    {
      role: 'Aside',
      class: 'flex flex-col w-64 flex-shrink-0 border-l border-border-default overflow-y-auto',
    },
    // ActivityBar는 고유 스타일 유지 (v1.1.0)
    {
      role: 'ActivityBar',
      class:
        'flex flex-col w-12 flex-shrink-0 bg-surface-elevated border-r border-border-default overflow-hidden',
    },
    // PrimarySidebar는 고유 스타일 유지 (v1.1.0)
    {
      role: 'PrimarySidebar',
      class:
        'flex flex-col w-64 flex-shrink-0 bg-surface border-r border-border-default overflow-y-auto',
    },
    // SecondarySidebar는 고유 스타일 유지 (v1.1.0)
    {
      role: 'SecondarySidebar',
      class:
        'flex flex-col w-56 flex-shrink-0 bg-surface border-l border-border-default overflow-y-auto',
    },
    // Editor는 고유 스타일 유지 (v1.1.0)
    {
      role: 'Editor',
      class: 'flex-1 flex flex-col min-w-0 overflow-hidden bg-surface',
    },
    // Panel은 고유 스타일 유지 (v1.1.0)
    {
      role: 'Panel',
      class:
        'flex flex-col h-48 flex-shrink-0 bg-surface-sunken border-t border-border-default overflow-hidden',
    },
    // Auxiliary는 고유 스타일 유지 (v1.1.0)
    {
      role: 'Auxiliary',
      class:
        'flex flex-col w-80 flex-shrink-0 bg-surface-cool border-l border-border-default overflow-y-auto',
    },

    // Dialog roles는 density에 따라 padding 조절 (v1.1.1)
    // DialogHeader + Compact
    {
      role: 'DialogHeader',
      density: 'Compact',
      class: 'py-2 px-3',
    },
    // DialogHeader + Standard
    {
      role: 'DialogHeader',
      density: 'Standard',
      class: 'py-3 px-4',
    },
    // DialogHeader + Comfortable
    {
      role: 'DialogHeader',
      density: 'Comfortable',
      class: 'py-4 px-6',
    },
    // DialogFooter + Compact
    {
      role: 'DialogFooter',
      density: 'Compact',
      class: 'py-2 px-3 gap-2',
    },
    // DialogFooter + Standard
    {
      role: 'DialogFooter',
      density: 'Standard',
      class: 'py-3 px-4 gap-3',
    },
    // DialogFooter + Comfortable
    {
      role: 'DialogFooter',
      density: 'Comfortable',
      class: 'py-4 px-6 gap-4',
    },
    // DialogContent + Compact
    {
      role: 'DialogContent',
      density: 'Compact',
      class: 'p-3',
    },
    // DialogContent + Standard
    {
      role: 'DialogContent',
      density: 'Standard',
      class: 'p-4',
    },
    // DialogContent + Comfortable
    {
      role: 'DialogContent',
      density: 'Comfortable',
      class: 'p-6',
    },
  ],
  defaultVariants: {
    role: 'Container',
    prominence: 'Primary',
    density: 'Standard',
  },
});

/**
 * Role → HTML 시맨틱 태그 매핑
 */
const roleToTag: Record<string, string> = {
  // General Layout
  Main: 'main',
  Header: 'header',
  Footer: 'footer',
  Navigator: 'nav',
  Aside: 'aside',
  Container: 'section',
  SplitContainer: 'section',
  // Dialog/Modal Specific
  DialogHeader: 'header',
  DialogFooter: 'footer',
  DialogContent: 'div',
  // IDE/Studio Specific
  ActivityBar: 'nav',
  PrimarySidebar: 'aside',
  SecondarySidebar: 'aside',
  Editor: 'main',
  Panel: 'section',
  Auxiliary: 'aside',
};

/**
 * Role → ARIA 속성 매핑
 */
const roleToAria: Record<string, Record<string, string>> = {
  Navigator: { role: 'navigation' },
  ActivityBar: { role: 'navigation', 'aria-label': 'Activity Bar' },
  PrimarySidebar: { 'aria-label': 'Primary Sidebar' },
  SecondarySidebar: { 'aria-label': 'Secondary Sidebar' },
  Panel: { 'aria-label': 'Panel' },
  Auxiliary: { 'aria-label': 'Auxiliary Panel' },
};

export function Section({
  role = 'Container',
  prominence = 'Primary',
  density,
  intent,
  mode,
  children,
  className,
  id,
  onClick,
  condition,
}: SectionProps) {
  // 부모 Context 가져오기 (중첩된 경우)
  const parentCtx = useLayoutContext();
  const computedDensity = density ?? parentCtx.density ?? 'Standard';
  const computedIntent = intent ?? parentCtx.intent ?? 'Neutral';
  const computedMode = mode ?? parentCtx.mode ?? 'view';

  // 조건부 렌더링 (v1.0.1)
  // TODO: condition 표현식 평가 구현
  if (condition) {
    // 현재는 조건부 렌더링 미구현
  }

  // role에 따른 HTML 태그 결정
  const tag = roleToTag[role] || 'section';
  const Component = tag as keyof JSX.IntrinsicElements;

  // role에 따른 ARIA 속성 결정
  const ariaProps = roleToAria[role] || {};

  return (
    <LayoutProvider
      value={{
        prominence,
        role,
        density: computedDensity,
        intent: computedIntent,
        depth: parentCtx.depth + 1,
        mode: computedMode,
      }}
    >
      <Component
        id={id}
        className={cn(
          sectionVariants({
            role: role as any,
            prominence: prominence as 'Hero' | 'Primary' | 'Secondary' | 'Tertiary',
            density: computedDensity as 'Comfortable' | 'Standard' | 'Compact',
          }),
          className
        )}
        {...ariaProps}
        data-dsl-component="section"
        data-role={role}
        data-prominence={prominence}
        data-density={computedDensity}
        data-intent={computedIntent}
        data-mode={computedMode}
        onClick={onClick}
      >
        {children}
      </Component>
    </LayoutProvider>
  );
}
