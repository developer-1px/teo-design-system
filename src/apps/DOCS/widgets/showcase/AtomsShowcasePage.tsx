/**
 * Atoms Showcase Page
 *
 * IDDL 1.0.1 준수 atoms 컴포넌트 전체 데모
 * - Text (5 roles)
 * - Field (21 dataTypes)
 * - Action (7 behaviors)
 */

import { useState } from 'react';
import { Section } from '@/components/Section/Section.tsx';
import { Group } from '@/components/Group/Group.tsx';
import { Text } from '@/components/Text/Text';
import { Field, type FieldOption } from '@/components/Field/Field';
import { Action } from '@/components/Action/Action';

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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Section role="Container" prominence="Tertiary" className="min-h-screen p-8">
      {/* Header */}
      <Section role="Header" className="mb-8">
        <Group role="Container">
          <Text role="Title" content="Atoms Showcase" prominence="Hero" />
          <Text
            role="Body"
            content="IDDL 1.0.1 명세를 준수하는 모든 atoms 컴포넌트 데모"
            prominence="Secondary"
          />
        </Group>
      </Section>

      {/* Text Component Showcase */}
      <Section role="Container" className="mb-12">
        <Group role="Card">
          <Text role="Title" content="1. Text Component (5 Roles)" prominence="Primary" />
          <Section role="Container" prominence="Tertiary" className="gap-4 p-4 rounded-lg">
            <Text role="Title" content="Title Role" prominence="Primary" />
            <Text role="Body" content="Body role for paragraphs and main content" />
            <Text role="Label" content="Label role for form labels and small text" />
            <Text role="Caption" content="Caption role for metadata and secondary info" />
            <Text role="Code" content="Code role for inline code" />
          </Section>

          <Text role="Title" content="Intent Colors" prominence="Secondary" className="mt-4" />
          <Section role="Container" prominence="Tertiary" className="gap-2 p-4 rounded-lg">
            <Text role="Body" content="Neutral (default)" intent="Neutral" />
            <Text role="Body" content="Brand (accent color)" intent="Brand" />
            <Text role="Body" content="Positive (success/green)" intent="Positive" />
            <Text role="Body" content="Caution (warning/yellow)" intent="Caution" />
            <Text role="Body" content="Critical (danger/red)" intent="Critical" />
            <Text role="Body" content="Info (blue)" intent="Info" />
          </Section>
        </Group>
      </Section>

      {/* Action Component Showcase */}
      <Section role="Container" className="mb-12">
        <Group role="Card">
          <Text role="Title" content="2. Action Component (7 Behaviors)" prominence="Primary" />

          <Section role="Container" prominence="Tertiary" className="gap-4 p-4 rounded-lg">
            <div>
              <Text role="Label" content="Command Behavior" prominence="Secondary" />
              <div className="flex gap-2 mt-2">
                <Action
                  label="Execute Command"
                  behavior={{ action: 'command', command: 'test.command', args: { id: 1 } }}
                  prominence="Primary"
                  intent="Brand"
                />
                <Action
                  label="With Confirm"
                  behavior={{ action: 'command', command: 'delete.item' }}
                  prominence="Secondary"
                  intent="Critical"
                  confirm="Are you sure?"
                />
              </div>
            </div>

            <div>
              <Text role="Label" content="Navigate Behavior" prominence="Secondary" />
              <div className="flex gap-2 mt-2">
                <Action
                  label="Internal Link"
                  behavior={{ action: 'navigate', to: '#section' }}
                  prominence="Tertiary"
                />
                <Action
                  label="External Link"
                  behavior={{ action: 'navigate', to: 'https://example.com', target: '_blank' }}
                  prominence="Tertiary"
                  intent="Info"
                />
              </div>
            </div>

            <div>
              <Text role="Label" content="Form Behaviors" prominence="Secondary" />
              <form className="flex gap-2 mt-2">
                <Action
                  label="Submit Form"
                  behavior={{ action: 'submit' }}
                  prominence="Primary"
                  intent="Brand"
                />
                <Action
                  label="Reset Form"
                  behavior={{ action: 'reset' }}
                  prominence="Secondary"
                />
              </form>
            </div>

            <div>
              <Text role="Label" content="Overlay Behaviors" prominence="Secondary" />
              <div className="flex gap-2 mt-2">
                <Action
                  label="Open Modal"
                  behavior={{ action: 'open', overlay: 'my-modal' }}
                  prominence="Secondary"
                />
                <Action
                  label="Close Modal"
                  behavior={{ action: 'close', overlay: 'my-modal' }}
                  prominence="Secondary"
                />
                <Action
                  label="Toggle Panel"
                  behavior={{ action: 'toggle', target: 'side-panel' }}
                  prominence="Tertiary"
                />
              </div>
            </div>
          </Section>
        </Group>
      </Section>

      {/* Field Component Showcase - View Mode */}
      <Section role="Container" mode="view" className="mb-12">
        <Group role="Card">
          <Text role="Title" content="3. Field Component - View Mode (21 DataTypes)" prominence="Primary" />

          <Section role="Container" prominence="Tertiary" className="gap-4 p-4 rounded-lg grid-cols-2">
            <Field label="Text" model="text" dataType="text" value={formData.text} />
            <Field label="Number" model="number" dataType="number" value={formData.number} />
            <Field label="Currency" model="currency" dataType="currency" value={formData.currency} />
            <Field label="Date" model="date" dataType="date" value={formData.date} />
            <Field label="DateTime" model="datetime" dataType="datetime" value={formData.datetime} />
            <Field label="Boolean" model="boolean" dataType="boolean" value={formData.boolean} />
            <Field label="Select" model="select" dataType="select" value={formData.select} options={selectOptions} />
            <Field label="Multiselect" model="multiselect" dataType="multiselect" value={formData.multiselect} options={selectOptions} />
            <Field label="Radio" model="radio" dataType="radio" value={formData.radio} options={radioOptions} />
            <Field label="Checkbox" model="checkbox" dataType="checkbox" value={formData.checkbox} options={checkboxOptions} />
            <Field label="Email" model="email" dataType="email" value={formData.email} />
            <Field label="URL" model="url" dataType="url" value={formData.url} />
            <Field label="Phone" model="phone" dataType="phone" value={formData.phone} />
            <Field label="Color" model="color" dataType="color" value={formData.color} />
            <Field label="Rating" model="rating" dataType="rating" value={formData.rating} />
            <Field label="Range" model="range" dataType="range" value={formData.range} constraints={{ min: 0, max: 100 }} />
          </Section>

          <Section role="Container" prominence="Tertiary" className="gap-4 p-4 rounded-lg mt-4">
            <Field label="Textarea" model="textarea" dataType="textarea" value={formData.textarea} />
            <Field label="Password" model="password" dataType="password" value="********" />
          </Section>
        </Group>
      </Section>

      {/* Field Component Showcase - Edit Mode */}
      <Section role="Container" mode="edit" className="mb-12">
        <Group role="Card">
          <Text role="Title" content="4. Field Component - Edit Mode" prominence="Primary" />

          <Section role="Container" prominence="Tertiary" className="gap-4 p-4 rounded-lg grid-cols-2">
            <Field
              label="Text"
              model="text"
              dataType="text"
              value={formData.text}
              onChange={(v) => handleChange('text', v)}
              placeholder="Enter text"
            />
            <Field
              label="Number"
              model="number"
              dataType="number"
              value={formData.number}
              onChange={(v) => handleChange('number', v)}
              constraints={{ min: 0, max: 100 }}
            />
            <Field
              label="Currency"
              model="currency"
              dataType="currency"
              value={formData.currency}
              onChange={(v) => handleChange('currency', v)}
              required
            />
            <Field
              label="Date"
              model="date"
              dataType="date"
              value={formData.date}
              onChange={(v) => handleChange('date', v)}
            />
            <Field
              label="DateTime"
              model="datetime"
              dataType="datetime"
              value={formData.datetime}
              onChange={(v) => handleChange('datetime', v)}
            />
            <Field
              label="Boolean"
              model="boolean"
              dataType="boolean"
              value={formData.boolean}
              onChange={(v) => handleChange('boolean', v)}
            />
            <Field
              label="Select"
              model="select"
              dataType="select"
              value={formData.select}
              onChange={(v) => handleChange('select', v)}
              options={selectOptions}
            />
            <Field
              label="Email"
              model="email"
              dataType="email"
              value={formData.email}
              onChange={(v) => handleChange('email', v)}
              placeholder="user@example.com"
            />
            <Field
              label="URL"
              model="url"
              dataType="url"
              value={formData.url}
              onChange={(v) => handleChange('url', v)}
            />
            <Field
              label="Phone"
              model="phone"
              dataType="phone"
              value={formData.phone}
              onChange={(v) => handleChange('phone', v)}
            />
            <Field
              label="Color"
              model="color"
              dataType="color"
              value={formData.color}
              onChange={(v) => handleChange('color', v)}
            />
            <Field
              label="Password"
              model="password"
              dataType="password"
              value={formData.password}
              onChange={(v) => handleChange('password', v)}
              constraints={{ minLength: 8 }}
            />
          </Section>

          <Section role="Container" prominence="Tertiary" className="gap-4 p-4 rounded-lg mt-4">
            <Field
              label="Radio Group"
              model="radio"
              dataType="radio"
              value={formData.radio}
              onChange={(v) => handleChange('radio', v)}
              options={radioOptions}
            />
            <Field
              label="Checkbox Group"
              model="checkbox"
              dataType="checkbox"
              value={formData.checkbox}
              onChange={(v) => handleChange('checkbox', v)}
              options={checkboxOptions}
            />
            <Field
              label="Textarea"
              model="textarea"
              dataType="textarea"
              value={formData.textarea}
              onChange={(v) => handleChange('textarea', v)}
              placeholder="Enter multiple lines..."
            />
            <Field
              label="Rating"
              model="rating"
              dataType="rating"
              value={formData.rating}
              onChange={(v) => handleChange('rating', v)}
            />
            <Field
              label="Range Slider"
              model="range"
              dataType="range"
              value={formData.range}
              onChange={(v) => handleChange('range', v)}
              constraints={{ min: 0, max: 100 }}
            />
          </Section>
        </Group>
      </Section>

      {/* Form State Debug */}
      <Section role="Container" className="mb-8">
        <Group role="Card">
          <Text role="Title" content="5. Live Form State (Debug)" prominence="Secondary" />
          <pre className="bg-layer-1 p-4 rounded-lg text-xs overflow-auto max-h-96">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </Group>
      </Section>
    </Section>
  );
}
