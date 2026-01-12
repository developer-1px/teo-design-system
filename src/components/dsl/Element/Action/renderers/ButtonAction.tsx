/**
 * ButtonAction - Button role renderer (v4.0)
 *
 * 기본 버튼 스타일 액션 renderer
 * prominence와 intent로 자동 스타일 결정
 */

import * as Icons from 'lucide-react';
import type { ActionRendererProps } from '@/components/dsl/Element/Action/Action.types';
import { getInteractiveClasses } from '@/shared/config/interactive-tokens';
import { cn } from '@/shared/lib/utils';

export interface ButtonActionProps extends ActionRendererProps {
  computedSize?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
}

export function ButtonAction({
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
  className, // Explicitly destructure to avoid {...rest} override
  ...rest
}: ButtonActionProps) {
  // 아이콘 컴포넌트 가져오기
  const IconComponent = icon ? (Icons as any)[icon] : null;

  // 아이콘 크기를 density에 따라 조절 (Density based or Size based)
  const iconSize = computedSize ? {
    xs: 12, sm: 14, md: 16, lg: 20, icon: 16,
  }[computedSize] : (computedDensity === 'Compact' ? 14 : 16);

  // ⚡️ Refined Interactive State (Hover/Focus/Active ONLY)
  // We don't want 'idle' state from here because Token Engine handles it
  const interactiveClasses = getInteractiveClasses({
    prominence: computedProminence,
    intent: computedIntent,
    config: {
      selected,
      disabled: isDisabled || loading,
    },
    skipIdle: true, // v6.0: Let Token Engine handle idle visuals
  });

  // Premium Effects based on prominence (Scale focus)
  const isHero = computedProminence === 'Hero';
  const premiumEffects = isHero
    ? 'hover:scale-[1.02] active:scale-[0.98] transition-all duration-200'
    : 'hover:brightness-110 active:brightness-90 transition-all duration-200';

  return (
    <Element
      {...rest}
      href={href}
      target={target}
      type={Element === 'button' ? 'button' : undefined}
      disabled={isDisabled || loading}
      onClick={handleClick}
      aria-pressed={selected !== undefined ? selected : undefined}
      className={cn(
        // 1. Structure (Base)
        'inline-flex items-center justify-center cursor-pointer select-none ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95',

        // 2. Interactive Tokens (State: hover/focus etc)
        interactiveClasses,

        // 3. Token Engine Base (Priority Override)
        tokens.typography.size,
        tokens.typography.weight,
        tokens.typography.color,
        tokens.surface.background,
        tokens.geometry.width,
        tokens.geometry.color,
        tokens.geometry.radius,
        tokens.geometry.outline,
        tokens.geometry.outlineOffset,
        tokens.shadow.boxShadow,
        tokens.typography.fontFamily,
        tokens.typography.lineHeight,
        tokens.extraClasses,

        // 4. Premium Interaction Effects
        !isDisabled && !loading && premiumEffects,

        // 5. Size (Legacy support)
        computedSize && computedSize !== 'md' &&
        {
          xs: 'h-7 px-2 text-xs gap-1',
          sm: 'h-8 px-3 text-sm gap-1.5',
          md: 'h-9 px-4 text-base gap-2',
          lg: 'h-10 px-6 text-lg gap-3',
          icon: 'h-9 w-9 p-0',
        }[computedSize],

        loading && 'opacity-70 cursor-wait',
        className // Merge passed className at the end
      )}
      data-dsl-component="action"
      data-role="button"
      data-prominence={computedProminence}
      data-intent={computedIntent}
      data-density={computedDensity}
      data-selected={selected}
      style={{
        // Token Engine Values (Layout)
        gap: tokens.spacing.gap,
        padding: !computedSize ? tokens.spacing.padding : undefined,
        opacity: tokens.surface.opacity,
        ...((rest as any).style || {})
      }}
    >
      {children ? (
        children
      ) : (
        <>
          {loading && <Icons.Loader2 size={iconSize} className="animate-spin mr-2" />}
          {!loading && IconComponent && <span className="inline-flex mr-2 text-current"><IconComponent size={iconSize} /></span>}
          <span className="truncate">{label}</span>
        </>
      )}
    </Element>
  );
}
