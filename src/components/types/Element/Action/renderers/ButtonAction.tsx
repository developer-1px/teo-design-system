/**
 * ButtonAction - Button role renderer (v4.0)
 *
 * 기본 버튼 스타일 액션 renderer
 * prominence와 intent로 자동 스타일 결정
 */

import * as Icons from 'lucide-react';
import type { ActionProps } from '@/components/types/Element/Action/Action.types';
import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
import { spacingVariants } from '@/shared/config/spacing-tokens';
import { cn } from '@/shared/lib/utils';

export interface ButtonActionProps extends Omit<ActionProps, 'role'> {
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

export function ButtonAction({
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
}: ButtonActionProps) {
  // 아이콘 컴포넌트 가져오기
  const IconComponent = icon ? (Icons as any)[icon] : null;

  // 아이콘 크기를 density에 따라 조절
  // 아이콘 크기를 size에 따라 조절 (size prop이 있으면 우선순위)
  const iconSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    icon: 16,
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

  // Spacing Token System 적용
  const spacingClasses = spacingVariants({
    prominence: computedProminence || 'Standard',
    density: computedDensity,
  });

  return (
    <Element
      href={href}
      target={target}
      type={Element === 'button' ? 'button' : undefined}
      disabled={isDisabled || loading}
      onClick={handleClick}
      aria-pressed={selected !== undefined ? selected : undefined}
      className={cn(
        // Base styles - rounded, flex, cursor
        'inline-flex items-center justify-center rounded cursor-pointer font-medium',
        // Interactive State (hover, active, selected, disabled, focus)
        interactiveClasses,
        // Spacing (gap, padding based on prominence × density)
        // Spacing (gap, padding based on prominence × density)
        spacingClasses,
        // ✨ NEW: Size variants override height/padding if size prop is used
        computedSize !== 'md' && {
          xs: 'h-7 px-2 text-xs gap-1',
          sm: 'h-8 px-3 text-sm gap-1.5',
          md: 'h-9 px-4 text-base gap-2',
          lg: 'h-10 px-6 text-lg gap-3',
          icon: 'h-9 w-9 p-0',
        }[computedSize],
        // Loading cursor
        loading && 'cursor-wait'
        // Custom className override
      )}
      data-dsl-component="action"
      data-role="button"
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
          {label}
        </>
      )}
    </Element>
  );
}
