/**
 * Overlay - 오버레이 컴포넌트 (IDDL v1.0.1)
 *
 * 모달, 드로어, 팝오버, 토스트, 툴팁 등 화면 위에 떠있는 UI 요소
 *
 * **레이아웃 관리 원칙**:
 * - Overlay는 순수하게 overlay 기능만 제공 (backdrop, positioning, dismissable 등)
 * - 레이아웃(너비, 높이, 최대너비 등)은 **Page가 className을 통해 제어**
 * - Overlay 자체에 size, width 같은 레이아웃 prop을 두지 않음
 *
 * @example
 * ```tsx
 * <Page role="App">
 *   <Overlay
 *     role="Drawer"
 *     className="w-[800px]"  // Page가 레이아웃 제어
 *   >
 *     <FormView />
 *   </Overlay>
 * </Page>
 * ```
 *
 * v1.0.1: 신규 추가 (Dialog, Drawer, Popover, Toast, Tooltip, Sheet, Lightbox), CVA 적용
 * @see spec/iddl-spec-1.0.1.md#33-overlay-node
 */

import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { LayoutProvider, useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { OverlayProps } from '@/components/types/Atom/types.ts';
import { cn } from '@/shared/lib/utils.ts';

/**
 * Overlay density variants (CVA) - for padding
 */
const overlayDensityVariants = cva('', {
  variants: {
    density: {
      Comfortable: 'p-8',
      Standard: 'p-6',
      Compact: 'p-4',
    },
  },
  defaultVariants: {
    density: 'Standard',
  },
});

/**
 * Popover/Toast density variants (CVA) - smaller padding
 */
const compactDensityVariants = cva('', {
  variants: {
    density: {
      Comfortable: 'p-4',
      Standard: 'p-3',
      Compact: 'p-2',
    },
  },
  defaultVariants: {
    density: 'Standard',
  },
});

/**
 * Placement variants (CVA) - for Popover and Toast
 */
const placementVariants = cva('', {
  variants: {
    placement: {
      center: 'items-center justify-center',
      top: 'top-4 left-1/2 -translate-x-1/2',
      bottom: 'bottom-4 left-1/2 -translate-x-1/2',
      left: 'left-4 top-1/2 -translate-y-1/2',
      right: 'right-4 top-1/2 -translate-y-1/2',
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
    },
  },
  defaultVariants: {
    placement: 'center',
  },
});

/**
 * Drawer direction variants (CVA)
 *
 * NOTE: 너비(width)는 포함하지 않음 - Page가 className으로 제어
 */
const drawerDirectionVariants = cva(
  'fixed inset-y-0 bg-surface-overlay shadow-xl overflow-auto',
  {
    variants: {
      direction: {
        left: 'left-0',
        right: 'right-0',
      },
    },
    defaultVariants: {
      direction: 'right',
    },
  }
);

/**
 * Sheet direction variants (CVA)
 */
const sheetDirectionVariants = cva(
  'fixed bg-surface-overlay shadow-xl w-full max-h-[80vh] overflow-auto',
  {
    variants: {
      direction: {
        top: 'top-0',
        bottom: 'bottom-0',
      },
    },
    defaultVariants: {
      direction: 'bottom',
    },
  }
);

export function Overlay({
  as,
  id,
  role,
  prominence = 'Standard',
  density,
  intent,
  placement = 'center',
  children,
  isOpen = false,
  dismissable = true,
  onClose,
  condition,
  ...rest
}: OverlayProps) {
  // 조건부 렌더링 (v1.0.1)
  // TODO: condition 표현식 평가 구현
  if (condition) {
    // 현재는 조건부 렌더링 미구현
  }

  // 부모 Context에서 상속
  const parentCtx = useLayoutContext();
  const computedDensity = density ?? parentCtx.density ?? 'Standard';
  const computedIntent = intent ?? parentCtx.intent ?? 'Neutral';

  // ESC 키로 닫기 (dismissable일 때만)
  useEffect(() => {
    if (!isOpen || !dismissable || !onClose) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, dismissable, onClose]);

  if (!isOpen) return null;

  // 배경 클릭으로 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dismissable && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Dialog
  if (role === 'Dialog') {
    const ContentComponent = as || 'div';
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={handleBackdropClick}
        data-dsl-component="overlay"
        data-role={role}
        data-overlay-id={id}
      >
        <LayoutProvider
          value={{
            prominence,
            density: computedDensity,
            intent: computedIntent,
            depth: parentCtx.depth + 1,
          }}
        >
          <ContentComponent
            className={cn(
              'bg-surface-overlay rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto',
              overlayDensityVariants({
                density: computedDensity as 'Comfortable' | 'Standard' | 'Compact',
              }),
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            {...rest}
          >
            {dismissable && onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-subtle hover:text-text transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}
            {children}
          </ContentComponent>
        </LayoutProvider>
      </div>
    );
  }

  // Drawer
  if (role === 'Drawer') {
    const ContentComponent = as || 'div';
    const drawerPlacement = placement === 'left' || placement === 'right' ? placement : 'right';
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={handleBackdropClick}
        data-dsl-component="overlay"
        data-role={role}
        data-overlay-id={id}
      >
        <LayoutProvider
          value={{
            prominence,
            density: computedDensity,
            intent: computedIntent,
            depth: parentCtx.depth + 1,
          }}
        >
          <ContentComponent
            className={cn(
              drawerDirectionVariants({
                direction: drawerPlacement as 'left' | 'right',
              }),
              overlayDensityVariants({
                density: computedDensity as 'Comfortable' | 'Standard' | 'Compact',
              }),
            )}
            role="dialog"
            aria-modal="true"
            {...rest}
          >
            {dismissable && onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-subtle hover:text-text transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}
            {children}
          </ContentComponent>
        </LayoutProvider>
      </div>
    );
  }

  // Sheet (similar to Drawer but full-width)
  if (role === 'Sheet') {
    const ContentComponent = as || 'div';
    const sheetPlacement = placement === 'top' || placement === 'bottom' ? placement : 'bottom';
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={handleBackdropClick}
        data-dsl-component="overlay"
        data-role={role}
        data-overlay-id={id}
      >
        <LayoutProvider
          value={{
            prominence,
            density: computedDensity,
            intent: computedIntent,
            depth: parentCtx.depth + 1,
          }}
        >
          <ContentComponent
            className={cn(
              sheetDirectionVariants({ direction: sheetPlacement as 'top' | 'bottom' }),
              overlayDensityVariants({
                density: computedDensity as 'Comfortable' | 'Standard' | 'Compact',
              }),
            )}
            role="dialog"
            aria-modal="true"
            {...rest}
          >
            {dismissable && onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-subtle hover:text-text transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}
            {children}
          </ContentComponent>
        </LayoutProvider>
      </div>
    );
  }

  // Popover
  if (role === 'Popover') {
    const ContentComponent = as || 'div';
    return (
      <ContentComponent
        className={cn(
          'absolute z-40 bg-surface-floating rounded-md shadow-lg border border-default',
          placementVariants({ placement }),
          compactDensityVariants({
            density: computedDensity as 'Comfortable' | 'Standard' | 'Compact',
          }),
        )}
        data-dsl-component="overlay"
        data-role={role}
        data-overlay-id={id}
        role="dialog"
        {...rest}
      >
        <LayoutProvider
          value={{
            prominence,
            density: computedDensity,
            intent: computedIntent,
            depth: parentCtx.depth + 1,
          }}
        >
          {dismissable && onClose && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-subtle hover:text-text transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
          {children}
        </LayoutProvider>
      </ContentComponent>
    );
  }

  // Toast
  if (role === 'Toast') {
    const ContentComponent = as || 'div';
    return (
      <ContentComponent
        className={cn(
          'fixed z-50 bg-surface-overlay rounded-lg shadow-xl border border-default',
          'min-w-[300px] max-w-md',
          placementVariants({ placement }),
          compactDensityVariants({
            density: computedDensity as 'Comfortable' | 'Standard' | 'Compact',
          }),
        )}
        data-dsl-component="overlay"
        data-role={role}
        data-overlay-id={id}
        role="alert"
        {...rest}
      >
        <LayoutProvider
          value={{
            prominence,
            density: computedDensity,
            intent: computedIntent,
            depth: parentCtx.depth + 1,
          }}
        >
          {dismissable && onClose && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-subtle hover:text-text transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
          {children}
        </LayoutProvider>
      </ContentComponent>
    );
  }

  // Tooltip
  if (role === 'Tooltip') {
    const ContentComponent = as || 'div';
    return (
      <ContentComponent
        className={cn(
          'absolute z-50 bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none',
          placementVariants({ placement }),
        )}
        data-dsl-component="overlay"
        data-role={role}
        data-overlay-id={id}
        role="tooltip"
        {...rest}
      >
        {children}
      </ContentComponent>
    );
  }

  // Lightbox
  if (role === 'Lightbox') {
    const ContentComponent = as || 'div';
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        onClick={handleBackdropClick}
        data-dsl-component="overlay"
        data-role={role}
        data-overlay-id={id}
      >
        <LayoutProvider
          value={{
            prominence,
            density: computedDensity,
            intent: computedIntent,
            depth: parentCtx.depth + 1,
          }}
        >
          <ContentComponent
            className={cn('max-w-7xl max-h-[90vh] overflow-auto')}
            {...rest}
          >
            {dismissable && onClose && (
              <button
                onClick={onClose}
                className="fixed top-4 right-4 text-white hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            )}
            {children}
          </ContentComponent>
        </LayoutProvider>
      </div>
    );
  }

  // Floating (v1.0.2)
  // 지속적으로 표시되는 인터랙티브 오버레이 (예: FloatingBar, 플로팅 툴바)
  // - 배경 dimming 없음
  // - 최소한의 스타일 제약 (자식 컴포넌트가 스타일 제어)
  // - pointer-events 허용 (상호작용 가능)
  // - dismissable 지원하지 않음 (persistent)
  if (role === 'Floating') {
    const ContentComponent = as || 'div';
    return (
      <ContentComponent
        className={cn('fixed z-50', placementVariants({ placement }))}
        data-dsl-component="overlay"
        data-role={role}
        data-overlay-id={id}
        {...rest}
      >
        <LayoutProvider
          value={{
            prominence,
            density: computedDensity,
            intent: computedIntent,
            depth: parentCtx.depth + 1,
          }}
        >
          {children}
        </LayoutProvider>
      </ContentComponent>
    );
  }

  return null;
}
