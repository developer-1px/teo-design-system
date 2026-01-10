/**
 * FieldShowcasePage - Field Component Showcase
 *
 * Demonstrates the minimal design system for Field components.
 * Uses strict IDDL components without manual class styling overrides.
 */

import { Block } from '@/components/types/Block/Block';
import { Field } from '@/components/types/Element/Field/Field';
import { Text } from '@/components/types/Element/Text/Text';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';

export function FieldShowcasePage() {
  return (
    <Page title="Showcase" role="Application" layout="Studio">
      {/* Header / Toolbar */}
      <Section role="Toolbar" prominence="Standard">
        <Block role="Toolbar" layout="inline" density="Compact">
          {/* Using Title Standard for navbar-like title */}
          <Text role="Title" prominence="Standard" content="Field Component Library" />
          <Block role="Divider" layout="inline">
            <></>
          </Block>
          <Text role="Body" prominence="Subtle" content="v2.1.0 Minimal Design" />
        </Block>
      </Section>

      {/* Sidebar for Navigation (Mock) */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Block role="ScrollMenu" layout="stack" density="Comfortable">
          <Text role="Label" content="COMPONENTS" prominence="Subtle" className="px-2 pt-2" />
          <Block role="Container" layout="stack" density="Standard">
            {[
              'Input Primitives',
              'Selection Controls',
              'Text Areas',
              'Advanced Inputs',
              'States & Validation',
            ].map((item) => (
              <Block
                key={item}
                role="Inline"
                clickable
                value={item}
                className="px-2 py-1 hover:bg-surface-elevated rounded-md cursor-pointer"
              >
                <Text role="Body" content={item} prominence="Standard" />
              </Block>
            ))}
          </Block>
        </Block>
      </Section>

      {/* Main Content Area - Set mode="edit" to render inputs */}
      <Section role="Editor" prominence="Standard" mode="edit">
        {/* Main Content Container */}
        <Block
          role="Container"
          layout="stack"
          density="Comfortable"
          className="p-8 gap-12 max-w-4xl mx-auto"
        >
          {/* Page Header */}
          <Block role="Container" layout="stack" density="Standard" className="gap-2">
            <Text role="Title" prominence="Hero" content="Field Inputs" />
            <Text
              role="Body"
              prominence="Hero"
              content="Totally refined, minimal input components designed for modern interfaces."
            />
          </Block>

          {/* Spacer */}
          <Block role="Divider" layout="stack">
            <></>
          </Block>

          {/* 1. Input Primitives */}
          <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="Input Primitives" />
              <Text role="Body" prominence="Subtle" content="Basic text-based input fields." />
            </div>

            <Block
              role="Grid"
              layout="grid"
              density="Comfortable"
              className="grid-cols-1 md:grid-cols-2 gap-8"
            >
              <Field
                label="Text Input"
                model="demo.text"
                type="text"
                placeholder="Enter your name"
                prominence="Standard"
                density="Standard"
              />
              <Field
                label="Email Input"
                model="demo.email"
                type="email"
                placeholder="name@example.com"
                prominence="Standard"
                density="Standard"
              />
              <Field
                label="Password Input"
                model="demo.password"
                type="password"
                placeholder="••••••••"
                prominence="Standard"
                density="Standard"
              />
              <Field
                label="Phone Input"
                model="demo.phone"
                type="phone"
                placeholder="+1 (555) 000-0000"
                prominence="Standard"
                density="Standard"
              />
            </Block>
          </Block>

          {/* Spacer */}
          <Block role="Divider" layout="stack">
            <></>
          </Block>

          {/* 2. Selection Controls */}
          <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="Selection Controls" />
              <Text role="Body" prominence="Subtle" content="Components for selecting options." />
            </div>

            <Block
              role="Grid"
              layout="grid"
              density="Comfortable"
              className="grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              <Block role="Container" layout="stack" density="Standard">
                <Field
                  label="Select Dropdown"
                  model="demo.select"
                  type="select"
                  options={[
                    { label: 'Americas', value: 'americas' },
                    { label: 'Europe', value: 'europe' },
                    { label: 'Asia', value: 'asia' },
                  ]}
                  placeholder="Select region..."
                />
              </Block>

              <Block role="Container" layout="stack" density="Standard">
                <Field
                  label="Radio Block"
                  model="demo.radio"
                  type="radio"
                  options={[
                    { label: 'Default', value: 'default' },
                    { label: 'Comfortable', value: 'comfortable' },
                    { label: 'Compact', value: 'compact' },
                  ]}
                  value="default"
                />
              </Block>

              <Block role="Container" layout="stack" density="Standard">
                <Field
                  label="Checkbox Block"
                  model="demo.checkbox"
                  type="checkbox"
                  options={[
                    { label: 'Notifications', value: 'notifications' },
                    { label: 'Marketing Emails', value: 'marketing' },
                    { label: 'Security Alerts', value: 'security' },
                  ]}
                />
              </Block>

              <Block role="Container" layout="stack" density="Standard">
                <Field
                  label="Boolean Toggle"
                  model="demo.toggle"
                  type="boolean"
                  label="Enable Dark Mode"
                />
              </Block>
            </Block>
          </Block>

          {/* Spacer */}
          <Block role="Divider" layout="stack">
            <></>
          </Block>

          {/* 3. Text Areas */}
          <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="Text Areas" />
              <Text role="Body" prominence="Subtle" content="For multiline text input." />
            </div>
            <Field
              label="Description"
              model="demo.textarea"
              type="textarea"
              placeholder="Tell us about yourself..."
              prominence="Standard"
            />
          </Block>

          {/* Spacer */}
          <Block role="Divider" layout="stack">
            <></>
          </Block>

          {/* 4. Advanced Inputs */}
          <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="Advanced Inputs" />
              <Text role="Body" prominence="Subtle" content="Specialized input types." />
            </div>

            <Block
              role="Grid"
              layout="grid"
              density="Comfortable"
              className="grid-cols-1 md:grid-cols-2 gap-8"
            >
              <Field label="Date Picker" model="demo.date" type="date" />
              <Field label="Color Picker" model="demo.color" type="color" />
              <Field label="File Upload" model="demo.file" type="file" />
              <Field
                label="Range Slider"
                model="demo.range"
                type="range"
                constraints={{ min: 0, max: 100 }}
                value={50}
              />
            </Block>
          </Block>

          {/* Spacer */}
          <Block role="Divider" layout="stack">
            <></>
          </Block>

          {/* 5. States & Validation */}
          <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="States & Validation" />
              <Text role="Body" prominence="Subtle" content="Visual feedback states." />
            </div>

            <Block
              role="Grid"
              layout="grid"
              density="Comfortable"
              className="grid-cols-1 md:grid-cols-2 gap-8"
            >
              <Block role="Container" layout="stack" className="gap-4">
                <Field
                  label="Disabled Input"
                  model="demo.disabled"
                  type="text"
                  value="This is disabled"
                  disabled={true}
                />
                <Field
                  label="Disabled Select"
                  model="demo.disabledSelect"
                  type="select"
                  placeholder="Can't select"
                  disabled={true}
                  options={[]}
                />
              </Block>

              <Block role="Container" layout="stack" className="gap-4">
                <Field
                  label="Error State"
                  model="demo.error"
                  type="text"
                  value="Invalid Value"
                  constraints={{
                    pattern: '^[0-9]+$',
                    patternMessage: 'Error: Input must be a number',
                  }}
                  // For demo purposes, we might need a way to force error state if not interactive
                  // Current renderer relies on hook state.
                />
                <Field
                  label="Required Field"
                  model="demo.required"
                  type="text"
                  required
                  placeholder="This is required *"
                />
              </Block>
            </Block>
          </Block>
        </Block>
      </Section>

      <Section role="Panel" prominence="Standard">
        <Block role="Container" layout="stack" density="Compact" className="items-center py-2">
          <Text
            role="Body"
            content="IDDL Design System v2.1 • Built with React 19 & TailwindCSS 4"
            prominence="Subtle"
          />
        </Block>
      </Section>
    </Page>
  );
}
