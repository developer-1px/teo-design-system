import { Frame } from '@/components/dsl/shared/Frame';
import { Block } from '@/components/dsl/Block/Block';
import { Field } from '@/components/dsl/Element/Field/Field';
import { Text } from '@/components/dsl/Element/Text/Text';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import {
  Type,
  CheckSquare,
  Sliders,
  Calendar,
  Database,
  Palette,
  Zap
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function FieldShowcasePage() {
  const categories = [
    { id: 'input', label: 'Input Category', icon: Type },
    { id: 'choice', label: 'Choice Category', icon: CheckSquare },
    { id: 'control', label: 'Control Category', icon: Sliders },
    { id: 'picker', label: 'Picker Category', icon: Calendar },
    { id: 'meta', label: 'Meta Category', icon: Database },
    { id: 'variants', label: 'Variants & Density', icon: Palette },
  ];

  const handleCategoryChange = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const PreviewCard = ({ title, children, description }: { title: string, children: React.ReactNode, description?: string }) => (
    <div className="relative overflow-hidden rounded-2xl border border-border-muted bg-surface-sunken flex flex-col p-1 mb-16 group">
      <div className="h-12 border-b border-border-muted flex items-center px-6 justify-between bg-surface-elevated/20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary opacity-40 shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]" />
          <span className="text-[12px] font-bold text-subtle uppercase tracking-widest">{title}</span>
        </div>
        {description && <span className="text-[11px] text-muted italic">{description}</span>}
      </div>
      <div className="p-10 flex flex-col gap-8">
        {children}
      </div>
    </div>
  );

  return (
    <ShowcasePage
      title="Fields"
      subtitle="Data Capture v6.0"
      description="IDDL Fields provide semantic entry points for user data. Each role ensures appropriate input constraints, validation logic, and contextual affordability."
      categories={categories}
      activeCategoryId="input"
      onCategoryChange={handleCategoryChange}
    >

      {/* 1. INPUT CATEGORY */}
      <Frame.Stack id="input" gap={8}>
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text tracking-tight">Keyboard Entry</h2>
          <p className="text-muted text-[16px] max-w-2xl">High-performance text entry roles with built-in format awareness and IME support.</p>
        </div>

        <PreviewCard title="Textbox & Search" description="Standard Input roles">
          <div className="grid grid-cols-2 gap-10">
            <Field
              role="Textbox"
              label="Primary Text"
              model="demo.text"
              placeholder="Standard text entry..."
              spec={{ type: 'text' }}
            />
            <Field
              role="Textbox"
              label="Email Address"
              model="demo.email"
              placeholder="user@studio.io"
              spec={{ type: 'email' }}
            />
            <Field
              role="Textbox"
              label="Secure Identifier"
              model="demo.password"
              placeholder="••••••••"
              spec={{ type: 'password', revealable: true }}
            />
            <Field
              role="Textbox"
              label="Global Search"
              model="demo.search"
              placeholder="Filter resources..."
              spec={{ clearable: true }}
            />
          </div>
          <Field
            role="Textarea"
            label="Descriptive Commentary"
            model="demo.textarea"
            placeholder="Enter detailed notes..."
            spec={{ rows: 4 }}
          />
        </PreviewCard>

        <PreviewCard title="Structured Input" description="Numeric & OTP">
          <div className="grid grid-cols-2 gap-10">
            <Field
              role="Spinbutton"
              label="Integer Velocity"
              model="demo.number"
              defaultValue={10}
              spec={{ min: 0, max: 100, step: 1 }}
            />
            <Field
              role="Otp"
              label="Verification PIN"
              model="demo.otp"
              spec={{ length: 6, numeric: true }}
            />
          </div>
        </PreviewCard>
      </Frame.Stack>

      {/* 2. CHOICE CATEGORY */}
      <Frame.Stack id="choice" gap={8} className="mt-20">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text tracking-tight">Selection & Choice</h2>
          <p className="text-muted text-[16px] max-w-2xl">Discrete value selection driven by predefined registries and option sets.</p>
        </div>

        <PreviewCard title="Toggles & Radios">
          <div className="grid grid-cols-2 gap-10">
            <Field
              role="Checkbox"
              label="Agreement Protocol"
              model="demo.check"
              defaultValue={true}
            />
            <Field
              role="Switch"
              label="Runtime Synchronization"
              model="demo.switch"
              defaultValue={false}
            />
          </div>
          <div className="h-[1px] bg-border-muted my-4" />
          <Field
            role="Radio"
            label="Deployment Environment"
            model="demo.radio"
            defaultValue="prod"
            spec={{
              options: [
                { label: 'Production', value: 'prod' },
                { label: 'Staging', value: 'stage' },
                { label: 'Development', value: 'dev' },
              ],
            }}
          />
        </PreviewCard>

        <PreviewCard title="Complex Selection" description="Combobox & Listbox">
          <div className="grid grid-cols-2 gap-10">
            <Field
              role="Combobox"
              label="Asset Registry"
              model="demo.combobox"
              placeholder="Search assets..."
              spec={{
                freeSolo: true,
                options: [
                  { label: 'Asset 01', value: 'a1' },
                  { label: 'Asset 02', value: 'a2' },
                  { label: 'Asset 03', value: 'a3' },
                ],
              }}
            />
            <Field
              role="Select"
              label="Multi-Select Tags"
              model="demo.multiselect"
              placeholder="Assign categories..."
              spec={{
                multiple: true,
                options: [
                  { label: 'Critical', value: 'c' },
                  { label: 'Legacy', value: 'l' },
                  { label: 'Proposed', value: 'p' },
                ],
              }}
            />
          </div>
        </PreviewCard>
      </Frame.Stack>

      {/* 4. PICKER CATEGORY */}
      <Frame.Stack id="picker" gap={8} className="mt-20">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text tracking-tight">Specialized Pickers</h2>
          <p className="text-muted text-[16px] max-w-2xl">Complex modalities for non-textual data capture.</p>
        </div>

        <PreviewCard title="Temporal & Files">
          <div className="grid grid-cols-2 gap-10">
            <Field
              role="Datepicker"
              label="Release Date"
              model="demo.date"
              spec={{ type: 'date' }}
            />
            <Field
              role="Filepicker"
              label="Identity Document"
              model="demo.file"
              spec={{ accept: 'image/*', multiple: false }}
            />
          </div>
        </PreviewCard>

        <PreviewCard title="Visual Signatures">
          <Field
            role="Signature"
            label="Legal Verification"
            model="demo.signature"
            spec={{
              penColor: 'var(--color-primary)',
              penWidth: 2,
              backgroundColor: 'transparent',
            }}
          />
        </PreviewCard>
      </Frame.Stack>

      {/* 6. VARIANTS & DENSITY */}
      <Frame.Stack id="variants" gap={8} className="mt-20">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text tracking-tight">Visual Hierarchy</h2>
          <p className="text-muted text-[16px] max-w-2xl">Fields adapt to the design system's prominence and density scales.</p>
        </div>

        <PreviewCard title="Prominence Levels">
          <div className="flex flex-col gap-8">
            <Field role="Textbox" label="Hero Prominence" model="p1" prominence="Hero" />
            <Field role="Textbox" label="Standard Prominence" model="p2" prominence="Standard" />
            <Field role="Textbox" label="Subtle Prominence" model="p3" prominence="Subtle" />
          </div>
        </PreviewCard>

        <PreviewCard title="Semantic Intent">
          <div className="grid grid-cols-2 gap-8">
            <Field role="Textbox" label="Positive Intent" model="i1" intent="Positive" />
            <Field role="Textbox" label="Brand Intent" model="i1" intent="Brand" />
            <Field role="Textbox" label="Caution Intent" model="i2" intent="Caution" error="Warning detected" />
            <Field role="Textbox" label="Critical Intent" model="i3" intent="Critical" error="Invalid entry" />
          </div>
        </PreviewCard>
      </Frame.Stack>

    </ShowcasePage>
  );
}
