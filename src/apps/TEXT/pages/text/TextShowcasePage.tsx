/**
 * TextShowcasePage - Text Component Showcase
 * 
 * MECE gallery of IDDL Text component capabilities.
 * Demonstrates all Roles, Prominences, Intents, and Behaviors.
 */

import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';

export function TextShowcasePage() {
  return (
    <Page role="Application" layout="Studio">
      {/* Header */}
      <Section role="Toolbar" prominence="Standard">
        <Group role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Standard" content="Text Component Gallery" />
          <Group role="Divider" layout="inline"><></></Group>
          <Text role="Body" prominence="Subtle" content="Typography System v2.1" />
        </Group>
      </Section>

      {/* Sidebar navigation */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Group role="ScrollMenu" layout="stack" density="Comfortable">
          <Text role="Label" content="CATEGORIES" prominence="Subtle" className="px-2 pt-2" />
          <Group role="Container" layout="stack" density="Standard">
            {['Typography Matrix', 'Intent Colors', 'Alignment & Layout', 'Highlighting', 'Code & Monospace'].map(item => (
              <Group key={item} role="Inline" clickable value={item} className="px-2 py-1 hover:bg-surface-elevated rounded-md cursor-pointer">
                <Text role="Body" content={item} prominence="Standard" />
              </Group>
            ))}
          </Group>
        </Group>
      </Section>

      {/* Main Content */}
      <Section role="Editor" prominence="Standard" mode="view">
        <Group role="Container" layout="stack" density="Comfortable" className="p-8 gap-12 max-w-4xl mx-auto">

          {/* Header */}
          <Group role="Container" layout="stack" density="Standard" className="gap-2">
            <Text role="Title" prominence="Hero" content="Typography" />
            <Text role="Body" prominence="Hero" content="The semantic text component for consistent Application UI." />
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 1. Typography Matrix (Role x Prominence) */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="1. Typography Matrix" />
              <Text role="Body" prominence="Subtle" content="Combinations of semantic Role and visual Prominence." />
            </div>

            {/* Title Role */}
            <Group role="Card" density="Standard" className="p-6 gap-6">
              <Text role="Label" content="Title Role" prominence="Subtle" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-baseline">
                <div>
                  <Text role="Title" prominence="Hero" content="Hero Title" />
                  <Text role="Caption" content="prominence='Hero' (Page Titles)" />
                </div>
                <div>
                  <Text role="Title" prominence="Strong" content="Strong Title" />
                  <Text role="Caption" content="prominence='Strong' (Section Headers)" />
                </div>
                <div>
                  <Text role="Title" prominence="Standard" content="Standard Title" />
                  <Text role="Caption" content="prominence='Standard' (Card Titles)" />
                </div>
                <div>
                  <Text role="Title" prominence="Subtle" content="Subtle Title" />
                  <Text role="Caption" content="prominence='Subtle' (Group Headers)" />
                </div>
              </div>
            </Group>

            {/* Body Role */}
            <Group role="Card" density="Standard" className="p-6 gap-6">
              <Text role="Label" content="Body Role" prominence="Subtle" />
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Text role="Body" prominence="Hero" content="Hero Body used for lead paragraphs." />
                  <Text role="Caption" content="prominence='Hero' (Lead Text)" />
                </div>
                <div className="flex flex-col gap-1">
                  <Text role="Body" prominence="Strong" content="Strong body text is used for emphasis within content." />
                  <Text role="Caption" content="prominence='Strong' (Emphasis)" />
                </div>
                <div className="flex flex-col gap-1">
                  <Text role="Body" prominence="Standard" content="Standard body text is the default for most reading content. It has good readability and contrast." />
                  <Text role="Caption" content="prominence='Standard' (Default)" />
                </div>
                <div className="flex flex-col gap-1">
                  <Text role="Body" prominence="Subtle" content="Subtle body text is for secondary information, metadata, or helper text." />
                  <Text role="Caption" content="prominence='Subtle' (Muted)" />
                </div>
              </div>
            </Group>
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 2. Intent Colors */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="2. Intent Colors" />
              <Text role="Body" prominence="Subtle" content="Semantic colors applied to text." />
            </div>

            <Group role="Grid" layout="grid" density="Standard" className="grid-cols-2 md:grid-cols-3 gap-6">
              <Group role="Card" className="p-4 items-center justify-center border-l-4 border-l-current text-text-primary">
                <Text role="Body" intent="Neutral" content="Neutral Intent" prominence="Strong" />
              </Group>
              <Group role="Card" className="p-4 items-center justify-center border-l-4 border-l-current text-brand-primary">
                <Text role="Body" intent="Brand" content="Brand Intent" prominence="Strong" />
              </Group>
              <Group role="Card" className="p-4 items-center justify-center border-l-4 border-l-green-500">
                <Text role="Body" intent="Positive" content="Positive Intent" prominence="Strong" />
              </Group>
              <Group role="Card" className="p-4 items-center justify-center border-l-4 border-l-yellow-500">
                <Text role="Body" intent="Caution" content="Caution Intent" prominence="Strong" />
              </Group>
              <Group role="Card" className="p-4 items-center justify-center border-l-4 border-l-red-500">
                <Text role="Body" intent="Critical" content="Critical Intent" prominence="Strong" />
              </Group>
              <Group role="Card" className="p-4 items-center justify-center border-l-4 border-l-blue-500">
                <Text role="Body" intent="Info" content="Info Intent" prominence="Strong" />
              </Group>
            </Group>
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 3. Alignment */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="3. Alignment" />
              <Text role="Body" prominence="Subtle" content="Text alignment utilities." />
            </div>

            <Group role="Card" className="p-6 gap-4">
              <Text role="Body" align="left" content="Left Aligned Text (Default)" className="bg-surface-sunken p-2" />
              <Text role="Body" align="center" content="Center Aligned Text" className="bg-surface-sunken p-2" />
              <Text role="Body" align="right" content="Right Aligned Text" className="bg-surface-sunken p-2" />
            </Group>
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 4. Highlighting */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="4. Search Highlighting" />
              <Text role="Body" prominence="Subtle" content="Built-in highlighting for search results." />
            </div>

            <Group role="Card" className="p-6">
              <Text
                role="Body"
                prominence="Standard"
                content="The intent-driven design language allows for quick semantic updates."
                highlight="intent-driven"
              />
              <Text role="Caption" content="highlight='intent-driven'" className="mt-2" />
            </Group>
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 5. Code & Monospace */}
          <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
              <Text role="Title" prominence="Strong" content="5. Technical Text" />
              <Text role="Body" prominence="Subtle" content="Monospaced styles for code and keys." />
            </div>

            <Group role="Grid" layout="grid" density="Standard" className="grid-cols-1 md:grid-cols-2 gap-8">
              <Group role="Container" layout="stack" className="gap-2">
                <Text role="Label" content="Inline Code" />
                <div>
                  <Text role="Body" content="Run the command " className="inline" />
                  <Text role="Code" content="npm run dev" />
                  <Text role="Body" content=" to start the server." className="inline" />
                </div>
              </Group>

              <Group role="Container" layout="stack" className="gap-2">
                <Text role="Label" content="Code Block (Mock)" />
                <Group role="Card" className="bg-surface-sunken p-4 font-mono text-sm">
                  <Text role="Code" content="import { Text } from '@/iddl';" />
                  <Text role="Code" content="<Text role='Title' />" />
                </Group>
              </Group>
            </Group>
          </Group>

        </Group>
      </Section>
    </Page>
  );
}
