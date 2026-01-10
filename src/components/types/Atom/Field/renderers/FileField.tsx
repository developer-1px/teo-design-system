/**
 * FileField - 파일 업로드 필드 렌더러
 *
 * file, image 타입을 지원합니다.
 * Headless hook 없이 간단한 네이티브 file input 사용
 *
 * @example
 * <FileField
 *   label="Profile Picture"
 *   model="user.avatar"
 *   type="image"
 *   prominence="Standard"
 *   required
 * />
 */

import {
  fileInputStyles,
  fieldWrapperStyles,
  labelStyles,
} from '../styles/field.styles';
import type { Intent, Prominence } from '@/components/types/Atom/types';
import { cn } from '@/shared/lib/utils';

export interface FileFieldProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Data type (determines accept attribute)
   */
  type: 'file' | 'image';

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
   * Change handler
   */
  onChange?: (file: File | null) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export function FileField(props: FileFieldProps) {
  const {
    label,
    model,
    type,
    prominence = 'Standard',
    density = 'Standard',
    required = false,
    onChange,
    className,
    disabled = false,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange?.(file);
  };

  return (
    <div className={cn(fieldWrapperStyles({ density }), className)}>
      {/* Label */}
      <label htmlFor={model} className={labelStyles({ prominence, required })}>
        {label}
      </label>

      {/* File Input */}
      <input
        id={model}
        name={model}
        type="file"
        onChange={handleChange}
        required={required}
        disabled={disabled}
        accept={type === 'image' ? 'image/*' : undefined}
        className={fileInputStyles()}
        data-model={model}
      />
    </div>
  );
}
