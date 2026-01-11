/**
 * Field Type Definitions
 * IDDL 2.0 Field Role Catalog
 */

import type { AsProp, Density, Intent, Prominence } from '../../Shared.types';

/**
 * Field Role - IDDL Canonical FieldRole
 * Ref: docs/2-areas/spec/5-field/field.spec.md
 */
export type FieldRole =
  | 'TextInput'
  | 'TextArea'
  | 'NumberInput'
  | 'PasswordInput'
  | 'EmailInput'
  | 'SearchInput'
  | 'Select'
  | 'Combobox'
  | 'Checkbox'
  | 'Switch'
  | 'RadioGroup'
  | 'DateInput'
  | 'TimeInput'
  | 'DateTimeInput'
  | 'FileInput'
  | 'Slider'
  | 'OTPInput'
  | 'TagInput'
  | 'Rating';

export type Option = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

/**
 * Field Spec - Role-dependent configuration
 */
export type FieldSpec =
  | { role: 'TextInput'; inputMode?: 'text' | 'numeric' | 'email' | 'tel' | 'url'; maxLength?: number; pattern?: string }
  | { role: 'TextArea'; rows?: number; maxLength?: number }
  | { role: 'NumberInput'; min?: number; max?: number; step?: number }
  | { role: 'PasswordInput'; revealable?: boolean }
  | { role: 'EmailInput'; autoComplete?: string }
  | { role: 'SearchInput'; clearable?: boolean }
  | { role: 'Select'; options: Option[]; multiple?: boolean }
  | { role: 'Combobox'; options: Option[]; freeSolo?: boolean; filter?: 'contains' | 'startsWith' | 'none' }
  | { role: 'Checkbox'; indeterminate?: boolean }
  | { role: 'Switch' }
  | { role: 'RadioGroup'; options: Option[]; legend?: string }
  | { role: 'DateInput'; min?: string; max?: string }
  | { role: 'TimeInput'; min?: string; max?: string; step?: number }
  | { role: 'DateTimeInput'; min?: string; max?: string }
  | { role: 'FileInput'; accept?: string; multiple?: boolean }
  | { role: 'Slider'; min: number; max: number; step?: number; range?: boolean }
  | { role: 'OTPInput'; length: number; numeric?: boolean }
  | { role: 'TagInput'; suggestions?: Option[]; maxItems?: number }
  | { role: 'Rating'; max: number; step?: number };

/**
 * Field Props
 */
export interface FieldProps extends AsProp {
  // Core
  role: FieldRole;
  spec?: Omit<Extract<FieldSpec, { role: FieldRole }>, 'role'>;

  // Data Definition
  label?: string; // made optional to allow strictly "field" usages if needed, but spec says recommended
  model?: string; // binding key

  // Common
  description?: string; // helper, error, hint
  required?: boolean;
  disabled?: boolean;

  // Styling
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  className?: string;

  // React Controlled (Optional - for direct usage without model binding context)
  value?: any;
  onChange?: (value: any) => void;
  // State from Part 2 (optional for now)
  error?: string;
  placeholder?: string;
}
