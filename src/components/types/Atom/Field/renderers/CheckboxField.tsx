/**
 * CheckboxField - 체크박스 그룹 필드 렌더러
 *
 * Headless useCheckboxField + CVA styles 조합
 * checkbox 타입을 지원합니다 (options 배열 기반 다중 선택)
 *
 * @example
 * <CheckboxField
 *   label="Interests"
 *   model="user.interests"
 *   type="checkbox"
 *   options={[
 *     { label: 'Sports', value: 'sports' },
 *     { label: 'Music', value: 'music' },
 *   ]}
 *   prominence="Standard"
 *   required
 * />
 */

import { useCheckboxField } from '../headless/useCheckboxField';
import {
  checkboxStyles,
  errorStyles,
  fieldWrapperStyles,
  labelStyles,
} from '../styles/field.styles';
import type { FieldOption, Intent, Prominence } from '@/components/types/Atom/types';
import { cn } from '@/shared/lib/utils';

export interface CheckboxFieldProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Data type (always 'checkbox')
   */
  type: 'checkbox';

  /**
   * Available options
   */
  options: FieldOption[];

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
   * Required field (at least one must be selected)
   */
  required?: boolean;

  /**
   * Controlled value (selected values)
   */
  value?: Array<string | number | boolean>;

  /**
   * Change handler
   */
  onChange?: (value: Array<string | number | boolean>) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export function CheckboxField(props: CheckboxFieldProps) {
  const {
    label,
    model,
    options,
    prominence = 'Standard',
    density = 'Standard',
    required = false,
    value,
    onChange,
    className,
    disabled = false,
  } = props;

  // Headless logic
  const field = useCheckboxField({
    model,
    options,
    value,
    required,
    onChange,
  });

  return (
    <div className={cn(fieldWrapperStyles({ density }), className)}>
      {/* Label */}
      <label className={labelStyles({ prominence, required })}>
        {label}
      </label>

      {/* Checkbox Block */}
      <div className="flex flex-col gap-2">
        {field.options.map((opt) => (
          <label
            key={String(opt.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              {...field.getCheckboxProps(opt.value)}
              disabled={disabled || opt.disabled}
              className={checkboxStyles({ type: 'checkbox' })}
            />
            <span className={cn(
              'text-sm text-text',
              (disabled || opt.disabled) && 'opacity-50 cursor-not-allowed'
            )}>
              {opt.label}
            </span>
          </label>
        ))}
      </div>

      {/* Error message */}
      {field.error && (
        <span className={errorStyles()} id={`${model}-error`} role="alert">
          {field.error}
        </span>
      )}
    </div>
  );
}
