/**
 * Page - 최상위 페이지 컨테이너
 *
 * 전체 페이지를 감싸는 루트 컴포넌트
 */

import { cn } from '@/lib/utils';
import type { PageProps } from './types';

export function Page({ children, className }: PageProps) {
  return (
    <div
      className={cn(
        'min-h-screen w-full bg-layer-0',
        'flex flex-col',
        className
      )}
      data-dsl-component="page"
    >
      {children}
    </div>
  );
}
