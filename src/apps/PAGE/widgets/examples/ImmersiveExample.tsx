import { Frame } from '@/components/dsl/shared/Frame';
/**
 * ImmersiveExample - Full-page scroll-snap experience
 *
 * Use cases: Landing pages, Marketing sites, Portfolios, Presentations
 * Note: Immersive uses Main sections for each full-screen panel
 */

import { ChevronDown, Menu, Sparkles, Target, Zap } from 'lucide-react';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';

export function ImmersiveExample() {
  return (
    <>
      {/* Fixed Header */}
      <Section role="Header" variant="Plain">
        <Block role="Toolbar">
          <Frame.Stack className="flex-row items-center gap-3">
            <Sparkles size={24} className="text-accent" />
            <Text role="Label" content="IDDL Platform" prominence="Strong" />
          </Frame.Stack>
          <Frame.Stack className="flex-row gap-4">
            <Action role="Link" label="Features" prominence="Subtle" />
            <Action role="Link" label="Pricing" prominence="Subtle" />
            <Action role="Link" label="Docs" prominence="Subtle" />
            <Action role="Button" label="Get Started" prominence="Strong" intent="Brand" />
            <Action role="IconButton" prominence="Subtle" className="md:hidden">
              <Menu size={20} />
            </Action>
          </Frame.Stack>
        </Block>
      </Section>

      {/* Hero Section */}
      <Section role="Main">
        <Frame.Stack density="Comfortable" className="items-center text-center max-w-5xl mx-auto">
          <Frame.Stack className="flex-row items-center gap-2 p-2 rounded-full border border-border-muted backdrop-blur-md">
            <Sparkles size={16} />
            <Text role="Caption" content="NEW: IDDL 6.5 ENGINE CORE" prominence="Strong" />
          </Frame.Stack>

          <Text
            role="Title"
            content="Interfaces Built with Higher Intent"
            prominence="Hero"
          />

          <Text
            role="Body"
            content="Stop micro-managing pixels. Start orchestrating experiences. The world's first intent-based design engine for mission-critical software."
            prominence="Standard"
          />

          <Frame.Stack className="flex-row gap-6 mt-8">
            <Action
              role="Button"
              label="Exploration"
              prominence="Strong"
              intent="Brand"
            />
            <Action
              role="Button"
              label="Documentation"
              prominence="Standard"
            />
          </Frame.Stack>

          <div className="mt-20 opacity-20">
            <ChevronDown size={32} />
          </div>
        </Frame.Stack>
      </Section>

      {/* Features Section 1 */}
      <Section role="Main">
        <Frame.Stack density="Comfortable" className="max-w-6xl">
          <div className="grid grid-cols-2 gap-12 items-center">
            <Frame.Stack density="Comfortable">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <Zap size={32} className="text-accent" />
              </div>
              <Text
                role="Title"
                content="Intent-Driven Design"
                prominence="Hero"
              />
              <Text
                role="Body"
                content="Declare why, not how. IDDL automatically handles tokens, semantics, and accessibility based on your declared intent."
                prominence="Standard"
              />
              <Action
                role="Button"
                label="Learn More"
                prominence="Strong"
                intent="Brand"
              />
            </Frame.Stack>

            <Block role="Card" prominence="Standard">
              <Text
                role="Code"
                content="<Action prominence='Strong' intent='Brand'>"
                prominence="Standard"
              />
            </Block>
          </div>
        </Frame.Stack>
      </Section>

      {/* Features Section 2 */}
      <Section role="Main">
        <Frame.Stack density="Comfortable" className="max-w-6xl">
          <div className="grid grid-cols-2 gap-12 items-center">
            <Block role="Card" prominence="Standard">
              <Text
                role="Title"
                content="100+ Components"
                prominence="Hero"
              />
            </Block>

            <Frame.Stack density="Comfortable">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
                <Target size={32} className="text-green-500" />
              </div>
              <Text
                role="Title"
                content="Production Ready"
                prominence="Hero"
              />
              <Text
                role="Body"
                content="Built-in keyboard navigation, focus management, accessibility, and enterprise features. Everything you need, out of the box."
                prominence="Standard"
              />
              <Action
                role="Button"
                label="Explore Features"
                prominence="Strong"
                intent="Positive"
              />
            </Frame.Stack>
          </div>
        </Frame.Stack>
      </Section>

      {/* CTA Section */}
      <Section role="Main">
        <Block role="Card" prominence="Hero" intent="Brand" className="p-16 text-center max-w-3xl rounded-3xl">
          <Text
            role="Title"
            content="Ready to Transform Your Workflow?"
            prominence="Hero"
          />
          <Text
            role="Body"
            content="Join thousands of developers building better interfaces with IDDL."
            prominence="Standard"
          />
          <Block role="Toolbar" className="justify-center gap-4 mt-8">
            <Action
              role="Button"
              label="Start Free Trial"
              prominence="Strong"
            />
            <Action
              role="Button"
              label="Contact Sales"
              prominence="Standard"
            />
          </Block>
        </Block>
      </Section>

      {/* Footer */}
      <Section role="Footer" variant="Plain">
        <Frame.Stack density="Comfortable" className="py-12">
          <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto w-full">
            <Frame.Stack density="Compact">
              <Text role="Label" content="Product" prominence="Strong" />
              <Action role="Link" label="Features" prominence="Subtle" />
              <Action role="Link" label="Pricing" prominence="Subtle" />
              <Action role="Link" label="Documentation" prominence="Subtle" />
              <Action role="Link" label="Changelog" prominence="Subtle" />
            </Frame.Stack>

            <Frame.Stack density="Compact">
              <Text role="Label" content="Company" prominence="Strong" />
              <Action role="Link" label="About" prominence="Subtle" />
              <Action role="Link" label="Blog" prominence="Subtle" />
              <Action role="Link" label="Careers" prominence="Subtle" />
              <Action role="Link" label="Contact" prominence="Subtle" />
            </Frame.Stack>

            <Frame.Stack density="Compact">
              <Text role="Label" content="Resources" prominence="Strong" />
              <Action role="Link" label="Community" prominence="Subtle" />
              <Action role="Link" label="Support" prominence="Subtle" />
              <Action role="Link" label="Status" prominence="Subtle" />
              <Action role="Link" label="GitHub" prominence="Subtle" />
            </Frame.Stack>

            <Frame.Stack density="Compact">
              <Text role="Label" content="Legal" prominence="Strong" />
              <Action role="Link" label="Privacy" prominence="Subtle" />
              <Action role="Link" label="Terms" prominence="Subtle" />
              <Action role="Link" label="Security" prominence="Subtle" />
              <Action role="Link" label="Cookies" prominence="Subtle" />
            </Frame.Stack>
          </div>

          <div className="h-px bg-border my-8 max-w-6xl mx-auto w-full" />

          <Block role="Toolbar" className="max-w-6xl mx-auto w-full justify-between">
            <Text
              role="Caption"
              content="© 2026 IDDL Platform. All rights reserved."
              prominence="Subtle"
            />
            <Frame.Stack className="flex-row gap-4">
              <Action role="Link" label="Twitter" prominence="Subtle" />
              <Action role="Link" label="GitHub" prominence="Subtle" />
              <Action role="Link" label="Discord" prominence="Subtle" />
            </Frame.Stack>
          </Block>
        </Frame.Stack>
      </Section>
    </>
  );
}
