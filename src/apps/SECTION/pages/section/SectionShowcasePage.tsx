/**
 * SectionShowcasePage - Section Component Showcase
 * 
 * MECE gallery of IDDL Section component capabilities.
 * Demonstrates the semantic regions (Roles) available for different Page Layouts.
 */

import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';

export function SectionShowcasePage() {
  return (
    <Page role="Application" layout="Studio">
      {/* Header */}
      <Section role="Toolbar" prominence="Standard">
        <Block role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Standard" content="Section Component Gallery" />
          <Block role="Divider" layout="inline"><></></Block>
          <Text role="Body" prominence="Subtle" content="Semantic Layout Regions v2.1" />
        </Block>
      </Section>

      {/* Sidebar navigation */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Block role="ScrollMenu" layout="stack" density="Comfortable">
          <Text role="Label" content="LAYOUT CONTEXTS" prominence="Subtle" className="px-2 pt-2" />
          <Block role="Container" layout="stack" density="Standard">
            {['General (Universal)', 'IDE Context (Studio)', 'Web Context (Sidebar)', 'Dialog Context'].map(item => (
              <Block key={item} role="Inline" clickable value={item} className="px-2 py-1 hover:bg-surface-elevated rounded-md cursor-pointer">
                <Text role="Body" content={item} prominence="Standard" />
              </Block>
            ))}
          </Block>
        </Block>
      </Section>

      {/* Main Content */}
      <Section role="Editor" prominence="Standard" mode="view">
        <Block role="Container" layout="stack" density="Comfortable" className="p-8 gap-12 max-w-5xl mx-auto">

          {/* Header */}
          <Block role="Container" layout="stack" density="Standard" className="gap-2">
            <Text role="Title" prominence="Hero" content="Sections" />
            <Text role="Body" prominence="Hero" content="Semantic areas that define the page structure." />
          </Block>

          <Block role="Divider" layout="stack"><></></Block>

          {/* 1. Universal */}
          <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="1. Universal Sections" />
              <Text role="Body" prominence="Subtle" content="Available in almost all layouts." />
            </div>

            <Block role="Grid" layout="grid" density="Comfortable" className="grid-cols-2 gap-8">
              <Block role="Card" className="p-4 gap-2 border-b-4 border-b-brand-primary">
                <Text role="Title" content="Header" />
                <Text role="Caption" content="<header> tag. Typically fixed height." />
              </Block>
              <Block role="Card" className="p-4 gap-2 border-t-4 border-t-brand-primary">
                <Text role="Title" content="Footer" />
                <Text role="Caption" content="<footer> tag. Bottom region." />
              </Block>
              <Block role="Card" className="p-4 gap-2 border-4 border-brand-primary">
                <Text role="Title" content="Container" />
                <Text role="Caption" content="<section> tag. Generic container." />
              </Block>
              <Block role="Card" className="p-4 gap-2 bg-surface-sunken">
                <Text role="Title" content="Main" />
                <Text role="Caption" content="<main> tag. Primary content area." />
              </Block>
            </Block>
          </Block>

          <Block role="Divider" layout="stack"><></></Block>

          {/* 2. IDE Context */}
          <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="2. IDE Context (Studio)" />
              <Text role="Body" prominence="Subtle" content="Specialized sections for development environments." />
            </div>

            <Block role="Grid" layout="grid" density="Comfortable" className="grid-cols-3 gap-6">
              <Block role="Card" className="p-4 border border-l-4 border-l-accent">
                <Text role="Label" content="ActivityBar" />
                <Text role="Caption" content="Narrow icon sidebar." />
              </Block>
              <Block role="Card" className="p-4 border border-l-4 border-l-accent">
                <Text role="Label" content="PrimarySidebar" />
                <Text role="Caption" content="File explorer tree." />
              </Block>
              <Block role="Card" className="p-4 border border-t-4 border-t-accent">
                <Text role="Label" content="Panel" />
                <Text role="Caption" content="Terminal/Output area." />
              </Block>
              <Block role="Card" className="p-4 bg-surface-sunken col-span-2">
                <Text role="Label" content="Editor" />
                <Text role="Caption" content="Code editing area. Often has tabs." />
              </Block>
              <Block role="Card" className="p-4 border border-r-4 border-r-accent">
                <Text role="Label" content="SecondarySidebar" />
                <Text role="Caption" content="Outline or Properties." />
              </Block>
            </Block>
          </Block>

          <Block role="Divider" layout="stack"><></></Block>

          {/* 3. Web Context */}
          <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="3. Web Context" />
              <Text role="Body" prominence="Subtle" content="Standard web page regions." />
            </div>

            <Block role="Grid" layout="grid" density="Comfortable" className="grid-cols-3 gap-6">
              <Block role="Card" className="p-4 border border-l-4 border-l-brand-primary">
                <Text role="Label" content="Navigator" />
                <Text role="Caption" content="Table of Contents / Menu." />
              </Block>
              <Block role="Card" className="p-4 bg-surface-sunken">
                <Text role="Label" content="Main" />
                <Text role="Caption" content="Article content." />
              </Block>
              <Block role="Card" className="p-4 border border-r-4 border-r-brand-primary">
                <Text role="Label" content="Aside" />
                <Text role="Caption" content="Related info / Ad." />
              </Block>
            </Block>
          </Block>

          <Block role="Divider" layout="stack"><></></Block>

          {/* 4. Dialog Context */}
          <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="4. Dialog Context" />
              <Text role="Body" prominence="Subtle" content="Regions within a modal dialog." />
            </div>

            <Block role="Card" className="p-0 border border-border-default max-w-md">
              <Block role="Container" className="p-4 border-b border-border-default bg-surface-raised">
                <Text role="Label" content="DialogHeader" />
              </Block>
              <Block role="Container" className="p-8 bg-surface">
                <Text role="Label" content="DialogContent" />
              </Block>
              <Block role="Container" className="p-4 border-t border-border-default bg-surface-raised">
                <Text role="Label" content="DialogFooter" />
              </Block>
            </Block>
          </Block>

        </Block>
      </Section>
    </Page>
  );
}
