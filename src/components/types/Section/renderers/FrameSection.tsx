/**
 * FrameSection - Frame role renderer (v4.1)
 *
 * Roles: Header, Footer, Navigator, Aside
 * Frame sections with fixed positioning and borders
 *
 * v4.1: baseStyles와 overflowClass를 props로 받음 (role-registry에서 주입)
 */

import type { SectionProps } from '@/components/types/Section/Section.types';
import { cn } from '@/shared/lib/utils';

export interface FrameSectionProps extends Omit<SectionProps, 'role'> {
  role: 'Header' | 'Footer' | 'Navigator' | 'Aside';
  computedProminence: SectionProps['prominence'];
  computedDensity: 'Compact' | 'Standard' | 'Comfortable';
  Element: any;
  baseStyles: string; // v4.1: role-registry에서 주입
  overflowClass: string; // v4.1: role-registry에서 주입
  ariaProps?: Record<string, string>; // v4.1: role-registry에서 주입
}

export function FrameSection({
  role,
  children,
  gridArea,
  Element,
  baseStyles, // v4.1: 외부에서 주입
  overflowClass, // v4.1: 외부에서 주입
  ariaProps, // v4.1: 외부에서 주입
  ...rest
}: FrameSectionProps) {
  return (
    <Element
      className={cn(baseStyles, overflowClass)}
      style={{ gridArea }}
      data-dsl-component="section"
      data-role={role}
      {...ariaProps}
      {...rest}
    >
      {children}
    </Element>
  );
}
