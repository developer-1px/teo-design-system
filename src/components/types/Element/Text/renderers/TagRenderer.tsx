/**
 * TagRenderer - Tag role renderer
 *
 * Maps TextProps to Tag component props
 */

import { cn } from '@/shared/lib/utils';
import { Tag } from '../role/Tag';
import type { TextProps } from '../Text.types';

/**
 * Prominence to Tag size mapping
 */
const prominenceToSize = (prominence?: TextProps['prominence']): 'sm' | 'md' => {
  switch (prominence) {
    case 'Subtle':
      return 'sm';
    case 'Hero':
    case 'Strong':
    case 'Standard':
    default:
      return 'md';
  }
};

export function TagRenderer({ content, children, prominence, className, spec }: TextProps) {
  const size = prominenceToSize(prominence);
  const onRemove = spec?.onRemove as (() => void) | undefined;

  return (
    <Tag size={size} onRemove={onRemove} className={cn(className)}>
      {children || content}
    </Tag>
  );
}
