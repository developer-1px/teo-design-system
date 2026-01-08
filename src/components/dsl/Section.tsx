/**
 * Section - 콘텐츠 섹션
 *
 * prominence를 설정하고 자식에게 전파
 * Context를 통해 Group과 Item에 prominence 제공
 */

import { cn } from '@/lib/utils';
import { LayoutProvider, useLayoutContext } from './LayoutContext';
import type { SectionProps } from './types';

export function Section({
  prominence = 2,
  children,
  className,
  id,
}: SectionProps) {
  // 부모 Context 가져오기 (중첩된 경우)
  const parentCtx = useLayoutContext();

  return (
    <LayoutProvider
      value={{
        prominence,
        depth: parentCtx.depth + 1,
      }}
    >
      <section
        id={id}
        className={cn(
          'space-y-4',
          // prominence에 따른 여백
          prominence === 1 && 'py-6',
          prominence === 2 && 'py-4',
          prominence === 3 && 'py-2',
          className
        )}
        data-dsl-component="section"
        data-prominence={prominence}
      >
        {children}
      </section>
    </LayoutProvider>
  );
}
