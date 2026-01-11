import { Block } from '@/components/types/Block/Block';
import { Field } from '@/components/types/Element/Field/Field';
import { Text } from '@/components/types/Element/Text/Text';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';

export function FieldShowcasePage() {
  const categories = [
    { id: 'all', label: 'All Examples' },
    { id: 'single', label: 'Single Value' },
    { id: 'selection', label: 'Selection' },
    { id: 'number', label: 'Number & Range' },
    { id: 'date', label: 'Date & Time' },
    { id: 'file', label: 'File & Others' },
  ];

  return (
    <ShowcasePage
      title="Field Roles"
      subtitle="IDDL 2.0 Spec"
      description="Comprehensive catalog of Field roles defined in IDDL 2.0."
      categories={categories}
      activeCategoryId="all"
      mode="edit"
    >
      {/* 1. Single Value Inputs */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="1. Single Value Inputs" />
          <Text role="Body" prominence="Subtle" content="Standard text-based inputs." />
        </div>

        <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable">
          <Field
            role="TextInput"
            label="Text Input"
            model="demo.text"
            placeholder="Basic text input"
            spec={{ maxLength: 50, pattern: '[A-Za-z]+' }}
          />
          <Field
            role="EmailInput"
            label="Email Input"
            model="demo.email"
            placeholder="user@example.com"
            spec={{ autoComplete: 'email' }}
          />
          <Field
            role="PasswordInput"
            label="Password Input"
            model="demo.password"
            placeholder="••••••••"
            spec={{ revealable: true }}
          />
          <Field
            role="SearchInput"
            label="Search Input"
            model="demo.search"
            placeholder="Search..."
            spec={{ clearable: true }}
          />
          <Field
            role="OTPInput"
            label="OTP Input"
            model="demo.otp"
            placeholder="123456"
            spec={{ length: 6, numeric: true }}
          />
          <Field
            role="TextArea"
            label="Text Area"
            model="demo.textarea"
            placeholder="Multiline text area..."
            spec={{ rows: 4, maxLength: 200 }}
          />
        </Block>
      </Block>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 2. Selection Inputs */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="2. Selection Inputs" />
          <Text role="Body" prominence="Subtle" content="Selection from options." />
        </div>

        <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable" className="items-start">
          <Field
            role="Select"
            label="Select (Single)"
            model="demo.select"
            placeholder="Select an option"
            spec={{
              options: [
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
                { label: 'Option C', value: 'c' },
              ],
            }}
          />
          <Field
            role="Select"
            label="Select (Multiple)"
            model="demo.multiselect"
            placeholder="Select multiple"
            spec={{
              multiple: true,
              options: [
                { label: 'Red', value: 'red' },
                { label: 'Green', value: 'green' },
                { label: 'Blue', value: 'blue' },
              ],
            }}
          />
          <Field
            role="RadioGroup"
            label="Radio Group"
            model="demo.radio"
            defaultValue="b"
            spec={{
              legend: 'Pick one',
              options: [
                { label: 'Choice A', value: 'a' },
                { label: 'Choice B', value: 'b' },
              ],
            }}
          />
          <Field
            role="Checkbox"
            label="Checkbox (Single)"
            model="demo.check"
            defaultValue={true}
            spec={{
              indeterminate: false
            }}
          />
          <Field
            role="Switch"
            label="Switch"
            model="demo.switch"
            defaultValue={false}
            spec={{}}
          />
          <Field
            role="Combobox"
            label="Combobox"
            model="demo.combobox"
            placeholder="Type to search..."
            spec={{
              filter: 'contains',
              freeSolo: true,
              options: [
                { label: 'Apple', value: 'apple' },
                { label: 'Banana', value: 'banana' },
                { label: 'Cherry', value: 'cherry' },
              ]
            }}
          />
        </Block>
      </Block>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 3. Number & Range Inputs */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="3. Number & Range Inputs" />
        </div>

        <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable">
          <Field
            role="NumberInput"
            label="Number Input"
            model="demo.number"
            defaultValue={10}
            spec={{ min: 0, max: 100, step: 5 }}
          />
          <Field
            role="Slider"
            label="Slider"
            model="demo.slider"
            defaultValue={50}
            spec={{ min: 0, max: 100, step: 1, range: false }}
          />
          <Field
            role="Rating"
            label="Rating"
            model="demo.rating"
            defaultValue={3}
            spec={{ max: 5, step: 0.5 }}
          />
        </Block>
      </Block>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 4. Date & Time Inputs */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="4. Date & Time Inputs" />
        </div>

        <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable">
          <Field
            role="DateInput"
            label="Date"
            model="demo.date"
            spec={{}}
          />
          <Field
            role="TimeInput"
            label="Time"
            model="demo.time"
            spec={{}}
          />
          <Field
            role="DateTimeInput"
            label="Date & Time"
            model="demo.datetime"
            spec={{}}
          />
        </Block>
      </Block>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 5. File & Other Inputs */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="5. File & Others" />
        </div>

        <Block role="Grid" spec={{ columns: 2 }} gap={8} density="Comfortable">
          <Field
            role="FileInput"
            label="File Upload"
            model="demo.file"
            spec={{ accept: 'image/*', multiple: false }}
          />
          <Field
            role="TagInput"
            label="Tag Input"
            model="demo.tags"
            placeholder="Add tags..."
            spec={{ maxItems: 5 }}
          />
        </Block>
      </Block>
    </ShowcasePage>
  );
}

