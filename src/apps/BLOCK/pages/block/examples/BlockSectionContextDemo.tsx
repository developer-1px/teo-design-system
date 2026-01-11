import { Block } from '@/components/types/Block/Block';
import { Section } from '@/components/types/Section/Section';
import { Text } from '@/components/types/Element/Text/Text';

export function BlockSectionContextDemo() {
    return (
        <Block role="Container" density="Comfortable" className="gap-8">
            <div className="flex flex-col gap-1">
                <Text role="Title" prominence="Strong" content="Section Context Awareness (v5.2)" />
                <Text
                    role="Body"
                    prominence="Subtle"
                    content="Blocks adapt their styling based on the parent Section role."
                />
            </div>

            {/* 1. Main Section (Default Context) */}
            <Section role="Main" className="border border-dashed border-border-default p-4 gap-4">
                <Text role="Label" content="Section: Main (Default)" prominence="Strong" />
                <Block role="Card" className="p-4">
                    <Text role="Body" content="I am a Card in Main. I have a background, border, and shadow." />
                </Block>
            </Section>

            {/* 2. Panel Section (Restricted Context) */}
            <Section role="Panel" className="border border-dashed border-border-default p-4 gap-4 bg-surface-sunken">
                <Text role="Label" content="Section: Panel (Sidebar/Split)" prominence="Strong" />
                <Block role="Card" className="p-4">
                    <Text role="Body" content="I am a Card in Panel. I am flat and transparent (overridden)." />
                </Block>
            </Section>

            {/* 3. Header Section (Integrated Context) */}
            <Section role="Header" className="border border-dashed border-border-default p-4 gap-4">
                <Text role="Label" content="Section: Header" prominence="Strong" />
                <Block role="Card" className="p-4">
                    <Text role="Body" content="I am a Card in Header. I integrate with the header style." />
                </Block>
            </Section>
        </Block>
    );
}
