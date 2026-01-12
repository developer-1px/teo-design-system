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
      <Section role="Header" variant="Plain">
        <Block role="Toolbar" className="px-6 py-4">
          <Block role="Stack" className="flex-row items-center gap-4">
            <FileText size={24} className="text-accent" />
            <Text role="Heading" content="Document Portal" prominence="Strong" />
          </Block>
          <Block role="Stack" className="flex-row gap-2">
            <Action role="Button" label="Home" prominence="Subtle">
              <Home size={16} />
            </Action>
            <Action role="Button" label="Settings" prominence="Subtle">
              <Settings size={16} />
            </Action>
          </Block>
        </Block>
      </Section>

      {/* Sidebar Navigation (if applicable) */}
      {isSidebarLayout && (
        <Section role="Sidebar" variant="Card">
          <Block role="Stack" density="Compact" className="p-4">
            <Text role="Label" content="Navigation" prominence="Strong" />
            <Block role="List" density="Compact">
              <Action role="ListItem" label="Getting Started" prominence="Standard" />
              <Action role="ListItem" label="Components" prominence="Standard" />
              <Action role="ListItem" label="API Reference" prominence="Strong" intent="Brand" />
              <Action role="ListItem" label="Examples" prominence="Standard" />
              <Action role="ListItem" label="FAQ" prominence="Standard" />
            </Block>
          </Block>
        </Section>
      )}

      {/* Main Content */}
      <Section role="Main" scrollable className="bg-white">
        <Block role="Stack" className="max-w-5xl mx-auto px-10 py-20">
          {/* Editorial Hero Heading */}
          <div className="mb-20 max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <Text
                role="Caption"
                content="V6.5 ENGINE SYSTEM"
                prominence="Strong"
                className="tracking-[0.3em] uppercase text-[10px] font-black"
              />
            </div>
            <Text
              role="Title"
              content="Design Systems with Higher Intelligence"
              prominence="Hero"
              className="text-7xl font-black leading-[0.95] tracking-[-0.04em] mb-10"
            />
            <Text
              role="Body"
              content="IDDL 6.5 introduces a paradigm shift in how digital products are architected. By moving from static tokens to dynamic intent-based logic, we empower designers and engineers to build at the speed of thought."
              prominence="Standard"
              className="text-2xl text-slate-500 font-light leading-relaxed"
            />
          </div>

          <Block role="Grid" className="grid-cols-2 gap-10 mb-20">
            <Block
              role="Card"
              prominence="Strong"
              className="p-10 border border-slate-100 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
                <FileText
                  className="text-slate-400 group-hover:text-primary transition-colors"
                  size={32}
                />
              </div>
              <Text
                role="Heading"
                content="Core Specification"
                prominence="Strong"
                className="mb-4 text-3xl font-black tracking-tight"
              />
              <Text
                role="Body"
                content="Deep dive into the mathematical models of intent-driven logic and multi-tier token propagation."
                prominence="Standard"
                className="mb-8 text-lg opacity-50 font-medium leading-relaxed"
              />
              <Action
                role="Button"
                label="Read Technical Spec"
                prominence="Strong"
                intent="Brand"
                className="rounded-xl px-8 h-12"
              />
            </Block>

            <Block
              role="Card"
              prominence="Strong"
              className="p-10 border border-slate-100 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
                <Settings
                  className="text-slate-400 group-hover:text-primary transition-colors"
                  size={32}
                />
              </div>
              <Text
                role="Heading"
                content="Atomic Orchestration"
                prominence="Strong"
                className="mb-4 text-3xl font-black tracking-tight"
              />
              <Text
                role="Body"
                content="Learn how to orchestrate thousands of design variables across any device, dialect, or modality instantly."
                prominence="Standard"
                className="mb-8 text-lg opacity-50 font-medium leading-relaxed"
              />
              <Action
                role="Button"
                label="Explore the Registry"
                prominence="Strong"
                intent="Brand"
                className="rounded-xl px-8 h-12"
              />
            </Block>
          </Block>

          <Block role="Stack" className="space-y-20">
            <div className="space-y-8 max-w-3xl">
              <Text
                role="Heading"
                content="The Philosophy of Intent"
                prominence="Strong"
                className="text-4xl font-black tracking-tight"
              />
              <Text
                role="Body"
                content="Traditional design systems are brittle. They break when the context changes. IDDL is a purely logic-based approach that derives its visuals from the declared intent. This means a component can transform from a high-impact marketing hero to a dense data workstation without changing a single line of component code."
                prominence="Standard"
                className="text-xl text-slate-500 leading-relaxed"
              />
              <Block
                role="Alert"
                prominence="Subtle"
                intent="Info"
                className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <Text
                  role="Body"
                  content="&ldquo;Intent is the soul of the interface. Architecture is the body. The Token Engine is the heart.&rdquo;"
                  prominence="Strong"
                  className="italic text-primary text-2xl font-black leading-tight"
                />
              </Block>
            </div>

            <div className="space-y-6">
              <Text
                role="Heading"
                content="Implementation Workflow"
                prominence="Strong"
                className="text-2xl"
              />
              <div className="grid grid-cols-3 gap-4">
                {[
                  { title: 'Declare', desc: "Define your component's role and purpose." },
                  { title: 'Derive', desc: 'Token Engine resolves styles automatically.' },
                  { title: 'Drive', desc: 'Propagate context to children instantly.' },
                ].map((step, i) => (
                  <Block key={i} role="Card" prominence="Subtle" className="p-5 bg-slate-100/30">
                    <Text
                      role="Label"
                      content={`${i + 1}. ${step.title}`}
                      prominence="Strong"
                      className="mb-2"
                    />
                    <Text role="Caption" content={step.desc} prominence="Standard" />
                  </Block>
                ))}
              </div>
            </div>
          </Block>
        </Block>
      </Section>

      {/* Aside (Meta information) */}
      {isAsideLayout && (
        <Section role="Aside" variant="Card">
          <Block role="Stack" density="Compact" className="p-4">
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
          </Block>
        </Section>
      )}

      {/* Footer */}
      <Section role="Footer" variant="Plain">
        <Block role="Toolbar" className="px-6 py-4">
          <Text role="Caption" content="© 2026 IDDL Platform" prominence="Subtle" />
          <Block role="Stack" className="flex-row gap-4">
            <Action role="Link" label="Privacy" prominence="Subtle" />
            <Action role="Link" label="Terms" prominence="Subtle" />
            <Action role="Link" label="Contact" prominence="Subtle" />
          </Block>
        </Block>
      </Section>
    </>
  );
}
