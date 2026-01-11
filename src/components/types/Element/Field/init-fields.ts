/**
 * Field Initialization
 *
 * Registers all IDDL Field Renderers into the registry.
 * This should be imported and executed at the app entry point.
 */

import { registerField } from './registry';

// 1. Input Category
import { FieldTextbox } from './renderers/input/FieldTextbox';
import { FieldTextarea } from './renderers/input/FieldTextarea';
import { FieldOtp } from './renderers/input/FieldOtp';
import { FieldSpinbutton } from './renderers/input/FieldSpinbutton';

// 2. Choice Category
import { FieldCheckbox } from './renderers/choice/FieldCheckbox';
import { FieldSwitch } from './renderers/choice/FieldSwitch';
import { FieldRadio } from './renderers/choice/FieldRadio';
import { FieldSelect } from './renderers/choice/FieldSelect';
import { FieldListbox } from './renderers/choice/FieldListbox';

// 3. Control Category
import { FieldColorpicker } from './renderers/control/FieldColorpicker';
import { FieldRating } from './renderers/control/FieldRating';

// 4. Picker Category
import { FieldDatepicker } from './renderers/picker/FieldDatepicker';
import { FieldFilepicker } from './renderers/picker/FieldFilepicker';
import { FieldSignature } from './renderers/picker/FieldSignature';
import { FieldCalendar } from './renderers/picker/FieldCalendar';

// 5. Meta Category
import { FieldHidden } from './renderers/meta/FieldHidden';

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
