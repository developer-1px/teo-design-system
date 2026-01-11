import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section';

export function SectionTypeShowcase() {
  return (
    <div className="p-8 space-y-12 bg-surface text-text">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Section Types & Adaptive Scaling</h1>
        <p className="text-text-subtle">
          This page demonstrates how the same <code>Text</code> component adapts its size based on
          the parent <code>Section</code>'s Type.
        </p>
      </div>

      {/* Comparison Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 1. Bar Section */}
        <div className="space-y-4">
          <Text role="Title" prominence="Standard" content="Type: Bar" />
          <p className="text-sm text-text-muted">
            Compact, fixed height. Reference: Header, Toolbar
          </p>

          <div className="border border-border-default rounded overflow-hidden">
            <Section
              role="Header"
              type="Bar"
            >
              <div className="flex items-center gap-4 px-4 h-full">
                <Text role="Heading" prominence="Hero" content="Hero Text" />
                <Text role="Heading" prominence="Standard" content="Standard" />
                <Text role="Body" prominence="Subtle" content="Subtle" />
              </div>
            </Section>
          </div>
          <div className="text-xs text-text-subtle">Hero: 20px, Standard: 14px</div>
        </div>

        {/* 2. Panel Section */}
        <div className="space-y-4">
          <Text role="Title" prominence="Standard" content="Type: Panel" />
          <p className="text-sm text-text-muted">
            Vertical, medium width. Reference: Sidebar, Properties
          </p>

          <div className="border border-border-default rounded overflow-hidden h-64 flex">
            <Section
              role="Panel"
              type="Panel"
            >
              <div>
                <Text role="Label" content="Section Title" />
                <Text role="Heading" prominence="Hero" content="Hero Text" />
              </div>
              <div>
                <Text role="Heading" prominence="Standard" content="Standard Text" />
                <Text
                  role="Body"
                  prominence="Subtle"
                  content="Subtle Body description goes here."
                />
              </div>
            </Section>
          </div>
          <div className="text-xs text-text-subtle">Hero: 18px, Standard: 14px</div>
        </div>

        {/* 3. Stage Section */}
        <div className="space-y-4">
          <Text role="Title" prominence="Standard" content="Type: Stage" />
          <p className="text-sm text-text-muted">Free form, large scale. Reference: Main, Canvas</p>

          <div className="border border-border-default rounded overflow-hidden h-64">
            <Section role="Main" type="Stage">
              <Text role="Heading" prominence="Hero" content="Hero Text" />
              <Text role="Heading" prominence="Standard" content="Standard Text" />
              <Text
                role="Body"
                prominence="Subtle"
                content="Subtle Body description. The stage allows for much larger typography to capture attention."
              />
            </Section>
          </div>
          <div className="text-xs text-text-subtle">Hero: 48px, Standard: 16px</div>
        </div>
      </div>

      <div className="h-px bg-border-muted" />

      {/* Layer & Float */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Layer */}
        <div className="space-y-4">
          <Text role="Title" prominence="Standard" content="Type: Layer (Modal)" />

          <div className="relative h-64 bg-surface-ground border border-border-default rounded flex items-center justify-center p-8">
            <Section
              role="Modal"
              type="Layer"
            >
              <Text role="Heading" prominence="Hero" content="Modal Title" />
              <Text
                role="Body"
                prominence="Standard"
                content="This is a modal dialog. The text size is comfortable but authoritative."
              />
              <div className="flex justify-end gap-2">
                <Text role="Label" content="Cancel" />
                <Text
                  role="Label"
                  content="Confirm"
                />
              </div>
            </Section>
          </div>
        </div>

        {/* Float */}
        <div className="space-y-4">
          <Text role="Title" prominence="Standard" content="Type: Float (Tooltip)" />

          <div className="relative h-64 bg-surface-ground border border-border-default rounded flex items-center justify-center">
            <div className="relative group">
              <button className="px-4 py-2 bg-surface-elevated border border-border-default rounded">
                Hover Me
              </button>
              <Section
                role="Popover"
                type="Float"
              >
                <Text role="Body" prominence="Standard" content="Floating Tooltip" />
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
