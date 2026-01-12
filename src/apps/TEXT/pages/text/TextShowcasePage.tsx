import { Frame } from '@/components/dsl/shared/Frame';
import { Block } from '@/components/dsl/Block/Block.tsx';
import { Text } from '@/components/dsl/Element/Text/Text.tsx';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import {
  Type,
  Palette,
  AlignLeft,
  Highlighter,
  Terminal,
  Zap
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function TextShowcasePage() {
  const categories = [
    { id: 'matrix', label: 'Typography Matrix', icon: Type },
    { id: 'intents', label: 'Intent Colors', icon: Palette },
    { id: 'alignment', label: 'Alignment & Layout', icon: AlignLeft },
    { id: 'highlighting', label: 'Highlighting', icon: Highlighter },
    { id: 'technical', label: 'Technical Text', icon: Terminal },
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
      title="Typography"
      subtitle="Visual Language v2.1"
      description="The semantic text system for IDDL. Typography is governed by semantic roles rather than raw pixel values, ensuring accessibility and hierarchical clarity."
      categories={categories}
      activeCategoryId="matrix"
      onCategoryChange={handleCategoryChange}
    >
      {/* 1. Typography Matrix */}
      <Frame.Stack id="matrix" gap={8}>
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text tracking-tight">Scale & Hierarchy</h2>
          <p className="text-muted text-[16px] max-w-2xl">Combinations of semantic Role and visual Prominence that define the information structure.</p>
        </div>

        <PreviewCard title="Title Role (Heading 1-4)">
          <div className="grid grid-cols-2 gap-12">
            <div className="flex flex-col gap-3">
              <Text role="Title" prominence="Hero" content="Hero Title" className="text-5xl font-bold text-text" />
              <span className="text-[11px] font-bold text-primary opacity-40 uppercase tracking-widest">Prominence: Hero</span>
            </div>
            <div className="flex flex-col gap-3">
              <Text role="Title" prominence="Strong" content="Strong Title" className="text-3xl font-bold text-text/90" />
              <span className="text-[11px] font-bold text-primary opacity-40 uppercase tracking-widest">Prominence: Strong</span>
            </div>
            <div className="flex flex-col gap-3">
              <Text role="Title" prominence="Standard" content="Standard Title" className="text-xl font-semibold text-text/80" />
              <span className="text-[11px] font-bold text-primary opacity-40 uppercase tracking-widest">Prominence: Standard</span>
            </div>
            <div className="flex flex-col gap-3">
              <Text role="Title" prominence="Subtle" content="Subtle Title" className="text-lg font-medium text-text/60" />
              <span className="text-[11px] font-bold text-primary opacity-40 uppercase tracking-widest">Prominence: Subtle</span>
            </div>
          </div>
        </PreviewCard>

        <PreviewCard title="Body Role (Paragraphs)">
          <div className="flex flex-col gap-10">
            <div className="max-w-2xl flex flex-col gap-2">
              <Text role="Body" prominence="Hero" content="Lead paragraphs for introduction. High contrast and spacious leading." className="text-lg text-text/80 leading-relaxed" />
              <div className="h-[1px] w-12 bg-border-muted" />
            </div>
            <div className="max-w-2xl flex flex-col gap-2">
              <Text role="Body" prominence="Standard" content="Standard body text is the default for most reading content. It has balanced readability and contrast for long-form consumption." className="text-[15px] text-muted leading-relaxed" />
              <div className="h-[1px] w-12 bg-border-muted" />
            </div>
            <div className="max-w-2xl">
              <Text role="Body" prominence="Subtle" content="Subtle body text for secondary documentation or helper text. Lower contrast but maintained legibility." className="text-[13px] text-subtle" />
            </div>
          </div>
        </PreviewCard>
      </Frame.Stack>

      {/* 2. Intent Colors */}
      <Frame.Stack id="intents" gap={8} className="mt-20">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text tracking-tight">Semantic Intents</h2>
          <p className="text-muted text-[16px] max-w-2xl">Intent colors map directly to system states and feedback signals.</p>
        </div>

        <PreviewCard title="Intent States">
          <div className="grid grid-cols-2 gap-8">
            {[
              { label: 'Neutral Intent', intent: 'Neutral' },
              { label: 'Brand Intent', intent: 'Brand' },
              { label: 'Positive Intent', intent: 'Positive' },
              { label: 'Caution Intent', intent: 'Caution' },
              { label: 'Critical Intent', intent: 'Critical' },
              { label: 'Info Intent', intent: 'Info' },
            ].map((item) => (
              <div key={item.label} className="p-6 rounded-xl bg-surface-sunken border border-border-muted flex items-center justify-between group/intent">
                <Text role="Body" intent={item.intent as any} content={item.label} prominence="Strong" className="text-lg font-semibold" />
                <div className="w-1.5 h-1.5 rounded-full bg-text/10 group-hover/intent:scale-150 group-hover/intent:bg-text/40 transition-all" />
              </div>
            ))}
          </div>
        </PreviewCard>
      </Frame.Stack>

      {/* 5. Technical Text */}
      <Frame.Stack id="technical" gap={8} className="mt-20">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-text tracking-tight">Technical Display</h2>
          <p className="text-muted text-[16px] max-w-2xl">Monospaced engine for code snippets and system values.</p>
        </div>

        <PreviewCard title="Monospace Logic">
          <div className="flex flex-col gap-10">
            <div className="p-8 rounded-xl bg-surface-base border border-border-muted shadow-inner">
              <Text role="Code" content="import { Text } from '@/iddl-core';" className="block font-mono text-primary mb-2" />
              <Text role="Code" content="<Text role='Title' prominence='Hero' />" className="block font-mono text-info" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[14px] text-subtle italic">Inline representation:</span>
              <Text role="Code" content="0x7F4B2" className="font-mono bg-surface-sunken px-2 py-0.5 rounded text-text/80" />
            </div>
          </div>
        </PreviewCard>
      </Frame.Stack>
    </ShowcasePage>
  );
}
