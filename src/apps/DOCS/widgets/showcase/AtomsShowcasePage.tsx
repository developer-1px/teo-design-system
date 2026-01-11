import { useState } from 'react';
import { Block } from '@/components/types/Block/Block.tsx';
import { Action } from '@/components/types/Element/Action/Action';
import { Field, type FieldOption } from '@/components/types/Element/Field/Field';
import { Text } from '@/components/types/Element/Text/Text';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';

export function AtomsShowcasePage() {
  // Form state for all field types
  const [formData, setFormData] = useState<Record<string, any>>({
    text: 'Sample text',
    number: 42,
    currency: 50000,
    date: '2025-01-09',
    datetime: '2025-01-09T14:30',
    boolean: true,
    select: 'option2',
    multiselect: ['option1', 'option3'],
    radio: 'medium',
    checkbox: ['feature1', 'feature2'],
    textarea: 'Multiple\nlines\nof text',
    richtext: '**Bold** text with *formatting*',
    password: 'secret123',
    email: 'user@example.com',
    url: 'https://example.com',
    phone: '010-1234-5678',
    color: '#3b82f6',
    rating: 4,
    range: 75,
  });

  const selectOptions: FieldOption[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const radioOptions: FieldOption[] = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];

  const checkboxOptions: FieldOption[] = [
    { label: 'Feature 1', value: 'feature1' },
    { label: 'Feature 2', value: 'feature2' },
    { label: 'Feature 3', value: 'feature3' },
  ];

  const categories = [
    { id: 'text', label: '1. Text Components' },
    { id: 'action', label: '2. Action Components' },
    { id: 'field-view', label: '3. Field (View)' },
    { id: 'field-edit', label: '4. Field (Edit)' },
    { id: 'debug', label: '5. State Debug' },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ShowcasePage
      title="Atoms Showcase"
      subtitle="IDDL 1.0.1 Specification Reference"
      description="IDDL 1.0.1 명세를 준수하는 모든 atoms 컴포넌트 데모"
      categories={categories}
      activeCategoryId="text"
    >
      <Block role="Stack" gap={8}>
        {/* 1. Text Component Showcase */}
        <Block role="Stack" gap={4} id="text">
          <Block role="Card" gap={4}>
            <Text role="Title" content="1. Text Component (5 Roles)" prominence="Standard" />
            <Block role="Stack" gap={4} className="p-4 rounded-lg bg-surface-sunken">
              <Text role="Title" content="Title Role" prominence="Standard" />
              <Text role="Body" content="Body role for paragraphs and main content" />
              <Text role="Label" content="Label role for form labels and small text" />
              <Text role="Caption" content="Caption role for metadata and secondary info" />
              <Text role="Code" content="Code role for inline code" />
            </Block>

            <Text role="Title" content="Intent Colors" prominence="Standard" className="mt-4" />
            <Block role="Stack" gap={2} className="p-4 rounded-lg bg-surface-sunken">
              <Text role="Body" content="Neutral (default)" intent="Neutral" />
              <Text role="Body" content="Brand (accent color)" intent="Brand" />
              <Text role="Body" content="Positive (success/green)" intent="Positive" />
              <Text role="Body" content="Caution (warning/yellow)" intent="Caution" />
              <Text role="Body" content="Critical (danger/red)" intent="Critical" />
              <Text role="Body" content="Info (blue)" intent="Info" />
            </Block>
          </Block>
        </Block>

        <Block role="Divider" />

        {/* 2. Action Component Showcase */}
        <Block role="Stack" gap={4} id="action">
          <Block role="Card" gap={4}>
            <Text role="Title" content="2. Action Component (7 Behaviors)" prominence="Standard" />

            <Block role="Stack" gap={4} className="p-4 rounded-lg bg-surface-sunken">
              <Block role="Stack" gap={2}>
                <Text role="Label" content="Command Behavior" prominence="Standard" />
                <Block role="Row" gap={2}>
                  <Action
                    label="Execute Command"
                    behavior={{ action: 'command', command: 'test.command', args: { id: 1 } }}
                    prominence="Standard"
                    intent="Brand"
                  />
                  <Action
                    label="With Confirm"
                    behavior={{ action: 'command', command: 'delete.item' }}
                    prominence="Standard"
                    intent="Critical"
                    confirm="Are you sure?"
                  />
                </Block>
              </Block>

              <Block role="Stack" gap={2}>
                <Text role="Label" content="Navigate Behavior" prominence="Standard" />
                <Block role="Row" gap={2}>
                  <Action label="Internal Link" behavior={{ action: 'navigate', to: '#section' }} />
                  <Action
                    label="External Link"
                    behavior={{ action: 'navigate', to: 'https://example.com', target: '_blank' }}
                    intent="Info"
                  />
                </Block>
              </Block>

              <Block role="Stack" gap={2}>
                <Text role="Label" content="Form Behaviors" prominence="Standard" />
                <Block role="Row" gap={2}>
                  <Action
                    label="Submit Form"
                    behavior={{ action: 'submit' }}
                    prominence="Standard"
                    intent="Brand"
                  />
                  <Action
                    label="Reset Form"
                    behavior={{ action: 'reset' }}
                    prominence="Standard"
                  />
                </Block>
              </Block>

              <Block role="Stack" gap={2}>
                <Text role="Label" content="Overlay Behaviors" prominence="Standard" />
                <Block role="Row" gap={2}>
                  <Action
                    label="Open Modal"
                    behavior={{ action: 'open', overlay: 'my-modal' }}
                    prominence="Standard"
                  />
                  <Action
                    label="Close Modal"
                    behavior={{ action: 'close', overlay: 'my-modal' }}
                    prominence="Standard"
                  />
                  <Action
                    label="Toggle Panel"
                    behavior={{ action: 'toggle', target: 'side-panel' }}
                  />
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>

        <Block role="Divider" />

        {/* 3. Field Component Showcase - View Mode */}
        <Block role="Stack" mode="view" gap={4} id="field-view">
          <Block role="Card" gap={4}>
            <Text
              role="Title"
              content="3. Field Component - View Mode (21 DataTypes)"
              prominence="Standard"
            />

            <Block role="Grid" spec={{ columns: 2 }} gap={4} className="p-4 rounded-lg bg-surface-sunken">
              <Field label="Text" model="text" type="text" value={formData.text} />
              <Field label="Number" model="number" type="number" value={formData.number} />
              <Field label="Currency" model="currency" type="currency" value={formData.currency} />
              <Field label="Date" model="date" type="date" value={formData.date} />
              <Field label="DateTime" model="datetime" type="datetime" value={formData.datetime} />
              <Field label="Boolean" model="boolean" type="boolean" value={formData.boolean} />
              <Field
                label="Select"
                model="select"
                type="select"
                value={formData.select}
                options={selectOptions}
              />
              <Field
                label="Multiselect"
                model="multiselect"
                type="multiselect"
                value={formData.multiselect}
                options={selectOptions}
              />
              <Field
                label="Radio"
                model="radio"
                type="radio"
                value={formData.radio}
                options={radioOptions}
              />
              <Field
                label="Checkbox"
                model="checkbox"
                type="checkbox"
                value={formData.checkbox}
                options={checkboxOptions}
              />
              <Field label="Email" model="email" type="email" value={formData.email} />
              <Field label="URL" model="url" type="url" value={formData.url} />
              <Field label="Phone" model="phone" type="phone" value={formData.phone} />
              <Field label="Color" model="color" type="color" value={formData.color} />
              <Field label="Rating" model="rating" type="rating" value={formData.rating} />
              <Field
                label="Range"
                model="range"
                type="range"
                value={formData.range}
                constraints={{ min: 0, max: 100 }}
              />
            </Block>

            <Block role="Stack" gap={4} className="p-4 rounded-lg mt-4">
              <Field label="Textarea" model="textarea" type="textarea" value={formData.textarea} />
              <Field label="Password" model="password" type="password" value="********" />
            </Block>
          </Block>
        </Block>

        <Block role="Divider" />

        {/* 4. Field Component Showcase - Edit Mode */}
        <Block role="Stack" mode="edit" gap={4} id="field-edit">
          <Block role="Card" gap={4}>
            <Text role="Title" content="4. Field Component - Edit Mode" prominence="Standard" />

            <Block role="Grid" spec={{ columns: 2 }} gap={4} className="p-4 rounded-lg bg-surface-sunken">
              <Field
                label="Text"
                model="text"
                type="text"
                value={formData.text}
                onChange={(v) => handleChange('text', v)}
                placeholder="Enter text"
              />
              <Field
                label="Number"
                model="number"
                type="number"
                value={formData.number}
                onChange={(v) => handleChange('number', v)}
                constraints={{ min: 0, max: 100 }}
              />
              <Field
                label="Currency"
                model="currency"
                type="currency"
                value={formData.currency}
                onChange={(v) => handleChange('currency', v)}
                required
              />
              <Field
                label="Date"
                model="date"
                type="date"
                value={formData.date}
                onChange={(v) => handleChange('date', v)}
              />
              <Field
                label="DateTime"
                model="datetime"
                type="datetime"
                value={formData.datetime}
                onChange={(v) => handleChange('datetime', v)}
              />
              <Field
                label="Boolean"
                model="boolean"
                type="boolean"
                value={formData.boolean}
                onChange={(v) => handleChange('boolean', v)}
              />
              <Field
                label="Select"
                model="select"
                type="select"
                value={formData.select}
                onChange={(v) => handleChange('select', v)}
                options={selectOptions}
              />
              <Field
                label="Email"
                model="email"
                type="email"
                value={formData.email}
                onChange={(v) => handleChange('email', v)}
                placeholder="user@example.com"
              />
              <Field
                label="URL"
                model="url"
                type="url"
                value={formData.url}
                onChange={(v) => handleChange('url', v)}
              />
              <Field
                label="Phone"
                model="phone"
                type="phone"
                value={formData.phone}
                onChange={(v) => handleChange('phone', v)}
              />
              <Field
                label="Color"
                model="color"
                type="color"
                value={formData.color}
                onChange={(v) => handleChange('color', v)}
              />
              <Field
                label="Password"
                model="password"
                type="password"
                value={formData.password}
                onChange={(v) => handleChange('password', v)}
                constraints={{ minLength: 8 }}
              />
            </Block>

            <Block role="Stack" gap={4} className="p-4 rounded-lg mt-4">
              <Field
                label="Radio Block"
                model="radio"
                type="radio"
                value={formData.radio}
                onChange={(v) => handleChange('radio', v)}
                options={radioOptions}
              />
              <Field
                label="Checkbox Block"
                model="checkbox"
                type="checkbox"
                value={formData.checkbox}
                onChange={(v) => handleChange('checkbox', v)}
                options={checkboxOptions}
              />
              <Field
                label="Textarea"
                model="textarea"
                type="textarea"
                value={formData.textarea}
                onChange={(v) => handleChange('textarea', v)}
                placeholder="Enter multiple lines..."
              />
              <Field
                label="Rating"
                model="rating"
                type="rating"
                value={formData.rating}
                onChange={(v) => handleChange('rating', v)}
              />
              <Field
                label="Range Slider"
                model="range"
                type="range"
                value={formData.range}
                onChange={(v) => handleChange('range', v)}
                constraints={{ min: 0, max: 100 }}
              />
            </Block>
          </Block>
        </Block>

        <Block role="Divider" />

        {/* Form State Debug */}
        <Block role="Stack" gap={4} id="debug">
          <Block role="Card" gap={4}>
            <Text role="Title" content="5. Live Form State (Debug)" prominence="Standard" />
            <pre className="bg-surface-sunken p-4 rounded-lg text-xs overflow-auto max-h-96">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </Block>
        </Block>
      </Block>
    </ShowcasePage>
  );
}
