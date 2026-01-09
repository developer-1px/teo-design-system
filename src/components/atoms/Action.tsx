/**
 * Action - IDDL Primitive
 *
 * 시스템에 변화를 주는 명령 트리거
 * prominence와 intent에 따라 버튼 스타일 자동 결정
 *
 * @see apps/docs/IDDL.spec.md Section 3.1.3
 */

import { cn } from '@/lib/utils';

export type Prominence = 'Hero' | 'Primary' | 'Secondary' | 'Tertiary';
export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';

/**
 * ActionBehavior - IDDL 1.0.1 명세 준수
 * @see spec/iddl-spec-1.0.1.md Section 4.1.3
 */
export type ActionBehavior =
  | { action: 'command'; command: string; args?: Record<string, unknown> }
  | { action: 'navigate'; to: string; target?: '_blank' | '_self' }
  | { action: 'submit'; form?: string }
  | { action: 'reset'; form?: string }
  | { action: 'open'; overlay: string }
  | { action: 'close'; overlay?: string }
  | { action: 'toggle'; target: string };

export interface ActionProps {
  label?: string;
  icon?: string;

  // Behavior (Discriminated Union)
  behavior: ActionBehavior;

  // Handlers (for custom logic)
  onClick?: () => void;

  // State
  disabled?: boolean | string;
  confirm?: string;  // Confirmation Message
  loading?: boolean;

  // Styling
  prominence?: Prominence;
  intent?: Intent;
  variant?: 'button' | 'list-item';  // 리스트 아이템 스타일 지원
  className?: string;
}

// prominence → 크기 및 스타일 매핑
const prominenceStyles: Record<Prominence, { size: string; style: string }> = {
  Hero: {
    size: 'h-14 px-8 text-lg',
    style: 'solid',  // Filled background
  },
  Primary: {
    size: 'h-10 px-5 text-base',
    style: 'solid',
  },
  Secondary: {
    size: 'h-9 px-4 text-sm',
    style: 'outline',  // Border only
  },
  Tertiary: {
    size: 'h-8 px-3 text-xs',
    style: 'ghost',  // Transparent
  },
};

// intent → 색상 매핑 (style별로 다름)
const intentColorClasses = {
  solid: {
    Neutral: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    Brand: 'bg-accent text-white hover:bg-accent/90 active:bg-accent/80',
    Positive: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
    Caution: 'bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800',
    Critical: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    Info: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  },
  outline: {
    Neutral: 'border border-default text-text hover:bg-black/5 active:bg-black/10',
    Brand: 'border-2 border-accent text-accent hover:bg-accent/10 active:bg-accent/20',
    Positive: 'border-2 border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100',
    Caution: 'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100',
    Critical: 'border-2 border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100',
    Info: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100',
  },
  ghost: {
    Neutral: 'text-text hover:bg-black/5 active:bg-black/10',
    Brand: 'text-accent hover:bg-accent/10 active:bg-accent/20',
    Positive: 'text-green-600 hover:bg-green-50 active:bg-green-100',
    Caution: 'text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100',
    Critical: 'text-red-600 hover:bg-red-50 active:bg-red-100',
    Info: 'text-blue-600 hover:bg-blue-50 active:bg-blue-100',
  },
};

export function Action({
  label,
  icon,
  behavior,
  onClick,
  disabled = false,
  confirm,
  loading = false,
  prominence = 'Primary',
  intent = 'Neutral',
  variant = 'button',
  className,
}: ActionProps) {
  // list-item variant는 고정 스타일 사용
  const isListItem = variant === 'list-item';

  const { size, style } = isListItem
    ? { size: '', style: 'ghost' }  // list-item은 고정 스타일
    : prominenceStyles[prominence];

  const colorClasses = intentColorClasses[style as keyof typeof intentColorClasses][intent];

  // disabled가 string이면 표현식으로 평가 (조건부)
  const isDisabled = typeof disabled === 'string' ? false : disabled;

  const handleClick = (e: React.MouseEvent) => {
    // confirm이 있으면 확인 메시지
    if (confirm && !window.confirm(confirm)) {
      e.preventDefault();
      return;
    }

    // onClick 핸들러 실행
    if (onClick) {
      onClick();
    }

    // behavior 방어 처리
    if (!behavior) {
      console.warn('[Action] behavior prop is undefined');
      return;
    }

    // behavior에 따른 처리
    switch (behavior.action) {
      case 'command':
        console.log('Execute command:', behavior.command, behavior.args);
        break;
      case 'submit':
        // form submit은 기본 동작
        break;
      case 'reset':
        // form reset은 기본 동작
        break;
      case 'open':
        console.log('Open overlay:', behavior.overlay);
        break;
      case 'close':
        console.log('Close overlay:', behavior.overlay);
        break;
      case 'toggle':
        console.log('Toggle target:', behavior.target);
        break;
    }
  };

  const baseClassName = cn(
    'inline-flex items-center gap-2 rounded-md font-medium',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    'disabled:pointer-events-none disabled:opacity-50',
    // list-item variant: 고정 스타일
    isListItem && 'w-full justify-start px-3 py-2 text-sm',
    // button variant: prominence 기반 스타일
    !isListItem && 'justify-center',
    !isListItem && size,
    colorClasses,
    loading && 'opacity-50 cursor-wait',
    className
  );

  // Navigate behavior: render as <a>
  if (behavior.action === 'navigate') {
    return (
      <a
        href={behavior.to}
        target={behavior.target}
        onClick={handleClick}
        className={cn(baseClassName, 'no-underline')}
        data-iddl-node="action"
        data-action={behavior.action}
        data-prominence={prominence}
        data-intent={intent}
      >
        {icon && <span className="text-lg">{icon}</span>}
        {loading ? 'Loading...' : label}
      </a>
    );
  }

  // Button behaviors: render as <button>
  const buttonType =
    behavior.action === 'submit'
      ? 'submit'
      : behavior.action === 'reset'
        ? 'reset'
        : 'button';

  return (
    <button
      type={buttonType}
      onClick={handleClick}
      disabled={isDisabled || loading}
      form={behavior.action === 'submit' || behavior.action === 'reset' ? behavior.form : undefined}
      className={baseClassName}
      data-iddl-node="action"
      data-action={behavior.action}
      data-prominence={prominence}
      data-intent={intent}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {loading ? 'Loading...' : label}
    </button>
  );
}
