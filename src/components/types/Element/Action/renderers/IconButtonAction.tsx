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

export interface IconButtonActionProps extends ActionRendererProps {
  computedSize?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
}

export function IconButtonAction({
  label,
  icon,
  loading,
  selected,
  computedProminence,
  computedIntent,
  computedDensity,
  computedSize,
  isDisabled,
  handleClick,
  Element,
  href,
  target,
  children,
  tokens, // v6.0: IDDL Tokens
  className, // Avoid override
  ...rest
}: IconButtonActionProps) {
  // 아이콘 컴포넌트 가져오기
  const IconComponent = icon ? (Icons as any)[icon] : null;

  const iconSize = computedSize ? {
    xs: 12, sm: 14, md: 16, lg: 20, icon: 16,
  }[computedSize] : (computedDensity === 'Compact' ? 14 : 18);

  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10', // 40px
    lg: 'h-12 w-12',
    icon: 'h-10 w-10',
  }[computedSize || 'md'];

  const interactiveClasses = getInteractiveClasses({
    prominence: computedProminence,
    intent: computedIntent,
    config: { selected, disabled: isDisabled || loading },
    skipIdle: true,
  });

  const isHero = computedProminence === 'Hero';
  const premiumEffects = isHero
    ? 'hover:scale-110 active:scale-95 transition-all duration-200'
    : 'hover:bg-surface-hover active:bg-surface-pressed transition-all duration-200 hover:scale-105';

  return (
    <Element
      {...rest}
      href={href}
      target={target}
      type={Element === 'button' ? 'button' : undefined}
      disabled={isDisabled || loading}
      onClick={handleClick}
      aria-label={label}
      aria-pressed={selected !== undefined ? selected : undefined}
      title={label}
      className={cn(
        // 1. Structure
        'inline-flex items-center justify-center cursor-pointer select-none ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        sizeClasses,

        // 2. Interactive Tokens (Early priority to be overridden)
        interactiveClasses,

        // 3. Token Engine Base
        tokens.surface.background,
        tokens.geometry.width,
        tokens.geometry.color,
        tokens.geometry.radius,
        tokens.geometry.outline,
        tokens.geometry.outlineOffset,
        tokens.shadow.boxShadow,
        tokens.typography.color, // Icon color follows text color token

        // 4. Premium Effects
        !isDisabled && !loading && premiumEffects,

        loading && 'opacity-70 cursor-wait',
        className
      )}
      style={{
        opacity: tokens.surface.opacity,
        ...((rest as any).style || {})
      }}
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
