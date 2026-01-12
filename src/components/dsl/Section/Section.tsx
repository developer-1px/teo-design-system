/**
 * Section - 시맨틱 영역 (IDDL v4.1)
 *
 * **Section = 시맨틱 영역 (Semantic Region)**
 * - Page가 만드는 영역, template의 named slot 역할
 * - 시맨틱 HTML 태그 매핑 (<header>, <nav>, <main>, <aside>, <footer>)
 * - CSS Grid의 grid-area로 배치됨
 * - 최소한의 시각적 요소 (배경색, 보더 정도)
 *
 * **Section vs Block**:
 * - Section: Page가 만드는 시맨틱 영역 (시맨틱 태그 + grid-area)
 * - Block: 개발자가 선택하는 기능적 컴포넌트 (Form, Card, Toolbar 등)
 *
 * **v4.1 변경사항**: Role Configuration 중앙화
 * - gridArea, overflow, htmlTag, ariaProps, baseStyles 모두 role-registry에서 자동 결정
 * - Page template context를 통해 적절한 설정 자동 적용
 * - 스크롤 동작은 Page 책임 (template + role 조합으로 결정)
 *
 * v1.0.1: Aside role 추가, condition 지원, CVA 적용
 * v4.0: Role Renderer 패턴 도입, Template-aware validation
 * v4.1: Role Configuration 중앙화 (role-registry.ts)
 */

