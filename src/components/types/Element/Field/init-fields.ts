/**
 * Field Initialization
 *
 * Registers all IDDL Field Renderers into the registry.
 * This should be imported and executed at the app entry point.
 */

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
import { registerField } from './role-registry';

export function registerDefaultFields() {
  // 1. Input
  registerField('Textbox', FieldTextbox);
  registerField('Textarea', FieldTextarea as any);
  registerField('Otp', FieldOtp as any);
  registerField('Spinbutton', FieldSpinbutton as any);

  // 2. Choice
  registerField('Checkbox', FieldCheckbox as any);
  registerField('Switch', FieldSwitch as any);
  registerField('Radio', FieldRadio as any);
  registerField('Select', FieldSelect as any);
  registerField('Combobox', FieldSelect as any);
  registerField('Listbox', FieldListbox as any);

  // 3. Control
  registerField('Colorpicker', FieldColorpicker as any);
  registerField('Rating', FieldRating as any);

  // 4. Picker
  registerField('Datepicker', FieldDatepicker as any);
  registerField('Filepicker', FieldFilepicker as any);
  registerField('Signature', FieldSignature as any);
  registerField('Calendar', FieldCalendar as any);
  registerField('Timepicker', FieldDatepicker as any);

  // 5. Meta
  registerField('Hidden', FieldHidden as any);
}
