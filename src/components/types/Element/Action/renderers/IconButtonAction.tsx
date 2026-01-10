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
  const iconSize = computedDensity === 'Compact' ? 14 : computedDensity === 'Comfortable' ? 20 : 16;

  // IconButton은 정사각형 크기
  const size = {
    Compact: 'h-7 w-7',
    Standard: 'h-9 w-9',
    Comfortable: 'h-11 w-11',
  }[computedDensity];

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
        size,
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
