/**
 * Action - 상호작용 트리거 (IDDL v1.0.1)
 *
 * 클릭 등의 상호작용을 통해 이벤트를 발생시키거나 페이지를 이동합니다.
 * prominence와 intent에 따라 버튼 스타일이 자동으로 결정됩니다.
 *
 * v1.0.1: behavior discriminated union, loading, Info intent 추가, CVA 적용
 * @see spec/iddl-spec-1.0.1.md#413-action-node
 */

import { cva, type VariantProps } from 'class-variance-authority';
import * as Icons from 'lucide-react';
import { useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { ActionProps, Intent, Prominence } from '@/components/Item/types.ts';
import { cn } from '@/shared/lib/utils';

/**
 * Action button variants (CVA)
 * IDDL semantic properties를 variants로 정의
 * v1.1.1: Density-aware sizing 추가
 */
const actionVariants = cva(
  // Base styles - rounded is essential per minimal-renderer-guide.md Section 3
  'inline-flex items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      // Prominence (size) - per minimal-renderer-guide.md Section 1.2
      prominence: {
        Hero: 'py-3 px-6 text-lg font-medium gap-3', // 12px 24px padding + radius
        Primary: 'py-2 px-4 text-base font-medium gap-2', // 8px 16px padding + radius
        Secondary: 'py-2 px-4 text-base font-medium gap-2', // 8px 16px, no bg (조용히 존재)
        Tertiary: 'p-2 text-xs font-medium gap-1 opacity-60', // 8px padding, 아이콘만
      },
      // Intent (color) - solid style for Hero/Primary
      intent: {
        Brand: 'bg-accent text-white hover:bg-accent/90',
        Positive: 'bg-success text-white hover:bg-success-hover',
        Caution: 'bg-warning text-white hover:bg-warning-hover',
        Critical: 'bg-error text-white hover:bg-error-hover',
        Info: 'bg-info text-white hover:bg-info-hover',
        Neutral: 'bg-surface text-text hover:bg-surface-raised',
      },
      loading: {
        true: 'cursor-wait',
        false: '',
      },
      // Density (v1.1.1)
      density: {
        Compact: '',
        Standard: '',
        Comfortable: '',
      },
    },
    // Compound variants: prominence + intent combinations
    compoundVariants: [
      // Secondary: 배경 없음, hover 시 surface-1
      {
        prominence: 'Secondary',
        intent: 'Brand',
        class: 'bg-transparent text-accent hover:bg-surface-sunken',
      },
      {
        prominence: 'Secondary',
        intent: 'Positive',
        class: 'bg-transparent text-success hover:bg-surface-sunken',
      },
      {
        prominence: 'Secondary',
        intent: 'Caution',
        class: 'bg-transparent text-warning hover:bg-surface-sunken',
      },
      {
        prominence: 'Secondary',
        intent: 'Critical',
        class: 'bg-transparent text-error hover:bg-surface-sunken',
      },
      {
        prominence: 'Secondary',
        intent: 'Info',
        class: 'bg-transparent text-info hover:bg-surface-sunken',
      },
      {
        prominence: 'Secondary',
        intent: 'Neutral',
        class: 'bg-transparent text-text hover:bg-surface-sunken',
      },
      // Tertiary: opacity 0.6, minimal
      {
        prominence: 'Tertiary',
        intent: 'Brand',
        class: 'bg-transparent text-accent',
      },
      {
        prominence: 'Tertiary',
        intent: 'Positive',
        class: 'bg-transparent text-success',
      },
      {
        prominence: 'Tertiary',
        intent: 'Caution',
        class: 'bg-transparent text-warning',
      },
      {
        prominence: 'Tertiary',
        intent: 'Critical',
        class: 'bg-transparent text-error',
      },
      {
        prominence: 'Tertiary',
        intent: 'Info',
        class: 'bg-transparent text-info',
      },
      {
        prominence: 'Tertiary',
        intent: 'Neutral',
        class: 'bg-transparent text-text',
      },

      // Prominence + Density (v1.1.1)
      // Hero + Compact
      {
        prominence: 'Hero',
        density: 'Compact',
        class: '!py-2 !px-4 !text-base !gap-2',
      },
      // Hero + Comfortable
      {
        prominence: 'Hero',
        density: 'Comfortable',
        class: '!py-4 !px-8 !text-xl !gap-4',
      },
      // Primary + Compact
      {
        prominence: 'Primary',
        density: 'Compact',
        class: '!py-1 !px-2 !text-sm !gap-1',
      },
      // Primary + Comfortable
      {
        prominence: 'Primary',
        density: 'Comfortable',
        class: '!py-3 !px-6 !text-lg !gap-3',
      },
      // Secondary + Compact
      {
        prominence: 'Secondary',
        density: 'Compact',
        class: '!py-1 !px-2 !text-sm !gap-1',
      },
      // Secondary + Comfortable
      {
        prominence: 'Secondary',
        density: 'Comfortable',
        class: '!py-3 !px-6 !text-lg !gap-3',
      },
      // Tertiary + Compact
      {
        prominence: 'Tertiary',
        density: 'Compact',
        class: '!p-1 !text-[10px] !gap-0.5',
      },
      // Tertiary + Comfortable
      {
        prominence: 'Tertiary',
        density: 'Comfortable',
        class: '!p-3 !text-sm !gap-2',
      },
    ],
    defaultVariants: {
      prominence: 'Primary',
      intent: 'Neutral',
      loading: false,
      density: 'Standard',
    },
  }
);

