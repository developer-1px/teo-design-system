import { forwardRef, type ReactNode, useState } from 'react';
import { cn } from '@/shared/lib/utils.ts';

/**
 * Tooltip - 툴팁
 *
 * 요소에 마우스를 올렸을 때 표시되는 설명 텍스트
 */
export interface TooltipProps {
  /**
   * content - 툴팁 내용
   */
  content: ReactNode;

  /**
   * children - 툴팁이 표시될 트리거 요소
   */
  children: ReactNode;

  /**
   * placement - 툴팁 위치
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * delay - 표시 지연 시간 (ms)
   */
  delay?: number;

  /**
   * className - 툴팁 컨테이너 클래스
   */
  className?: string;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, placement = 'top', delay = 200, className }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
      const id = setTimeout(() => setIsVisible(true), delay);
      setTimeoutId(id);
    };

    const handleMouseLeave = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      setIsVisible(false);
    };

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Trigger */}
        {children}

        {/* Tooltip */}
        {isVisible && (
          <div
            role="tooltip"
            className={cn(
              'absolute z-50 px-2 py-1 text-xs',
              'bg-gray-900 text-white rounded shadow-lg',
              'whitespace-nowrap pointer-events-none',
              'animate-in fade-in-0 zoom-in-95',
              // Placement
              placement === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
              placement === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
              placement === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
              placement === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2',
              className
            )}
          >
            {content}

            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 bg-gray-900 rotate-45',
                placement === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
                placement === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
                placement === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
                placement === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'
              )}
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';
