/**
 * LinkAction - Link role renderer (v4.0)
 *
 * 링크 스타일 액션 renderer
 * 배경 없이 underline + text 색상만 사용
 */

import * as Icons from 'lucide-react';
import type { ActionProps } from '@/components/types/Element/Action/Action.types';
import { cn } from '@/shared/lib/utils';

export interface LinkActionProps extends Omit<ActionProps, 'role'> {
  computedProminence: ActionProps['prominence'];
  computedIntent: ActionProps['intent'];
  computedDensity: 'Compact' | 'Standard' | 'Comfortable';
  isDisabled: boolean;
  handleClick: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  Element: any;
  href?: string;
  target?: string;
}

export function LinkAction({
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
}: LinkActionProps) {
  // 아이콘 컴포넌트 가져오기
  const IconComponent = icon ? (Icons as any)[icon] : null;

  // 아이콘 크기를 density에 따라 조절
  const iconSize = computedDensity === 'Compact' ? 12 : computedDensity === 'Comfortable' ? 16 : 14;

  // Intent에 따른 색상
  const intentColor = {
    Brand: 'text-accent hover:text-accent/80',
    Positive: 'text-success hover:text-success-hover',
    Caution: 'text-warning hover:text-warning-hover',
    Critical: 'text-error hover:text-error-hover',
    Info: 'text-info hover:text-info-hover',
    Neutral: 'text-text hover:text-text/80',
  }[computedIntent || 'Neutral'];

  // Prominence에 따른 폰트 크기
  const fontSize = {
    Hero: 'text-lg',
    Standard: 'text-base',
    Strong: 'text-base',
    Subtle: 'text-sm',
  }[computedProminence || 'Standard'];

  return (
    <Element
      href={href}
      target={target}
      type={Element === 'button' ? 'button' : undefined}
      disabled={isDisabled || loading}
      onClick={handleClick}
      className={cn(
        // Base styles - inline flex, underline
        'inline-flex items-center gap-1',
        'underline underline-offset-2 decoration-current/30',
        'hover:decoration-current/60',
        'transition-colors cursor-pointer',
        // Intent color
        intentColor,
        // Font size by prominence
        fontSize,
        // Disabled state
        isDisabled && 'opacity-50 cursor-not-allowed',
        // Loading cursor
        loading && 'cursor-wait',
        // Custom className override
      )}
      data-dsl-component="action"
      data-role="link"
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
