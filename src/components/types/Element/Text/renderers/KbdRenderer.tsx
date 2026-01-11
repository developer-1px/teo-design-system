/**
 * KbdRenderer - Kbd role renderer
 *
 * Maps TextProps to Kbd component props
 */

import type { TextProps } from '../Text.types';
import { Kbd } from '../role/Kbd';
import { cn } from '@/shared/lib/utils';

/**
 * Prominence to Kbd size mapping
 */
const prominenceToSize = (prominence?: TextProps['prominence']): 'sm' | 'md' | 'lg' => {
  switch (prominence) {
    case 'Hero':
    case 'Strong':
      return 'lg';
    case 'Subtle':
      return 'sm';
    case 'Standard':
    default:
      return 'md';
  }
};

export function KbdRenderer({ content, children, prominence, className }: TextProps) {
  const size = prominenceToSize(prominence);

  return (
    <Kbd size={size} className={cn(className)}>
      {children || content}
    </Kbd>
  );
}
