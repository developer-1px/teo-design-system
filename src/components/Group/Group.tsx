/**
 * Group - 그룹 컨테이너 (IDDL v1.0.1)
 *
 * role을 지정하여 "이것은 무엇인지" 정의
 * prominence, density, intent를 재정의할 수도 있고, 부모에서 상속받을 수도 있음
 *
 * v1.0.1: layout, state, emptyContent, errorContent, condition 추가, CVA 적용
 */

import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { LayoutProvider, useLayoutContext } from '@/components/Unknown/context/IDDLContext';
import type { GroupProps, GroupRole } from '@/components/Unknown/utils/types';
import { cn } from '@/shared/lib/utils';

/**
 * Group container variants (CVA)
 * v1.1.1: Density-aware spacing 추가
 */
const groupVariants = cva('', {
  variants: {
    // Layout (how children are arranged)
    layout: {
      stack: 'flex flex-col gap-2',
      inline: 'flex flex-row gap-2 items-center',
      grid: 'grid grid-cols-2 md:grid-cols-3 gap-4',
      table: 'flex flex-col',
      split: 'grid grid-cols-2 gap-4',
      tabs: 'flex flex-col',
      steps: 'flex flex-col gap-4',
    },
    // Role (semantic purpose)
    role: {
      Container: '',
      Form: 'space-y-4',
      Fieldset: 'border border-default rounded-lg p-4 space-y-3',
      Toolbar: 'flex items-center gap-2',
      List: 'flex flex-col gap-1 flex-1 overflow-y-auto',
      Grid: 'grid gap-4',
      Table: 'border border-default rounded-lg overflow-hidden',
      Tabs: 'flex flex-col',
      Steps: 'flex flex-col',
      Split: 'grid grid-cols-2 gap-4',
      Card: 'bg-surface-raised rounded-lg p-4', // Shadow removed per minimal-renderer-guide.md Section 2.1: Card는 페이지와 같은 레벨
      Inline: 'flex items-center gap-2',
    },
    // Density (v1.1.1)
    density: {
      Compact: '',
      Standard: '',
      Comfortable: '',
    },
  },
  compoundVariants: [
    // Layout + Density (v1.1.1)
    { layout: 'stack', density: 'Compact', class: '!gap-1' },
    { layout: 'stack', density: 'Comfortable', class: '!gap-4' },
    { layout: 'inline', density: 'Compact', class: '!gap-1' },
    { layout: 'inline', density: 'Comfortable', class: '!gap-4' },
    { layout: 'grid', density: 'Compact', class: '!gap-2' },
    { layout: 'grid', density: 'Comfortable', class: '!gap-6' },
    { layout: 'split', density: 'Compact', class: '!gap-2' },
    { layout: 'split', density: 'Comfortable', class: '!gap-6' },
    { layout: 'steps', density: 'Compact', class: '!gap-2' },
    { layout: 'steps', density: 'Comfortable', class: '!gap-6' },

    // Role + Density (v1.1.1)
    { role: 'Form', density: 'Compact', class: '!space-y-2' },
    { role: 'Form', density: 'Comfortable', class: '!space-y-6' },
    { role: 'Fieldset', density: 'Compact', class: '!p-2 !space-y-2' },
    { role: 'Fieldset', density: 'Comfortable', class: '!p-6 !space-y-4' },
    { role: 'Toolbar', density: 'Compact', class: '!gap-1' },
    { role: 'Toolbar', density: 'Comfortable', class: '!gap-3' },
    { role: 'List', density: 'Compact', class: '!gap-0.5' },
    { role: 'List', density: 'Comfortable', class: '!gap-2' },
    { role: 'Grid', density: 'Compact', class: '!gap-2' },
    { role: 'Grid', density: 'Comfortable', class: '!gap-6' },
    { role: 'Card', density: 'Compact', class: '!p-2' },
    { role: 'Card', density: 'Comfortable', class: '!p-6' },
    { role: 'Inline', density: 'Compact', class: '!gap-1' },
    { role: 'Inline', density: 'Comfortable', class: '!gap-3' },
  ],
  defaultVariants: {
    layout: 'stack',
    role: 'Container',
    density: 'Standard',
  },
});

