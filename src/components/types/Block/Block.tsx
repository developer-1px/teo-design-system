/**
 * Block - 기능적 컴포넌트 (IDDL v4.0)
 *
 * **Block = 기능적 컴포넌트 (Functional Component)**
 * - role을 지정하여 "이것은 무엇을 하는가?" 정의 (Form, Card, Toolbar, List 등)
 * - 시각적 요소를 가질 수 있음 (배경, 보더, 패딩, 그림자)
 * - Template 무관하게 독립적으로 동작
 * - 재사용 가능한 UI 조합
 *
 * **Block vs Section vs Block**:
 * - Section: Page가 만드는 시맨틱 영역 (시맨틱 태그 + grid-area)
 * - Block: 개발자가 선택하는 기능적 컴포넌트 (Form, Card, Toolbar 등)
 *
 * v1.0.1: layout, state, emptyContent, errorContent, condition 추가, CVA 적용
 * v3.1: Interactive State Token System, Spacing Token System 통합
 * v4.0: 기능적 컴포넌트로 개념 명확화
 * v1.0.4: Focus management 추가 (registerItemRef)
 */

import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { BlockLayoutProvider, useBlockLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { BlockProps, BlockRole } from '@/components/types/Block/Block.types';
import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
import { gapVariants } from '@/shared/config/spacing-tokens';
import { cn } from '@/shared/lib/utils';
import { getRoleConfig, hasRenderer } from './role-config';

// Re-export renderer utilities
export { ToolbarDivider, ToolbarBlock } from './role/Toolbar';
export { AccordionItem, AccordionTrigger, AccordionContent } from './role/Accordion';

/**
 * Block container variants (CVA) - v4.1: Layout + Density only
 * v1.1.1: Density-aware spacing 추가
 * v4.1: Role styles moved to role-config.ts (baseStyles)
 *
 * **남은 역할**:
 * - Layout: 자식 배치 방식 (stack, inline, grid, etc.)
 * - Density: 여백 조절 (Compact, Standard, Comfortable)
 * - compoundVariants: Layout × Density 조합
 */
const blockVariants = cva('', {
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
    // Density (spacing modifiers)
    density: {
      Compact: '',
      Standard: '',
      Comfortable: '',
    },
  },
  compoundVariants: [
    // Layout + Density combinations
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
  ],
  defaultVariants: {
    layout: 'stack',
    density: 'Standard',
  },
});

/**
 * Block state variants (CVA) - for loading/error/empty states
 */
