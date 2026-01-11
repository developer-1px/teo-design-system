/**
 * ListboxField - Listbox 필드 렌더러
 *
 * Headless useListboxField + Listbox primitive 조합
 * 항상 보이는 선택 목록
 *
 * IDDL Field Spec: Choice Category - Listbox
 *
 * @example
 * <ListboxField
 *   label="Available Colors"
 *   model="colors"
 *   options={[
 *     { label: 'Red', value: 'red' },
 *     { label: 'Blue', value: 'blue' },
 *   ]}
 *   multiple={true}
 *   prominence="Standard"
 * />
 */

import type { FieldOption } from '@/components/types/Element/Field/Field.types';
import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';
import { useFieldListbox } from '../../headless/useFieldListbox';
import { errorStyles, fieldWrapperStyles, labelStyles } from '../../styles/field.styles';
import { ListboxRole } from './ListboxRole';

export interface FieldListboxProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Available options
   */
  options: FieldOption[];

  /**
   * Allow multiple selection
   */
  multiple?: boolean;

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
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * className
   */
  className?: string;

  /**
   * Controlled value
   */
  value?: string | number | (string | number)[];

  /**
   * onChange callback
   */
  onChange?: (value: string | number | (string | number)[]) => void;
}

/**
 * FieldListbox Component
 */
export function FieldListbox({
  label,
  model,
  options,
  multiple = false,
  prominence,
  intent,
  density,
  required,
  disabled,
  error,
  className,
  value: controlledValue,
  onChange,
}: FieldListboxProps) {
  // Use headless hook
  const listbox = useFieldListbox({
    options: options || [],
    multiple,
    value: controlledValue,
    onChange,
    disabled,
  });

  return (
    <div
      className={cn(
        fieldWrapperStyles({
          prominence: prominence as 'Hero' | 'Standard' | 'Strong' | 'Subtle',
          intent: intent as 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical',
          density: density as 'Comfortable' | 'Standard' | 'Compact',
        }),
        className
      )}
      data-model={model}
    >
      {/* Label */}
      <label
        className={labelStyles({
          prominence: prominence as 'Hero' | 'Standard' | 'Strong' | 'Subtle',
        })}
      >
        {label}
        {required && <span className="text-critical ml-1">*</span>}
      </label>

      {/* Listbox */}
      <ListboxRole
        options={options || []}
        value={listbox.value}
        multiple={multiple}
        disabled={disabled}
        listboxProps={listbox.listboxProps}
        optionProps={listbox.optionProps}
        isSelected={listbox.isSelected}
        focusedIndex={listbox.focusedIndex}
      />

      {/* Error */}
      {error && <p className={errorStyles()}>{error}</p>}
    </div>
  );
}
