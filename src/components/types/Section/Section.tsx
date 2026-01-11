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
import { Text } from '@/components/types/Element/Text/Text';
import type {
  SectionProps,
  SectionRole,
  SectionType,
} from '@/components/types/Section/Section.types';
import { getSectionRoleConfig } from './configs/registry';
import { SECTION_DESIGN_CONTEXTS, SECTION_RULES } from './configs/section-spec';
import { TYPE_SCALES } from './configs/section-tokens';

// Styles for Section Variants
const sectionVariants = cva('flex flex-col relative', {
  variants: {
    variant: {
      Plain: 'bg-transparent',
      Card: 'bg-surface border border-border-default rounded-lg shadow-sm',
      Hero: 'bg-surface-elevated border-b border-border-default p-6',
    },
    mode: {
      view: '',
      edit: 'ring-1 ring-border-focus',
    },
  },
  defaultVariants: {
    variant: 'Plain',
  },
});

export function Section({
  as,
  role = 'Main',
  title,
  actions,
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
  const dimensionStyles: React.CSSProperties = {
    minWidth: dimensions.minWidth,
    maxWidth: dimensions.maxWidth,
    minHeight: dimensions.minHeight,
    maxHeight: dimensions.maxHeight,
    width: dimensions.fixedWidth,
    height: dimensions.fixedHeight,
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

  return (
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
        className={`
          ${baseStyles}
          ${sectionVariants({ variant, mode: computedMode })}
          ${transitionClass}
          ${className || ''}
        `}
        style={{
          gridArea: computedGridArea,
          ...dimensionStyles, // Apply Physical Constraints
          ...collapsibleStyle,
          ...rest.style, // Pass through style if any
        }}
        {...ariaProps}
        {...rest}
      >
        {/* Section Header (Optional) */}
        {(title || actions) && (
          <header className="flex items-center justify-between px-4 py-2 border-b border-border-muted bg-surface-elevated flex-shrink-0 min-h-[40px]">
            {title && <Text role="Label" content={title} prominence="Strong" />}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </header>
        )}

        {/* Section Body */}
        <div className={`flex-1 ${overflowClass} ${variant === 'Card' ? 'p-4' : ''} relative`}>
          {children}
        </div>
      </Element>
    </LayoutProvider>
  );
}
