/**
 * ColorField - 색상 선택 필드 렌더러
 *
 * color 타입을 지원합니다.
 * Headless hook 없이 간단한 네이티브 color picker 사용
 *
 * @example
 * <ColorField
 *   label="Brand Color"
 *   model="theme.primaryColor"
 *   type="color"
 *   prominence="Standard"
 * />
 */

import {
  colorInputStyles,
  fieldWrapperStyles,
  labelStyles,
} from '../styles/field.styles';
import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';

export interface ColorFieldProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Data type (always 'color')
   */
  type: 'color';

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
   * Controlled value (hex color)
   */
  value?: string;

  /**
   * Change handler
   */
  onChange?: (value: string) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export function ColorField(props: ColorFieldProps) {
  const {
    label,
    model,
    prominence = 'Standard',
    density = 'Standard',
    required = false,
    value = '#000000',
    onChange,
    className,
    disabled = false,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={cn(fieldWrapperStyles({ density }), className)}>
      {/* Label */}
      <label htmlFor={model} className={labelStyles({ prominence, required })}>
        {label}
      </label>

      {/* Color Input */}
      <input
        id={model}
        name={model}
        type="color"
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={colorInputStyles()}
        data-model={model}
      />
    </div>
  );
}
