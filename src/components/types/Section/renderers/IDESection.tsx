/**
 * IDESection - IDE/Studio role renderer (v4.1)
 *
 * Roles: Toolbar, ActivityBar, PrimarySidebar, SecondarySidebar, Editor, Panel, Auxiliary
 * IDE/Studio specific layout sections
 *
 * v4.1: baseStyles와 overflowClass를 props로 받음 (role-config에서 주입)
 */

import type { SectionProps } from '@/components/types/Section/Section.types';
import { cn } from '@/shared/lib/utils';

export interface IDESectionProps extends Omit<SectionProps, 'role'> {
  role: 'Toolbar' | 'ActivityBar' | 'PrimarySidebar' | 'SecondarySidebar' | 'Editor' | 'Panel' | 'Auxiliary';
  computedProminence: SectionProps['prominence'];
  computedDensity: 'Compact' | 'Standard' | 'Comfortable';
  Element: any;
  baseStyles: string; // v4.1: role-config에서 주입
  overflowClass: string; // v4.1: role-config에서 주입
  ariaProps?: Record<string, string>; // v4.1: role-config에서 주입
}

export function IDESection({
  role,
  children,
  gridArea,
  Element,
  baseStyles, // v4.1: 외부에서 주입
  overflowClass, // v4.1: 외부에서 주입
  ariaProps, // v4.1: 외부에서 주입
  ...rest
}: IDESectionProps) {
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
