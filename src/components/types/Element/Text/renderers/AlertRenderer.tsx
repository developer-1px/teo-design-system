/**
 * AlertRenderer - Alert role renderer
 *
 * Maps TextProps to Alert component props
 */

import { cn } from '@/shared/lib/utils';
import { Alert } from '../role/Alert';
import type { TextProps } from '../Text.types';

/**
 * Intent to Alert variant mapping
 */
const intentToVariant = (
  intent?: TextProps['intent']
): 'info' | 'success' | 'warning' | 'error' => {
  switch (intent) {
    case 'Positive':
      return 'success';
    case 'Caution':
      return 'warning';
    case 'Critical':
      return 'error';
    default:
      return 'info';
  }
};

export function AlertRenderer({ content, children, intent, className, spec }: TextProps) {
  const variant = intentToVariant(intent);
  const title = spec?.title as string | undefined;
  const onClose = spec?.onClose as (() => void) | undefined;

  return (
    <Alert variant={variant} title={title} onClose={onClose} className={cn(className)}>
      {children || content}
    </Alert>
  );
}
