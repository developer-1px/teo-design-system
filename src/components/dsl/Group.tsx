/**
 * Group - 그룹 컨테이너 (IDDL v1.0.1)
 *
 * role을 지정하여 "이것은 무엇인지" 정의
 * prominence, density, intent를 재정의할 수도 있고, 부모에서 상속받을 수도 있음
 *
 * v1.0.1: layout, state, emptyContent, errorContent, condition 추가, CVA 적용
 */

import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LayoutProvider, useLayoutContext } from './IDDLContext';
import type { GroupProps, GroupRole } from './types';
import { Loader2 } from 'lucide-react';

/**
 * Group container variants (CVA)
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
  },
  defaultVariants: {
    layout: 'stack',
    role: 'Container',
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

export function Group({
  role,
  prominence,
  density,
  intent,
  children,
  className,
  direction,  // @deprecated: layout을 사용하세요
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
    return (
      <div className={groupStateVariants({ state: 'error', className })}>
        {errorContent}
      </div>
    );
  }

  if (state === 'empty' && emptyContent) {
    return (
      <div className={groupStateVariants({ state: 'empty', className })}>
        {emptyContent}
      </div>
    );
  }

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
      <div
        className={groupVariants({
          layout: computedLayout as 'stack' | 'inline' | 'grid' | 'table' | 'split' | 'tabs' | 'steps',
          role: role as GroupRole,
          className,
        })}
        data-dsl-component="group"
        data-role={role}
        data-layout={computedLayout}
        data-state={state}
        data-prominence={computedProminence}
        onClick={onClick}
      >
        {children}
      </div>
    </LayoutProvider>
  );
}
