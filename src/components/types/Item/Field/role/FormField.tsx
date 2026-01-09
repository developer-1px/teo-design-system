import { forwardRef, type ReactNode } from 'react';
import { Label } from '@/components/Item/Text/role/Label.tsx';
import { cn } from '@/shared/lib/utils';

/**
 * FormField - 폼 필드 컨테이너
 *
 * Label + Input/Select/Textarea + Error/Helper 텍스트를 조합
 */
export interface FormFieldProps {
  /**
   * label - 필드 레이블
   */
  label?: string;

  /**
   * required - 필수 항목 여부
   */
  required?: boolean;

  /**
   * error - 에러 메시지
   */
  error?: string;

  /**
   * helper - 도움말 텍스트
   */
  helper?: string;

  /**
   * children - 입력 요소 (Input, Select, Textarea 등)
   */
  children: ReactNode;

  /**
   * className - 컨테이너 클래스
   */
  className?: string;

  /**
   * htmlFor - label의 for 속성
   */
  htmlFor?: string;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, required, error, helper, children, className, htmlFor }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5', className)}>
        {/* Label */}
        {label && (
          <Label htmlFor={htmlFor} required={required}>
            {label}
          </Label>
        )}

        {/* Input Element */}
        {children}

        {/* Error or Helper Text */}
        {error ? (
          <p className="text-xs text-red-500 font-normal">{error}</p>
        ) : helper ? (
          <p className="text-xs text-subtle font-normal">{helper}</p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
