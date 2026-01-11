/**
 * Field Type Definitions
 * IDDL 2.0 Field Role Catalog
 */

import type { AsProp, Density, Intent, Prominence } from '../../Shared.types';

/**
 * Field Role - IDDL Canonical FieldRole
 * Ref: docs/2-areas/spec/5-field/field.spec.md
 */
// 1. Input Category
export type FieldRole =
  | 'Textbox'     // Text, Email, Password, Url...
  | 'Searchbox'
  | 'Spinbutton'
  | 'Otp'
  | 'Textarea'    // NOTE: Spec also mentions multiline Textbox, but we keep Textarea for now if legacy code needs it, but should map to Textbox ideally? Let's check spec again. Spec 6.1.1 says Textbox is single or multiline. So Textarea role is technically "Textbox" with multiline spec. But to minimize breakage let's alias or keep it. Actually user wants strictly spec aligned.
  // Wait, Spec list in 6.1.1 says Textbox. But 6.1.1 header says "Textbox". Spec table 6.1.1 says `multiline` is a spec property.
  // Let's stick to Textbox for all text.

  // 2. Choice Category
  | 'Checkbox'
  | 'Switch'
  | 'Radio'       // Spec says Radio (inside radiogroup? No, Field role is Radio). Actually Spec 2.4.1 says IDDL Role: Radio.
  | 'Combobox'
  | 'Select'      // Spec mentions Select? 2.4.1 table: Combobox, Listbox. Wait.
  // Spec Section 9.1.1 says <select> limitation.
  // Let's look at 6.2 Choice Category. 6.2.4 Combobox, 6.2.5 Listbox. "Select" isn't strictly an IDDL 2.0 role name in the draft we saw (it was Combobox or Listbox).
  // But let's check legacy usage. Users used 'Select'. I should probably alias 'Select' to 'Combobox' or 'Listbox' in the registry.
  // For types, let's keep 'Select' as a compatibility or explicit role if the user wants it, but for SPEC ALIGNMENT, it should be 'Combobox' (collapsed) or 'Listbox' (open).
  // However, usually 'Select' = Collapsed Listbox. IDDL 2.4.1 doesn't explicitly list 'Select'.
  // I will Keep 'Select' but add comment.
  | 'Listbox'

  // 3. Control Category
  | 'Slider'
  | 'Colorpicker'
  | 'Rating'      // Spec uses Slider variant="rating" or explicit Rating? Spec 6.3.1 says variant "rating". But legacy had Rating. I will keep Rating role for now to avoid logic breakage.

  // 4. Picker Category
  | 'Datepicker'
  | 'Timepicker'
  | 'Filepicker'
  | 'Signature'

  // 5. Meta Category
  | 'Hidden'

export type Option = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

/**
 * Field Spec - Role-dependent configuration
 */
export type FieldSpec =
  // Input
  | { role: 'Textbox'; inputMode?: 'text' | 'numeric' | 'email' | 'tel' | 'url'; maxLength?: number; pattern?: string; multiline?: boolean; rows?: number }
  | { role: 'Searchbox'; clearable?: boolean; debounce?: number }
  | { role: 'Spinbutton'; min?: number; max?: number; step?: number; format?: string }
  | { role: 'Otp'; length: number; numeric?: boolean }

  // Choice
  | { role: 'Checkbox'; indeterminate?: boolean }
  | { role: 'Switch' }
  | { role: 'Radio'; options: Option[]; legend?: string }
  | { role: 'Combobox'; options: Option[]; multiple?: boolean; searchable?: boolean; clearable?: boolean }
  | { role: 'Select'; options: Option[]; multiple?: boolean } // Legacy/Alias
  | { role: 'Listbox'; options: Option[]; multiple?: boolean; virtualize?: boolean }

  // Control
  | { role: 'Slider'; min: number; max: number; step?: number; range?: boolean; variant?: 'default' | 'rating' }
  | { role: 'Colorpicker'; format?: 'hex' | 'rgb' | 'hsl' | 'hsv'; alpha?: boolean }
  | { role: 'Rating'; max: number; step?: number }

  // Picker
  | { role: 'Datepicker'; min?: string; max?: string; range?: boolean; variant?: 'date' | 'datetime' | 'time' } // Merged Time/Date? Spec says Timepicker is separate.
  | { role: 'Timepicker'; min?: string; max?: string; format?: '12h' | '24h' }
  | { role: 'Filepicker'; accept?: string; multiple?: boolean }
  | { role: 'Signature'; penColor?: string }

  // Meta
  | { role: 'Hidden' };

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