const blockStateVariants = cva('', {
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

// roleToTag and roleToAria are now in role-config.ts

export function Block({
  as,
  role,
  prominence,
  density,
  intent,
  children,
  className, // EXCEPTION: 데이터 시각화용 동적 스타일링
  style, // EXCEPTION: 동적 레이아웃(grid-area)용 인라인 스타일
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
  // SortableList-specific props
  items,
  onReorder,
  renderItem,
  // v1.0 Core: Spec support
  // Toolbar-specific
  sticky,
  border,
  // v1.0 Core: Spec support
  spec,
  ...rest
}: BlockProps) {
  // 조건부 렌더링 (v1.0.1)
  // TODO: condition 표현식 평가 구현
  if (condition) {
    // 현재는 조건부 렌더링 미구현
  }

  // 부모 Context에서 prominence 상속
  const parentCtx = useBlockLayoutContext();
  const computedProminence = prominence ?? parentCtx.prominence;
  const computedDensity = density ?? parentCtx.density;
  const computedIntent = intent ?? parentCtx.intent;

  // Deprecated direction을 layout으로 변환
  let computedLayout = layout;
  if (!computedLayout && direction) {
    computedLayout = direction === 'horizontal' ? 'inline' : 'stack';
  }

  // v1.0 Core: Role determines layout (Migration Stub)
  if (role === 'Stack' || role === 'Group') computedLayout = 'stack';
  if (role === 'Row' || role === 'Inline' || role === 'Toolbar' || role === 'FloatingToolbar' || role === 'Breadcrumbs') computedLayout = 'inline';
  if (role === 'Grid') computedLayout = 'grid';
  if (role === 'Split') computedLayout = 'split';

  // Default fallback
  computedLayout = computedLayout ?? 'stack';

  // v1.0 Core: Spec handling (Grid columns)
  const specStyle: React.CSSProperties = {};
  if (role === 'Grid' && spec?.columns) {
    specStyle.gridTemplateColumns = `repeat(${spec.columns}, minmax(0, 1fr))`;
  }
  // Stack/Row gap handling via spec (optional future enhancement, current using gap prop)

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

  // v1.0.4: Focus management - ref 등록
  const componentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (value !== undefined && selectionModel?.registerItemRef && componentRef.current) {
      selectionModel.registerItemRef(value, componentRef.current);

      // Cleanup: ref 해제
      return () => {
        selectionModel.registerItemRef?.(value, null);
      };
    }
  }, [value, selectionModel]);

  // State 렌더링 (v1.0.1)
  if (state === 'loading') {
    return (
      <div className={blockStateVariants({ state: 'loading' })}>
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  if (state === 'error' && errorContent) {
    return <div className={blockStateVariants({ state: 'error' })}>{errorContent}</div>;
  }

  if (state === 'empty' && emptyContent) {
    return <div className={blockStateVariants({ state: 'empty' })}>{emptyContent}</div>;
  }

  // role-config에서 설정 가져오기 (v4.1)
  const roleConfig = getRoleConfig(role);

  // v5.1: Safety check for missing/invalid role
  if (!roleConfig) {
    if (import.meta.env.DEV) {
      console.warn(`[Block] Missing or invalid role: "${role}". Falling back to "div".`);
    }
  }

  const Component: any = as || roleConfig?.htmlTag || 'div';
  const ariaProps = roleConfig?.ariaProps || {};

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

  // v4.1: 전용 renderer가 있으면 사용, 없으면 기본 렌더링
  const Renderer = roleConfig.renderer;

  // BlockLayoutProvider로 한 번만 래핑 (v4.1)
  return (
    <BlockLayoutProvider
      value={{
        prominence: computedProminence,
        role,
        density: computedDensity,
        intent: computedIntent,
        depth: parentCtx.depth + 1,
      }}
    >
      {Renderer ? (
        <Renderer
          role={role}
          computedDensity={computedDensity as 'Compact' | 'Standard' | 'Comfortable'}
          computedProminence={computedProminence}
          computedIntent={computedIntent}
          Element={Component}
          // Accordion-specific props
          mode={mode}
          defaultValue={defaultValue}
          accordionValue={accordionValue}
          onValueChange={onValueChange}
          // SortableList-specific props
          items={items}
          onReorder={onReorder}
          renderItem={renderItem}
          // Common props
          onClick={onClick}
          {...rest}
        >
          {children}
        </Renderer>
      ) : (
        <Component
          ref={componentRef}
          // Toolbar props
          data-sticky={sticky}
          data-border={border}
          // Accordion props handled via data-attributes if needed or ignored for DOM
          data-accordion-mode={mode}
          className={cn(
            // Base role-based styles from role-config (v4.1)
            roleConfig.baseStyles,
            // Layout + Density styles (CVA v4.1)
            blockVariants({
              layout: computedLayout as
                | 'stack'
                | 'inline'
                | 'grid'
                | 'table'
                | 'split'
                | 'tabs'
                | 'steps',
              density: computedDensity as 'Compact' | 'Standard' | 'Comfortable',
            }),
            // v3.1: Interactive State (clickable/selectable groups)
            interactiveClasses,
            // v3.1: Spacing (gap from tokens or override)
            spacingClasses,
            // EXCEPTION: 데이터 시각화를 위한 동적 className (예: 차트 색상, 데이터 기반 배경색)
            className
          )}
          style={{ ...specStyle, ...style }} // EXCEPTION: 동적 레이아웃(grid-area)용 인라인 스타일
          {...ariaProps}
          {...selectionAriaProps}
          data-dsl-component="block"
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
      )}
    </BlockLayoutProvider>
  );
}