/**
 * Action 컴포넌트
 * v1.0.1: behavior, loading 추가
 */
export function Action({
  label,
  icon,
  prominence,
  intent,
  className,
  behavior,
  disabled,
  confirm,
  loading,
  hidden,
  onClick,
  children,
}: ActionProps) {
  const ctx = useLayoutContext();

  // 부모 컨텍스트에서 상속
  const computedProminence = prominence ?? ctx.prominence ?? 'Primary';
  const computedIntent = intent ?? ctx.intent ?? 'Neutral';
  const computedDensity = ctx.density ?? 'Standard'; // v1.1.1

  if (hidden) return null;

  // disabled 표현식 평가 (v1.0.1: boolean | string 지원)
  const isDisabled =
    typeof disabled === 'string'
      ? false // TODO: 표현식 평가 구현
      : (disabled ?? false);

  // 아이콘 컴포넌트 가져오기
  const IconComponent = icon ? (Icons as any)[icon] : null;

  // 아이콘 크기를 density에 따라 조절 (v1.1.1)
  const iconSize = computedDensity === 'Compact' ? 14 : computedDensity === 'Comfortable' ? 20 : 16;

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
        console.log('[Action] Execute command:', behavior.command, behavior.args);
        // TODO: 실제 구현에서는 커맨드 시스템에 전달
        // commandRegistry.execute(behavior.command, behavior.args);
        break;

      case 'navigate':
        // a 태그가 자동으로 처리, 필요시 target도 설정
        break;

      case 'submit':
        e.preventDefault();
        console.log('[Action] Submit form:', behavior.form);
        // TODO: form submit 로직
        break;

      case 'reset':
        e.preventDefault();
        console.log('[Action] Reset form:', behavior.form);
        // TODO: form reset 로직
        break;

      case 'open':
        e.preventDefault();
        console.log('[Action] Open overlay:', behavior.overlay);
        // TODO: overlay 열기 로직
        break;

      case 'close':
        e.preventDefault();
        console.log('[Action] Close overlay:', behavior.overlay);
        // TODO: overlay 닫기 로직
        break;

      case 'toggle':
        e.preventDefault();
        console.log('[Action] Toggle:', behavior.target);
        // TODO: toggle 로직
        break;
    }
  };

  // behavior에 따라 element 결정
  const Element = behavior?.action === 'navigate' ? 'a' : 'button';
  const href = behavior?.action === 'navigate' ? behavior.to : undefined;
  const target = behavior?.action === 'navigate' ? behavior.target : undefined;

  return (
    <Element
      href={href}
      target={target}
      type={Element === 'button' ? 'button' : undefined}
      disabled={isDisabled || loading}
      onClick={handleClick}
      className={actionVariants({
        prominence: computedProminence as Prominence,
        intent: computedIntent as Intent,
        loading,
        density: computedDensity as 'Compact' | 'Standard' | 'Comfortable', // v1.1.1
        className,
      })}
      data-dsl-component="action"
      data-prominence={computedProminence}
      data-intent={computedIntent}
      data-density={computedDensity}
      data-behavior={behavior?.action}
    >
      {children ? (
        children
      ) : (
        <>
          {loading && <Icons.Loader2 size={iconSize} className="animate-spin" />}
          {!loading && IconComponent && <IconComponent size={iconSize} />}
          {label}
        </>
      )}
    </Element>
  );
}