import { cva } from 'class-variance-authority';
import { LayoutProvider, useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type {
  SectionProps,
  SectionRole,
  SectionType,
} from '@/components/dsl/Section/Section.types';
import { cn } from '@/shared/lib/utils';
import { getSectionRoleConfig } from './configs/registry';
import { SECTION_DESIGN_CONTEXTS, SECTION_RULES } from './configs/section-spec';
import { TYPE_SCALES } from './configs/section-tokens';

// Styles for Section Variants
const sectionVariants = cva('flex flex-col relative', {
  variants: {
    variant: {
      Plain: 'bg-transparent',
      Card: '',
      Hero: '',
    },
    mode: {
      view: '',
      edit: '', // Handled by Token Engine
    },
  },
  defaultVariants: {
    variant: 'Plain',
  },
});

import { useIDDLToken } from '@/shared/iddl/token-engine';
import { useResizable } from '@/shared/hooks/useResizable';
import { createPortal } from 'react-dom';
import { useLayoutPortal } from '@/components/dsl/Page/context/LayoutPortalContext';

export function Section({
  as,
  role = 'Main',
  scrollable,
  variant = 'Plain',
  prominence,
  density,
  intent,
  type, // Override prop
  mode,
  children,
  id,
  onClick,
  className,
  gridArea,
  collapsible, // ✨ NEW (v4.1)
  ...rest
}: SectionProps) {
  // Spec Configuration (v5)
  const specContext = SECTION_DESIGN_CONTEXTS[role as SectionRole] || SECTION_DESIGN_CONTEXTS.Main;

  const parentCtx = useLayoutContext();
  // v5: Use spec default density if not provided in props or parent
  const computedDensity = density ?? parentCtx.density ?? specContext.defaultDensity;
  const computedIntent = intent ?? parentCtx.intent ?? 'Neutral';
  const computedMode = mode ?? parentCtx.mode ?? 'view';

  // v5.2: Type Resolution
  const computedType: SectionType = type || specContext.type || 'Stage';
  const scale = TYPE_SCALES[computedType];

  // ============================================
  // ⚡️ IDDL Token Engine Integration (v6.0)
  // ============================================
  const tokens = useIDDLToken({
    role: role as string,
    sectionRole: role as string,
    sectionType: computedType,
    prominence: prominence || (variant === 'Card' ? 'Strong' : variant === 'Hero' ? 'Hero' : 'Standard'),
    intent: computedIntent,
    density: computedDensity,
    state: { hover: false } // Basic state for now
  });

  const portalContext = useLayoutPortal();

  // Validation
  if (import.meta.env.DEV) {
    // Basic Spec Validation
    const rules = SECTION_RULES[role as SectionRole];
    if (rules) {
      // Validation logic would go here
    }
  }

  // Configuration
  const config = getSectionRoleConfig(role as string, parentCtx.layout as any);
  const { gridArea: configGridArea, overflow, htmlTag, ariaProps, baseStyles } = config;

  const Element: any = as || htmlTag || 'section';
  const computedGridArea = gridArea || configGridArea;
  const isScrollable = scrollable ?? (overflow === 'auto' || overflow === 'scroll');
  const overflowClass = isScrollable ? 'overflow-auto' : 'overflow-hidden';

  // collapsible logic (v4.1)
  const isCollapsible = !!collapsible;
  const collapsibleConfig = typeof collapsible === 'object' ? collapsible : undefined;
  const isCollapsed = collapsibleConfig?.collapsed ?? false;
  const useTransition = collapsibleConfig?.transition ?? true;

  // Determine if horizontal or vertical sizing based on role
  const isHorizontalCollapse =
    role === 'PrimarySidebar' || role === 'SecondarySidebar' || role === 'Nav' || role === 'Aside';

  // Dimensions from scale
  const { dimensions } = scale;

  // Resizable Logic (v5.3)
  const isResizable = !!rest.resizable;
  const resizableConfig = typeof rest.resizable === 'object' ? rest.resizable : {};

  // Determine resize direction based on role if not specified
  let resizeDirection: 'left' | 'right' | 'top' | 'bottom' = 'right';
  if (resizableConfig.direction) {
    // Map 'horizontal'/'vertical' to specific sides if generic
    if (resizableConfig.direction === 'horizontal') resizeDirection = role === 'SecondarySidebar' || role === 'Aside' ? 'left' : 'right';
    else if (resizableConfig.direction === 'vertical') resizeDirection = role === 'Panel' || role === 'Footer' ? 'top' : 'bottom';
  } else {
    // Auto-detect based on role
    if (role === 'PrimarySidebar' || role === 'Nav') resizeDirection = 'right';
    else if (role === 'SecondarySidebar' || role === 'Aside') resizeDirection = 'left';
    else if (role === 'Panel' || role === 'Footer' || role === 'Statusbar') resizeDirection = 'top';
    else if (role === 'Header') resizeDirection = 'bottom';
  }

  const { size: resizedSize, handleProps: resizeHandleProps, isResizing } = useResizable({
    initialSize: (dimensions.fixedWidth || dimensions.fixedHeight || 250),
    minSize: resizableConfig.minSize || dimensions.minWidth || 50,
    maxSize: resizableConfig.maxSize || dimensions.maxWidth as number || 800,
    direction: resizeDirection,
  });

  const dimensionStyles: React.CSSProperties = {
    minWidth: dimensions.minWidth,
    maxWidth: dimensions.maxWidth,
    minHeight: dimensions.minHeight,
    maxHeight: dimensions.maxHeight,
    width: isResizable && (resizeDirection === 'left' || resizeDirection === 'right') ? resizedSize : dimensions.fixedWidth,
    height: isResizable && (resizeDirection === 'top' || resizeDirection === 'bottom') ? resizedSize : dimensions.fixedHeight,
  };

  const collapsibleStyle: React.CSSProperties = isCollapsible
    ? {
      ...(isHorizontalCollapse
        ? {
          width: isCollapsed
            ? (collapsibleConfig?.collapsedSize ?? 0)
            : (collapsibleConfig?.expandedSize ?? 'auto'),
        }
        : {
          height: isCollapsed
            ? (collapsibleConfig?.collapsedSize ?? 0)
            : (collapsibleConfig?.expandedSize ?? 'auto'),
        }),
    }
    : {};

  const transitionClass =
    isCollapsible && useTransition ? 'transition-all duration-200 ease-in-out' : '';

  const content = (
    <LayoutProvider
      value={{
        role: role as SectionRole,
        type: computedType,
        scale,
        prominence,
        density: computedDensity,
        intent: computedIntent,
        depth: parentCtx.depth + 1,
        mode: computedMode,
        pageRole: parentCtx.pageRole,
        // v5.1 Design Context Propagation
        preferIconOnly: specContext.preferIconOnly,
        truncateText: specContext.truncateText,
        tooltipRequired: specContext.tooltipRequired,
        direction: specContext.direction,
        sizeMode: specContext.sizeMode,
      }}
    >
      <Element
        id={id}
        onClick={onClick}
        className={cn(
          baseStyles,
          sectionVariants({ variant, mode: computedMode }),
          transitionClass,
          // Token Engine Classes
          tokens.surface.background,
          tokens.surface.blur,
          tokens.geometry.radius,
          tokens.geometry.color,
          tokens.geometry.width,
          tokens.geometry.outline,
          tokens.geometry.outlineOffset,
          tokens.shadow.boxShadow,
          tokens.extraClasses,
          className
        )}
        style={{
          gridArea: computedGridArea,
          ...dimensionStyles, // Apply Physical Constraints
          ...collapsibleStyle,
          // Token Engine Styles (Values)
          gap: tokens.spacing.gap,
          ...rest.style, // Pass through style if any
        }}
        {...ariaProps}
        data-role={role}
        {...rest}
      >
        {/* Resize Handle */}
        {isResizable && (
          <div
            {...resizeHandleProps}
            // Prevent portal capture issues
            onMouseDown={(e) => {
              resizeHandleProps.onMouseDown(e);
            }}
          />
        )}

        {/* Section Body */}
        <div className={cn('flex-1 relative flex flex-col', overflowClass)} style={{ padding: tokens.spacing.padding }}>
          {children}
        </div>
      </Element>
    </LayoutProvider>
  );

  // Portal Logic
  if (portalContext) {
    const slot = portalContext.register(role as string);
    // If we have a slot, and it's NOT center (default child location), and the DOM node exists
    if (slot && slot !== 'center' && portalContext.slots[slot]?.current) {
      return createPortal(content, portalContext.slots[slot].current!);
    }
  }

  return content;
}
