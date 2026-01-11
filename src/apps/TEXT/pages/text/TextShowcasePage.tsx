import { Block } from '@/components/types/Block/Block.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';

export function TextShowcasePage() {
  const categories = [
    { id: 'matrix', label: 'Typography Matrix' },
    { id: 'intents', label: 'Intent Colors' },
    { id: 'alignment', label: 'Alignment & Layout' },
    { id: 'highlighting', label: 'Highlighting' },
    { id: 'technical', label: 'Technical Text' },
  ];

  return (
    <ShowcasePage
      title="Typography"
      subtitle="Typography System v2.1"
      description="The semantic text component for consistent Application UI."
      categories={categories}
      activeCategoryId="matrix"
    >
      {/* 1. Typography Matrix (Role x Prominence) */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="1. Typography Matrix" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Combinations of semantic Role and visual Prominence."
          />
        </Block>

        {/* Title Role */}
        <Block role="Card" density="Standard" className="p-6" gap={6}>
          <Text role="Label" content="Title Role" prominence="Subtle" />
          <Block role="Grid" spec={{ columns: 2 }} gap={8}>
            <Block role="Stack" gap={0.5}>
              <Text role="Title" prominence="Hero" content="Hero Title" />
              <Text role="Caption" content="prominence='Hero' (Page Titles)" />
            </Block>
            <Block role="Stack" gap={0.5}>
              <Text role="Title" prominence="Strong" content="Strong Title" />
              <Text role="Caption" content="prominence='Strong' (Section Headers)" />
            </Block>
            <Block role="Stack" gap={0.5}>
              <Text role="Title" prominence="Standard" content="Standard Title" />
              <Text role="Caption" content="prominence='Standard' (Card Titles)" />
            </Block>
            <Block role="Stack" gap={0.5}>
              <Text role="Title" prominence="Subtle" content="Subtle Title" />
              <Text role="Caption" content="prominence='Subtle' (Block Headers)" />
            </Block>
          </Block>
        </Block>

        {/* Body Role */}
        <Block role="Card" density="Standard" className="p-6" gap={6}>
          <Text role="Label" content="Body Role" prominence="Subtle" />
          <Block role="Stack" gap={4}>
            <Block role="Stack" gap={1}>
              <Text
                role="Body"
                prominence="Hero"
                content="Hero Body used for lead paragraphs."
              />
              <Text role="Caption" content="prominence='Hero' (Lead Text)" />
            </Block>
            <Block role="Stack" gap={1}>
              <Text
                role="Body"
                prominence="Strong"
                content="Strong body text is used for emphasis within content."
              />
              <Text role="Caption" content="prominence='Strong' (Emphasis)" />
            </Block>
            <Block role="Stack" gap={1}>
              <Text
                role="Body"
                prominence="Standard"
                content="Standard body text is the default for most reading content. It has good readability and contrast."
              />
              <Text role="Caption" content="prominence='Standard' (Default)" />
            </Block>
            <Block role="Stack" gap={1}>
              <Text
                role="Body"
                prominence="Subtle"
                content="Subtle body text is for secondary information, metadata, or helper text."
              />
              <Text role="Caption" content="prominence='Subtle' (Muted)" />
            </Block>
          </Block>
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* 2. Intent Colors */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="2. Intent Colors" />
          <Text role="Body" prominence="Subtle" content="Semantic colors applied to text." />
        </Block>

        <Block role="Grid" gap={6} spec={{ columns: 3 }}>
          <Block
            role="Card"
            className="p-4 items-center justify-center border-l-4 border-l-current text-text-primary"
          >
            <Text role="Body" intent="Neutral" content="Neutral Intent" prominence="Strong" />
          </Block>
          <Block
            role="Card"
            className="p-4 items-center justify-center border-l-4 border-l-current text-brand-primary"
          >
            <Text role="Body" intent="Brand" content="Brand Intent" prominence="Strong" />
          </Block>
          <Block
            role="Card"
            className="p-4 items-center justify-center border-l-4 border-l-green-500"
          >
            <Text role="Body" intent="Positive" content="Positive Intent" prominence="Strong" />
          </Block>
          <Block
            role="Card"
            className="p-4 items-center justify-center border-l-4 border-l-yellow-500"
          >
            <Text role="Body" intent="Caution" content="Caution Intent" prominence="Strong" />
          </Block>
          <Block
            role="Card"
            className="p-4 items-center justify-center border-l-4 border-l-red-500"
          >
            <Text role="Body" intent="Critical" content="Critical Intent" prominence="Strong" />
          </Block>
          <Block
            role="Card"
            className="p-4 items-center justify-center border-l-4 border-l-blue-500"
          >
            <Text role="Body" intent="Info" content="Info Intent" prominence="Strong" />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* 3. Alignment */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="3. Alignment" />
          <Text role="Body" prominence="Subtle" content="Text alignment utilities." />
        </Block>

        <Block role="Card" className="p-6" gap={4}>
          <Text
            role="Body"
            align="left"
            content="Left Aligned Text (Default)"
            className="bg-surface-sunken p-2"
          />
          <Text
            role="Body"
            align="center"
            content="Center Aligned Text"
            className="bg-surface-sunken p-2"
          />
          <Text
            role="Body"
            align="right"
            content="Right Aligned Text"
            className="bg-surface-sunken p-2"
          />
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* 4. Highlighting */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="4. Search Highlighting" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Built-in highlighting for search results."
          />
        </Block>

        <Block role="Card" className="p-6">
          <Text
            role="Body"
            prominence="Standard"
            content="The intent-driven design language allows for quick semantic updates."
            highlight="intent-driven"
          />
          <Text role="Caption" content="highlight='intent-driven'" className="mt-2" />
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* 5. Code & Monospace */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="5. Technical Text" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Monospaced styles for code and keys."
          />
        </Block>

        <Block role="Grid" density="Standard" gap={8} spec={{ columns: 2 }}>
          <Block role="Stack" gap={2}>
            <Text role="Label" content="Inline Code" />
            <div>
              <Text role="Body" content="Run the command " className="inline" />
              <Text role="Code" content="npm run dev" />
              <Text role="Body" content=" to start the server." className="inline" />
            </div>
          </Block>

          <Block role="Stack" gap={2}>
            <Text role="Label" content="Code Block (Mock)" />
            <Block role="Card" className="bg-surface-sunken p-4 font-mono text-sm">
              <Text role="Code" content="import { Text } from '@/iddl';" />
              <Text role="Code" content="<Text role='Title' />" />
            </Block>
          </Block>
        </Block>
      </Block>
    </ShowcasePage>
  );
}