/**
 * Group state variants (CVA) - for loading/error/empty states
 */
const groupStateVariants = cva('', {
  variants: {
    state: {
      loading: 'flex items-center justify-center py-8',
      error: 'py-8',
      empty: 'py-8 text-center',
      idle: '',
    },
  },
  defaultVariants: {
    state: 'idle',
  },
});

/**
 * Role → HTML 시맨틱 태그 매핑
 */
const roleToTag: Record<GroupRole, string> = {
  Form: 'form',
  Fieldset: 'fieldset',
  List: 'ul',
  Table: 'table',
  Card: 'article',
  Toolbar: 'div',
  Container: 'div',
  Grid: 'div',
  Tabs: 'div',
  Steps: 'ol',
  Split: 'div',
  Inline: 'div',
};

/**
 * Role → ARIA 속성 매핑
 */
const roleToAria: Partial<Record<GroupRole, Record<string, string>>> = {
  Toolbar: { role: 'toolbar' },
  Tabs: { role: 'tablist' },
  Table: { role: 'table' },
  List: { role: 'list' },
  Grid: { role: 'grid' },
};

export function Group({
  role,
  prominence,
  density,
  intent,
  children,
  className,
  direction, // @deprecated: layout을 사용하세요
  layout,
  state = 'idle',
  emptyContent,
  errorContent,
  onClick,
  condition,
}: GroupProps) {
  // 조건부 렌더링 (v1.0.1)
  // TODO: condition 표현식 평가 구현
  if (condition) {
    // 현재는 조건부 렌더링 미구현
  }

  // 부모 Context에서 prominence 상속
  const parentCtx = useLayoutContext();
  const computedProminence = prominence ?? parentCtx.prominence;
  const computedDensity = density ?? parentCtx.density;
  const computedIntent = intent ?? parentCtx.intent;

  // Deprecated direction을 layout으로 변환
  let computedLayout = layout;
  if (!computedLayout && direction) {
    computedLayout = direction === 'horizontal' ? 'inline' : 'stack';
  }
  computedLayout = computedLayout ?? 'stack';

  // State 렌더링 (v1.0.1)
  if (state === 'loading') {
    return (
      <div className={groupStateVariants({ state: 'loading', className })}>
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  if (state === 'error' && errorContent) {
    return <div className={groupStateVariants({ state: 'error', className })}>{errorContent}</div>;
  }

  if (state === 'empty' && emptyContent) {
    return <div className={groupStateVariants({ state: 'empty', className })}>{emptyContent}</div>;
  }

  // role에 따른 HTML 태그 결정
  const tag = roleToTag[role];
  const Component = tag as keyof JSX.IntrinsicElements;

  // role에 따른 ARIA 속성 결정
  const ariaProps = roleToAria[role] || {};

  return (
    <LayoutProvider
      value={{
        prominence: computedProminence,
        role,
        density: computedDensity,
        intent: computedIntent,
        depth: parentCtx.depth + 1,
      }}
    >
      <Component
        className={groupVariants({
          layout: computedLayout as
            | 'stack'
            | 'inline'
            | 'grid'
            | 'table'
            | 'split'
            | 'tabs'
            | 'steps',
          role: role as GroupRole,
          density: computedDensity as 'Compact' | 'Standard' | 'Comfortable', // v1.1.1
          className,
        })}
        {...ariaProps}
        data-dsl-component="group"
        data-role={role}
        data-layout={computedLayout}
        data-state={state}
        data-prominence={computedProminence}
        data-density={computedDensity}
        onClick={onClick}
      >
        {children}
      </Component>
    </LayoutProvider>
  );
}
