import { Frame } from '@/components/dsl/shared/Frame';
import { Block } from '@/components/dsl/Block/Block';
import { Text } from '@/components/dsl/Element/Text/Text';

export function BlockListsDemo() {
  return (
    <Frame.Column gap={6}>
      <div className="flex flex-col gap-1">
        <Text role="Title" prominence="Strong" content="2. Lists & Grids" />
        <Text role="Body" prominence="Subtle" content="Layouts for collections of items." />
      </div>

      {/* Grid */}
      <Block role="Card">
        <Text role="Label" content="Grid Layout" />
        <Frame.Grid columns={3} gap={4}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface-sunken p-4 rounded text-center">
              Item {i}
            </div>
          ))}
        </Frame.Grid>
      </Block>

      {/* List */}
      <Block role="Card">
        <Text role="Label" content="List Layout" />
        <Block role="List">
          {['First Item', 'Second Item', 'Third Item'].map((item) => (
            <div key={item} className="p-2 border-b border-border-muted last:border-0">
              <Text role="Body" content={item} />
            </div>
          ))}
        </Block>
      </Block>
    </Frame.Column>
  );
}
