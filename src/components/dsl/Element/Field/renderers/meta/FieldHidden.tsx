/**
 * HiddenField - 숨겨진 폼 데이터 필드 렌더러
 *
 * IDDL Field Spec: Meta Category - Hidden
 * UI 없음, 폼 제출 시 데이터만 포함
 *
 * @see docs/2-areas/spec/4-element/field/field.spec.md#651-hidden
 *
 * @example
 * <HiddenField
 *   model="userId"
 *   value="12345"
 * />
 */

import type { Intent, Prominence } from '@/components/dsl/Shared.types';

export interface FieldHiddenProps {
  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Hidden field value
   */
  value?: any;

  /**
   * onChange handler (for controlled usage)
   */
  onChange?: (value: any) => void;

  /**
   * Prominence (무의미하지만 일관성을 위해 유지)
   */
  prominence?: Prominence;

  /**
   * Intent (무의미하지만 일관성을 위해 유지)
   */
  intent?: Intent;

  /**
   * Density (무의미하지만 일관성을 위해 유지)
   */
  density?: 'Comfortable' | 'Standard' | 'Compact';

  /**
   * Label (hidden이므로 사용되지 않음)
   */
  label?: string;

  /**
   * className (적용되지 않음)
   */
  className?: string;

  /**
   * required (무의미하지만 일관성을 위해 유지)
   */
  required?: boolean;

  /**
   * disabled (무의미하지만 일관성을 위해 유지)
   */
  disabled?: boolean;
}

/**
 * FieldHidden Component
 *
 * Renders as <input type="hidden">
 * No visible UI, participates in form submission
 */
export function FieldHidden({ model, value, onChange }: FieldHiddenProps) {
  return (
    <input
      type="hidden"
      name={model}
      value={value !== undefined ? String(value) : ''}
      data-model={model}
      // Hidden fields don't need onChange, but support it for controlled usage
      onChange={
        onChange
          ? (e) => {
              onChange(e.target.value);
            }
          : undefined
      }
    />
  );
}
