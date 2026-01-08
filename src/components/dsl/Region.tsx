/**
 * Region - 페이지 영역
 *
 * 시맨틱 HTML 역할을 가진 영역 (header, main, sidebar, footer)
 */

import { cn } from '@/lib/utils';
import type { RegionProps } from './types';

const roleElements = {
  header: 'header',
  main: 'main',
  sidebar: 'aside',
  footer: 'footer',
  aside: 'aside',
} as const;

const roleStyles = {
  header: 'bg-layer-2 border-b border-border shadow-sm',
  main: 'flex-1 bg-layer-0',
  sidebar: 'bg-layer-2 border-r border-border',
  footer: 'bg-layer-2 border-t border-border shadow-sm',
  aside: 'bg-layer-1',
};

export function Region({ role, children, className }: RegionProps) {
  const Component = roleElements[role];

  return (
    <Component
      className={cn(roleStyles[role], className)}
      data-dsl-component="region"
      data-region-role={role}
    >
      {children}
    </Component>
  );
}
