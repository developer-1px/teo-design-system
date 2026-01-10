import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Label - 폼 레이블
 */
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * required - 필수 항목 표시
   */
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium text-text mb-1.5 cursor-pointer', className)}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
