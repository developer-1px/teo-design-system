/**
 * FocusExample - Centered single-task layout examples
 *
 * Use cases: Login, Sign Up, Payment, Checkout, Single-action flows
 */

import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Field } from '@/components/dsl/Element/Field/Field';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';

export function FocusExample() {
  return (
    <>
      {/* Optional Header - Minimal */}
      <Section role="Header" variant="Plain">
        <Block role="Toolbar" className="px-6 py-3">
          <Action role="Button" prominence="Subtle" className="gap-2">
            <ArrowLeft size={16} />
            Back
          </Action>
          <Action role="Link" label="Need help?" prominence="Subtle" />
        </Block>
      </Section>

      {/* Main - Centered Content */}
      <Section
        role="Main"
        className="relative h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Modern Abstract Background Orbs */}
        <div className="absolute top-[-20%] left-[-15%] w-[60%] aspect-square rounded-full bg-[radial-gradient(circle,var(--color-primary),transparent_70%)] opacity-[0.2] blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[60%] aspect-square rounded-full bg-[radial-gradient(circle,var(--color-accent),transparent_70%)] opacity-[0.15] blur-[100px] animate-pulse-slow delay-700" />

        <Block
          role="Card"
          prominence="Hero"
          className="w-full max-w-md p-10 relative z-10 shadow-soft-xl rounded-[3rem] border border-white/20"
        >
          {/* Logo/Brand */}
          <Block role="Stack" className="items-center mb-10">
            <div className="w-20 h-20 rounded-[2rem] bg-primary text-white flex items-center justify-center mb-8 shadow-soft-lg rotate-3 hover:rotate-0 transition-all duration-500 ease-out cursor-pointer group">
              <Lock size={36} className="group-hover:scale-110 transition-transform" />
            </div>
            <Text
              role="Title"
              content="STRATA OS"
              prominence="Hero"
              className="text-center font-black tracking-tighter uppercase"
            />
            <Text
              role="Body"
              content="Secure gateway to your high-intent design workspace"
              prominence="Subtle"
              className="text-center mt-3 opacity-60 text-sm max-w-[280px]"
            />
          </Block>

          {/* Login Form */}
          <Block role="Form" density="Standard">
            <Block role="Stack" density="Standard" className="gap-6">
              <Field
                role="Textbox"
                label="Email"
                placeholder="Enter your email"
                prominence="Standard"
                required
              />

              <Field
                role="Textbox"
                label="Password"
                placeholder="Enter your password"
                prominence="Standard"
                spec={{ type: 'password' }}
                required
              />

              <Block role="Toolbar" className="items-center justify-between">
                <Field role="Checkbox" label="Remember me" prominence="Subtle" />
                <Action
                  role="Link"
                  label="Forgot password?"
                  prominence="Standard"
                  className="text-sm opacity-60"
                />
              </Block>

              <Action
                role="Button"
                label="Sign In"
                prominence="Strong"
                intent="Brand"
                className="w-full h-14 rounded-2xl font-bold shadow-soft-lg"
              >
                <ArrowRight size={18} />
              </Action>
            </Block>
          </Block>

          {/* Divider */}
          <Block role="Stack" className="flex-row items-center gap-4 my-10">
            <div className="flex-1 h-px bg-border/30" />
            <Text
              role="Caption"
              content="VERIFY VIA"
              prominence="Subtle"
              className="text-[10px] uppercase font-black tracking-widest opacity-30"
            />
            <div className="flex-1 h-px bg-border/30" />
          </Block>

          {/* Footer */}
          <Block role="Toolbar" className="justify-center mt-8">
            <Text role="Body" content="No account?" prominence="Subtle" />
            <Action role="Link" label="Sign up now" prominence="Strong" intent="Brand" />
          </Block>
        </Block>
      </Section>

      {/* Footer - Minimal Links */}
      <Section role="Footer" variant="Plain">
        <Block role="Toolbar" className="px-6 py-4 justify-center">
          <Block role="Stack" className="flex-row gap-8">
            <Action role="Link" label="Privacy" prominence="Subtle" />
            <Action role="Link" label="Terms" prominence="Subtle" />
            <Action role="Link" label="Support" prominence="Subtle" />
          </Block>
        </Block>
      </Section>
    </>
  );
}
