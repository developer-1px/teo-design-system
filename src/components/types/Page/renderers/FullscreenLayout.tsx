/**
 * FullscreenLayout - Fullscreen Layout Renderer (v5.0)
 *
 * 전체화면 고정 레이아웃 (프레젠테이션, 키오스크, 몰입형 경험용)
 *
 * 특징:
 * - Full viewport (w-screen h-screen)
 * - overflow-hidden (스크롤 없음)
 * - position: fixed (다른 모든 UI 위에 표시)
 * - z-50 (최상위 레이어)
 * - 브레드크럼, 타이틀 등 크롬 요소 없음
 * - ESC 키로 종료 가능
 *
 * @example
 * // 프레젠테이션 모드
 * <Page role="Fullscreen">
 *   <Section role="Container">
 *     <Slide />
 *   </Section>
 * </Page>
 */

import { cva } from 'class-variance-authority';
import { type ReactNode } from 'react';
import type { Intent, Prominence } from '@/components/types/Atom/types';
import { cn } from '@/shared/lib/utils';

/**
 * Fullscreen Layout Container Variants (CVA)
 */
const fullscreenLayoutVariants = cva(
  [
    'fixed inset-0',
    'w-screen h-screen overflow-hidden',
    'bg-surface text-base text-text-primary',
    'z-50',
  ],
  {
    variants: {
      prominence: {
        Hero: 'bg-surface-raised',
        Standard: 'bg-surface',
        Strong: 'bg-surface-sunken',
        Subtle: 'bg-surface-base',
      },
    },
    defaultVariants: {
      prominence: 'Standard',
    },
  }
);

export interface FullscreenLayoutProps {
  /**
   * Prominence level
   */
  prominence?: Prominence;

  /**
   * Intent (semantic color)
   */
  intent?: Intent;

  /**
   * Children (Section 컴포넌트들)
   */
  children: ReactNode;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent) => void;
}

export function FullscreenLayout(props: FullscreenLayoutProps) {
  const {
    prominence = 'Standard',
    intent = 'Neutral',
    children,
    className,
    onClick,
  } = props;

  return (
    <div
      className={cn(
        fullscreenLayoutVariants({ prominence }),
        className
      )}
      data-dsl-component="page"
      data-role="Fullscreen"
      data-prominence={prominence}
      data-intent={intent}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
