import { Block } from '@/components/dsl/Block/Block';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';

export function BlockSectionContextDemo() {
  return (
    <Block role="Container" density="Comfortable">
      <div className="flex flex-col gap-1">
        <Text role="Title" prominence="Strong" content="Section Context Awareness (v5.2)" />
        <Text
          role="Body"
          prominence="Subtle"
          content="Blocks adapt their styling based on the parent Section role."
        />
      </div>

      {/* 1. Main Section (Default Context) */}
      <Section role="Main">
        <Text role="Label" content="Section: Main (Default)" prominence="Strong" />
        <Block role="Card">
          <Text
            role="Body"
            content="I am a Card in Main. I have a background, border, and shadow."
          />
        </Block>
      </Section>

      {/* 2. Panel Section (Restricted Context) */}
      <Section role="Panel">
        <Text role="Label" content="Section: Panel (Sidebar/Split)" prominence="Strong" />
        <Block role="Card">
          <Text
            role="Body"
            content="I am a Card in Panel. I am flat and transparent (overridden)."
          />
        </Block>
      </Section>

      {/* 3. Header Section (Integrated Context) */}
      <Section role="Header">
        <Text role="Label" content="Section: Header" prominence="Strong" />
        <Block role="Card">
          <Text role="Body" content="I am a Card in Header. I integrate with the header style." />
        </Block>
      </Section>
    </Block>
  );
}
