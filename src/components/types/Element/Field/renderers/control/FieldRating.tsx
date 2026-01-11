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
import type { FieldConstraints } from '@/components/types/Element/Field/Field.types';
import type { Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';
import { useFieldRating } from '../../headless/useFieldRating';
import { errorStyles, fieldWrapperStyles, labelStyles } from '../../styles/field.styles';
import { ratingContainerStyles, starButtonStyles } from '../../styles/rating.styles';

export interface FieldRatingProps {
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

export function FieldRating(props: FieldRatingProps) {
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
  const field = useFieldRating({
    model,
    value,
    max: constraints?.max ?? 5, // Default to 5 if not set
    min: 1, // Default to 1
    allowHalf: constraints?.step ? constraints.step < 1 : false, // e.g. step 0.5 -> allowHalf true
    onChange: (val) => onChange?.(val),
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
              state:
                star <= field.displayValue
                  ? 'filled'
                  : star === field.hoverValue
                    ? 'hover'
                    : 'empty',
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
