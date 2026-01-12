/**
 * BlogPostExample2
 *
 * Real blog post page with role="Document" layout="Aside"
 * Uses ONLY IDDL - NO className
 */

import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Page } from '@/components/dsl/Page/Page';
import { Section } from '@/components/dsl/Section/Section';

export function BlogPostExample2() {
  return (
    <Page role="Document" layout="Aside" title="Blog Post">
      {/* Main Content */}
      <Section role="Main">
        <Block role="Container" density="Comfortable">
          <Block role="Stack" density="Comfortable">
            {/* Article Header */}
            <Block role="Stack" density="Standard">
              <Text role="Overline" prominence="Subtle" content="Technology" />
              <Text role="Title" prominence="Hero" content="Building Design Systems with IDDL" />
              <Block role="Stack" density="Compact">
                <Block role="Stack" density="Compact">
                  <Text role="Body" content="👤" />
                  <Text role="Username" content="Sarah Chen" prominence="Strong" />
                </Block>
                <Text role="Timestamp" content="Published 3 days ago" />
              </Block>
            </Block>

            {/* Article Content */}
            <Block role="Stack" density="Comfortable">
              <Text
                role="Body"
                prominence="Hero"
                content="IDDL (Intent-Driven Design Language) represents a paradigm shift in how we build user interfaces."
              />

              <Text
                role="Body"
                prominence="Standard"
                content="Traditional design systems require developers to remember countless className combinations. IDDL changes this by making developers declare intent instead of implementation."
              />

              <Block role="Quote" prominence="Subtle" density="Comfortable">
                <Text
                  role="Blockquote"
                  prominence="Standard"
                  content="Declare why, not how. The system handles the rest."
                />
              </Block>

              <Text role="Heading" prominence="Strong" content="Key Benefits" />
              <Block role="List" density="Standard">
                <Action role="ListItem">
                  <Text role="Body" content="✓ No className pollution" />
                </Action>
                <Action role="ListItem">
                  <Text role="Body" content="✓ Automatic token generation" />
                </Action>
                <Action role="ListItem">
                  <Text role="Body" content="✓ Built-in accessibility" />
                </Action>
              </Block>

              <Text role="Heading" prominence="Strong" content="Getting Started" />
              <Text
                role="Body"
                prominence="Standard"
                content="Start by understanding the three core axes: prominence, intent, and density. Every component uses these to generate appropriate tokens."
              />

              <Block role="Code" prominence="Subtle" density="Standard">
                <Text
                  role="Code"
                  content='<Action role="Button" prominence="Hero" intent="Brand">Submit</Action>'
                />
              </Block>
            </Block>

            {/* Article Footer */}
            <Block role="Divider" />
            <Block role="Stack" density="Compact">
              <Action role="Button" prominence="Hero" intent="Brand" label="Share Article" />
              <Action role="Button" prominence="Standard" label="Bookmark" />
            </Block>
          </Block>
        </Block>
      </Section>

      {/* Sidebar (Table of Contents) */}
      <Section role="Aside">
        <Block role="Container" density="Standard">
          <Block role="Stack" density="Standard">
            <Text role="Heading" prominence="Strong" content="On this page" />
            <Block role="List" density="Compact">
              <Action role="Link" label="Key Benefits" prominence="Subtle" />
              <Action role="Link" label="Getting Started" prominence="Subtle" />
              <Action role="Link" label="Examples" prominence="Subtle" />
            </Block>
          </Block>

          <Block role="Divider" />

          <Block role="Stack" density="Standard">
            <Text role="Heading" prominence="Strong" content="Related Articles" />
            <Block role="List" density="Compact">
              <Action role="Link" label="Token Engine Architecture" prominence="Subtle" />
              <Action role="Link" label="Designing with Purpose" prominence="Subtle" />
            </Block>
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
