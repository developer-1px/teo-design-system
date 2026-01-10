/**
 * TextareaField - 텍스트 영역 필드 렌더러
 *
 * Headless useTextareaField + CVA styles 조합
 * textarea, richtext 타입을 지원합니다.
 * (richtext는 향후 리치 텍스트 에디터 통합 예정)
 *
 * @example
 * <TextareaField
 *   label="Description"
 *   model="product.description"
 *   type="textarea"
 *   prominence="Standard"
 *   required
 *   constraints={{ minLength: 10, maxLength: 500 }}
 * />
 */

import type { FieldConstraints } from '@/components/types/Element/Field/Field.types';
import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';
import { useTextareaField } from '../headless/useTextareaField';
import {
  errorStyles,
  fieldWrapperStyles,
  labelStyles,
  textareaStyles,
} from '../styles/field.styles';

export interface TextareaFieldProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Data type
   */
  type: 'textarea' | 'richtext';

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
   * Validation constraints
   */
  constraints?: FieldConstraints;

  /**
   * Required field
   */
  required?: boolean;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Number of visible text rows
   */
  rows?: number;

  /**
   * Controlled value
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

export function TextareaField(props: TextareaFieldProps) {
  const {
    label,
    model,
    type,
    prominence = 'Standard',
    intent = 'Neutral',
    density = 'Standard',
    constraints,
    required = false,
    placeholder,
    rows = 4,
    value,
    onChange,
    className,
    disabled = false,
  } = props;

  // Headless logic
  const field = useTextareaField({
    model,
    value,
    required,
    constraints,
    rows,
    onChange,
  });

  // richtext 타입은 향후 리치 텍스트 에디터 통합 예정
  const isRichtext = type === 'richtext';

  return (
    <div className={cn(fieldWrapperStyles({ density }), className)}>
      {/* Label */}
      <label htmlFor={model} className={labelStyles({ prominence, required })}>
        {label}
      </label>

      {/* Textarea */}
      <textarea
        {...field.getTextareaProps()}
        id={model}
        placeholder={placeholder || (isRichtext ? 'Rich text editor (placeholder)' : undefined)}
        disabled={disabled}
        className={textareaStyles({
          prominence,
          density,
          intent,
          error: !!field.error,
          dataType: type,
        })}
      />

      {/* Character count */}
      {constraints?.maxLength && (
        <div className="flex justify-between text-xs text-subtle">
          <span>
            {field.characterCount.current} / {field.characterCount.max}
          </span>
          <span>{field.characterCount.percentage}%</span>
        </div>
      )}

      {/* Error message */}
      {field.error && (
        <span className={errorStyles()} id={`${model}-error`} role="alert">
          {field.error}
        </span>
      )}

      {/* Helper text (pattern message) */}
      {constraints?.patternMessage && !field.error && (
        <span className="text-xs text-subtle">{constraints.patternMessage}</span>
      )}

      {/* TODO note for richtext */}
      {isRichtext && (
        <p className="text-xs text-subtle">
          TODO: Rich text editor integration (TipTap, Lexical, or Slate)
        </p>
      )}
    </div>
  );
}
