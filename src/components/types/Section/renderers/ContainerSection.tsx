/**
 * ContainerSection - General container role renderer (v4.1)
 *
 * Roles: Container, Main, SplitContainer
 * General purpose containers with prominence and density support
 *
 * v4.1: baseStyles와 overflowClass를 props로 받음 (role-config에서 주입)
 */

import type { SectionProps } from '@/components/types/Section/Section.types';
import { cn } from '@/shared/lib/utils';

export interface ContainerSectionProps extends Omit<SectionProps, 'role'> {
  role: 'Container' | 'Main' | 'SplitContainer';
  computedProminence: SectionProps['prominence'];
  computedDensity: 'Compact' | 'Standard' | 'Comfortable';
  Element: any;
  baseStyles: string; // v4.1: role-config에서 주입
  overflowClass: string; // v4.1: role-config에서 주입
  ariaProps?: Record<string, string>; // v4.1: role-config에서 주입
}

export function ContainerSection({
  role,
  children,
  computedProminence,
  computedDensity,
  gridArea,
  Element,
  baseStyles, // v4.1: 외부에서 주입
  overflowClass, // v4.1: 외부에서 주입
  ariaProps, // v4.1: 외부에서 주입
  ...rest
}: ContainerSectionProps) {
  return (
    <Element
      className={cn(baseStyles, overflowClass)}
      style={{ gridArea }}
      data-dsl-component="section"
      data-role={role}
      data-prominence={computedProminence}
      data-density={computedDensity}
      {...ariaProps}
      {...rest}
    >
      {children}
    </Element>
  );
}
