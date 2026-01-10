import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Atom/Text/Text';

export function BlockCardsDemo() {
    return (
        <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
                <Text role="Title" prominence="Strong" content="1. Cards & Containers" />
                <Text role="Body" prominence="Subtle" content="Visual grouping with backgrounds and borders." />
            </div>

            <Block role="Grid" layout="grid" density="Comfortable" className="grid-cols-1 md:grid-cols-2 gap-8">
                <Block role="Card" prominence="Standard" className="p-6 gap-4">
                    <Text role="Title" prominence="Standard" content="Standard Card" />
                    <Text role="Body" content="The default card style used for most content groupings. It has a subtle raised effect or border depending on the theme." />
                </Block>

                <Block role="Card" prominence="Subtle" className="p-6 gap-4">
                    <Text role="Title" prominence="Standard" content="Subtle Card" />
                    <Text role="Body" content="A card with reduced visual weight, often used for secondary content regions or flat layouts." />
                </Block>
            </Block>
            <Block role="PreviewContainer" className="h-32 flex items-center justify-center">
                <Text role="Caption" content="PreviewContainer (Sunken Background)" />
            </Block>
        </Block>
    );
}
