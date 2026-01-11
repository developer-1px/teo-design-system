/**
 * Action - 상호작용 트리거 (IDDL v1.0.1)
 *
 * 클릭 등의 상호작용을 통해 이벤트를 발생시키거나 페이지를 이동합니다.
 * prominence와 intent에 따라 버튼 스타일이 자동으로 결정됩니다.
 *
 * v1.0.1: behavior discriminated union, loading, Info intent 추가, CVA 적용
 * v3.1: Interactive State Token System, Spacing Token System 통합
 * v4.0: Role Renderer 패턴 도입 (ButtonAction, IconButtonAction, LinkAction)
 * v4.1: Registry 패턴 적용 (role-registry.ts)
 * @see spec/iddl-spec-1.0.1.md#413-action-node
 */

import { useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { ActionProps } from '@/components/types/Element/Action/Action.types';
import { ButtonAction } from './renderers/ButtonAction';
import { getRoleConfig } from './role-registry';

/**
 * Action 컴포넌트
 * v1.0.1: behavior, loading 추가
 * v3.1: Interactive & Spacing Token System 통합
 * v4.0: Role Renderer 패턴 적용
 */
export function Action({
  as,
  role = 'Button', // v4.0: default role
  label,
  icon,
  prominence,
  intent,
  density,
  behavior,
  disabled,
  confirm,
  loading,
  selected = false,
  hidden,
  onClick,
  children,
  ...rest
}: ActionProps) {
  const ctx = useLayoutContext();

  // 부모 컨텍스트에서 상속
  const computedProminence = prominence ?? ctx.prominence ?? 'Standard';
  const computedIntent = intent ?? ctx.intent ?? 'Neutral';
  const computedDensity = density ?? ctx.density ?? 'Standard';

  if (hidden) return null;

  // disabled 표현식 평가 (v1.0.1: boolean | string 지원)
  const isDisabled =
    typeof disabled === 'string'
      ? false // TODO: 표현식 평가 구현
      : (disabled ?? false);

  // 클릭 핸들러 (v1.0.1: behavior 기반)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    // 로딩 중이거나 disabled면 무시
    if (loading || isDisabled) {
      e.preventDefault();
      return;
    }

    // Confirm 메시지가 있으면 확인 다이얼로그 표시
    if (confirm && !window.confirm(confirm)) {
      e.preventDefault();
      return;
    }

    // 외부 onClick이 있으면 우선 호출 (실용적 접근)
    if (onClick) {
      onClick(e);
      // onClick이 preventDefault를 호출했으면 behavior 실행 안 함
      if (e.defaultPrevented) {
        return;
      }
    }

    // Behavior가 없으면 아무것도 하지 않음
    if (!behavior) {
      return;
    }

    // Behavior 실행 (v1.0.1)
    switch (behavior.action) {
      case 'command':
        e.preventDefault();
        // TODO: 실제 구현에서는 커맨드 시스템에 전달
        // commandRegistry.execute(behavior.command, behavior.args);
        break;

      case 'navigate':
        // a 태그가 자동으로 처리, 필요시 target도 설정
        break;

      case 'submit':
        e.preventDefault();
        // TODO: form submit 로직
        break;

      case 'reset':
        e.preventDefault();
        // TODO: form reset 로직
        break;

      case 'open':
        e.preventDefault();
        // TODO: overlay 열기 로직
        break;

      case 'close':
        e.preventDefault();
        // TODO: overlay 닫기 로직
        break;

      case 'toggle':
        e.preventDefault();
        // TODO: toggle 로직
        break;
    }
  };

  // behavior에 따라 element 결정 (as prop이 있으면 우선 사용)
  const defaultElement = behavior?.action === 'navigate' ? 'a' : 'button';
  const Element: any = as || defaultElement;
  const href = behavior?.action === 'navigate' ? behavior.to : undefined;
  const target = behavior?.action === 'navigate' ? behavior.target : undefined;

  // v4.0: Role에 따라 적절한 Renderer 선택
  const rendererProps = {
    label,
    icon,
    loading,
    selected,
    computedProminence,
    computedIntent,
    computedDensity: computedDensity as 'Compact' | 'Standard' | 'Comfortable',
    isDisabled,
    handleClick,
    Element,
    href,
    target,
    children,
    behavior,
    ...rest,
  };

  // v4.1: Registry-based role delegation
  const config = getRoleConfig(role);
  if (config.renderer) {
    const Renderer = config.renderer;
    return <Renderer {...rendererProps} />;
  }

  // Fallback (should not happen if registry is complete)
  console.warn(`[Action] No renderer found for role "${role}". Using Button fallback.`);
  return <ButtonAction {...rendererProps} />;
}
