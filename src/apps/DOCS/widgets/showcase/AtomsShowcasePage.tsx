import { Frame } from '@/components/dsl/shared/Frame';
import { useState } from 'react';
import { Block } from '@/components/dsl/Block/Block.tsx';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Field, type FieldOption } from '@/components/dsl/Element/Field/Field';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import {
  Type,
  MousePointer2,
  Eye,
  Edit3,
  Terminal,
  Zap,
  Box
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function AtomsShowcasePage() {
  // Form state for all field types
  const [formData, setFormData] = useState<Record<string, any>>({
    text: 'Sample text',
    number: 42,
    currency: 50000,
    date: '2026-01-11',
    datetime: '2026-01-11T14:30',
    boolean: true,
    select: 'option2',
    multiselect: ['option1', 'option3'],
    radio: 'medium',
    checkbox: ['feature1', 'feature2'],
    textarea: 'Integrated Design\nLanguage\nStandard v6.0',
    password: 'secret123',
    email: 'user@studio.io',
    color: 'var(--color-primary)',
    rating: 4,
    range: 75,
  });

  const selectOptions: FieldOption[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const categories = [
    { id: 'text', label: '1. Text Components', icon: Type },
    { id: 'action', label: '2. Action Components', icon: MousePointer2 },
    { id: 'field-view', label: '3. Field (View)', icon: Eye },
    { id: 'field-edit', label: '4. Field (Edit)', icon: Edit3 },
    { id: 'debug', label: '5. State Debug', icon: Terminal },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      title="Atoms"
      subtitle="Standard v6.0 Spec"
      description="The foundational building blocks of the IDDL ecosystem. Atoms are context-agnostic elements that provide the base visual and functional primitives."
      categories={categories}
      activeCategoryId="text"
      onCategoryChange={(id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
    >
      <Frame.Stack id="text" gap={8}>
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text tracking-tight">Text Primitives</h2>
          <p className="text-muted text-[16px] max-w-2xl">Semantic typography roles for structured content delivery.</p>
        </div>

        <PreviewCard title="Typography Roles">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Text role="Title" content="Role: Title (Hero)" prominence="Standard" className="text-4xl font-bold text-text" />
              <Text role="Body" content="Role: Body - For primary readable content and descriptive paragraphs." className="text-muted text-lg" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-surface-sunken border border-border-muted">
                <Text role="Label" content="Role: Label" className="text-[14px] font-bold text-text opacity-80 uppercase tracking-wide mb-2 block" />
                <Text role="Caption" content="Role: Caption - For metadata, dates, and secondary instructions." className="text-[13px] text-subtle" />
              </div>
              <div className="p-6 rounded-xl bg-surface-sunken border border-border-muted flex items-center justify-center">
                <Text role="Code" content="<Block role='Studio' />" className="font-mono text-primary bg-primary/10 px-3 py-1 rounded border border-primary/20" />
              </div>
            </div>
          </div>
        </PreviewCard>

        <PreviewCard title="Intent Axis">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Neutral', intent: 'Neutral' },
              { label: 'Brand', intent: 'Brand' },
              { label: 'Positive', intent: 'Positive' },
              { label: 'Caution', intent: 'Caution' },
              { label: 'Critical', intent: 'Critical' },
              { label: 'Info', intent: 'Info' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-4 rounded-lg bg-surface-sunken/50 border border-border-muted">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  item.intent === 'Neutral' && "bg-text/20",
                  item.intent === 'Brand' && "bg-primary shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.5)]",
                  item.intent === 'Positive' && "bg-success shadow-[0_0_10px_rgba(var(--color-success-rgb),0.5)]",
                  item.intent === 'Caution' && "bg-warning shadow-[0_0_10px_rgba(var(--color-warning-rgb),0.5)]",
                  item.intent === 'Critical' && "bg-error shadow-[0_0_10px_rgba(var(--color-error-rgb),0.5)]",
                  item.intent === 'Info' && "bg-info shadow-[0_0_10px_rgba(var(--color-info-rgb),0.5)]",
                )} />
                <Text role="Body" content={item.label} intent={item.intent as any} className="font-medium" />
              </div>
            ))}
          </div>
        </PreviewCard>
      </Frame.Stack>

      {/* 2. Action Component Showcase */}
      <Frame.Stack id="action" gap={8} className="mt-20">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text tracking-tight">Interactive Behaviors</h2>
          <p className="text-muted text-[16px] max-w-2xl">Standardized execution patterns for user interactions.</p>
        </div>

        <PreviewCard title="System Commands">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold text-subtle uppercase tracking-widest">Execute & Confirm</span>
              <div className="flex gap-4">
                <Action
                  label="Run Diagnostic"
                  behavior={{ action: 'command', command: 'test.command' }}
                  prominence="Standard"
                  intent="Brand"
                />
                <Action
                  label="Purge Cache"
                  behavior={{ action: 'command', command: 'delete.item' }}
                  prominence="Standard"
                  intent="Critical"
                  confirm="This will permanently delete local cache. Continue?"
                />
              </div>
            </div>
          </div>
        </PreviewCard>
      </Frame.Stack>

      {/* 3. Field Component Showcase */}
      <Frame.Stack id="field-view" gap={8} className="mt-20">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text tracking-tight">Visual States</h2>
          <p className="text-muted text-[16px] max-w-2xl">Fields in viewing mode optimized for information density and readability.</p>
        </div>

        <PreviewCard title="ReadOnly Primitives">
          <div className="grid grid-cols-2 gap-10">
            <Field label="Identity" model="text" type="text" value={formData.text} />
            <Field label="System Velocity" model="number" type="number" value={formData.number} />
            <Field label="Date Created" model="date" type="date" value={formData.date} />
            <Field label="Access Status" model="boolean" type="boolean" value={formData.boolean} />
          </div>
        </PreviewCard>
      </Frame.Stack>

      {/* 5. Live Form State */}
      <Frame.Stack id="debug" gap={8} className="mt-20">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text tracking-tight">Runtime Debugger</h2>
          <p className="text-muted text-[16px] max-w-2xl">Real-time synchronization log for the atom state registry.</p>
        </div>

        <div className="bg-surface-base rounded-2xl border border-border-muted p-8 shadow-inner overflow-hidden relative group">
          <div className="absolute top-4 right-4 text-[10px] font-bold text-primary opacity-40 uppercase tracking-widest animate-pulse">Live Sync</div>
          <pre className="text-[13px] font-mono text-subtle leading-relaxed overflow-auto scrollbar-hide max-h-[400px]">
            {JSON.stringify(formData, null, 3)}
          </pre>
        </div>
      </Frame.Stack>

    </ShowcasePage>
  );
}
