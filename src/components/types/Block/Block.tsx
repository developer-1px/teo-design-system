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
import { useEffect, useRef } from 'react';
import {
  BlockLayoutProvider,
  useBlockLayoutContext,
  useLayoutContext,
} from '@/components/context/IDDLContext.tsx';
import type { BlockProps } from '@/components/types/Block/Block.types';
import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
import { gapVariants, paddingVariants } from '@/shared/config/spacing-tokens';
import { cn } from '@/shared/lib/utils';
import { getRoleConfig } from './role-config';

export {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './role/Accordion';
// Re-export renderer utilities
export { ToolbarBlock, ToolbarDivider } from './role/Toolbar';

/**
 * Block container variants (CVA) - v4.1: Layout + Density only
 * v1.1.1: Density-aware spacing 추가
 * v4.1: Role styles moved to role-registry.ts (baseStyles)
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

// roleToTag and roleToAria are now in role-registry.ts

export function Block({
  as,
  role,
  prominence,
  density,
  intent,
  children,
  className,
  style,
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
  value,
  selectionModel,
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
  sticky,
  border,
  spec,
  // Practical helpers - filter these out to prevents DOM warnings
  padding,
  justify,
  align,
  flex,
  divider,
  width,
  height,
  orientation: _orientation,
  // Tree-specific
  data,
  icons,
  onNodeClick,
  expandable,
  selectable: _selectable,
  defaultExpandedIds,
  ...rest
}: BlockProps) {
  // 부모 Context에서 prominence 상속
  const parentCtx = useBlockLayoutContext();
  const sectionCtx = useLayoutContext(); // v5.1: Section role 참조용
  const computedProminence = prominence ?? parentCtx.prominence;
  const computedDensity = density ?? parentCtx.density;
  const computedIntent = intent ?? parentCtx.intent;

  // role-registry에서 설정 가져오기 (Prioritize Registry)
  const roleConfig = getRoleConfig(role);

  // v5.1: Safety check for missing/invalid role
  if (!roleConfig) {
    if (import.meta.env.DEV) {
      console.warn(`[Block] Missing or invalid role: "${role}". Falling back to "div".`);
    }
  }

  // Determine Layout based on Role (Legacy Support + Defaults)
  // This helps apply correct blockVariants when no specific Renderer is used
  let computedLayout = layout;
  if (!computedLayout) {
    const r = role as string;
    if (['Stack', 'Group'].includes(r)) computedLayout = 'stack';
    else if (['Row', 'Inline', 'Toolbar', 'FloatingToolbar', 'Breadcrumbs'].includes(r))
      computedLayout = 'inline';
    else if (r === 'Grid') computedLayout = 'grid';
    else if (r === 'Split' || r === 'Splitter') computedLayout = 'split';
    else computedLayout = 'stack'; // Default fallback
  }

  // v1.0 Core: Spec handling (Grid columns)
  const specStyle: React.CSSProperties = {};
  if (role === 'Grid' && spec?.columns) {
    specStyle.gridTemplateColumns = `repeat(${spec.columns}, minmax(0, 1fr))`;
  }

  // v1.0.2: Selection logic
  const isSelectable = value !== undefined;
  const computedClickable = clickable || isSelectable;
  const isSelected =
    value !== undefined && selectionModel ? selectionModel.isSelected(value) : selected;

  const handleClick = (e: React.MouseEvent) => {
    if (value !== undefined && selectionModel?.handleItemClick) {
      selectionModel.handleItemClick(value, e);
    }
    onClick?.(e);
  };

  const selectionAriaProps =
    value !== undefined
      ? { role: 'option', 'aria-selected': isSelected, tabIndex: isSelected ? 0 : -1 }
      : {};

  // v1.0.4: Focus management - ref 등록
  const componentRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (value !== undefined && selectionModel?.registerItemRef && componentRef.current) {
      selectionModel.registerItemRef(value, componentRef.current);
      return () => selectionModel.registerItemRef?.(value, null);
    }
  }, [value, selectionModel]);

  // State 렌더링
  if (state === 'loading') {
    return (
      <div className={blockStateVariants({ state: 'loading' })}>
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }
  if (state === 'error' && errorContent)
    return <div className={blockStateVariants({ state: 'error' })}>{errorContent}</div>;
  if (state === 'empty' && emptyContent)
    return <div className={blockStateVariants({ state: 'empty' })}>{emptyContent}</div>;

  const Renderer = roleConfig?.renderer;

  // v3.1: Interactive & Spacing Tokens
  const interactiveClasses = computedClickable
    ? getInteractiveClasses({
        prominence: computedProminence,
        intent: computedIntent,
        config: { selected: isSelected, disabled: false, focusable: true, clickable: true },
      })
    : '';

  const gapClasses = gap
    ? `gap-${gap}`
    : gapVariants({
        prominence: computedProminence as any,
        density: computedDensity as any,
      });

  const paddingClasses = roleConfig?.autoPadding
    ? paddingVariants({
        prominence: computedProminence as any,
        density: computedDensity as any,
      })
    : '';

  // v5.2: Section Overrides (Apply baseStyles from section context)
  const sectionRole = sectionCtx.role as string;
  const sectionOverride = roleConfig?.sectionOverrides?.[sectionRole];
  const finalBaseStyles = cn(roleConfig?.baseStyles, sectionOverride?.baseStyles);

  const spacingClasses = cn(gapClasses, paddingClasses);

  const Component: any = as || roleConfig?.htmlTag || 'div';
  const ariaProps = roleConfig?.ariaProps || {};

  return (
    <BlockLayoutProvider
      value={{
        prominence: computedProminence,
        role,
        density: computedDensity,
        intent: computedIntent,
        depth: parentCtx.depth + 1,
        sectionRole: sectionCtx.role as string, // v5.1: 현재 Section role 전달
      }}
    >
      {Renderer ? (
        <Renderer
          role={role}
          Element={Component}
          spec={spec}
          className={className}
          style={style}
          gap={gap}
          // Pass specific props only if relevant role (cleaner spreading could be considered)
          {...(role === 'Accordion' ? { mode, defaultValue, accordionValue, onValueChange } : {})}
          {...(role === 'SortableList' ? { items, onReorder, renderItem } : {})}
          {...(role === 'Tree' ? { data, icons, onNodeClick, expandable, defaultExpandedIds } : {})}
          {...(role === 'Toolbar' ? { sticky, border } : {})}
          onClick={onClick}
          {...rest}
        >
          {children}
        </Renderer>
      ) : (
        <Component
          ref={componentRef}
          className={cn(
            finalBaseStyles,
            blockVariants({
              layout: computedLayout as any,
              density: computedDensity as any,
            }),
            interactiveClasses,
            spacingClasses,
            className
          )}
          style={{ ...specStyle, ...style }}
          {...ariaProps}
          {...selectionAriaProps}
          data-role={role}
          data-layout={computedLayout}
          data-prominence={computedProminence}
          data-density={computedDensity}
          data-selected={isSelected}
          data-state={state}
          onClick={computedClickable ? handleClick : undefined}
          {...rest}
        >
          {Component === 'hr' ? null : children}
        </Component>
      )}
    </BlockLayoutProvider>
  );
}
