/**
 * Section - 시맨틱 영역 (IDDL v4.1)
 *
 * **Section = 시맨틱 영역 (Semantic Region)**
 * - Page가 만드는 영역, template의 named slot 역할
 * - 시맨틱 HTML 태그 매핑 (<header>, <nav>, <main>, <aside>, <footer>)
 * - CSS Grid의 grid-area로 배치됨
 * - 최소한의 시각적 요소 (배경색, 보더 정도)
 *
 * **Section vs Group**:
 * - Section: Page가 만드는 시맨틱 영역 (시맨틱 태그 + grid-area)
 * - Group: 개발자가 선택하는 기능적 컴포넌트 (Form, Card, Toolbar 등)
 *
 * **v4.1 변경사항**: Role Configuration 중앙화
 * - gridArea, overflow, htmlTag, ariaProps, baseStyles 모두 role-config에서 자동 결정
 * - Page template context를 통해 적절한 설정 자동 적용
 * - 스크롤 동작은 Page 책임 (template + role 조합으로 결정)
 *
 * v1.0.1: Aside role 추가, condition 지원, CVA 적용
 * v4.0: Role Renderer 패턴 도입, Template-aware validation
 * v4.1: Role Configuration 중앙화 (role-config.ts)
 */

import { LayoutProvider, useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { SectionProps } from '@/components/types/Atom/types.ts';
import { TEMPLATE_SECTION_ROLES } from '@/components/types/Atom/types.ts';

// v4.1: Role Configuration Helper
import { getRoleConfig, getOverflowClass } from './role-config';

// Role Renderers (v4.0)
import { ContainerSection } from './renderers/ContainerSection';
import { FrameSection } from './renderers/FrameSection';
import { IDESection } from './renderers/IDESection';
import { DialogSection } from './renderers/DialogSection';

export function Section({
  as,
  role = 'Container',
  prominence = 'Standard',
  density,
  intent,
  mode,
  children,
  className,
  id,
  onClick,
  condition,
  gridArea,
  ...rest
}: SectionProps) {
  // 부모 Context 가져오기 (중첩된 경우)
  const parentCtx = useLayoutContext();
  const computedDensity = density ?? parentCtx.density ?? 'Standard';
  const computedIntent = intent ?? parentCtx.intent ?? 'Neutral';
  const computedMode = mode ?? parentCtx.mode ?? 'view';

  // v4.0: Template-aware validation (dev mode only)
  if (import.meta.env.DEV && parentCtx.template) {
    const template = parentCtx.template;
    const validRoles = TEMPLATE_SECTION_ROLES[template] || [];
    const universalRoles = TEMPLATE_SECTION_ROLES.universal || [];
    const allValidRoles = [...new Set([...universalRoles, ...validRoles])];

    if (!allValidRoles.includes(role)) {
      console.warn(
        `[Section] Role "${role}" is not valid for template "${template}". ` +
        `Valid roles: ${allValidRoles.join(', ')}`
      );
    }
  }

  // 조건부 렌더링 (v1.0.1)
  if (condition) {
    // TODO: condition 표현식 평가 구현
  }

  // v4.1: Role Configuration 가져오기 (template 기반)
  const config = getRoleConfig(role, parentCtx.template);

  // 자동 계산된 값들
  const {
    gridArea: configGridArea,
    overflow,
    htmlTag,
    ariaProps: configAriaProps,
    baseStyles: configBaseStyles,
  } = config;

  // HTML 태그 결정 (as prop이 우선)
  const Element: any = as || htmlTag;

  // ARIA 속성 (config에서 가져옴)
  const ariaProps = configAriaProps || {};

  // v4.1: gridArea 계산 (명시적 prop > config)
  const computedGridArea = gridArea || configGridArea;

  // v4.1: Overflow 클래스 생성
  const overflowClass = getOverflowClass(overflow);

  // v4.1: Role에 따라 적절한 Renderer 선택
  const rendererProps = {
    role: role as any,
    children,
    className,
    gridArea: computedGridArea,
    computedProminence: prominence,
    computedDensity: computedDensity as 'Compact' | 'Standard' | 'Comfortable',
    Element,
    id,
    onClick,
    // v4.1: role-config에서 가져온 값들
    baseStyles: configBaseStyles,
    overflowClass,
    ariaProps,
    ...rest,
  };

  // Context Provider로 감싸서 반환
  const content = (() => {
    // Container roles
    if (['Container', 'Main', 'SplitContainer'].includes(role)) {
      return <ContainerSection {...rendererProps} />;
    }

    // Frame roles
    if (['Header', 'Footer', 'Navigator', 'Aside'].includes(role)) {
      return <FrameSection {...rendererProps} />;
    }

    // IDE/Studio roles
    if (['Toolbar', 'ActivityBar', 'PrimarySidebar', 'SecondarySidebar', 'Editor', 'Panel', 'Auxiliary'].includes(role)) {
      return <IDESection {...rendererProps} />;
    }

    // Dialog roles
    if (['DialogHeader', 'DialogFooter', 'DialogContent'].includes(role)) {
      return <DialogSection {...rendererProps} />;
    }

    // Fallback to Container
    return <ContainerSection {...rendererProps} />;
  })();

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
      {content}
    </LayoutProvider>
  );
}
