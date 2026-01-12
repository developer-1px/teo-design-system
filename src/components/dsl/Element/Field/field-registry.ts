/**
 * Field Registry (Static)
 *
 * Statically imports all Field Renderers to ensure tree-shaking
 * and explicit dependency graph.
 */

import type { ComponentType } from 'react';
import type { FieldProps } from './Field.types';
// 2. Choice Category
import { FieldCheckbox } from './renderers/choice/FieldCheckbox';
import { FieldListbox } from './renderers/choice/FieldListbox';
import { FieldRadio } from './renderers/choice/FieldRadio';
import { FieldSelect } from './renderers/choice/FieldSelect';
import { FieldSwitch } from './renderers/choice/FieldSwitch';
// 3. Control Category
import { FieldColorpicker } from './renderers/control/FieldColorpicker';
import { FieldRating } from './renderers/control/FieldRating';
import { FieldOtp } from './renderers/input/FieldOtp';
import { FieldSpinbutton } from './renderers/input/FieldSpinbutton';
import { FieldTextarea } from './renderers/input/FieldTextarea';
// 1. Input Category
import { FieldTextbox } from './renderers/input/FieldTextbox';
// 5. Meta Category
import { FieldHidden } from './renderers/meta/FieldHidden';
import { FieldCalendar } from './renderers/picker/FieldCalendar';
// 4. Picker Category
import { FieldDatepicker } from './renderers/picker/FieldDatepicker';
import { FieldFilepicker } from './renderers/picker/FieldFilepicker';
import { FieldSignature } from './renderers/picker/FieldSignature';

export const FIELD_REGISTRY: Record<string, ComponentType<FieldProps>> = {
  // 1. Input
  Textbox: FieldTextbox,
  Textarea: FieldTextarea as ComponentType<FieldProps>,
  Otp: FieldOtp as ComponentType<FieldProps>,
  Spinbutton: FieldSpinbutton as ComponentType<FieldProps>,

  // 2. Choice
  Checkbox: FieldCheckbox as ComponentType<FieldProps>,
  Switch: FieldSwitch as ComponentType<FieldProps>,
  Radio: FieldRadio as ComponentType<FieldProps>,
  Select: FieldSelect as ComponentType<FieldProps>,
  Combobox: FieldSelect as ComponentType<FieldProps>, // Alias
  Listbox: FieldListbox as ComponentType<FieldProps>,

  // 3. Control
  Colorpicker: FieldColorpicker as ComponentType<FieldProps>,
  Rating: FieldRating as ComponentType<FieldProps>,

  // 4. Picker
  Datepicker: FieldDatepicker as ComponentType<FieldProps>,
  Timepicker: FieldDatepicker as ComponentType<FieldProps>, // Alias
  Filepicker: FieldFilepicker as ComponentType<FieldProps>,
  Signature: FieldSignature as ComponentType<FieldProps>,
  Calendar: FieldCalendar as ComponentType<FieldProps>,

  // 5. Meta
  Hidden: FieldHidden as ComponentType<FieldProps>,
};
