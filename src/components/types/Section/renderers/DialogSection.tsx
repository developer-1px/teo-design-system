/**
 * DialogSection - Dialog role renderer (v4.1)
 *
 * Roles: DialogHeader, DialogFooter, DialogContent
 * Dialog/Modal specific sections
 *
 * v4.1: baseStyles와 overflowClass를 props로 받음 (role-config에서 주입)
 */

import type { SectionProps } from '@/components/types/Atom/types';
import { cn } from '@/shared/lib/utils';

export interface DialogSectionProps extends Omit<SectionProps, 'role'> {
  role: 'DialogHeader' | 'DialogFooter' | 'DialogContent';
  computedProminence: SectionProps['prominence'];
  computedDensity: 'Compact' | 'Standard' | 'Comfortable';
  Element: any;
  baseStyles: string; // v4.1: role-config에서 주입
  overflowClass: string; // v4.1: role-config에서 주입
  ariaProps?: Record<string, string>; // v4.1: role-config에서 주입
  gridArea?: string; // v4.1: gridArea 추가
}

export function DialogSection({
  role,
  children,
  Element,
  baseStyles, // v4.1: 외부에서 주입
  overflowClass, // v4.1: 외부에서 주입
  ariaProps, // v4.1: 외부에서 주입
  gridArea, // v4.1: gridArea 추가
  ...rest
}: DialogSectionProps) {
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
