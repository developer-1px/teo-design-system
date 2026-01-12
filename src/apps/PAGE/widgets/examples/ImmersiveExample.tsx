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
      {/* Fixed Header - Transparent Overlay */}
      <Section
        role="Header"
        variant="Plain"
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
      >
        <Block role="Toolbar" className="px-6 py-4">
          <Block role="Stack" className="flex-row items-center gap-3">
            <Sparkles size={24} className="text-accent" />
            <Text role="Label" content="IDDL Platform" prominence="Strong" />
          </Block>
          <Block role="Stack" className="flex-row gap-4">
            <Action role="Link" label="Features" prominence="Subtle" />
            <Action role="Link" label="Pricing" prominence="Subtle" />
            <Action role="Link" label="Docs" prominence="Subtle" />
            <Action role="Button" label="Get Started" prominence="Strong" intent="Brand" />
            <Action role="IconButton" prominence="Subtle" className="md:hidden">
              <Menu size={20} />
            </Action>
          </Block>
        </Block>
      </Section>

      {/* Hero Section */}
      <Section
        role="Main"
        className="snap-start h-screen flex items-center justify-center pt-20 relative overflow-hidden"
      >
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow delay-700" />

        <Block
          role="Stack"
          density="Comfortable"
          className="text-center max-w-5xl px-6 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-primary mb-10 backdrop-blur-xl shadow-soft-xl animate-fade-in-up">
            <Sparkles size={16} className="animate-pulse" />
            <Text
              role="Caption"
              content="NEW: IDDL 6.5 ENGINE CORE"
              prominence="Strong"
              className="text-[11px] tracking-[0.2em] font-black uppercase"
            />
          </div>

          <Text
            role="Title"
            content="Interfaces Built with Higher Intent"
            prominence="Hero"
            className="text-7xl md:text-8xl font-black mb-8 tracking-[-0.04em] leading-[0.9] text-white"
          />

          <Text
            role="Body"
            content="Stop micro-managing pixels. Start orchestrating experiences. The world's first intent-based design engine for mission-critical software."
            prominence="Standard"
            className="text-xl md:text-2xl mb-12 opacity-50 max-w-2xl mx-auto leading-relaxed font-light text-white"
          />

          <Block
            role="Stack"
            className="flex-row justify-center gap-6 animate-fade-in-up delay-300"
          >
            <Action
              role="Button"
              label="Exploration"
              prominence="Strong"
              intent="Brand"
              className="px-10 py-5 h-auto text-lg rounded-2xl shadow-[0_20px_40px_rgba(56,189,248,0.3)] transition-all hover:scale-105"
            />
            <Action
              role="Button"
              label="Documentation"
              prominence="Standard"
              className="px-10 py-5 h-auto text-lg rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white"
            />
          </Block>

          <div className="mt-20 animate-bounce opacity-20">
            <ChevronDown size={32} className="mx-auto text-white" />
          </div>
        </Block>
      </Section>

      {/* Features Section 1 */}
      <Section role="Main" className="snap-start h-screen flex items-center justify-center">
        <Block role="Stack" density="Comfortable" className="max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-12 items-center">
            <Block role="Stack" density="Comfortable">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <Zap size={32} className="text-accent" />
              </div>
              <Text
                role="Title"
                content="Intent-Driven Design"
                prominence="Hero"
                className="text-4xl font-bold"
              />
              <Text
                role="Body"
                content="Declare why, not how. IDDL automatically handles tokens, semantics, and accessibility based on your declared intent."
                prominence="Standard"
                className="text-lg opacity-80"
              />
              <Action
                role="Button"
                label="Learn More"
                prominence="Strong"
                intent="Brand"
                className="mt-4 w-fit"
              />
            </Block>

            <Block
              role="Card"
              prominence="Standard"
              className="p-8 aspect-square flex items-center justify-center"
            >
              <Text
                role="Code"
                content="<Action prominence='Strong' intent='Brand'>"
                prominence="Standard"
              />
            </Block>
          </div>
        </Block>
      </Section>

      {/* Features Section 2 */}
      <Section role="Main" className="snap-start h-screen flex items-center justify-center">
        <Block role="Stack" density="Comfortable" className="max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-12 items-center">
            <Block
              role="Card"
              prominence="Standard"
              className="p-8 aspect-square flex items-center justify-center"
            >
              <Text
                role="Title"
                content="100+ Components"
                prominence="Hero"
                className="text-center"
              />
            </Block>

            <Block role="Stack" density="Comfortable">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
                <Target size={32} className="text-green-500" />
              </div>
              <Text
                role="Title"
                content="Production Ready"
                prominence="Hero"
                className="text-4xl font-bold"
              />
              <Text
                role="Body"
                content="Built-in keyboard navigation, focus management, accessibility, and enterprise features. Everything you need, out of the box."
                prominence="Standard"
                className="text-lg opacity-80"
              />
              <Action
                role="Button"
                label="Explore Features"
                prominence="Strong"
                intent="Positive"
                className="mt-4 w-fit"
              />
            </Block>
          </div>
        </Block>
      </Section>

      {/* CTA Section */}
      <Section role="Main" className="snap-start h-screen flex items-center justify-center">
        <Block
          role="Card"
          prominence="Hero"
          intent="Brand"
          className="p-16 text-center max-w-3xl px-6 rounded-3xl"
        >
          <Text
            role="Title"
            content="Ready to Transform Your Workflow?"
            prominence="Hero"
            className="text-5xl font-black mb-6 text-white"
          />
          <Text
            role="Body"
            content="Join thousands of developers building better interfaces with IDDL."
            prominence="Standard"
            className="text-xl mb-8 text-white/90"
          />
          <Block role="Toolbar" className="justify-center gap-4">
            <Action
              role="Button"
              label="Start Free Trial"
              prominence="Strong"
              className="px-8 py-3 h-auto bg-white text-primary hover:bg-white/90"
            />
            <Action
              role="Button"
              label="Contact Sales"
              prominence="Standard"
              className="px-8 py-3 h-auto border border-white/30 text-white hover:bg-white/10"
            />
          </Block>
        </Block>
      </Section>

      {/* Footer */}
      <Section role="Footer" variant="Plain" className="snap-start">
        <Block role="Stack" density="Comfortable" className="px-6 py-12">
          <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Block role="Stack" density="Compact">
              <Text role="Label" content="Product" prominence="Strong" />
              <Action role="Link" label="Features" prominence="Subtle" />
              <Action role="Link" label="Pricing" prominence="Subtle" />
              <Action role="Link" label="Documentation" prominence="Subtle" />
              <Action role="Link" label="Changelog" prominence="Subtle" />
            </Block>

            <Block role="Stack" density="Compact">
              <Text role="Label" content="Company" prominence="Strong" />
              <Action role="Link" label="About" prominence="Subtle" />
              <Action role="Link" label="Blog" prominence="Subtle" />
              <Action role="Link" label="Careers" prominence="Subtle" />
              <Action role="Link" label="Contact" prominence="Subtle" />
            </Block>

            <Block role="Stack" density="Compact">
              <Text role="Label" content="Resources" prominence="Strong" />
              <Action role="Link" label="Community" prominence="Subtle" />
              <Action role="Link" label="Support" prominence="Subtle" />
              <Action role="Link" label="Status" prominence="Subtle" />
              <Action role="Link" label="GitHub" prominence="Subtle" />
            </Block>

            <Block role="Stack" density="Compact">
              <Text role="Label" content="Legal" prominence="Strong" />
              <Action role="Link" label="Privacy" prominence="Subtle" />
              <Action role="Link" label="Terms" prominence="Subtle" />
              <Action role="Link" label="Security" prominence="Subtle" />
              <Action role="Link" label="Cookies" prominence="Subtle" />
            </Block>
          </div>

          <div className="h-px bg-border my-8 max-w-6xl mx-auto" />

          <Block role="Toolbar" className="max-w-6xl mx-auto">
            <Text
              role="Caption"
              content="© 2026 IDDL Platform. All rights reserved."
              prominence="Subtle"
            />
            <Block role="Stack" className="flex-row gap-4">
              <Action role="Link" label="Twitter" prominence="Subtle" />
              <Action role="Link" label="GitHub" prominence="Subtle" />
              <Action role="Link" label="Discord" prominence="Subtle" />
            </Block>
          </Block>
        </Block>
      </Section>
    </>
  );
}
