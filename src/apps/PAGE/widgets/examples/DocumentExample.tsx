import { Frame } from '@/components/dsl/shared/Frame';
/**
 * DocumentExample - Standard scrollable document layout examples
 *
 * Use cases: Blogs, Documentation, Articles, News, Settings
 */

import { FileText, Home, Settings } from 'lucide-react';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import type { PageLayout } from '@/components/dsl/Page/Page.types';
import { Section } from '@/components/dsl/Section/Section';

interface DocumentExampleProps {
  layout: PageLayout;
}

export function DocumentExample({ layout }: DocumentExampleProps) {
  const isSidebarLayout = layout === 'Sidebar' || layout === 'ThreeColumn';
  const isAsideLayout = layout === 'Aside' || layout === 'ThreeColumn';

  return (
    <>
      {/* Header */}
      <Section role="Header">
        <Block role="Toolbar">
          <Frame.Stack className="flex-row items-center gap-4">
            <FileText size={24} className="text-primary" />
            <Text role="Heading" content="Document Portal" prominence="Strong" />
          </Frame.Stack>
          <Frame.Stack className="flex-row gap-2">
            <Action role="Button" label="Home" prominence="Subtle">
              <Home size={16} />
            </Action>
            <Action role="Button" label="Settings" prominence="Subtle">
              <Settings size={16} />
            </Action>
          </Frame.Stack>
        </Block>
      </Section>

      {/* Sidebar Navigation (if applicable) */}
      {isSidebarLayout && (
        <Section role="Sidebar">
          <Frame.Stack density="Compact">
            <Text role="Label" content="Navigation" prominence="Strong" />
            <Block role="List" density="Compact">
              <Action role="ListItem" label="Getting Started" prominence="Standard" />
              <Action role="ListItem" label="Components" prominence="Standard" />
              <Action role="ListItem" label="API Reference" prominence="Strong" intent="Brand" />
              <Action role="ListItem" label="Examples" prominence="Standard" />
              <Action role="ListItem" label="FAQ" prominence="Standard" />
            </Block>
          </Frame.Stack>
        </Section>
      )}

      {/* Main Content */}
      <Section role="Main">
        <Frame.Stack align="start" gap={16}>
          {/* Editorial Hero Heading */}
          <div className="max-w-4xl">
            <Frame.Stack density="Comfortable" gap={8}>
              <div className="inline-flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <Text
                  role="Caption"
                  content="V6.5 ENGINE SYSTEM"
                  prominence="Strong"
                  intent="Brand"
                />
              </div>
              <Text
                role="Title"
                content="Design Systems with Higher Intelligence"
                prominence="Hero"
              />
              <div className="max-w-2xl mt-4">
                <Text
                  role="Body"
                  content="IDDL 6.5 introduces a paradigm shift in how digital products are architected. By moving from static tokens to dynamic intent-based logic, we empower designers and engineers to build at the speed of thought."
                  prominence="Standard"
                />
              </div>
            </Frame.Stack>
          </div>

          <Frame.Grid className="grid-cols-2" gap={10}>
            <Block
              role="Card"
              prominence="Subtle"
              align="start"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                <FileText
                  className="text-primary"
                  size={32}
                />
              </div>
              <Text
                role="Heading"
                content="Core Specification"
                prominence="Strong"
              />
              <Text
                role="Body"
                content="Deep dive into the mathematical models of intent-driven logic and multi-tier token propagation."
                prominence="Standard"
              />
              <Action
                role="Button"
                label="Read Technical Spec"
                prominence="Strong"
                intent="Brand"
              />
            </Block>

            <Block
              role="Card"
              prominence="Subtle"
              align="start"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                <Settings
                  className="text-primary"
                  size={32}
                />
              </div>
              <Text
                role="Heading"
                content="Atomic Orchestration"
                prominence="Strong"
              />
              <Text
                role="Body"
                content="Learn how to orchestrate thousands of design variables across any device, dialect, or modality instantly."
                prominence="Standard"
              />
              <Action
                role="Button"
                label="Explore the Registry"
                prominence="Strong"
                intent="Brand"
              />
            </Block>
          </Frame.Grid>

          <Frame.Stack>
            <div className="max-w-3xl space-y-8">
              <Text
                role="Heading"
                content="The Philosophy of Intent"
                prominence="Strong"
              />
              <Text
                role="Body"
                content="Traditional design systems are brittle. They break when the context changes. IDDL is a purely logic-based approach that derives its visuals from the declared intent. This means a component can transform from a high-impact marketing hero to a dense data workstation without changing a single line of component code."
                prominence="Standard"
              />

              <Block role="Alert" prominence="Subtle" intent="Info" className="my-6">
                <Text
                  role="Body"
                  content='"Intent is the soul of the interface. Architecture is the body. The Token Engine is the heart."'
                  prominence="Strong"
                  intent="Brand"
                  className="italic"
                />
              </Block>

              <Text
                role="Heading"
                content="Why We Need a New Engine"
                prominence="Strong"
              />
              <Text
                role="Body"
                content="In the era of AI-generated interfaces, static CSS classes are insufficient. We need a system that understands the *meaning* of content. When an AI generates a UI, it shouldn't be picking pixel values; it should be selecting roles and intents. The IDDL Engine handles the translation from semantic intent to pixel-perfect execution, ensuring consistency at a scale previously impossible to maintain manually."
                prominence="Standard"
              />

              <Block
                role="FeatureGrid"
                spec={{
                  icon: Settings,
                  label: "Atomic Token Graph"
                }}
              >
                <Text role="Heading" content="Visualizing the Logic" prominence="Standard" />
                <Text
                  role="Body"
                  content="The engine doesn't just manage colors; it manages relationships. When you tweak the 'Density' token, it cascades through padding, gap, font-size, and corner radius simultaneously."
                  prominence="Standard"
                />
                <Block
                  role="CodeSnippet"
                  spec={{
                    lines: [
                      { text: `const token = useToken({` },
                      { text: `  role: 'Button',`, className: 'pl-4 text-primary' },
                      { text: `  intent: 'Brand',`, className: 'pl-4 text-accent' },
                      { text: `  prominence: 'Strong'`, className: 'pl-4' },
                      { text: `});` },
                      { text: `// Returns: "bg-blue-600 hover:bg-blue-700 text-white..."`, className: 'text-text-subtle mt-2' }
                    ]
                  }}
                />
              </Block>

              <div className="pl-6 border-l-2 border-border-muted space-y-4">
                <Text role="Heading" content="Core Principles" prominence="Standard" />
                <Block role="List" density="Comfortable">
                  <Action role="ListItem" label="Semantic Abstraction over Visual Styles" prominence="Standard" />
                  <Action role="ListItem" label="Context-Aware Token Resolution" prominence="Standard" />
                  <Action role="ListItem" label="Universal Accessibility by Default" prominence="Standard" />
                </Block>
              </div>

              <Text
                role="Body"
                content="This approach dramatically reduces technical debt. Instead of maintaining thousands of inconsistent CSS classes, you maintain a single source of truth: the Token Engine. Updates propagate instantly across the entire application ecosystem, from marketing landing pages to complex data grids."
                prominence="Standard"
              />
            </div>

            <div className="space-y-6 pt-12 border-t border-border-muted">
              <Text
                role="Heading"
                content="Implementation Workflow"
                prominence="Strong"
              />
              <div className="grid grid-cols-3">
                {[
                  { title: 'Declare', desc: "Define your component's role and purpose." },
                  { title: 'Derive', desc: 'Token Engine resolves styles automatically.' },
                  { title: 'Drive', desc: 'Propagate context to children instantly.' },
                ].map((step, i) => (
                  <Block key={i} role="Card" prominence="Subtle">
                    <Text
                      role="Label"
                      content={`${i + 1}. ${step.title}`}
                      prominence="Strong"
                    />
                    <Text role="Caption" content={step.desc} prominence="Standard" />
                  </Block>
                ))}
              </div>
            </div>
          </Frame.Stack>
        </Frame.Stack>
      </Section>

      {/* Aside (Meta information) */}
      {isAsideLayout && (
        <Section role="Aside">
          <Frame.Stack density="Compact">
            <Text role="Label" content="On This Page" prominence="Strong" />
            <Block role="List" density="Compact">
              <Action role="Link" label="Quick Start" prominence="Subtle" />
              <Action role="Link" label="Core Concepts" prominence="Subtle" />
              <Action role="Link" label="Examples" prominence="Subtle" />
            </Block>

            <div className="mt-6 pt-4 border-t border-border">
              <Text role="Label" content="Metadata" prominence="Strong" />
              <Text role="Caption" content="Last updated: Jan 12, 2026" prominence="Subtle" />
              <Text role="Caption" content="Version: 5.0" prominence="Subtle" />
            </div>
          </Frame.Stack>
        </Section>
      )}

      {/* Footer */}
      <Section role="Footer">
        <Block role="Toolbar">
          <Text role="Caption" content="© 2026 IDDL Platform" prominence="Subtle" />
          <Frame.Stack className="flex-row gap-4">
            <Action role="Link" label="Privacy" prominence="Subtle" />
            <Action role="Link" label="Terms" prominence="Subtle" />
            <Action role="Link" label="Contact" prominence="Subtle" />
          </Frame.Stack>
        </Block>
      </Section>
    </>
  );
}
