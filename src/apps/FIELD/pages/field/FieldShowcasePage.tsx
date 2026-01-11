import { Block } from '@/components/types/Block/Block';
import { Field } from '@/components/types/Element/Field/Field';
import { Text } from '@/components/types/Element/Text/Text';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';

export function FieldShowcasePage() {
  const categories = [
    { id: 'all', label: 'All Examples' },
    { id: 'input', label: 'Input Category' },
    { id: 'choice', label: 'Choice Category' },
    { id: 'control', label: 'Control Category' },
    { id: 'picker', label: 'Picker Category' },
    { id: 'meta', label: 'Meta Category' },
    { id: 'variants', label: 'Variants' },
  ];

  return (
    <ShowcasePage
      title="IDDL Field Specification"
      subtitle="Complete Field Role Catalog (16 Roles)"
      description="All Field roles defined in docs/2-areas/spec/4-element/field/field.spec.md"
      categories={categories}
      activeCategoryId="all"
      mode="edit"
    >
      {/* ========================================
          1. INPUT CATEGORY
          ======================================== */}
      <Block role="Stack" gap={12}>
        <Block role="Stack" gap={3}>
          <Text
            role="Title"
            prominence="Hero"
            content="1. Input Category"
            className="text-3xl font-bold"
          />
          <Text
            role="Body"
            prominence="Standard"
            content="Keyboard-driven text entry. User types value as primary interaction."
            className="text-base"
          />
        </Block>

        {/* 1.1 Textbox */}
        <Block role="Stack" gap={4} className="mt-8">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="1.1 Textbox" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Single-line or multi-line text input. Supports format variants (email, password, tel, url)."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Textbox"
              label="Text Input (Basic)"
              model="demo.text"
              placeholder="Enter text..."
              spec={{ type: 'text', maxLength: 50 }}
            />
            <Field
              role="Textbox"
              label="Email Input"
              model="demo.email"
              placeholder="user@example.com"
              spec={{ type: 'email', autoComplete: 'email' }}
            />
            <Field
              role="Textbox"
              label="Password Input"
              model="demo.password"
              placeholder="••••••••"
              spec={{ type: 'password', revealable: true }}
            />
            <Field
              role="Textarea"
              label="Text Area (Multiline)"
              model="demo.textarea"
              placeholder="Enter multiline text..."
              spec={{ rows: 4, maxLength: 200 }}
            />
          </Block>
        </Block>

        {/* 1.2 Searchbox */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="1.2 Searchbox" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Text input optimized for search queries with debounce and minChars support."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Textbox"
              label="Search Input"
              model="demo.search"
              placeholder="Search..."
              spec={{ clearable: true }}
            />
          </Block>
        </Block>

        {/* 1.3 Spinbutton */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="1.3 Spinbutton" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Numeric input with increment/decrement controls. Supports format (integer, decimal, currency, percent)."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Spinbutton"
              label="Number Input (Spinbutton)"
              model="demo.number"
              defaultValue={10}
              spec={{ min: 0, max: 100, step: 5 }}
            />
          </Block>
        </Block>

        {/* 1.4 Otp */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="1.4 Otp" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="One-time password / PIN code input. Auto-advance, paste handling, masked option."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Otp"
              label="OTP Input (6-digit)"
              model="demo.otp"
              placeholder="123456"
              spec={{ length: 6, numeric: true }}
            />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* ========================================
          2. CHOICE CATEGORY
          ======================================== */}
      <Block role="Stack" gap={12}>
        <Block role="Stack" gap={3}>
          <Text
            role="Title"
            prominence="Hero"
            content="2. Choice Category"
            className="text-3xl font-bold"
          />
          <Text
            role="Body"
            prominence="Standard"
            content="User selects from options. `items` property REQUIRED (except single Checkbox/Switch)."
            className="text-base"
          />
        </Block>

        {/* 2.1 Checkbox */}
        <Block role="Stack" gap={4} className="mt-8">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="2.1 Checkbox" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Boolean or multi-select control. Single checkbox without items, or checkbox group with items."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Checkbox"
              label="Single Checkbox (Boolean)"
              model="demo.check"
              defaultValue={true}
              spec={{ indeterminate: false }}
            />
          </Block>
        </Block>

        {/* 2.2 Switch */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="2.2 Switch" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Toggle control for on/off states. Semantically distinct from Checkbox - use for immediate-effect toggles."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Switch"
              label="Switch Toggle"
              model="demo.switch"
              defaultValue={false}
              spec={{}}
            />
          </Block>
        </Block>

        {/* 2.3 Radio */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="2.3 Radio" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Single-select from mutually exclusive options. items is REQUIRED. Supports segmented variant."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Radio"
              label="Radio Group"
              model="demo.radio"
              defaultValue="b"
              spec={{
                legend: 'Pick one option',
                options: [
                  { label: 'Choice A', value: 'a' },
                  { label: 'Choice B', value: 'b' },
                  { label: 'Choice C', value: 'c' },
                ],
              }}
            />
          </Block>
        </Block>

        {/* 2.4 Combobox */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="2.4 Combobox" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Dropdown selection with optional search, creatable, multiple, async loading. items REQUIRED."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Combobox"
              label="Combobox (Searchable)"
              model="demo.combobox"
              placeholder="Type to search..."
              spec={{
                filter: 'contains',
                freeSolo: true,
                options: [
                  { label: 'Apple', value: 'apple' },
                  { label: 'Banana', value: 'banana' },
                  { label: 'Cherry', value: 'cherry' },
                  { label: 'Date', value: 'date' },
                  { label: 'Elderberry', value: 'elderberry' },
                ],
              }}
            />
            <Field
              role="Select"
              label="Select (Dropdown - Multiple)"
              model="demo.multiselect"
              placeholder="Select multiple options"
              spec={{
                multiple: true,
                options: [
                  { label: 'Red', value: 'red' },
                  { label: 'Green', value: 'green' },
                  { label: 'Blue', value: 'blue' },
                  { label: 'Yellow', value: 'yellow' },
                ],
              }}
            />
          </Block>
        </Block>

        {/* 2.5 Listbox */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="2.5 Listbox" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Always-visible selection list (not a dropdown). Supports multiple selection, keyboard navigation, virtualization."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Listbox"
              label="Listbox (Always Visible)"
              model="demo.listbox"
              spec={{
                options: [
                  { label: 'Spring', value: 'spring' },
                  { label: 'Summer', value: 'summer' },
                  { label: 'Fall', value: 'fall' },
                  { label: 'Winter', value: 'winter' },
                ],
                multiple: true,
                virtualize: false,
              }}
            />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* ========================================
          3. CONTROL CATEGORY
          ======================================== */}
      <Block role="Stack" gap={12}>
        <Block role="Stack" gap={3}>
          <Text
            role="Title"
            prominence="Hero"
            content="3. Control Category"
            className="text-3xl font-bold"
          />
          <Text
            role="Body"
            prominence="Standard"
            content="User manipulates continuous or discrete value range via pointer interaction (mouse/touch)."
            className="text-base"
          />
        </Block>

        {/* 3.1 Slider */}
        <Block role="Stack" gap={4} className="mt-8">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="3.1 Slider" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Slider for selecting numeric value(s). Supports dual-handle range, marks, orientation, rating variant."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Spinbutton"
              label="Slider (Single Handle)"
              model="demo.slider"
              defaultValue={50}
              spec={{ type: 'range', min: 0, max: 100, step: 1, range: false }}
            />
            <Field
              role="Rating"
              label="Rating (Slider Variant)"
              model="demo.rating"
              defaultValue={3}
              spec={{ max: 5, step: 0.5 }}
            />
          </Block>
        </Block>

        {/* 3.2 Colorpicker */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="3.2 Colorpicker" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Color selection with format (hex/rgb/hsl/hsv), alpha, presets, and variant options (default/compact/swatch-only)."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Colorpicker"
              label="Color Picker (Default)"
              model="demo.color1"
              defaultValue="#3b82f6"
              spec={{
                format: 'hex',
                alpha: false,
                presets: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
                variant: 'default',
              }}
            />
            <Field
              role="Colorpicker"
              label="Color Picker (Compact)"
              model="demo.color2"
              defaultValue="#10b981"
              spec={{
                format: 'hex',
                alpha: false,
                presets: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
                variant: 'compact',
              }}
            />
            <Field
              role="Colorpicker"
              label="Brand Colors (Swatch Only)"
              model="demo.color3"
              defaultValue="#ef4444"
              spec={{
                format: 'hex',
                alpha: false,
                presets: [
                  '#ef4444',
                  '#f97316',
                  '#eab308',
                  '#22c55e',
                  '#3b82f6',
                  '#8b5cf6',
                  '#ec4899',
                  '#6366f1',
                ],
                variant: 'swatch-only',
              }}
            />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* ========================================
          4. PICKER CATEGORY
          ======================================== */}
      <Block role="Stack" gap={12}>
        <Block role="Stack" gap={3}>
          <Text
            role="Title"
            prominence="Hero"
            content="4. Picker Category"
            className="text-3xl font-bold"
          />
          <Text
            role="Body"
            prominence="Standard"
            content="User invokes specialized interface for value selection. Returns structured value appropriate to role."
            className="text-base"
          />
        </Block>

        {/* 4.1 Datepicker */}
        <Block role="Stack" gap={4} className="mt-8">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="4.1 Datepicker" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Date selection with calendar interface. Supports range, variants (date/datetime/month/year/week), min/max, disabled dates."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field role="Datepicker" label="Date Picker" model="demo.date" spec={{ type: 'date' }} />
            <Field role="Datepicker" label="Date & Time Picker" model="demo.datetime" spec={{ type: 'datetime' }} />
          </Block>
        </Block>

        {/* 4.2 Timepicker */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="4.2 Timepicker" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Time selection. Supports format (12h/24h), minute/second step, min/max time constraints."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field role="Datepicker" label="Time Picker" model="demo.time" spec={{ type: 'time' }} />
          </Block>
        </Block>

        {/* 4.3 Filepicker */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="4.3 Filepicker" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="File upload. Supports accept (MIME types), multiple, maxSize, drag-drop, preview, avatar variant."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Filepicker"
              label="File Upload"
              model="demo.file"
              spec={{ accept: 'image/*', multiple: false }}
            />
          </Block>
        </Block>

        {/* 4.4 Signature */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="4.4 Signature" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Signature capture with HTML Canvas. Supports penColor, penWidth, backgroundColor, outputFormat, trimWhitespace."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 1 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Signature"
              label="Your Signature"
              model="demo.signature"
              spec={{
                penColor: '#000000',
                penWidth: 2,
                backgroundColor: '#FFFFFF',
                outputFormat: 'png',
                trimWhitespace: true,
              }}
            />
          </Block>
        </Block>

        {/* 4.5 Calendar */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="4.5 Calendar" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Visual calendar interface for date selection. Useful for scheduling or dashboard filters."
            />
          </Block>

          <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="mt-4">
            <Field
              role="Calendar"
              label="Meeting Date"
              model="demo.meetingDate"
              defaultValue="2026-01-11"
              spec={{}}
            />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* ========================================
          5. META CATEGORY
          ======================================== */}
      <Block role="Stack" gap={12}>
        <Block role="Stack" gap={3}>
          <Text
            role="Title"
            prominence="Hero"
            content="5. Meta Category"
            className="text-3xl font-bold"
          />
          <Text
            role="Body"
            prominence="Standard"
            content="No visible UI. Participates in form submission but not rendered to user."
            className="text-base"
          />
        </Block>

        {/* 5.1 Hidden */}
        <Block role="Stack" gap={4} className="mt-8">
          <Block role="Stack" gap={1}>
            <Text role="Title" prominence="Strong" content="5.1 Hidden" className="text-xl font-semibold" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Non-visible field for form data. Renders as <input type='hidden'>. No spec options."
            />
          </Block>

          <Block role="Card" className="p-6 bg-layer-2 mt-4" gap={4}>
            <Text role="Label" prominence="Strong" content="Hidden Field Example" />
            <Text
              role="Body"
              prominence="Subtle"
              content="Hidden fields have no visible UI. Inspect DevTools to see the hidden input element below:"
            />
            <Field role="Hidden" model="demo.userId" value="12345" />
            <code className="text-xs text-muted font-mono bg-layer-1 px-3 py-2 rounded border border-border">
              {'<Field role="Hidden" model="demo.userId" value="12345" />'}
            </code>
            <Text role="Body" prominence="Subtle" content="👆 Check browser DevTools to see the hidden input" />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* ========================================
          6. PROMINENCE & INTENT VARIANTS
          ======================================== */}
      <Block role="Stack" gap={12}>
        <Block role="Stack" gap={3}>
          <Text
            role="Title"
            prominence="Hero"
            content="6. Prominence & Intent Variants"
            className="text-3xl font-bold"
          />
          <Text
            role="Body"
            prominence="Standard"
            content="All Fields support prominence and intent props for visual hierarchy and semantic meaning."
            className="text-base"
          />
        </Block>

        {/* Prominence variants */}
        <Block role="Stack" gap={4} className="mt-8">
          <Block role="Stack" gap={1}>
            <Text
              role="Title"
              prominence="Strong"
              content="Prominence Levels"
              className="text-xl font-semibold"
            />
            <Text
              role="Body"
              prominence="Subtle"
              content="Hero → Standard → Strong → Subtle"
            />
          </Block>

          <Block role="Stack" gap={6} className="mt-4">
            <Field
              role="Textbox"
              label="Hero Prominence"
              model="demo.prominence1"
              placeholder="Hero level input"
              prominence="Hero"
            />
            <Field
              role="Textbox"
              label="Standard Prominence (Default)"
              model="demo.prominence2"
              placeholder="Standard level input"
              prominence="Standard"
            />
            <Field
              role="Textbox"
              label="Strong Prominence"
              model="demo.prominence3"
              placeholder="Strong level input"
              prominence="Strong"
            />
            <Field
              role="Textbox"
              label="Subtle Prominence"
              model="demo.prominence4"
              placeholder="Subtle level input"
              prominence="Subtle"
            />
          </Block>
        </Block>

        {/* Intent variants */}
        <Block role="Stack" gap={4} className="mt-12">
          <Block role="Stack" gap={1}>
            <Text
              role="Title"
              prominence="Strong"
              content="Intent Colors"
              className="text-xl font-semibold"
            />
            <Text
              role="Body"
              prominence="Subtle"
              content="Neutral → Brand → Positive → Caution → Critical"
            />
          </Block>

          <Block role="Stack" gap={6} className="mt-4">
            <Field
              role="Textbox"
              label="Neutral Intent (Default)"
              model="demo.intent1"
              placeholder="Neutral"
              intent="Neutral"
            />
            <Field
              role="Textbox"
              label="Brand Intent"
              model="demo.intent2"
              placeholder="Brand color"
              intent="Brand"
            />
            <Field
              role="Textbox"
              label="Positive Intent (Success)"
              model="demo.intent3"
              placeholder="Success"
              intent="Positive"
            />
            <Field
              role="Textbox"
              label="Caution Intent (Warning)"
              model="demo.intent4"
              placeholder="Warning"
              intent="Caution"
              error="This is a warning message"
            />
            <Field
              role="Textbox"
              label="Critical Intent (Error)"
              model="demo.intent5"
              placeholder="Error"
              intent="Critical"
              error="This field has an error"
            />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* ========================================
          7. DENSITY VARIANTS
          ======================================== */}
      <Block role="Stack" gap={12}>
        <Block role="Stack" gap={3}>
          <Text
            role="Title"
            prominence="Hero"
            content="7. Density Variants"
            className="text-3xl font-bold"
          />
          <Text
            role="Body"
            prominence="Standard"
            content="Control spacing with density prop: Comfortable → Standard → Compact"
            className="text-base"
          />
        </Block>

        <Block role="Grid" spec={{ columns: 3 }} gap={12} density="Comfortable" className="mt-8">
          <Field
            role="Textbox"
            label="Comfortable Density"
            model="demo.density1"
            placeholder="More spacious"
            density="Comfortable"
          />
          <Field
            role="Textbox"
            label="Standard Density (Default)"
            model="demo.density2"
            placeholder="Normal spacing"
            density="Standard"
          />
          <Field
            role="Textbox"
            label="Compact Density"
            model="demo.density3"
            placeholder="Tight spacing"
            density="Compact"
          />
        </Block>
      </Block>
    </ShowcasePage>
  );
}
