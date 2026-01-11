/**
 * FieldCheckbox - 체크박스 그룹 필드 렌더러
 *
 * Headless useFieldCheckbox + CVA styles 조합
 * checkbox 타입을 지원합니다 (options 배열 기반 다중 선택)
 *
 * @example
 * <FieldCheckbox
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

import type { FieldOption } from '@/components/types/Element/Field/Field.types';
import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';
import { useFieldCheckbox } from '../../headless/useFieldCheckbox';
import { useFieldBoolean } from '../../headless/useFieldBoolean';
import {
  checkboxStyles,
  errorStyles,
  fieldWrapperStyles,
  labelStyles,
} from '../../styles/field.styles';

export interface FieldCheckboxProps {
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
   * Available options (if provided, renders as checkbox group)
   */
  options?: FieldOption[];

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

export function FieldCheckbox(props: FieldCheckboxProps) {
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

  // Conditionally use headless hooks
  const isGroup = !!options && options.length > 0;

  const checkboxGroup = useFieldCheckbox({
    model,
    options: options || [],
    value: Array.isArray(value) ? value : [],
    required,
    onChange: (val) => onChange?.(val as any),
  });

  const booleanField = useFieldBoolean({
    model,
    value: typeof value === 'boolean' ? value : !!value,
    required,
    onChange: (val) => onChange?.(val as any),
  });

  return (
    <div className={cn(fieldWrapperStyles({ density }), className)}>
      {/* Label (for group it's a header, for single it's next to the checkbox) */}
      {isGroup && <label className={labelStyles({ prominence, required })}>{label}</label>}

      {/* Checkbox Content */}
      <div className="flex flex-col gap-2">
        {isGroup ? (
          // Group Mode
          checkboxGroup.options.map((opt) => (
            <label key={String(opt.value)} className="flex items-center gap-2 cursor-pointer">
              <input
                {...checkboxGroup.getCheckboxProps(opt.value)}
                disabled={disabled || opt.disabled}
                className={checkboxStyles({ type: 'checkbox' })}
              />
              <span
                className={cn(
                  'text-sm text-text',
                  (disabled || opt.disabled) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {opt.label}
              </span>
            </label>
          ))
        ) : (
          // Single Mode
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...booleanField.getCheckboxProps()}
              disabled={disabled}
              className={checkboxStyles({ type: 'checkbox' })}
            />
            <span
              className={cn(
                'text-text',
                prominence === 'Hero' && 'text-base font-semibold',
                (prominence === 'Standard' || !prominence) && 'text-sm',
                prominence === 'Strong' && 'text-sm font-medium',
                prominence === 'Subtle' && 'text-xs text-muted',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </label>
        )}
      </div>

      {/* Error message */}
      {(isGroup ? checkboxGroup.error : booleanField.error) && (
        <span className={errorStyles()} id={`${model}-error`} role="alert">
          {isGroup ? checkboxGroup.error : booleanField.error}
        </span>
      )}
    </div>
  );
}
