/**
 * IconButtonAction - IconButton role renderer (v4.0)
 *
 * 아이콘 전용 버튼 renderer
 * label은 aria-label로만 사용
 */

import * as Icons from 'lucide-react';
import type { ActionProps } from '@/components/types/Element/Action/Action.types';
import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
import { cn } from '@/shared/lib/utils';

export interface IconButtonActionProps extends Omit<ActionProps, 'role'> {
  computedProminence: ActionProps['prominence'];
  computedIntent: ActionProps['intent'];
  computedDensity: 'Compact' | 'Standard' | 'Comfortable';
  computedSize: 'xs' | 'sm' | 'md' | 'lg' | 'icon'; // ✨ NEW
  isDisabled: boolean;
  handleClick: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  Element: any;
  href?: string;
  target?: string;
}

export function IconButtonAction({
  label,
  icon,
  loading,
  selected,
  computedProminence,
  computedIntent,
  computedDensity,
  computedSize, // ✨ NEW
  isDisabled,
  handleClick,
  Element,
  href,
  target,
  children,
  ...rest
}: IconButtonActionProps) {
  // 아이콘 컴포넌트 가져오기
  const IconComponent = icon ? (Icons as any)[icon] : null;

  // 아이콘 크기를 density에 따라 조절
  // 아이콘 크기를 size에 따라 조절
  const iconSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    icon: 16,
  }[computedSize];

  // IconButton은 정사각형 크기
  // IconButton은 정사각형 크기 (size prop이 있으면 우선순위)
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
    icon: 'h-9 w-9',
  }[computedSize];

  // Interactive State Token System 적용
  const interactiveClasses = getInteractiveClasses({
    prominence: computedProminence || 'Standard',
    intent: computedIntent || 'Neutral',
    config: {
      selected,
      disabled: isDisabled || loading,
      focusable: true,
      clickable: true,
    },
  });

  return (
    <Element
      href={href}
      target={target}
      type={Element === 'button' ? 'button' : undefined}
      disabled={isDisabled || loading}
      onClick={handleClick}
      aria-label={label}
      aria-pressed={selected !== undefined ? selected : undefined}
      title={label}
      className={cn(
        // Base styles - rounded, flex, cursor, square size
        'inline-flex items-center justify-center rounded cursor-pointer',
        sizeClasses,
        // Interactive State (hover, active, selected, disabled, focus)
        interactiveClasses,
        // Enhanced hover/active states for IconButton (구 IconButton 디자인 통합)
        !selected &&
        !isDisabled &&
        'hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10',
        selected && 'bg-accent/10',
        // Loading cursor
        loading && 'cursor-wait'
        // Custom className override
      )}
      data-dsl-component="action"
      data-role="icon-button"
      data-prominence={computedProminence}
      data-intent={computedIntent}
      data-density={computedDensity}
      data-selected={selected}
      {...rest}
    >
      {children ? (
        children
      ) : (
        <>
          {loading && <Icons.Loader2 size={iconSize} className="animate-spin" />}
          {!loading && IconComponent && <IconComponent size={iconSize} />}
        </>
      )}
    </Element>
  );
}
