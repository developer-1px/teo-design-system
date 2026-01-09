/**
 * Group - 기능적 컴포넌트 (IDDL v4.0)
 *
 * **Group = 기능적 컴포넌트 (Functional Component)**
 * - role을 지정하여 "이것은 무엇을 하는가?" 정의 (Form, Card, Toolbar, List 등)
 * - 시각적 요소를 가질 수 있음 (배경, 보더, 패딩, 그림자)
 * - Template 무관하게 독립적으로 동작
 * - 재사용 가능한 UI 조합
 *
 * **Group vs Section**:
 * - Section: Page가 만드는 시맨틱 영역 (시맨틱 태그 + grid-area)
 * - Group: 개발자가 선택하는 기능적 컴포넌트 (Form, Card, Toolbar 등)
 *
 * v1.0.1: layout, state, emptyContent, errorContent, condition 추가, CVA 적용
 * v3.1: Interactive State Token System, Spacing Token System 통합
 * v4.0: 기능적 컴포넌트로 개념 명확화
 */

import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { GroupLayoutProvider, useGroupLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { GroupProps, GroupRole } from '@/components/types/Atom/types.ts';
import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
import { gapVariants } from '@/shared/config/spacing-tokens';
import { cn } from '@/shared/lib/utils.ts';

// Import Toolbar renderer
import { Toolbar } from './role/Toolbar';

// Re-export Toolbar utilities
export { ToolbarDivider, ToolbarGroup } from './role/Toolbar';

// Import Accordion renderer
import { Accordion } from './role/Accordion';

// Re-export Accordion utilities
export { AccordionItem, AccordionTrigger, AccordionContent } from './role/Accordion';

// Import SortableList renderer
import { SortableList } from './role/SortableList';

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
      Accordion: 'flex flex-col gap-2',
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
  Accordion: 'div',
};

/**
 * Role → ARIA 속성 매핑
 */
const roleToAria: Partial<Record<GroupRole, Record<string, string>>> = {
  Toolbar: { role: 'toolbar' },
  Tabs: { role: 'tablist' },
  Table: { role: 'table' },
  List: { role: 'list' },
  SortableList: { role: 'listbox', 'aria-label': 'Sortable list' },
  Grid: { role: 'grid' },
  Form: { role: 'form' },
  Fieldset: { role: 'group' }, // <fieldset> 태그는 role="group" 자동 적용
  Card: { role: 'article' },
  Steps: { role: 'list', 'aria-label': 'Progress steps' },
  Accordion: { role: 'region' }, // 각 AccordionItem은 개별 ARIA 처리
};

