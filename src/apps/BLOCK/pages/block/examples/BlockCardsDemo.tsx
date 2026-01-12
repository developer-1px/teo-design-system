import { Frame } from '@/components/dsl/shared/Frame';
import { Block } from '@/components/dsl/Block/Block';
import { Text } from '@/components/dsl/Element/Text/Text';

export function BlockCardsDemo() {
  return (
    <Frame.Column gap={6}>
      <div className="flex flex-col gap-1">
        <Text role="Title" prominence="Strong" content="1. Cards & Containers" />
        <Text
          role="Body"
          prominence="Subtle"
          content="Visual grouping with backgrounds and borders."
        />
      </div>

      <Frame.Grid columns={2} gap={6}>
        <Block role="Card" prominence="Standard">
          <Text role="Title" prominence="Standard" content="Standard Card" />
          <Text
            role="Body"
            content="The default card style used for most content groupings. It has a subtle raised effect or border depending on the theme."
          />
        </Block>

        <Block role="Card" prominence="Subtle">
          <Text role="Title" prominence="Standard" content="Subtle Card" />
          <Text
            role="Body"
            content="A card with reduced visual weight, often used for secondary content regions or flat layouts."
          />
        </Block>
      </Frame.Grid>
      <Block role="Card">
        <Text role="Caption" content="Card (Sunken Background)" />
      </Block>
    </Frame.Column>
  );
}
