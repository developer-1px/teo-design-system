import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { Block } from '@/components/types/Block/Block.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';

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
      <Block role="Container" density="Comfortable">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="1. Typography Matrix" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Combinations of semantic Role and visual Prominence."
          />
        </Block>

        {/* Title Role */}
        <Block role="Card" density="Standard">
          <Text role="Label" content="Title Role" prominence="Subtle" />
          <Block role="Grid" spec={{ columns: 2 }}>
            <Block role="Stack">
              <Text role="Title" prominence="Hero" content="Hero Title" />
              <Text role="Caption" content="prominence='Hero' (Page Titles)" />
            </Block>
            <Block role="Stack">
              <Text role="Title" prominence="Strong" content="Strong Title" />
              <Text role="Caption" content="prominence='Strong' (Section Headers)" />
            </Block>
            <Block role="Stack">
              <Text role="Title" prominence="Standard" content="Standard Title" />
              <Text role="Caption" content="prominence='Standard' (Card Titles)" />
            </Block>
            <Block role="Stack">
              <Text role="Title" prominence="Subtle" content="Subtle Title" />
              <Text role="Caption" content="prominence='Subtle' (Block Headers)" />
            </Block>
          </Block>
        </Block>

        {/* Body Role */}
        <Block role="Card" density="Standard">
          <Text role="Label" content="Body Role" prominence="Subtle" />
          <Block role="Stack">
            <Block role="Stack">
              <Text role="Body" prominence="Hero" content="Hero Body used for lead paragraphs." />
              <Text role="Caption" content="prominence='Hero' (Lead Text)" />
            </Block>
            <Block role="Stack">
              <Text
                role="Body"
                prominence="Strong"
                content="Strong body text is used for emphasis within content."
              />
              <Text role="Caption" content="prominence='Strong' (Emphasis)" />
            </Block>
            <Block role="Stack">
              <Text
                role="Body"
                prominence="Standard"
                content="Standard body text is the default for most reading content. It has good readability and contrast."
              />
              <Text role="Caption" content="prominence='Standard' (Default)" />
            </Block>
            <Block role="Stack">
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

      <Block role="Divider" />

      {/* 2. Intent Colors */}
      <Block role="Container" density="Comfortable">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="2. Intent Colors" />
          <Text role="Body" prominence="Subtle" content="Semantic colors applied to text." />
        </Block>

        <Block role="Grid" spec={{ columns: 3 }}>
          <Block role="Card">
            <Text role="Body" intent="Neutral" content="Neutral Intent" prominence="Strong" />
          </Block>
          <Block role="Card">
            <Text role="Body" intent="Brand" content="Brand Intent" prominence="Strong" />
          </Block>
          <Block role="Card">
            <Text role="Body" intent="Positive" content="Positive Intent" prominence="Strong" />
          </Block>
          <Block role="Card">
            <Text role="Body" intent="Caution" content="Caution Intent" prominence="Strong" />
          </Block>
          <Block role="Card">
            <Text role="Body" intent="Critical" content="Critical Intent" prominence="Strong" />
          </Block>
          <Block role="Card">
            <Text role="Body" intent="Info" content="Info Intent" prominence="Strong" />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" />

      {/* 3. Alignment */}
      <Block role="Container" density="Comfortable">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="3. Alignment" />
          <Text role="Body" prominence="Subtle" content="Text alignment utilities." />
        </Block>

        <Block role="Card">
          <Text role="Body" content="Left Aligned Text (Default)" />
          <Text role="Body" content="Center Aligned Text" />
          <Text role="Body" content="Right Aligned Text" />
        </Block>
      </Block>

      <Block role="Divider" />

      {/* 4. Highlighting */}
      <Block role="Container" density="Comfortable">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="4. Search Highlighting" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Built-in highlighting for search results."
          />
        </Block>

        <Block role="Card">
          <Text
            role="Body"
            prominence="Standard"
            content="The intent-driven design language allows for quick semantic updates."
            highlight="intent-driven"
          />
          <Text role="Caption" content="highlight='intent-driven'" />
        </Block>
      </Block>

      <Block role="Divider" />

      {/* 5. Code & Monospace */}
      <Block role="Container" density="Comfortable">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="5. Technical Text" />
          <Text role="Body" prominence="Subtle" content="Monospaced styles for code and keys." />
        </Block>

        <Block role="Grid" density="Standard" spec={{ columns: 2 }}>
          <Block role="Stack">
            <Text role="Label" content="Inline Code" />
            <div>
              <Text role="Body" content="Run the command " />
              <Text role="Code" content="npm run dev" />
              <Text role="Body" content=" to start the server." />
            </div>
          </Block>

          <Block role="Stack">
            <Text role="Label" content="Code Block (Mock)" />
            <Block role="Card">
              <Text role="Code" content="import { Text } from '@/iddl';" />
              <Text role="Code" content="<Text role='Title' />" />
            </Block>
          </Block>
        </Block>
      </Block>
    </ShowcasePage>
  );
}
