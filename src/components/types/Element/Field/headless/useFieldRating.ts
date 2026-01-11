/**
 * useRatingField - 별점 입력 필드 헤드리스 훅
 *
 * rating 타입에서 사용되는 별점 입력 로직을 제공합니다.
 *
 * 제공 기능:
 * - 별점 값 관리 (1-5점, 커스터마이징 가능)
 * - 호버 미리보기
 * - 키보드 네비게이션 (Arrow Left/Right, Number keys)
 * - ARIA 접근성 자동 설정 (role="radiogroup")
 *
 * @example
 * const field = useRatingField({
 *   model: 'satisfaction',
 *   value: 4,
 *   max: 5,
 *   onChange: setSatisfaction,
 * });
 *
 * <div {...field.getRatingContainerProps()}>
 *   {field.stars.map((star) => (
 *     <button key={star} {...field.getStarProps(star)}>
 *       <Star fill={star <= field.displayValue ? 'gold' : 'none'} />
 *     </button>
 *   ))}
 * </div>
 */

import { type KeyboardEvent, useRef, useState } from 'react';

export interface UseRatingFieldOptions {
  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Controlled value (optional)
   */
  value?: number;

  /**
   * Required field validation
   */
  required?: boolean;

  /**
   * Minimum rating value (default: 1)
   */
  min?: number;

  /**
   * Maximum rating value (default: 5)
   */
  max?: number;

  /**
   * Allow half-star ratings (e.g., 3.5)
   */
  allowHalf?: boolean;

  /**
   * Value change handler
   */
  onChange?: (value: number) => void;

  /**
   * Blur event handler
   */
  onBlur?: () => void;

  /**
   * Focus event handler
   */
  onFocus?: () => void;
}

export interface UseRatingFieldReturn {
  /**
   * Current rating value
   */
  value: number;

  /**
   * Current hover value (for preview)
   */
  hoverValue: number;

  /**
   * Display value (hoverValue || value)
   */
  displayValue: number;

  /**
   * Current error message (null if no error)
   */
  error: string | null;

  /**
   * Array of star indexes [1, 2, 3, 4, 5]
   */
  stars: number[];

  /**
   * Container ref for focus management
   */
  containerRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Props getter for rating container
   */
  getRatingContainerProps: () => {
    ref: React.RefObject<HTMLDivElement | null>;
    role: 'radiogroup';
    'aria-label': string;
    'aria-required'?: boolean;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
    onBlur: () => void;
    onFocus: () => void;
    onMouseLeave: () => void;
    'data-model': string;
  };

  /**
   * Props getter for star button
   */
  getStarProps: (star: number) => {
    role: 'radio';
    'aria-checked': boolean;
    'aria-label': string;
    'aria-setsize': number;
    'aria-posinset': number;
    tabIndex: number;
    onClick: () => void;
    onMouseEnter: () => void;
    'data-value': number;
  };

  /**
   * Set rating value
   */
  setValue: (value: number) => void;

  /**
   * Manual validation trigger
   */
  validate: () => string | null;
}

export function useFieldRating(options: UseRatingFieldOptions): UseRatingFieldReturn {
  const {
    model,
    value: controlledValue,
    required,
    min = 1,
    max = 5,
    allowHalf = false,
    onChange,
    onBlur,
    onFocus,
  } = options;

  // State
  const [internalValue, setInternalValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Controlled vs Uncontrolled
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const isControlled = controlledValue !== undefined;

  // Generate star array [1, 2, 3, 4, 5]
  const stars = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  /**
   * Validate value
   */
  const validate = (val: number): string | null => {
    // Required check
    if (required && val === 0) {
      return 'Please select a rating';
    }

    // Min/Max check
    if (val < min || val > max) {
      return `Rating must be between ${min} and ${max}`;
    }

    return null;
  };

  /**
   * Update value and trigger validation
   */
  const setValue = (newValue: number) => {
    // Clamp to min/max
    const clampedValue = Math.max(min, Math.min(max, newValue));

    if (!isControlled) {
      setInternalValue(clampedValue);
    }

    // Validate only if touched
    if (touched) {
      const validationError = validate(clampedValue);
      setError(validationError);
    }

    // Trigger onChange
    onChange?.(clampedValue);
  };

  /**
   * Handle star click
   */
  const handleStarClick = (star: number) => {
    setValue(star);
  };

  /**
   * Handle star hover
   */
  const handleStarHover = (star: number) => {
    setHoverValue(star);
  };

  /**
   * Handle mouse leave (clear hover)
   */
  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (value > min) setValue(value - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (value < max) setValue(value + 1);
        break;
      case 'Home':
        e.preventDefault();
        setValue(min);
        break;
      case 'End':
        e.preventDefault();
        setValue(max);
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9': {
        e.preventDefault();
        const numValue = parseInt(e.key);
        if (numValue >= min && numValue <= max) {
          setValue(numValue);
        }
        break;
      }
    }
  };

  /**
   * Handle blur (mark as touched, validate)
   */
  const handleBlur = () => {
    setTouched(true);
    const validationError = validate(value);
    setError(validationError);
    onBlur?.();
  };

  /**
   * Handle focus
   */
  const handleFocus = () => {
    onFocus?.();
  };

  /**
   * Get rating container props
   */
  const getRatingContainerProps = () => ({
    ref: containerRef,
    role: 'radiogroup' as const,
    'aria-label': `Rating: ${value} out of ${max} stars`,
    'aria-required': required,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${model}-error` : undefined,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onMouseLeave: handleMouseLeave,
    'data-model': model,
  });

  /**
   * Get star button props
   */
  const getStarProps = (star: number) => ({
    role: 'radio' as const,
    'aria-checked': value === star,
    'aria-label': `${star} ${star === 1 ? 'star' : 'stars'}`,
    'aria-setsize': max - min + 1,
    'aria-posinset': star - min + 1,
    tabIndex: value === star ? 0 : -1,
    onClick: () => handleStarClick(star),
    onMouseEnter: () => handleStarHover(star),
    'data-value': star,
  });

  return {
    value,
    hoverValue,
    displayValue: hoverValue || value,
    error,
    stars,
    containerRef,
    getRatingContainerProps,
    getStarProps,
    setValue,
    validate: () => validate(value),
  };
}
