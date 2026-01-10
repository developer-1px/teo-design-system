/**
 * RatingField - 별점 입력 필드 렌더러
 *
 * Headless useRatingField + CVA styles 조합
 * rating 타입을 지원합니다.
 *
 * @example
 * <RatingField
 *   label="Satisfaction"
 *   model="satisfaction"
 *   type="rating"
 *   constraints={{ min: 1, max: 5 }}
 * />
 */

import { Star } from 'lucide-react';
import { useRatingField } from '../headless/useRatingField';
import {
  errorStyles,
  fieldWrapperStyles,
  labelStyles,
} from '../styles/field.styles';
import { ratingContainerStyles, starButtonStyles } from '../styles/rating.styles';
import type { FieldConstraints } from '@/components/types/Element/Field/Field.types';
import type { Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';

export interface RatingFieldProps {
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
  type: 'rating';

  /**
   * Prominence level
   */
  prominence?: Prominence;

  /**
   * Validation constraints (min, max)
   */
  constraints?: FieldConstraints;

  /**
   * Required field
   */
  required?: boolean;

  /**
   * Controlled value
   */
  value?: number;

  /**
   * Change handler
   */
  onChange?: (value: number) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export function RatingField(props: RatingFieldProps) {
  const {
    label,
    model,
    prominence = 'Standard',
    constraints,
    required = false,
    value,
    onChange,
    className,
    disabled = false,
  } = props;

  // Headless logic
  const field = useRatingField({
    model,
    value,
    required,
    min: constraints?.min ?? 1,
    max: constraints?.max ?? 5,
    onChange,
  });

  return (
    <div className={cn(fieldWrapperStyles(), className)}>
      {/* Label */}
      <label className={labelStyles({ prominence, required })}>{label}</label>

      {/* Rating stars */}
      <div {...field.getRatingContainerProps()} className={ratingContainerStyles()}>
        {field.stars.map((star) => (
          <button
            key={star}
            {...field.getStarProps(star)}
            disabled={disabled}
            className={starButtonStyles({
              prominence,
              state: star <= field.displayValue ? 'filled' : star === field.hoverValue ? 'hover' : 'empty',
              disabled,
            })}
          >
            <Star fill={star <= field.displayValue ? 'currentColor' : 'none'} />
          </button>
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
