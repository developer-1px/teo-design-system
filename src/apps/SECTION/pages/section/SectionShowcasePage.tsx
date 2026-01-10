/**
 * SectionShowcasePage - Section Component Showcase
 * 
 * MECE gallery of IDDL Section component capabilities.
 * Demonstrates the semantic regions (Roles) available for different Page Layouts.
 */

import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';

export function SectionShowcasePage() {
  return (
    <Page role="Application" layout="Studio">
      {/* Header */}
      <Section role="Toolbar" prominence="Standard">
        <Group role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Standard" content="Section Component Gallery" />
          <Group role="Divider" layout="inline"><></></Group>
          <Text role="Body" prominence="Subtle" content="Semantic Layout Regions v2.1" />
        </Group>
      </Section>

      {/* Sidebar navigation */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Group role="ScrollMenu" layout="stack" density="Comfortable">
          <Text role="Label" content="LAYOUT CONTEXTS" prominence="Subtle" className="px-2 pt-2" />
          <Group role="Container" layout="stack" density="Standard">
            {['General (Universal)', 'IDE Context (Studio)', 'Web Context (Sidebar)', 'Dialog Context'].map(item => (
              <Group key={item} role="Inline" clickable value={item} className="px-2 py-1 hover:bg-surface-elevated rounded-md cursor-pointer">
                <Text role="Body" content={item} prominence="Standard" />
              </Group>
            ))}
          </Group>
        </Group>
      </Section>

      {/* Main Content */}
      <Section role="Editor" prominence="Standard" mode="view">
        <Group role="Container" layout="stack" density="Comfortable" className="p-8 gap-12 max-w-5xl mx-auto">

          {/* Header */}
          <Group role="Container" layout="stack" density="Standard" className="gap-2">
            <Text role="Title" prominence="Hero" content="Sections" />
            <Text role="Body" prominence="Hero" content="Semantic areas that define the page structure." />
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 1. Universal */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="1. Universal Sections" />
              <Text role="Body" prominence="Subtle" content="Available in almost all layouts." />
            </div>

            <Group role="Grid" layout="grid" density="Comfortable" className="grid-cols-2 gap-8">
              <Group role="Card" className="p-4 gap-2 border-b-4 border-b-brand-primary">
                <Text role="Title" content="Header" />
                <Text role="Caption" content="<header> tag. Typically fixed height." />
              </Group>
              <Group role="Card" className="p-4 gap-2 border-t-4 border-t-brand-primary">
                <Text role="Title" content="Footer" />
                <Text role="Caption" content="<footer> tag. Bottom region." />
              </Group>
              <Group role="Card" className="p-4 gap-2 border-4 border-brand-primary">
                <Text role="Title" content="Container" />
                <Text role="Caption" content="<section> tag. Generic container." />
              </Group>
              <Group role="Card" className="p-4 gap-2 bg-surface-sunken">
                <Text role="Title" content="Main" />
                <Text role="Caption" content="<main> tag. Primary content area." />
              </Group>
            </Group>
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 2. IDE Context */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="2. IDE Context (Studio)" />
              <Text role="Body" prominence="Subtle" content="Specialized sections for development environments." />
            </div>

            <Group role="Grid" layout="grid" density="Comfortable" className="grid-cols-3 gap-6">
              <Group role="Card" className="p-4 border border-l-4 border-l-accent">
                <Text role="Label" content="ActivityBar" />
                <Text role="Caption" content="Narrow icon sidebar." />
              </Group>
              <Group role="Card" className="p-4 border border-l-4 border-l-accent">
                <Text role="Label" content="PrimarySidebar" />
                <Text role="Caption" content="File explorer tree." />
              </Group>
              <Group role="Card" className="p-4 border border-t-4 border-t-accent">
                <Text role="Label" content="Panel" />
                <Text role="Caption" content="Terminal/Output area." />
              </Group>
              <Group role="Card" className="p-4 bg-surface-sunken col-span-2">
                <Text role="Label" content="Editor" />
                <Text role="Caption" content="Code editing area. Often has tabs." />
              </Group>
              <Group role="Card" className="p-4 border border-r-4 border-r-accent">
                <Text role="Label" content="SecondarySidebar" />
                <Text role="Caption" content="Outline or Properties." />
              </Group>
            </Group>
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 3. Web Context */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="3. Web Context" />
              <Text role="Body" prominence="Subtle" content="Standard web page regions." />
            </div>

            <Group role="Grid" layout="grid" density="Comfortable" className="grid-cols-3 gap-6">
              <Group role="Card" className="p-4 border border-l-4 border-l-brand-primary">
                <Text role="Label" content="Navigator" />
                <Text role="Caption" content="Table of Contents / Menu." />
              </Group>
              <Group role="Card" className="p-4 bg-surface-sunken">
                <Text role="Label" content="Main" />
                <Text role="Caption" content="Article content." />
              </Group>
              <Group role="Card" className="p-4 border border-r-4 border-r-brand-primary">
                <Text role="Label" content="Aside" />
                <Text role="Caption" content="Related info / Ad." />
              </Group>
            </Group>
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 4. Dialog Context */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="4. Dialog Context" />
              <Text role="Body" prominence="Subtle" content="Regions within a modal dialog." />
            </div>

            <Group role="Card" className="p-0 border border-border-default max-w-md">
              <Group role="Container" className="p-4 border-b border-border-default bg-surface-raised">
                <Text role="Label" content="DialogHeader" />
              </Group>
              <Group role="Container" className="p-8 bg-surface">
                <Text role="Label" content="DialogContent" />
              </Group>
              <Group role="Container" className="p-4 border-t border-border-default bg-surface-raised">
                <Text role="Label" content="DialogFooter" />
              </Group>
            </Group>
          </Group>

        </Group>
      </Section>
    </Page>
  );
}
