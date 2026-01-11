/**
 * AvatarRenderer - Avatar role renderer
 *
 * Maps TextProps to Avatar component props
 */

import type { TextProps } from '../Text.types';
import { Avatar } from '../role/Avatar';
import { cn } from '@/shared/lib/utils';

/**
 * Prominence to Avatar size mapping
 */
const prominenceToSize = (prominence?: TextProps['prominence']): 'sm' | 'md' | 'lg' | 'xl' => {
  switch (prominence) {
    case 'Hero':
      return 'xl';
    case 'Strong':
      return 'lg';
    case 'Subtle':
      return 'sm';
    case 'Standard':
    default:
      return 'md';
  }
};

export function AvatarRenderer({ content, prominence, className, spec }: TextProps) {
  const size = prominenceToSize(prominence);
  const src = spec?.src as string | undefined;
  const fallback = content || (spec?.fallback as string | undefined);
  const alt = spec?.alt as string | undefined;

  return <Avatar size={size} src={src} fallback={fallback} alt={alt} className={cn(className)} />;
}