export function Group({
  as,
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
  selected = false,
  clickable = false,
  condition,
  gap,
  // v1.0.2: Selection props
  value, // Selectable item identifier
  selectionModel, // Selection management
  // Accordion-specific props
  mode,
  defaultValue,
  accordionValue,
  onValueChange,
  ...rest
}: GroupProps) {
  // 조건부 렌더링 (v1.0.1)
  // TODO: condition 표현식 평가 구현
  if (condition) {
    // 현재는 조건부 렌더링 미구현
  }

  // 부모 Context에서 prominence 상속
  const parentCtx = useGroupLayoutContext();
  const computedProminence = prominence ?? parentCtx.prominence;
  const computedDensity = density ?? parentCtx.density;
  const computedIntent = intent ?? parentCtx.intent;

  // Deprecated direction을 layout으로 변환
  let computedLayout = layout;
  if (!computedLayout && direction) {
    computedLayout = direction === 'horizontal' ? 'inline' : 'stack';
  }
  computedLayout = computedLayout ?? 'stack';

  // v1.0.2: Selection logic
  // value가 있으면 자동으로 selectable (clickable)
  const isSelectable = value !== undefined;
  const computedClickable = clickable || isSelectable;

  // value가 있고 selectionModel이 있으면 선택 상태 확인
  const isSelected =
    value !== undefined && selectionModel ? selectionModel.isSelected(value) : selected;

  // value가 있으면 클릭 핸들러 자동 생성
  const handleClick = (e: React.MouseEvent) => {
    if (value !== undefined && selectionModel?.handleItemClick) {
      selectionModel.handleItemClick(value, e);
    }
    onClick?.(e);
  };

  // v1.0.2: Selection ARIA 속성 자동 추가
  const selectionAriaProps =
    value !== undefined
      ? {
          role: 'option',
          'aria-selected': isSelected,
          tabIndex: isSelected ? 0 : -1,
        }
      : {};

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
  const defaultTag = roleToTag[role] || 'div'; // 기본값: div
  const Component: any = as || defaultTag;

  // role에 따른 ARIA 속성 결정
  const ariaProps = roleToAria[role] || {};

  // v3.1: Interactive State Token System 적용 (clickable/selectable일 때)
  const interactiveClasses = computedClickable
    ? getInteractiveClasses({
        prominence: computedProminence,
        intent: computedIntent,
        config: {
          selected: isSelected,
          disabled: false,
          focusable: true,
          clickable: true,
        },
      })
    : '';

  // v3.1: Spacing Token System 적용 (gap만 필요)
  const spacingClasses = gap
    ? `gap-${gap}` // override
    : gapVariants({
        prominence: computedProminence as 'Hero' | 'Standard' | 'Strong' | 'Subtle',
        density: computedDensity as 'Compact' | 'Standard' | 'Comfortable',
      });

  // v4.0: Toolbar role에 대해 전용 renderer 사용
  if (role === 'Toolbar') {
    return (
      <GroupLayoutProvider
        value={{
          prominence: computedProminence,
          role,
          density: computedDensity,
          intent: computedIntent,
          depth: parentCtx.depth + 1,
        }}
      >
        <Toolbar
          role="Toolbar"
          computedDensity={computedDensity as 'Compact' | 'Standard' | 'Comfortable'}
          computedProminence={computedProminence}
          computedIntent={computedIntent}
          Element={Component}
          className={className}
          onClick={onClick}
          {...rest}
        >
          {children}
        </Toolbar>
      </GroupLayoutProvider>
    );
  }

  // v4.0: Accordion role에 대해 전용 renderer 사용
  if (role === 'Accordion') {
    return (
      <GroupLayoutProvider
        value={{
          prominence: computedProminence,
          role,
          density: computedDensity,
          intent: computedIntent,
          depth: parentCtx.depth + 1,
        }}
      >
        <Accordion
          role="Accordion"
          computedDensity={computedDensity as 'Compact' | 'Standard' | 'Comfortable'}
          computedProminence={computedProminence}
          computedIntent={computedIntent}
          Element={Component}
          className={className}
          onClick={onClick}
          mode={mode}
          defaultValue={defaultValue}
          value={accordionValue}
          onValueChange={onValueChange}
          {...rest}
        >
          {children}
        </Accordion>
      </GroupLayoutProvider>
    );
  }

  // v4.0: SortableList role에 대해 전용 renderer 사용
  if (role === 'SortableList') {
    return (
      <GroupLayoutProvider
        value={{
          prominence: computedProminence,
          role,
          density: computedDensity,
          intent: computedIntent,
          depth: parentCtx.depth + 1,
        }}
      >
        <SortableList
          role="SortableList"
          computedDensity={computedDensity as 'Compact' | 'Standard' | 'Comfortable'}
          computedProminence={computedProminence}
          computedIntent={computedIntent}
          Element={Component}
          className={className}
          onClick={onClick}
          {...rest}
        >
          {children}
        </SortableList>
      </GroupLayoutProvider>
    );
  }

  return (
    <GroupLayoutProvider
      value={{
        prominence: computedProminence,
        role,
        density: computedDensity,
        intent: computedIntent,
        depth: parentCtx.depth + 1,
      }}
    >
      <Component
        className={cn(
          // Base role-based styles
          groupVariants({
            layout: computedLayout as
              | 'stack'
              | 'inline'
              | 'grid'
              | 'table'
              | 'split'
              | 'tabs'
              | 'steps',
            role: role as GroupRole,
            density: computedDensity as 'Compact' | 'Standard' | 'Comfortable',
          }),
          // v3.1: Interactive State (clickable/selectable groups)
          interactiveClasses,
          // v3.1: Spacing (gap from tokens or override)
          spacingClasses,
          // Custom className override
          className
        )}
        {...ariaProps}
        {...selectionAriaProps}
        data-dsl-component="group"
        data-role={role}
        data-layout={computedLayout}
        data-state={state}
        data-prominence={computedProminence}
        data-density={computedDensity}
        data-selected={isSelected}
        data-clickable={computedClickable}
        data-value={value}
        onClick={computedClickable ? handleClick : undefined}
        {...rest}
      >
        {children}
      </Component>
    </GroupLayoutProvider>
  );
}
