/**
 * BooleanField - 단일 체크박스 필드 렌더러
 *
 * boolean 타입을 지원합니다.
 * Headless hook 없이 간단한 체크박스 구현
 *
 * @example
 * <BooleanField
 *   label="Accept Terms"
 *   model="user.acceptTerms"
 *   type="boolean"
 *   prominence="Standard"
 *   required
 * />
 */

import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';
import { checkboxStyles, fieldWrapperStyles } from '../styles/field.styles';

export interface BooleanFieldProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Data type (always 'boolean')
   */
  type: 'boolean';

  /**
   * Prominence level
   */
  prominence?: Prominence;

  /**
   * Intent (semantic color)
   */
  intent?: Intent;

  /**
   * Density (spacing)
   */
  density?: 'Comfortable' | 'Standard' | 'Compact';

  /**
   * Required field
   */
  required?: boolean;

  /**
   * Controlled value
   */
  value?: boolean;

  /**
   * Change handler
   */
  onChange?: (value: boolean) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export function BooleanField(props: BooleanFieldProps) {
  const {
    label,
    model,
    prominence = 'Standard',
    density = 'Standard',
    required = false,
    value = false,
    onChange,
    className,
    disabled = false,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <div className={cn(fieldWrapperStyles({ density }), className)}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name={model}
          checked={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          className={checkboxStyles({ type: 'checkbox' })}
          data-model={model}
        />
        <span
          className={cn(
            'text-text',
            prominence === 'Hero' && 'text-base font-semibold',
            prominence === 'Standard' && 'text-sm',
            prominence === 'Strong' && 'text-sm font-medium',
            prominence === 'Subtle' && 'text-xs text-muted'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
    </div>
  );
}
